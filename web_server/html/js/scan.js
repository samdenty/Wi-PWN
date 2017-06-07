var table = document.getElementsByTagName('table')[0];
var networkInfo = getE('networksFound');
var scanInfo = getE('spinner-container');
var apMAC = getE('apMAC');
var startStopScan = getE('startStopScan');
var selectAll = getE('selectAll');
var autoScan = false;
var tableHeaderHTML = '<tr><th>Ch</th><th>SSID</th><th>Signal</th><th>Type</th><th style="padding-left: 40px"></th></tr>';
var selectAllState = 'not-checked';
var url = window.location.href;

function toggleScan(onoff) {
    if (onoff && !autoScan) {
        scanInfo.classList.remove("show-loading")
    } else {
        scanInfo.classList.add("show-loading")
    }
}

function compare(a, b) {
    if (a.r > b.r) return -1;
    if (a.r < b.r) return 1;
    return 0;
}

function getEncryption(num) {
    if (num == 8) return "WPA*";
    else if (num == 4) return "WPA2";
    else if (num == 2) return "WPA";
    else if (num == 7) return "none";
    else if (num == 5) return "WEP";
}

function getResults() {
    toggleScan(true);
    getResponse("APScanResults.json", function(responseText) {
        var res = JSON.parse(responseText);
        res.aps = res.aps.sort(compare);
        networkInfo.innerHTML = '(' + res.aps.length + ' found)';
        if (res.aps.length == 0) scan()
        apMAC.innerHTML = "";
        if (res.multiAPs == 1) tableHeaderHTML = '<tr><th>Ch</th><th>SSID</th><th>Signal</th><th>Type</th><th><input type="checkbox" name="selectAll" id="selectAll" value="false" onclick="selAll()" '+selectAllState+'><label class="checkbox" for="selectAll"></th></tr>';
         var tr = '';
        if (res.aps.length > 0) tr += tableHeaderHTML;

        for (var i = 0; i < res.aps.length; i++) {

            if (res.aps[i].se == 1) tr += '<tr class="selected" onclick="select(' + res.aps[i].i + ')">';
            else tr += '<tr onclick="select(' + res.aps[i].i + ')">';
            tr += '<td>' + res.aps[i].c + '</td>';
            tr += '<td>' + res.aps[i].ss + '</td>';
            tr += '<td>' + res.aps[i].r + ' <meter value="' + res.aps[i].r + '" max="-30" min="-100" low="-80" high="-60" optimum="-50"></meter></td>';
            tr += '<td>' + getEncryption(res.aps[i].e) + '</td>';

            if (res.aps[i].se) {
                tr += '<td><input type="checkbox" name="check' + res.aps[i].i + '" id="check' + res.aps[i].i + '" value="false" checked><label class="checkbox no-events" for="check' + res.aps[i].i + '"></label></td>';
                apMAC.innerHTML = res.aps[i].m;
            } else tr += '<td><input type="checkbox" name="check' + res.aps[i].i + '" id="check' + res.aps[i].i + '" value="false"><label class="checkbox no-events" for="check' + res.aps[i].i + '"></label></td>';
            tr += '</tr>';
        }
        table.innerHTML = tr;
    });
}

function scan() {
    toggleScan(false);
    getResponse("APScan.json", function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'APScan.json'");
        toggleScan(true);
    });
}

function select(num) {
    getResponse("APSelect.json?num=" + num, function(responseText) {
        if (responseText == "true") getResults();
        else showMessage("ERROR: Bad response 'APSelect.json'");
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


getResults();
