#include "Settings.h"

Settings::Settings() {

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
  
  apScanHidden = (bool)EEPROM.read(apScanHiddenAdr);

  deauthReason = EEPROM.read(deauthReasonAdr);
  attackTimeout = eepromReadInt(attackTimeoutAdr);
  attackPacketRate = EEPROM.read(attackPacketRateAdr);
  clientScanTime = EEPROM.read(clientScanTimeAdr);
  attackEncrypted = (bool)EEPROM.read(attackEncryptedAdr);
  useLed = (bool)EEPROM.read(useLedAdr);
  channelHop = (bool)EEPROM.read(channelHopAdr);
  multiAPs = (bool)EEPROM.read(multiAPsAdr);
  multiAttacks = (bool)EEPROM.read(multiAttacksAdr);
  macInterval = eepromReadInt(macIntervalAdr);
  beaconInterval = (bool)EEPROM.read(beaconIntervalAdr);
  ledPin = (int)EEPROM.read(ledPinAdr);
  darkMode = (bool)EEPROM.read(darkModeAdr);
  simplify = (bool)EEPROM.read(simplifyAdr);
  newUser = (bool)EEPROM.read(newUserAdr);
  detectorChannel = (int)EEPROM.read(detectorChannelAdr);
  detectorAllChannels = (bool)EEPROM.read(detectorAllChannelsAdr);
  alertPin = (int)EEPROM.read(alertPinAdr);
  invertAlertPin = (bool)EEPROM.read(invertAlertPinAdr);
  detectorScanTime = (int)EEPROM.read(detectorScanTimeAdr);
}

void Settings::reset() {
  if (debug) Serial.print("reset settings...");

  ssid = "Wi-PWN";
  password = "";
  ssidHidden = false;
  apChannel = 1;

  ssidLen = ssid.length();
  passwordLen = password.length();

  apScanHidden = true;

  deauthReason = 0x01;
  attackTimeout = 0;
  attackPacketRate = 10;
  clientScanTime = 15;
  attackEncrypted = true;
  useLed = true;
  channelHop = false;
  multiAPs = true;
  multiAttacks = true;
  macInterval = 4;
  beaconInterval = false;
  ledPin = 2;
  darkMode = false;
  simplify = false;
  newUser = true;
  detectorChannel = 1;
  detectorAllChannels = true;
  alertPin = 2;
  invertAlertPin = true;
  detectorScanTime = 200;

  if (debug) Serial.println("done");

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

  EEPROM.write(apScanHiddenAdr, apScanHidden);

  EEPROM.write(deauthReasonAdr, deauthReason);

  eepromWriteInt(attackTimeoutAdr, attackTimeout);

  EEPROM.write(attackPacketRateAdr, attackPacketRate);
  EEPROM.write(clientScanTimeAdr, clientScanTime);
  EEPROM.write(attackEncryptedAdr, attackEncrypted);
  EEPROM.write(useLedAdr, useLed);
  EEPROM.write(channelHopAdr, channelHop);
  EEPROM.write(multiAPsAdr, multiAPs);
  EEPROM.write(multiAttacksAdr, multiAttacks);
  EEPROM.write(checkNumAdr, checkNum);
  eepromWriteInt(macIntervalAdr, macInterval);
  EEPROM.write(beaconIntervalAdr, beaconInterval);
  EEPROM.write(ledPinAdr, ledPin);
  EEPROM.write(darkModeAdr, darkMode);
  EEPROM.write(simplifyAdr, simplify);
  EEPROM.write(newUserAdr, newUser);
  EEPROM.write(detectorChannelAdr, detectorChannel);
  EEPROM.write(detectorAllChannelsAdr, detectorAllChannels);
  EEPROM.write(alertPinAdr, alertPin);
  EEPROM.write(invertAlertPinAdr, invertAlertPin);
  EEPROM.write(detectorScanTimeAdr, detectorScanTime);
  EEPROM.commit();

  if (debug) {
    info();
    Serial.println("settings saved!");
  }
}

void Settings::info() {
  Serial.println("Settings:");
  Serial.println("SSID: " + ssid);
  Serial.println("SSID length: " + (String)ssidLen);
  Serial.println("SSID hidden: " + (String)ssidHidden);
  Serial.println("password: " + password);
  Serial.println("password length: " + (String)passwordLen);
  Serial.println("channel: " + (String)apChannel);
  Serial.println("Scan hidden APs: " + (String)apScanHidden);
  Serial.println("deauth reason: " + (String)(int)deauthReason);
  Serial.println("attack timeout: " + (String)attackTimeout);
  Serial.println("attack packet rate: " + (String)attackPacketRate);
  Serial.println("client scan time: " + (String)clientScanTime);
  Serial.println("attack SSID encrypted: " + (String)attackEncrypted);
  Serial.println("use built-in LED: " + (String)useLed);
  Serial.println("channel hopping: " + (String)channelHop);
  Serial.println("multiple APs: " + (String)multiAPs);
  Serial.println("multiple Attacks: " + (String)multiAttacks);
  Serial.println("mac change interval: " + (String)macInterval);
  Serial.println("1s beacon interval: " + (String)beaconInterval);
  Serial.println("LED Pin: " + (String)ledPin);
  Serial.println("dark mode: " + (String)darkMode);
  Serial.println("simplify: " + (String)simplify);
  Serial.println("new user: " + (String)newUser);
  Serial.println("detector- channel: " + (String)detectorChannel);
  Serial.println("detector- all channels: " + (String)detectorAllChannels);
  Serial.println("detector- alert pin: " + (String)alertPin);
  Serial.println("detector- invert alert pin: " + (String)invertAlertPin);
  Serial.println("detector- scan time: " + (String)detectorScanTime);
}

size_t Settings::getSize() {
  String json = "{";
  size_t jsonSize = 0;

  json += "\"ssid\":\"" + ssid + "\",";
  json += "\"ssidHidden\":" + (String)ssidHidden + ",";
  json += "\"password\":\"" + password + "\",";
  json += "\"apChannel\":" + (String)apChannel + ",";
  json += "\"apScanHidden\":" + (String)apScanHidden + ",";
  json += "\"deauthReason\":" + (String)(int)deauthReason + ",";
  json += "\"attackTimeout\":" + (String)attackTimeout + ",";
  json += "\"attackPacketRate\":" + (String)attackPacketRate + ",";
  json += "\"clientScanTime\":" + (String)clientScanTime + ",";
  json += "\"attackEncrypted\":" + (String)attackEncrypted + ",";
  json += "\"useLed\":" + (String)useLed + ",";
  json += "\"channelHop\":" + (String)channelHop + ",";
  json += "\"multiAPs\":" + (String)multiAPs + ",";
  json += "\"multiAttacks\":" + (String)multiAttacks + ",";
  json += "\"macInterval\":" + (String)macInterval + ",";
  json += "\"beaconInterval\":" + (String)beaconInterval + ",";
  json += "\"ledPin\":" + (String)ledPin + ",";
  json += "\"darkMode\":" + (String)darkMode + ",";
  json += "\"simplify\":" + (String)simplify + ",";
  json += "\"newUser\":" + (String)newUser + ",";
  json += "\"detectorChannel\":" + (String)detectorChannel + ",";
  json += "\"detectorAllChannels\":" + (String)detectorAllChannels + ",";
  json += "\"alertPin\":" + (String)alertPin + ",";
  json += "\"invertAlertPin\":" + (String)invertAlertPin + ",";
  json += "\"detectorScanTime\":" + (String)detectorScanTime + "}";
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
  json += "\"apScanHidden\":" + (String)apScanHidden + ",";
  json += "\"deauthReason\":" + (String)(int)deauthReason + ",";
  json += "\"attackTimeout\":" + (String)attackTimeout + ",";
  json += "\"attackPacketRate\":" + (String)attackPacketRate + ",";
  json += "\"clientScanTime\":" + (String)clientScanTime + ",";
  json += "\"attackEncrypted\":" + (String)attackEncrypted + ",";
  json += "\"useLed\":" + (String)useLed + ",";
  json += "\"channelHop\":" + (String)channelHop + ",";
  json += "\"multiAPs\":" + (String)multiAPs + ",";
  json += "\"multiAttacks\":" + (String)multiAttacks + ",";
  json += "\"macInterval\":" + (String)macInterval + ",";
  json += "\"beaconInterval\":" + (String)beaconInterval + ",";
  json += "\"ledPin\":" + (String)ledPin + ",";
  json += "\"darkMode\":" + (String)darkMode + ",";
  json += "\"simplify\":" + (String)simplify + ",";
  json += "\"newUser\":" + (String)newUser + ",";
  json += "\"detectorChannel\":" + (String)detectorChannel + ",";
  json += "\"detectorAllChannels\":" + (String)detectorAllChannels + ",";
  json += "\"alertPin\":" + (String)alertPin + ",";
  json += "\"invertAlertPin\":" + (String)invertAlertPin + ",";
  json += "\"detectorScanTime\":" + (String)detectorScanTime + "}";
  sendToBuffer(json);
  sendBuffer();

  if (debug) Serial.println("\ndone");

}
