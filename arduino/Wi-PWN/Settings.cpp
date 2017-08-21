#include "Settings.h"

Settings::Settings() {
  uint8_t tempMAC[6];
  defaultMacAP.set(WiFi.softAPmacAddress(tempMAC));
  if(!defaultMacAP.valid()) defaultMacAP.randomize();
}

void Settings::syncMacInterface(){
  if(debug) Serial.println("Trying to sync the MAC addr with settings");
  if(isSettingsLoaded){
    Mac macToSync;
    if(isMacAPRand){
      macToSync.randomize();
      wifi_set_macaddr(SOFTAP_IF, macToSync._get());
      if(debug) Serial.println("Synced with a random mac addr : " + macToSync.toString());
    }else if(macAP.valid()){
      macToSync = macAP;
      wifi_set_macaddr(SOFTAP_IF, macToSync._get());
      if(debug) Serial.println("Synced with saved mac addr : " + macToSync.toString());
    }else{
      if(debug) Serial.println("Could not sync because of invalid settings !");
    }
  }else{
    if(debug) Serial.println("Could not sync because settings are not loaded !");
  }
}

void Settings::setLedPin(int newLedPin){
  prevLedPin = ledPin;
  if(newLedPin > 0 && newLedPin != prevLedPin){
    ledPin = newLedPin;
    pinMode(ledPin, OUTPUT);
    if(!prevLedPin == 0){
      digitalWrite(ledPin, digitalRead(prevLedPin));
      digitalWrite(prevLedPin, pinStateOff);
      pinMode(prevLedPin, INPUT);
    }else{
      digitalWrite(ledPin, pinStateOff);
    }
  }
}

void Settings::load() {

  if (EEPROM.read(checkNumAdr) != checkNum) {
    reset();
    return;
  }

  ssidLen = EEPROM.read(ssidLenAdr);
  passwordLen = EEPROM.read(passwordLenAdr);

  if (ssidLen < 1 || ssidLen > 32 || passwordLen < 8 && passwordLen != 0  || passwordLen > 32) {
    reset();
    return;
  }

  ssid = "";
  password = "";
  for (int i = 0; i < ssidLen; i++) ssid += (char)EEPROM.read(ssidAdr + i);
  for (int i = 0; i < passwordLen; i++) password += (char)EEPROM.read(passwordAdr + i);

  ssidHidden = (bool)EEPROM.read(ssidHiddenAdr);

  if ((int)EEPROM.read(apChannelAdr) >= 1 && (int)EEPROM.read(apChannelAdr) <= 14) {
    apChannel = (int)EEPROM.read(apChannelAdr);
  } else {
    apChannel = 1;
  }
  for(int i=0; i<6; i++){
    macAP.setAt((uint8_t)EEPROM.read(macAPAdr+i),i);
  }
  if(!macAP.valid()) macAP.set(defaultMacAP);
  isMacAPRand = (bool)EEPROM.read(isMacAPRandAdr);

  apScanHidden = (bool)EEPROM.read(apScanHiddenAdr);

  deauthReason = EEPROM.read(deauthReasonAdr);
  attackTimeout = eepromReadInt(attackTimeoutAdr);
  attackPacketRate = EEPROM.read(attackPacketRateAdr);
  clientScanTime = EEPROM.read(clientScanTimeAdr);
  useLed = (bool)EEPROM.read(useLedAdr);
  channelHop = (bool)EEPROM.read(channelHopAdr);
  multiAPs = (bool)EEPROM.read(multiAPsAdr);
  multiAttacks = (bool)EEPROM.read(multiAttacksAdr);
  macInterval = eepromReadInt(macIntervalAdr);
  beaconInterval = (bool)EEPROM.read(beaconIntervalAdr);
  setLedPin((int)EEPROM.read(ledPinAdr));
  isSettingsLoaded = 1;
  darkMode = (bool)EEPROM.read(darkModeAdr);
  cache = (bool)EEPROM.read(cacheAdr);
  newUser = (bool)EEPROM.read(newUserAdr);
  detectorChannel = (int)EEPROM.read(detectorChannelAdr);
  detectorAllChannels = (bool)EEPROM.read(detectorAllChannelsAdr);
  alertPin = (int)EEPROM.read(alertPinAdr);
  invertAlertPin = (bool)EEPROM.read(invertAlertPinAdr);
  detectorScanTime = (int)EEPROM.read(detectorScanTimeAdr);
  pinNamesLen = EEPROM.read(pinNamesLenAdr);
  pinNames = "";
  for (int i = 0; i < pinNamesLen; i++) pinNames += (char)EEPROM.read(pinNamesAdr + i);
}

void Settings::reset() {
  if (debug) Serial.print("reset settings...");

  ssid = "Wi-PWN";
  password = "";
  ssidHidden = false;
  apChannel = 1;

  macAP = defaultMacAP;
  isMacAPRand = 0;

  apScanHidden = true;

  deauthReason = 0x01;
  attackTimeout = 0;
  attackPacketRate = 10;
  clientScanTime = 15;
  useLed = true;
  channelHop = false;
  multiAPs = true;
  multiAttacks = true;
  macInterval = 4;
  beaconInterval = false;
  ledPin = 2;
  darkMode = false;
  cache = true;
  newUser = true;
  detectorChannel = 1;
  detectorAllChannels = true;
  alertPin = 2;
  invertAlertPin = true;
  detectorScanTime = 200;
  pins = "000000";
  pinNames = "Pin 3;Pin 4;Pin 5;Pin 6;Pin 7;Pin 8"; 
  if (debug) Serial.println("Reset complete!");

  save();
}

void Settings::save() {
  ssidLen = ssid.length();
  passwordLen = password.length();

  EEPROM.write(ssidLenAdr, ssidLen);
  EEPROM.write(passwordLenAdr, passwordLen);
  for (int i = 0; i < ssidLen; i++) EEPROM.write(ssidAdr + i, ssid[i]);
  for (int i = 0; i < passwordLen; i++) EEPROM.write(passwordAdr + i, password[i]);

  EEPROM.write(ssidHiddenAdr, ssidHidden);
  EEPROM.write(apChannelAdr, apChannel);

  EEPROM.write(isMacAPRandAdr, isMacAPRand);

  for(int i=0; i<6; i++){
    EEPROM.write(macAPAdr+i, macAP._get(i));
  }

  EEPROM.write(apScanHiddenAdr, apScanHidden);

  EEPROM.write(deauthReasonAdr, deauthReason);

  eepromWriteInt(attackTimeoutAdr, attackTimeout);

  EEPROM.write(attackPacketRateAdr, attackPacketRate);
  EEPROM.write(clientScanTimeAdr, clientScanTime);
  EEPROM.write(useLedAdr, useLed);
  EEPROM.write(channelHopAdr, channelHop);
  EEPROM.write(multiAPsAdr, multiAPs);
  EEPROM.write(multiAttacksAdr, multiAttacks);
  EEPROM.write(checkNumAdr, checkNum);
  eepromWriteInt(macIntervalAdr, macInterval);
  EEPROM.write(beaconIntervalAdr, beaconInterval);
  EEPROM.write(ledPinAdr, ledPin);
  EEPROM.write(darkModeAdr, darkMode);
  EEPROM.write(cacheAdr, cache);
  EEPROM.write(newUserAdr, newUser);
  EEPROM.write(detectorChannelAdr, detectorChannel);
  EEPROM.write(detectorAllChannelsAdr, detectorAllChannels);
  EEPROM.write(alertPinAdr, alertPin);
  EEPROM.write(invertAlertPinAdr, invertAlertPin);
  EEPROM.write(detectorScanTimeAdr, detectorScanTime);
  pinNamesLen = pinNames.length();
  EEPROM.write(pinNamesLenAdr, pinNamesLen);
  for (int i = 0; i < pinNamesLen; i++) EEPROM.write(pinNamesAdr + i, pinNames[i]);
  EEPROM.commit();

  /*int i=0;
  int pinNumber = 3;
  Serial.println("START");
  while (i < 6)
  {  
     int pinState = pins[i++];
     if (pinState == 49) {
      Serial.println("Making high: " + (String)pinNumber);
     }
     Serial.println((String)pinNumber + (String)": " + pinState);
     pinNumber++;
  }
  Serial.println("END");*/

  if (debug) {
    info();
    Serial.println("settings saved!");
  }
}

void Settings::info() {
  Serial.println("");
  Serial.println("Settings:");
  Serial.println("  SSID            : '" + ssid + "'\t\t\t|  characters='" + (String)ssidLen + "'\t\t|  hidden='"+(String)ssidHidden+"'\t\t|  channel='"+(String)apChannel+"'\t\t|");
  Serial.println("  Password        : '" + password + "'\t\t|  characters='" + (String)passwordLen + "'\t\t|");
  Serial.println("  Scan            : hidden-networks='" + (String)apScanHidden + "'\t\t|  client-scan-time='" + (String)clientScanTime + "'\t|");
  Serial.println("  Attack          : timeout='" + (String)attackTimeout + "'\t\t\t|  packet_rate='" + (String)attackPacketRate + "'\t\t|  deauth_reason='" + (String)(int)deauthReason + "'");
  Serial.println("  Interface       : dark-mode='" + (String)darkMode + "'\t\t|  new-user='" + (String)newUser + "'\t\t\t|  cache='" + (String)cache + "'");
  Serial.println("  LED Indicator   : enable='" + (String)useLed + "'\t\t\t|  pin='" + (String)ledPin + "'\t\t\t|");
  Serial.println("  MAC AP          : default='" + defaultMacAP.toString()+"'\t|  saved='" + macAP.toString()+"'\t|  random='" + (String)isMacAPRand + "'");
  Serial.println("  Beacons         : mac-change-interval='" + (String)multiAttacks + "'\t|  " + "1s-interval='" + (String)beaconInterval + "");
  Serial.println("  Deauth Detector : all-channels='" + (String)detectorAllChannels + "'\t\t|  channel='" + (String)detectorChannel + "'\t\t\t|  alert-pin='" + (String)alertPin + "'\t|  invert-pin='" + (String)invertAlertPin + "'\t|  scan-time='" + (String)detectorScanTime + "'");
  Serial.println("  Other           : channel-hopping='" + (String)channelHop + "'\t\t|  multiple-aps='" + (String)multiAPs + "'\t\t|  multiple-attacks='" + (String)multiAttacks + "'");
  Serial.println("  PIN Control     : state='" + (String)pins + "'\t\t|  names='" + (String)pinNames + "'");
  Serial.println("");
}

size_t Settings::getSize() {
  String json = "{";
  size_t jsonSize = 0;

  json += "\"ssid\":\"" + ssid + "\",";
  json += "\"ssidHidden\":" + (String)ssidHidden + ",";
  json += "\"password\":\"" + password + "\",";
  json += "\"apChannel\":" + (String)apChannel + ",";
  json += "\"macAp\":\"" + macAP.toString() + "\",";
  json += "\"randMacAp\":" + (String)isMacAPRand + ",";
  json += "\"apScanHidden\":" + (String)apScanHidden + ",";
  json += "\"deauthReason\":" + (String)(int)deauthReason + ",";
  json += "\"attackTimeout\":" + (String)attackTimeout + ",";
  json += "\"attackPacketRate\":" + (String)attackPacketRate + ",";
  json += "\"clientScanTime\":" + (String)clientScanTime + ",";
  json += "\"useLed\":" + (String)useLed + ",";
  json += "\"channelHop\":" + (String)channelHop + ",";
  json += "\"multiAPs\":" + (String)multiAPs + ",";
  json += "\"multiAttacks\":" + (String)multiAttacks + ",";
  json += "\"macInterval\":" + (String)macInterval + ",";
  json += "\"beaconInterval\":" + (String)beaconInterval + ",";
  json += "\"ledPin\":" + (String)ledPin + ",";
  json += "\"darkMode\":" + (String)darkMode + ",";
  json += "\"cache\":" + (String)cache + ",";
  json += "\"newUser\":" + (String)newUser + ",";
  json += "\"detectorChannel\":" + (String)detectorChannel + ",";
  json += "\"detectorAllChannels\":" + (String)detectorAllChannels + ",";
  json += "\"alertPin\":" + (String)alertPin + ",";
  json += "\"invertAlertPin\":" + (String)invertAlertPin + ",";
  json += "\"detectorScanTime\":" + (String)detectorScanTime + ",";
  json += "\"pins\":\"" + (String)pins + "\",";
  json += "\"pinNames\":\"" + (String)pinNames + "\"}";
  jsonSize += json.length();

  return jsonSize;
}

void Settings::send() {
  if (debug) Serial.println("getting settings json");
  sendHeader(200, "text/json", getSize());

  String json = "{";
  json += "\"ssid\":\"" + ssid + "\",";
  json += "\"ssidHidden\":" + (String)ssidHidden + ",";
  json += "\"password\":\"" + password + "\",";
  json += "\"apChannel\":" + (String)apChannel + ",";
  json += "\"macAp\":\"" + macAP.toString() + "\",";
  json += "\"randMacAp\":" + (String)isMacAPRand + ",";
  json += "\"apScanHidden\":" + (String)apScanHidden + ",";
  json += "\"deauthReason\":" + (String)(int)deauthReason + ",";
  json += "\"attackTimeout\":" + (String)attackTimeout + ",";
  json += "\"attackPacketRate\":" + (String)attackPacketRate + ",";
  json += "\"clientScanTime\":" + (String)clientScanTime + ",";
  json += "\"useLed\":" + (String)useLed + ",";
  json += "\"channelHop\":" + (String)channelHop + ",";
  json += "\"multiAPs\":" + (String)multiAPs + ",";
  json += "\"multiAttacks\":" + (String)multiAttacks + ",";
  json += "\"macInterval\":" + (String)macInterval + ",";
  json += "\"beaconInterval\":" + (String)beaconInterval + ",";
  json += "\"ledPin\":" + (String)ledPin + ",";
  json += "\"darkMode\":" + (String)darkMode + ",";
  json += "\"cache\":" + (String)cache + ",";
  json += "\"newUser\":" + (String)newUser + ",";
  json += "\"detectorChannel\":" + (String)detectorChannel + ",";
  json += "\"detectorAllChannels\":" + (String)detectorAllChannels + ",";
  json += "\"alertPin\":" + (String)alertPin + ",";
  json += "\"invertAlertPin\":" + (String)invertAlertPin + ",";
  json += "\"detectorScanTime\":" + (String)detectorScanTime + ",";
  json += "\"pins\":\"" + (String)pins + "\",";
  json += "\"pinNames\":\"" + (String)pinNames + "\"}";
  sendToBuffer(json);
  sendBuffer();

  if (debug) Serial.println("\ndone");

}

size_t Settings::getSysInfoSize() {
  String json = "{";
  size_t jsonSize = 0;

  json += "\"freememory\":\"" + (String)ESP.getFreeHeap() + "\",";
  json += "\"deauthpackets\":\"" + (String)deauthpackets + "\",";
  json += "\"beaconpackets\":\"" + (String)beaconpackets + "\",";
  json += "\"uptime\":\"" + (String)millis() + "\",";
  json += "\"bootmode\":\"" + (String)ESP.getBootMode() + "\",";
  json += "\"bootversion\":\"" + (String)ESP.getBootVersion() + "\",";
  json += "\"sdkversion\":\"" + (String)ESP.getSdkVersion() + "\",";
  json += "\"chipid\":\"" + (String)ESP.getChipId() + "\",";
  json += "\"flashchipid\":\"" + (String)ESP.getFlashChipId() + "\",";
  json += "\"flashchipsize\":\"" + (String)ESP.getFlashChipSize() + "\",";
  json += "\"flashchiprealsize\":\"" + (String)ESP.getFlashChipRealSize() + "\"}";
  jsonSize += json.length();

  return jsonSize;
}

void Settings::sendSysInfo() {
  if (debug) Serial.println("getting sysinfo json");
  sendHeader(200, "text/json", getSysInfoSize());
  
  String json = "{";
  json += "\"freememory\":\"" + (String)ESP.getFreeHeap() + "\",";
  json += "\"deauthpackets\":\"" + (String)deauthpackets + "\",";
  json += "\"beaconpackets\":\"" + (String)beaconpackets + "\",";
  json += "\"uptime\":\"" + (String)millis() + "\",";
  json += "\"bootmode\":\"" + (String)ESP.getBootMode() + "\",";
  json += "\"bootversion\":\"" + (String)ESP.getBootVersion() + "\",";
  json += "\"sdkversion\":\"" + (String)ESP.getSdkVersion() + "\",";
  json += "\"chipid\":\"" + (String)ESP.getChipId() + "\",";
  json += "\"flashchipid\":\"" + (String)ESP.getFlashChipId() + "\",";
  json += "\"flashchipsize\":\"" + (String)ESP.getFlashChipSize() + "\",";
  json += "\"flashchiprealsize\":\"" + (String)ESP.getFlashChipRealSize() + "\"}";
  sendToBuffer(json);
  sendBuffer();

  if (debug) Serial.println("\ndone");

}
