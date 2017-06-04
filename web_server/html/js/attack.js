var selectedAPs = getE("selectedAPs");
var selectedClients = getE("selectedClients");
var table = document.getElementsByTagName("table")[0];
var ssidList = document.getElementsByTagName("table")[1];
var saved = getE("saved");
var ssidCounter = getE("ssidCounter");
var resultInterval;
var res;

function getResults() {
    getResponse("attackInfo.json", function(responseText) {
        res = JSON.parse(responseText);
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
            if (res.attacks[i].status == "ready") tr += "<td class='green'>" + res.attacks[i].status + "</td>";
            else tr += "<td class='red'>" + res.attacks[i].status + "</td>";
            if (res.attacks[i].running) tr += "<td><button class='marginNull selectedBtn' onclick='startStop(" + i + ")'>stop</button></td>";
            else tr += "<td><button class='marginNull' onclick='startStop(" + i + ")'>start</button></td>";

            tr += "</tr>";
        }
        table.innerHTML = tr;
        ssidCounter.innerHTML = " (" + res.ssid.length + "/48)";

        var tr = "<tr><th>SSID</th><th>Remove</th></tr>";
        for (var i = 0; i < res.ssid.length; i++) {
            tr += "<tr>";
            tr += "<td>" + res.ssid[i] + "</td>";
            tr += '<td><div class="edit delete" onclick="deleteSSID(' + i + ')">&times;</div></td>';
            tr += "</tr>";
        }
        ssidList.innerHTML = tr;

    }, function() {
        clearInterval(resultInterval);
        showMessage("ERROR: Failed to load 'attackInfo.json'");
        checkConnection();
    }, 3000);
}

function startStop(num) {
    getResponse("attackStart.json?num=" + num, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'attackStart.json'");
    });
}

function addSSID() {
    saved.innerHTML = "";
    if (res.ssid.length >= 64) showMessage("SSID list is full", 2500);
    else {
        var _ssidName = prompt("Add SSID:");
        if (_ssidName != null) getResponse("addSSID.json?name=" + _ssidName, getResults);
    }
}

function cloneSSID(_ssidName) {
    saved.innerHTML = "";
    if (res.ssid.length >= 64) showMessage("SSID list is full", 2500);
    else if (_ssidName != null) getResponse("cloneSSID.json?name=" + _ssidName, getResults);
}

function deleteSSID(num) {
    saved.innerHTML = "";
    getResponse("deleteSSID.json?num=" + num, getResults);
}

function randomSSID() {
    saved.innerHTML = "";
    getResponse("randomSSID.json", getResults);
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

getResults();
resultInterval = setInterval(getResults, 1000);
