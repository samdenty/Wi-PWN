var selectedAPs = getE("selectedAPs"),
    selectedClients = getE("selectedClients"),
    table = document.getElementsByTagName("table")[0],
    ssidList = document.getElementsByTagName("table")[3],
    ssidCounter = getE("ssidCounter"),
    ssidContainer = getE("ssidContainer"),
    ssid = getE("ssid"),
    num = getE("num"),
    randomBtn = getE("randomBtn"),
    resultInterval = '',
    randomIntrvl = 5,
    data = {};

var randSSID = document.getElementById('randSSID');
randSSID.addEventListener("change", switchRandom, false);

function getResults() {
    getResponse("attackInfo.json", function(responseText) {
        var res = JSON.parse(responseText);
        if (res.aps.length == 0) {document.getElementById("selectedNetworksDevices").className = "dn";var aps = ""} else {document.getElementById("selectedNetworksDevices").className = "card-container";var aps = "<tr><th>SSID</th><th></th></tr>"}
        var clients = "<tr><th>MAC Address</th><th>Vendor</th></tr>";
        var tr = "<tr><th>Attack</th><th>Status</th><th>Switch</th></tr>";
        for (var i = 0; i < res.aps.length; i++) {
            var resApsI = res.aps[i].replace("'", "\\'"); // Escape single quotes from network name
            resApsI = resApsI.replace("\"", "&quot;"); // Escape double quotes from network name
            aps += "<tr><td>" + res.aps[i] + "</td><td><button class='clone' onclick=\"cloneSSID('" + resApsI + "')\"><svg viewBox='0 0 1000 1000'xmlns=http://www.w3.org/2000/svg><path d='M700.5,10H165.9c-49.2,0-89.1,39.9-89.1,89.1v623.6h89.1V99.1h534.5V10L700.5,10z M834.1,188.2h-490c-49.2,0-89.1,39.9-89.1,89.1v623.6c0,49.2,39.9,89.1,89.1,89.1h490c49.2,0,89.1-39.9,89.1-89.1V277.3C923.2,228.1,883.3,188.2,834.1,188.2z M834.1,900.9h-490V277.3h490V900.9z'/></svg>clone</button></td></tr>";
        }
        for (var i = 0; i < res.clients.length; i++) {
            clients += "<tr><td>" + res.clients[i].substr(0,res.clients[i].indexOf(' ')) + "</td><td>" + res.clients[i].substr(res.clients[i].indexOf(' ')+1).split("-", 1) + "</td></tr>";
        }

        if (aps) {
            document.getElementById("selectedNetworksDevices").className = "card-container";
            selectedAPs.innerHTML = aps;
            if (clients.indexOf('FF:FF:FF:FF:FF:FF') >= 0) {
                document.getElementById("selectedClients").className = "dn";
            } else {
                selectedClients.innerHTML = clients;
                document.getElementById("selectedClients").className = "";
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

            var tr = "<tr><th>SSID</th><th><a onclick='clearSSID()' class='right' style='padding-right:10px'>Clear</a></th></tr>";
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
        else notify("No network(s) selected! (E15)");
    });
}

function addSSID() {
    var isChecked = randSSID.checked;
    if (isChecked) {
        getResponse("randomSSID.json", getResults);
    } else {
        var _ssidName = ssid.value;
        if (_ssidName.length > 0) {
            if (data.length >= 64) notify("SSID list full (E16)", 2500);
            else {
                getResponse("addSSID.json?ssid=" + _ssidName + "&num=" + num.value, getResults);
            }
        }
    }
}

function cloneSSID(_ssidName) {
    ssid.value = _ssidName;
    if (data.length > 0) num.value = 48 - data.length;
    else num.value = 48;
    var section2 = document.getElementById("section2");
    scrollIt(section2);
}

function deleteSSID(num) {
    getResponse("deleteSSID.json?num=" + num, getResults);
}

function clearSSID() {
    getResponse("clearSSID.json", getResults);
}

function saveSSID() {
    indicate(true);
    getResponse("saveSSID.json", getResults);
}

function resetSSID() {
    indicate(true);
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
