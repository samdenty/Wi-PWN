var selectedAPs = getE("selectedAPs");
var selectedClients = getE("selectedClients");
var table = document.getElementsByTagName("table")[0];
var ssidList = document.getElementsByTagName("table")[1];
var saved = getE("saved");
var ssidCounter = getE("ssidCounter");
var ssidContainer = getE("ssidContainer");
var ssid = getE("ssid");
var num = getE("num");
var randomBtn = getE("randomBtn");
var resultInterval;
var randomIntrvl = 5;
var data = {};

var randSSID = document.getElementById('randSSID');
randSSID.addEventListener("change", switchRandom, false);

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
            if (res.attacks[i].status == "ready") {
                tr += "<td class='green' id='status" + i + "'>" + res.attacks[i].status + "</td>";
            } else {
                tr += "<td class='red' id='status" + i + "'>" + res.attacks[i].status + "</td>";
            }
            if (res.attacks[i].running) {
                tr += "<td><button class='attackBtn selectedBtn' onclick='startStop(" + i + ")'>stop</button></td>";
            } else {
                if(res.attacks[i].status == "No network(s)") {
                    tr += "<td><button class='attackBtn' disabled=''>start</button></td>";
                } else {
                    tr += "<td><button class='attackBtn' onclick='startStop(" + i + ")'>start</button></td>";
                }
            }
            tr += "</tr>";
            if (~res.attacks[i].name.indexOf('Beacon')) {
                if (res.randomMode == 1) {
                    tr += "<tr class='selected'><td class='darken-on-hover' onclick='changeInterval()'>Random <span class='light'>"+randomIntrvl+"s</span></td><td class='red'>running</td><td><button class='attackBtn selectedBtn' id='randomBtn' onclick='random()'>stop</button></td></tr>"
                } else {
                    tr += "<tr><td class='darken-on-hover' onclick='changeInterval()'>Random <span class='light'>"+randomIntrvl+"s</span></td><td class='green'>ready</td><td><button class='attackBtn' id='randomBtn' onclick='random()'>start</button></td></tr>"
                }
            }
        }
        table.innerHTML = tr;
        Waves.attach('button',['waves-light']);

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
        checkConnection();
    }, 3000);
}

function startStop(num) {
    getResponse("attackStart.json?num=" + num, function(responseText) {
        getE("status" + num).innerHTML = "...";
        if (responseText == "true") getResults();
        else showMessage("No network(s) selected!");
    });
}

function addSSID() {
    var isChecked = randSSID.checked;
    if (isChecked) {
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
    getResponse("enableRandom.json?interval=" + randomIntrvl, getResults);
}

function changeInterval() {
    var newRandomIntrvl = prompt("Random attack interval", randomIntrvl);
    if (isNaN(newRandomIntrvl)=== false && newRandomIntrvl) {
        randomIntrvl = newRandomIntrvl;
        getResults();
    }
}
function switchRandom() {
    var isChecked = randSSID.checked;
    if (isChecked) {
        ssidContainer.classList.add("disabled");
    } else {
        ssidContainer.classList.remove("disabled");
    }
}

getResults();
resultInterval = setInterval(getResults, 2000);
