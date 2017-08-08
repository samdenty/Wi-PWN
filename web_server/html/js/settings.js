var ssid = getE('ssid'),
    ssidHidden = getE('ssidHidden'),
    password = getE('password'),
    apChannel = getE('apChannel'),
    macAp = getE('macAp'),
    randMacAp = getE('randMacAp'),
    apScanHidden = getE('apScanHidden'),
    scanTime = getE('scanTime'),
    timeout = getE('timeout'),
    deauthReason = getE('deauthReason'),
    packetRate = getE('packetRate'),
    clientNames = getE('clientNames'),
    useLed = getE('useLed'),
    channelHop = getE('channelHop'),
    multiAPs = getE('multiAPs'),
    multiAttacks = getE('multiAttacks'),
    cMac = getE('cMac'),
    cName = getE('cName'),
    macInterval = getE('macInterval'),
    beaconInterval = getE('beaconInterval'),
    ledPin = getE('ledPin'),
    darkMode = getE('darkMode'),
    ledContainer = getE('ledContainer'),
    macContainer = getE('macContainer'),
    cache = getE('cache'),
    res = '',
    checkboxChanges,
    inputChanges;

/* Add listeners to checkboxes */
useLed.addEventListener("change", switchLED, false);
randMacAp.addEventListener("change", switchMAC, false);

function getData() {
    getResponse("settings.json", function(responseText) {
        try {
            res = JSON.parse(responseText);
        } catch (e) {
            notify("ERROR: Reset the settings.  (E17)");
            return;
        }
        ssid.value = res.ssid;
        ssidHidden.checked = res.ssidHidden;
        password.value = res.password;
        apChannel.value = res.apChannel;
        macAp.value = res.macAp;
        randMacAp.checked = res.randMacAp;
        apScanHidden.checked = res.apScanHidden;
        scanTime.value = res.clientScanTime;
        timeout.value = res.attackTimeout;
        deauthReason.value = res.deauthReason;
        packetRate.value = res.attackPacketRate;
        useLed.checked = res.useLed;
        /*channelHop.checked = res.channelHop;*/
        multiAPs.checked = res.multiAPs;
        multiAttacks.checked = res.multiAttacks;
        macInterval.value = res.macInterval;
        beaconInterval.checked = res.beaconInterval;
        ledPin.value = res.ledPin;
        darkMode.checked = res.darkMode;
        cache.checked = res.cache;
        switchLED();
        switchMAC();
    });
}

function saveSettings() {
    indicate();
    showLoading();
    var url = "settingsSave.json";
    url += "?ssid=" + ssid.value;
    url += "&ssidHidden=" + ssidHidden.checked;
    url += "&password=" + password.value;
    url += "&apChannel=" + apChannel.value;
    url += "&macAp=" + macAp.value;
    url += "&randMacAp=" + randMacAp.checked;
    url += "&apScanHidden=" + apScanHidden.checked;
    url += "&scanTime=" + scanTime.value;
    url += "&timeout=" + timeout.value;
    url += "&deauthReason=" + deauthReason.value;
    url += "&packetRate=" + packetRate.value;
    url += "&useLed=" + useLed.checked;
    /*url += "&channelHop=" + channelHop.checked;*/
    url += "&multiAPs=" + multiAPs.checked;
    url += "&multiAttacks=" + multiAttacks.checked;
    url += "&macInterval=" + macInterval.value;
    url += "&beaconInterval=" + beaconInterval.checked;
    url += "&ledPin=" + ledPin.value;
    url += "&darkMode=" + darkMode.checked;
    url += "&cache=" + cache.checked;

    getResponse(url, function(responseText) {
        if (responseText == "true") {
            getData();
            indicate(true);
            var uniqueKey = new Date();
            document.getElementById('darkStyle').setAttribute('href', 'dark.css?' + uniqueKey.getTime());
            defaultMetaColor();
            inputChanges = false;
            checkboxChanges = false;
        } else {
            indicate(false);
            notify("Failed to save settings! (E18)");
        }
    }, function() {
        indicate(false);
        notify("Failed to save settings! (E19)");
    });
}

function resetSettings() {
    if (confirm("Reset Wi-PWN to default settings?") == true) {
        showLoading();
        getResponse("settingsReset.json", function(responseText) {
            if (responseText == "true") {
                getData();
                indicate(true);
                restart(true);
                setTimeout(function() { window.location = "/" }, 3000)
            } else {
                notify("Failed to reset settings! (E20)");
                indicate(false);
            }
        }, function() {
            notify("Failed to reset settings! (E21)");
            indicate(false);
        });
    }
    inputChanges = false;
    checkboxChanges = false;
}

function switchLED() {
    var isChecked = useLed.checked;
    if (isChecked) {
        ledContainer.classList.remove("disabled");
    } else {
        ledContainer.classList.add("disabled");
    }
}

function switchMAC() {
    var isChecked = randMacAp.checked;
    if (isChecked) {
        macContainer.classList.add("disabled");
    } else {
        macContainer.classList.remove("disabled");
    }
}

getData();

/* Detect form changes and display popup if not saved */
    var form = document.getElementById("settings");
    form.addEventListener("input", function() {
        inputChanges = true;
    });
    form.addEventListener("change", function() {
        checkboxChanges = true;
    }, false);

    window.addEventListener("beforeunload", function(e) {
        if (inputChanges || checkboxChanges) {
            var confirmationMessage = 'All changes will be lost!';
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });
