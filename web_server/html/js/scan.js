var table = document.getElementsByTagName('table')[0],
    networkInfo = getE('networksFound'),
    scanInfo = getE('spinner-container'),
    apMAC = getE('apMAC'),
    startStopScan = getE('startStopScan'),
    selectAll = getE('selectAll'),
    autoScan = false,
    tableHeaderHTML = '<tr><th>Signal</th><th>SSID</th><th>Security</th><th>Ch.</th><th style="padding-left: 40px"></th></tr>',
    selectAllState = 'not-checked',
    url = window.location.href,
    wifiIndicator, securityState;

function toggleScan(onoff) {
    if (onoff && !autoScan) {
        showLoading("hide");
    } else {
        showLoading();
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
    else if (num == 7) return "Open";
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
        if (res.multiAPs == 1) tableHeaderHTML = '<tr><th>Signal</th><th>SSID</th><th>Security</th><th>Ch.</th><th><input type="checkbox" name="selectAll" id="selectAll" value="false" onclick="selAll()" ' + selectAllState + '><label class="checkbox" for="selectAll"></th></tr>';
        var tr = '';
        if (res.aps.length > 0) tr += tableHeaderHTML;

        for (var i = 0; i < res.aps.length; i++) {

            if (res.aps[i].se == 1) tr += '<tr class="selected" onclick="select(' + res.aps[i].i + ')">';
            else tr += '<tr onclick="select(' + res.aps[i].i + ')">';
            if (getEncryption(res.aps[i].e) !== 'Open') {securityState = 'L'} else {securityState = ''}
            if (-89 > res.aps[i].r) {
                wifiIndicator = 's0'+securityState
            } else if (-88 > res.aps[i].r) {
                wifiIndicator = 's1'+securityState
            } else if (-77 > res.aps[i].r) {
                wifiIndicator = 's2'+securityState
            } else if (-66 > res.aps[i].r) {
                wifiIndicator = 's3'+securityState
            } else {
                wifiIndicator = 's4'+securityState
            }
            var signalPercent = Math.round((1-((res.aps[i].r+30)/-70))*100);
            tr += '<td class="WiFi"><div>' + eval(wifiIndicator) + '</div><div><span style="background:linear-gradient(135deg, rgba(0,0,0,0.3) '+signalPercent+'%,rgba(0,0,0,0.07) '+signalPercent+'%)"></span><span>' + res.aps[i].r + '</span></div></td>';
            tr += '<td>' + res.aps[i].ss + '</td>';
            tr += '<td>' + getEncryption(res.aps[i].e) + '</td>';
            tr += '<td>' + res.aps[i].c + '</td>';

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
        else notify("ERROR: Bad response 'APScan.json' (E3)");
        setTimeout(function(){toggleScan(true)}, 700);
    });
}

function select(num) {
    getResponse("APSelect.json?num=" + num, function(responseText) {
        if (responseText == "true") getResults();
        else notify("ERROR: Bad response 'APSelect.json' (E4)");
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
