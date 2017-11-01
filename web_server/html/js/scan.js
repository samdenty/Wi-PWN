---
---
var table = document.getElementsByTagName('table')[0],
	networkInfo = getE('networksFound'),
	scanInfo = getE('spinner-container'),
	apMAC = getE('apMAC'),
	startStopScan = getE('startStopScan'),
	selectAll = getE('selectAll'),
	autoScan = false,
	tableHeaderHTML = '<tr><th width="8%"></th><th width="17%">{% t scan.card-1.table.signal %}</th><th width="22%">{% t global.ssid %}</th><th width="15%">{% t scan.card-1.table.security %}</th><th width="8%">{% t scan.card-1.table.channel %}</th></tr>',
	selectAllState = 'not-checked',
	previousCall = new Date().getTime(),
	url = window.location.href,
	wifiIndicator, securityState, res;

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

function getStatus(enc, hid) {
	var buff = "";
		  if (enc == 8) buff = "WPA* &nbsp;&#128274;";
	else  if (enc == 4) buff = "WPA2 &nbsp;&#128274;";
	else  if (enc == 2) buff = "WPA";
	else  if (enc == 7) buff = "{% t scan.strings.A %}";
	else  if (enc == 5) buff = "WEP";
		  if (hid == 1) buff += "&#128123;";
	return buff
}

function getResults() {
	toggleScan(true);
	getResponse("APScanResults.json", function(responseText) {
		try {
			res = JSON.parse(responseText);
			log("RESPONSE  ~ ", res,  true)
			notify()
		} catch(err) {
			log("INVALID   ~ ", responseText, false)
			console.error(err)
			notify('{% t errors.E98 %}');
			return
		}
		res.aps = res.aps.sort(compare);
		networkInfo.innerHTML = res.aps.length;
		if (res.aps.length == 0) scan()
		apMAC.innerHTML = "";
		if (res.multiAPs == 1) tableHeaderHTML = '<tr><th width="8%"><input type="checkbox" name="selectAll" id="selectAll" value="false" onclick="selAll()" ' + selectAllState + '><label class="checkbox" for="selectAll"></th><th width="17%">{% t scan.card-1.table.signal %}</th><th width="22%">{% t global.ssid %}</th><th width="15%">{% t scan.card-1.table.security %}</th><th width="8%">{% t scan.card-1.table.channel %}</th></tr>';
		var tr = '';
		if (res.aps.length > 0) tr += tableHeaderHTML;

		for (var i = 0; i < res.aps.length; i++) {

			if (res.aps[i].se == 1) tr += '<tr class="selected" onclick="select(' + res.aps[i].i + ')">';
			else tr += '<tr onclick="select(' + res.aps[i].i + ')">';

			if (res.aps[i].se) {
				tr += '<td><input type="checkbox" name="check' + res.aps[i].i + '" id="check' + res.aps[i].i + '" value="false" checked><label class="checkbox" for="check' + res.aps[i].i + '"></label></td>';
				apMAC.innerHTML = res.aps[i].m;
			} else tr += '<td><input type="checkbox" name="check' + res.aps[i].i + '" id="check' + res.aps[i].i + '" value="false"><label class="checkbox" for="check' + res.aps[i].i + '"></label></td>';

			if (getStatus(res.aps[i].e) != 'Open') {securityState = 'L'} else {securityState = ''}
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
			tr += '<td>' + getStatus(res.aps[i].e, res.aps[i].h) + '</td>';
			tr += '<td>' + res.aps[i].c + '</td>';
			tr += '</tr>';
		}
		table.innerHTML = tr;
		checkSize()
		fadeIn();
	}, function() {
		toggleScan(true);
		fadeIn();
		notify("{% t errors.E0 %} E0")
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
		else notify("{% t errors.bad-response %} 'APScan.json' (E3)");
		setTimeout(function(){toggleScan(true)}, 700);
	});
}

function select(num) {
	var time = new Date().getTime();
	if ((time - previousCall) >= 80) {
		previousCall = time;
		getResponse("APSelect.json?num=" + num, function(responseText) {
			if (responseText == "true") getResults();
			else notify("{% t errors.bad-response %} 'APSelect.json' (E4)");
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
		try {
			var w = document.getElementById('resizeEventTD');
			if (w.clientWidth <= 99) {
				document.getElementById('apscan').className = 'pointUp'
			} else {
				document.getElementById('apscan').className = ''
			}
		} catch(e) {}
	}

getResults();