var table = document.getElementsByTagName('table')[0];
var scanBtn = getE("startScan");
var clientsFound = getE("clientsFound");
var scanStatus = getE("spinner-container");
var clientNames = getE('clientNames');
var nameListTable = getE('nameList');
var res, scanTime;
var selectAllState = 'not-checked';
var tableHeaderHTML = '<tr><th>Name</th><th>Client info</th><th>Pkts</th><th style="padding-left: 40px"></th></tr>';

function compare(a, b) {
    if (a.p > b.p) return -1;
    if (a.p < b.p) return 1;
    return 0;
}

function toggleBtn(onoff) {
    if (onoff) {
        showLoading();
    } else {
        showLoading("hide");
    }
}

function getResults() {
    getResponse("ClientScanResults.json", function(responseText) {
        try {
            res = JSON.parse(responseText);
        } catch (e) {
            showMessage("ERROR: Clear the client list. (E5)");
            return;
        }

        res.clients = res.clients.sort(compare);

        clientsFound.innerHTML = '(' + res.clients.length + ' found)';

        var tr = '';
        if (res.clients.length > 1) tableHeaderHTML = '<tr><th>Name</th><th>Client info</th><th>Pkts</th><th><input type="checkbox" name="selectAll" id="selectAll" value="false" onclick="selAll()" '+selectAllState+'><label class="checkbox" for="selectAll"></th></tr>';
        tr += tableHeaderHTML;

        for (var i = 0; i < res.clients.length; i++) {

            if (res.clients[i].s == 1) tr += '<tr class="selected">';
            else tr += '<tr>';
            if (res.clients[i].n) {
                tr += '<td class="darken-on-hover" onclick="setName(' + res.clients[i].i + ')"><b>' + res.clients[i].n + '</b></td>';
            } else {
                tr += '<td class="darken-on-hover" onclick="setName(' + res.clients[i].i + ')">' + res.clients[i].v + '</td>';
            }
            tr += '<td onclick="select(' + res.clients[i].i + ')"><b>' + res.clients[i].m + '</b><br>' + res.clients[i].a + '</td>';
            tr += '<td onclick="select(' + res.clients[i].i + ')">' + res.clients[i].p + '</td>';
            if (res.clients[i].s == 1) tr += '<td onclick="select(' + res.clients[i].i + ')"><input type="checkbox" name="check' + res.clients[i].i + '" id="check' + res.clients[i].i + '" value="false" checked><label class="checkbox no-events" for="check' + res.clients[i].i + '"></label></td>';
            else tr += '<td onclick="select(' + res.clients[i].i + ')"><input type="checkbox" name="check' + res.clients[i].i + '" id="check' + res.clients[i].i + '" value="false"><label class="checkbox no-events" for="check' + res.clients[i].i + '"></label></td>';

            tr += '</tr>';
        }
        table.innerHTML = tr;
        if (res.nameList.length != 0) {
            document.getElementById('saved-users').className = "";
        }
        clientNames.innerHTML = "(" + res.nameList.length + "/50)";
        var tr = '<tr><th>Name</th><th>Action</th></tr>';
        for (var i = 0; i < res.nameList.length; i++) {

            tr += '<tr>';
            tr += '<td><b>' + res.nameList[i].n + '</b><br>' + res.nameList[i].m + '</td>';
            tr += '<td><div class="edit delete" onclick="deleteName(' + i + ')">&times;</div><div class="clearfix"></div><div class="edit add" onclick="add(' + i + ')">+</div><div class="clearfix"></div><div class="edit" onclick="editNameList(' + i + ')"><svg style=width:22px;height:24px viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg></div></td>';
            tr += '</tr>';
        }

        nameListTable.innerHTML = tr;
        Waves.attach('.edit');

    }, function() {
        showMessage("Reconnect to Wi-Fi network (E6)");
        checkConnection();
    }, 3000);

}

function scan() {
    getResponse("ClientScan.json?time=" + scanTime, function(responseText) {
        if (responseText == "true") {
            toggleBtn(true);
            checkConnection();
        } else {
            showMessage("INFO: No Wi-Fi network(s) selected! (E7)'");
        }

    });
}

function select(num) {
    getResponse("clientSelect.json?num=" + num, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'clientSelect.json' (E8)");
    });
}

function selAll() {
    if (selectAllState == 'not-checked') {
        select(-1);
        selectAllState = 'checked';
    } else {
        select(-2);
        selectAllState = 'not-checked';
    }
}

function clearNameList() {
    getResponse("clearNameList.json", function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'clearNameList.json' (E9)");
    });
}

function addClient() {
    getResponse("addClient.json?mac=" + cMac.value + "&name=" + cName.value, function(responseText) {
        if (responseText == "true") {
            getResults();
            var macReset = document.getElementById('cMac');
            var nameReset = document.getElementById('cName');
            macReset.value = '';
            nameReset.value = '';
        } else showMessage("ERROR: Bad response 'addClient.json' (E10)");
    });
}

function setName(id) {
    var newName = prompt("Name for " + res.clients[id].m);

    if (newName != null) {
        getResponse("setName.json?id=" + id + "&name=" + newName, function(responseText) {
            if (responseText == "true") getResults();
            else showMessage("ERROR: Bad response 'editNameList.json' (E11)");
        });
    }
}

function editNameList(id) {
    var newName = prompt("Name for " + res.nameList[id].m);

    if (newName != null) {
        getResponse("editNameList.json?id=" + id + "&name=" + newName, function(responseText) {
            if (responseText == "true") getResults();
            else showMessage("ERROR: Bad response 'editNameList.json' (E12)");
        });
    }
}

function deleteName(id) {
    getResponse("deleteName.json?num=" + id, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'deleteName.json' (E13)");
    });
}

function add(id) {
    getResponse("addClientFromList.json?num=" + id, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'addClientFromList.json' (E14)");
    });
}

getResponse("ClientScanTime.json", function(responseText) {
    scanTime = responseText;
});

getResults();
toggleBtn(false);
