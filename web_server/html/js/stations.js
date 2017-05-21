var table = document.getElementsByTagName('table')[0];
var scanBtn = getE("startScan");
var scanTime = getE("scanTime");
var clientsFound = getE("clientsFound");
var scanStatus = getE("spinner-container");
var clientNames = getE('clientNames');
var nameListTable = getE('nameList');
var res;

function compare(a, b) {
    if (a.p > b.p) return -1;
    if (a.p < b.p) return 1;
    return 0;
}

function toggleBtn(onoff) {
    if (onoff) {
        scanStatus.classList.add("show-loading")
    } else {
        scanStatus.classList.remove("show-loading")
    }
}

function getResults() {
    getResponse("ClientScanResults.json", function(responseText) {
        try {
            res = JSON.parse(responseText);
        } catch (e) {
            showMessage("ERROR: Clear the client list.");
            return;
        }

        res.clients = res.clients.sort(compare);

        clientsFound.innerHTML = '('+res.clients.length+' clients found)';

        var tr = '';
        if (res.clients.length > 0) tr += '<tr><th>Name</th><th>Client info</th><th>Pkts</th><th style="padding-left: 40px"></th></tr>';

        for (var i = 0; i < res.clients.length; i++) {

            if (res.clients[i].s == 1) tr += '<tr class="selected">';
            else tr += '<tr>';
            tr += '<td><b>' + res.clients[i].n + '</b><div class="edit"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUAgMAAADw5/WeAAAADFBMVEUAAAAAAAAAAAAAAAA16TeWAAAABHRSTlMB/phhN1gO+QAAADtJREFUeF5jQAM8YFIVTIo6AAkm1gIgyenYABIOAAlPjQAJhyaAhEPBwmFowrxgYU6wMGcEiOTbgGYPAPKdCT6Ht/q3AAAAAElFTkSuQmCC" onclick="changeName(' + res.clients[i].i + ')"></div><br>' + res.clients[i].v + '</td>';
            tr += '<td><b>' + res.clients[i].m + '</b><br>' + res.clients[i].a + '</td>';
            tr += '<td>' + res.clients[i].p + '</td>';
            if (res.clients[i].s == 1) tr += '<td onclick="select(' + res.clients[i].i + ')"><input type="checkbox" name="check' + res.clients[i].i + '" id="check' + res.clients[i].i + '" value="false" checked><label class="checkbox no-events" for="check' + res.clients[i].i + '"></label></td>';
            else tr += '<td onclick="select(' + res.clients[i].i + ')"><input type="checkbox" name="check' + res.clients[i].i + '" id="check' + res.clients[i].i + '" value="false"><label class="checkbox no-events" for="check' + res.clients[i].i + '"></label></td>';

            tr += '</tr>';
        }
        table.innerHTML = tr;

        clientNames.innerHTML = res.nameList.length + "/50";

        var tr = '<tr><th>MAC</th><th>Name</th><th>X</th><th>Add</th></tr>';

        for (var i = 0; i < res.nameList.length; i++) {

            tr += '<tr>';
            tr += '<td>' + res.nameList[i].m + '</td>';
            tr += '<td>' + res.nameList[i].n + ' <a onclick="changeName(' + i + ')">edit</a></td>';
            tr += '<td><button class="marginNull button-warn" onclick="deleteName(' + i + ')">x</button></td>';
            tr += '<td><button class="marginNull button-primary" onclick="add(' + i + ')">add</button></td>';
            tr += '</tr>';
        }

        nameListTable.innerHTML = tr;

    }, function() {
        showMessage("Reconnect and reload this page");
    }, 6000);

}

function scan() {
    toggleBtn(true);
    getResponse("ClientScan.json?time=" + scanTime.value, function(responseText) {
        if (responseText == "true") {
            setTimeout(function() {
                toggleBtn(true);
                getResults();
            }, scanTime.value * 1000);
        } else {
            showMessage("INFO: No Wi-Fi network(s) selected!'");
            scanStatus.classList.remove("show-loading");
        }

    });
}

function select(num) {
    getResponse("clientSelect.json?num=" + num, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'clientSelect.json'");
    });
}

function clearNameList() {
    getResponse("clearNameList.json", function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'clearNameList.json'");
    });
}

function addClient() {
    getResponse("addClient.json?mac=" + cMac.value + "&name=" + cName.value, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'addClient.json'");
    });
}

function changeName(id) {
    var newName = prompt("Name for " + res.nameList[id].m);
    if (newName != null) {
        getResponse("editNameList.json?id=" + id + "&name=" + newName, function(responseText) {
            if (responseText == "true") getResults();
            else showMessage("ERROR: Bad response 'editNameList.json'");
        });
    }
}

function deleteName(id) {
    getResponse("deleteName.json?num=" + id, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'deleteName.json'");
    });
}

function add(id) {
    getResponse("addClientFromList.json?num=" + id, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'addClientFromList.json'");
    });
}

getResponse("ClientScanTime.json", function(responseText) {
    scanTime.value = responseText;
});

getResults();
toggleBtn(false);
