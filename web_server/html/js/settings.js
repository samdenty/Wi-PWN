var ssid = getE('ssid');
var ssidHidden = getE('ssidHidden');
var password = getE('password');
var apChannel = getE('apChannel');
var apScanHidden = getE('apScanHidden');
var scanTime = getE('scanTime');
var timeout = getE('timeout');
var deauthReason = getE('deauthReason');
var packetRate = getE('packetRate');
var clientNames = getE('clientNames');
var ssidEnc = getE('ssidEnc');
var useLed = getE('useLed');
/*var channelHop = getE('channelHop');*/
var multiAPs = getE('multiAPs');
var multiAttacks = getE('multiAttacks');
var cMac = getE('cMac');
var cName = getE('cName');
var macInterval = getE('macInterval');
var beaconInterval = getE('beaconInterval');
var ledPin = getE('ledPin');
var darkMode = getE('darkMode');
var saveStatus = getE('spinner-container');
var res;

function getData() {
  getResponse("settings.json", function(responseText) {
  try {
        res = JSON.parse(responseText);
    } catch(e) {
        showMessage("ERROR: Reset the settings.  (E17)");
    return;
    }
  ssid.value = res.ssid;
  ssidHidden.checked = res.ssidHidden;
  password.value = res.password;
  apChannel.value = res.apChannel;
  apScanHidden.checked = res.apScanHidden;
  scanTime.value = res.clientScanTime;
  timeout.value = res.attackTimeout;
  deauthReason.value = res.deauthReason;
  packetRate.value = res.attackPacketRate;
  ssidEnc.checked = res.attackEncrypted;
  useLed.checked = res.useLed;
  /*channelHop.checked = res.channelHop;*/
  multiAPs.checked = res.multiAPs;
  multiAttacks.checked = res.multiAttacks;
  macInterval.value = res.macInterval;
  beaconInterval.checked = res.beaconInterval;
  ledPin.value = res.ledPin;
  darkMode.checked = res.darkMode;
  });
}

function saveSettings() {
  saveStatus.className = "";
  showLoading();
  var url = "settingsSave.json";
  url += "?ssid=" + ssid.value;
  url += "&ssidHidden=" + ssidHidden.checked;
  url += "&password=" + password.value;
  url += "&apChannel=" + apChannel.value;
  url += "&apScanHidden=" + apScanHidden.checked;
  url += "&scanTime=" + scanTime.value;
  url += "&timeout=" + timeout.value;
  url += "&deauthReason=" + deauthReason.value;
  url += "&packetRate=" + packetRate.value;
  url += "&ssidEnc=" + ssidEnc.checked;
  url += "&useLed=" + useLed.checked;
  /*url += "&channelHop=" + channelHop.checked;*/
  url += "&multiAPs="+multiAPs.checked;
  url += "&multiAttacks="+multiAttacks.checked;
  url += "&macInterval="+macInterval.value;
  url += "&beaconInterval="+beaconInterval.checked;
  url += "&ledPin="+ledPin.value;
  url += "&darkMode="+darkMode.checked;

  getResponse(url, function(responseText) {
    if (responseText == "true") {
      getData();
      saveStatus.classList.add("success-save");
      var links = document.querySelectorAll("link[rel=stylesheet]"); for (var i = 0; i < links.length;i++) { var link = links[i]; if (link.rel === "stylesheet") {link.href += "?"; }} 
    } else {
      saveStatus.classList.add("failed-save");
      showMessage("Failed to save settings! (E18)");
    }
  }, function() {
      saveStatus.classList.add("failed-save");
      showMessage("Failed to save settings! (E19)");
  });
}

function resetSettings() {
  if (confirm("Reset Wi-PWN to default settings?") == true) {
    showLoading();
    getResponse("settingsReset.json", function(responseText) {
      if (responseText == "true") {
        getData();
        saveStatus.classList.add("success-save")
      }
      else {
        showMessage("Failed to reset settings! (E20)");
        saveStatus.classList.add("failed-save");
      }
    }, function() {
        showMessage("Failed to reset settings! (E21)");
        saveStatus.classList.add("failed-save");
    });
  }
}

getData();