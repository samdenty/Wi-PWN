var selectedAPs = getE("selectedAPs");
var selectedClients = getE("selectedClients");
var table = document.getElementsByTagName("table")[0];
var ssidList = document.getElementsByTagName("table")[1];
var saved = getE("saved");
var ssidCounter = getE("ssidCounter");
var ssidContainer = getE("ssidContainer");
var ssid = getE("ssid");
var num = getE("num");
var randomIntrvl = getE("randomIntrvl");
var randomBtn = getE("randomBtn");
var randomCheckboxStatus = false;
var resultInterval;
var data = {};

function getResults() {
    getResponse("attackInfo.json", function(responseText) {
        var res = JSON.parse(responseText);
        var aps = "";
        var clients = "";
        var tr = "<tr><th>Attack</th><th>Status</th><th>Switch</th></tr>";
        for (var i = 0; i < res.aps.length; i++) aps += "<li class='clone-container'><div class='clone-text'>" + res.aps[i] + "</div><div class='clone-button'><button class='clone' onclick='cloneSSID(\"" + res.aps[i] + "\")'>clone</button></div></li>";
        for (var i = 0; i < res.clients.length; i++) clients += "<li>" + res.clients[i] + "</li>";

        if (aps) {
            document.getElementById("selectedNetworksDevices").className = "card-container-basic";
            selectedAPs.innerHTML = aps;
            if (clients != '<li>FF:FF:FF:FF:FF:FF - BROADCAST</li>') {
                selectedClients.innerHTML = clients;
                document.getElementById("users").className = "";
            } else {
                document.getElementById("users").className = "dn";
            }
        }

        for (var i = 0; i < res.attacks.length; i++) {
            if (res.attacks[i].running) tr += "<tr class='selected'>";
            else tr += "<tr>";

            tr += "<td>" + res.attacks[i].name + "</td>";
            if (res.attacks[i].status == "ready") tr += "<td class='green' id='status" + i + "'>" + res.attacks[i].status + "</td>";
            else tr += "<td class='red' id='status" + i + "'>" + res.attacks[i].status + "</td>";
            if (res.attacks[i].running) tr += "<td><button class='marginNull selectedBtn' onclick='startStop(" + i + ")'>stop</button></td>";
            else tr += "<td><button class='marginNull' onclick='startStop(" + i + ")'>start</button></td>";

            tr += "</tr>";
        }
        table.innerHTML = tr;

        if (typeof res.ssid != 'undefined') {
            data = res.ssid;
            ssidCounter.innerHTML = " ("+ data.length + "/48)";

            var tr = "<tr><th>SSID</th><th><div class='edit delete attack-del-all' onclick='clearSSID()'>&times;</div></th></tr>";
            for (var i = 0; i < res.ssid.length; i++) {
                tr += "<tr>";
                tr += "<td>" + res.ssid[i] + "</td>";
                tr += '<td><div class="edit delete" onclick="deleteSSID(' + i + ')">&times;</div></td>';
                tr += "</tr>";
            }
            ssidList.innerHTML = tr;
        }

    }, function() {
        clearInterval(resultInterval);
        showMessage("Reconnect to Wi-Fi network");
        checkConnection();
    }, 3000);
}

function startStop(num) {
    getResponse("attackStart.json?num=" + num, function(responseText) {
        getE("status" + num).innerHTML = "loading";
        if (responseText == "true") getResults();
        else showMessage("No networks selected!");
    });
}

function addSSID() {
    if (randomCheckboxStatus == true) {
        randomCheckboxStatus = false;
        saved.innerHTML = "";
        getResponse("randomSSID.json", getResults);
    } else {
        var _ssidName = ssid.value;
        if (_ssidName.length > 0) {
            if (data.length >= 64) showMessage("SSID list full", 2500);
            else {
                saved.innerHTML = "";
                getResponse("addSSID.json?ssid=" + _ssidName + "&num=" + num.value, getResults);
            }
        }
    }
}

function cloneSSID(_ssidName) {
    ssid.value = _ssidName;
    if (data.length > 0) num.value = 48 - data.length;
    else num.value = 48;
}

function deleteSSID(num) {
    saved.innerHTML = "";
    getResponse("deleteSSID.json?num=" + num, getResults);
}

function clearSSID() {
    saved.innerHTML = "";
    getResponse("clearSSID.json", getResults);
}

function saveSSID() {
    saved.innerHTML = "Saved successfully!";
    getResponse("saveSSID.json", getResults);
}

function resetSSID() {
    saved.innerHTML = "Saved successfully!";
    getResponse("resetSSID.json", getResults);
}

function random() {
    getResponse("enableRandom.json?interval=" + randomIntrvl.value, getResults);
}

function switchRandom() {
    if (randomCheckboxStatus == false) {
        randomCheckboxStatus = true;
        ssidContainer.classList.add("disabled");
        ssid.disabled = true;
    } else {
        randomCheckboxStatus = false;
        ssidContainer.classList.remove("disabled");
        ssid.disabled = false;
    }
}

getResults();
resultInterval = setInterval(getResults, 2000);
