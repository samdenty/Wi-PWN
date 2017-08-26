var table = document.getElementsByTagName('table')[0],
	networkInfo = getE('networksFound'),
	scanInfo = getE('spinner-container'),
	apMAC = getE('apMAC'),
	startStopScan = getE('startStopScan'),
	selectAll = getE('selectAll'),
	autoScan = false,
	tableHeaderHTML = '<tr><th width="8%"></th><th width="17%">Signal</th><th width="22%">SSID</th><th width="15%">Security</th><th width="8%">Ch.</th></tr>',
	selectAllState = 'not-checked',
	previousCall = new Date().getTime(),
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
		notify();
		res.aps = res.aps.sort(compare);
		networkInfo.innerHTML = '(' + res.aps.length + ')';
		if (res.aps.length == 0) scan()
		apMAC.innerHTML = "";
		if (res.multiAPs == 1) tableHeaderHTML = '<tr><th width="8%"><input type="checkbox" name="selectAll" id="selectAll" value="false" onclick="selAll()" ' + selectAllState + '><label class="checkbox" for="selectAll"></th><th width="17%">Signal</th><th width="22%">SSID</th><th width="15%">Security</th><th width="8%">Ch.</th></tr>';
		var tr = '';
		if (res.aps.length > 0) tr += tableHeaderHTML;

		for (var i = 0; i < res.aps.length; i++) {

			if (res.aps[i].se == 1) tr += '<tr class="selected" onclick="select(' + res.aps[i].i + ')">';
			else tr += '<tr onclick="select(' + res.aps[i].i + ')">';

			if (res.aps[i].se) {
				tr += '<td><input type="checkbox" name="check' + res.aps[i].i + '" id="check' + res.aps[i].i + '" value="false" checked><label class="checkbox" for="check' + res.aps[i].i + '"></label></td>';
				apMAC.innerHTML = res.aps[i].m;
			} else tr += '<td><input type="checkbox" name="check' + res.aps[i].i + '" id="check' + res.aps[i].i + '" value="false"><label class="checkbox" for="check' + res.aps[i].i + '"></label></td>';

			if (getEncryption(res.aps[i].e) != 'Open') {securityState = 'L'} else {securityState = ''}
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
			if (signalPercent > 100) signalPercent = 100;
			if (i == 0) {var tdID = ' id="resizeEventTD"'} else {var tdID = ''}
			tr += '<td class="WiFi"'+tdID+'><div>' + eval(wifiIndicator) + '</div><div><span style="background:linear-gradient(135deg, '+getColor(signalPercent)+' '+signalPercent+'%,rgba(0,0,0,0.15) '+signalPercent+'%)"></span><span style="color:'+getColor(signalPercent, true)+'">' + signalPercent + '</span></div></td>';
			tr += '<td>' + escapeHTML(res.aps[i].ss) + '</td>';
			tr += '<td>' + getEncryption(res.aps[i].e) + '</td>';
			tr += '<td>' + res.aps[i].c + '</td>';
			tr += '</tr>';
		}
		table.innerHTML = tr;
		checkSize()
		fadeIn();
	}, function() {
		toggleScan(true);
		fadeIn();
		notify("Failed to scan for networks E0")
	});
}

function getColor(value, lighten){
	var lightness = 50;
	var saturation = 75;
	if (lighten == true) lightness = 90
	if (value > 120) value = 100
	if (value > 90) saturation = 60;
	value = 100 - value;
	var hue=((1-(value/87))*100).toString(10);
	return ["hsl(",hue,","+saturation+"%,"+lightness+"%)"].join("");
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
	var time = new Date().getTime();
	if ((time - previousCall) >= 80) {
		previousCall = time;
		getResponse("APSelect.json?num=" + num, function(responseText) {
			if (responseText == "true") getResults();
			else notify("ERROR: Bad response 'APSelect.json' (E4)");
		});
	}
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

/* Add event listener for WiFi signal icons */
	window.onresize = function(event){checkSize()}
	function checkSize() {
		var w = document.getElementById('resizeEventTD').clientWidth;
		if (w <= 99) {
			document.getElementById('apscan').className = 'pointUp'
		} else {
			document.getElementById('apscan').className = ''
		}
	}

getResults();