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
	enc = getE("enc"),
	data = {},
	randSSID = document.getElementById('randSSID');

randSSID.addEventListener("change", switchRandom, false);

function getResults() {
	getResponse("attackInfo.json", function(responseText) {
		try {
		    var res = JSON.parse(responseText);
		}
		catch(err) {
		    notify('Failed to parse saved SSIDs, clearing...')
		    resetSSID(true)
		}
		if (res.aps.length == 0) {document.getElementById("selectedNetworksDevices").className = "dn";var aps = ""} else {document.getElementById("selectedNetworksDevices").className = "card-container";var aps = "<tr><th>SSID</th><th></th></tr>"}
		var clients = "<tr><th>MAC Address</th><th>Vendor</th></tr>";
		var tr = "<tr><th>Attack</th><th>Status</th><th>Switch</th></tr>";
		for (var i = 0; i < res.aps.length; i++) {
			aps += "<tr><td>" + res.aps[i] + "</td><td><button class='clone' onclick=\"cloneSSID('" + escapeHTML(res.aps[i]) + "')\"><svg viewBox='0 0 1000 1000'xmlns=http://www.w3.org/2000/svg><path d='M700.5,10H165.9c-49.2,0-89.1,39.9-89.1,89.1v623.6h89.1V99.1h534.5V10L700.5,10z M834.1,188.2h-490c-49.2,0-89.1,39.9-89.1,89.1v623.6c0,49.2,39.9,89.1,89.1,89.1h490c49.2,0,89.1-39.9,89.1-89.1V277.3C923.2,228.1,883.3,188.2,834.1,188.2z M834.1,900.9h-490V277.3h490V900.9z'/></svg>clone</button></td></tr>";
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
				tr += "<td><button class='redBtn' onclick='startStop(" + i + ")'>stop</button></td>";
			} else {
				if(res.attacks[i].status == "No network(s)") {
					tr += "<td><button disabled=''>start</button></td>";
				} else {
					tr += "<td><button class='secondary' onclick='startStop(" + i + ")'>start</button></td>";
				}
			}
			tr += "</tr>";
			if (~res.attacks[i].name.indexOf('Beacon')) {
				if (res.randomMode == 1) {
					tr += "<tr class='selected'><td class='darken-on-hover' onclick='changeInterval()'>Random <span class='light'>"+randomIntrvl+"s</span></td><td class='red'>running</td><td><button class='redBtn' id='randomBtn' onclick='random()'>stop</button></td></tr>"
				} else {
					tr += "<tr><td class='darken-on-hover' onclick='changeInterval()'>Random <span class='light'>"+randomIntrvl+"s</span></td><td class='green'>ready</td><td><button id='randomBtn' class='secondary' onclick='random()'>start</button></td></tr>"
				}
			}
		}
		table.innerHTML = tr;
		Waves.attach('button',['waves-blue']);

		if (typeof res.ssid != 'undefined') {
			data = res.ssid;
			ssidCounter.innerHTML = " ("+ data.length + "/48)";

			var tr = "<tr><th>SSID</th><th><a onclick='clearSSID()' class='button secondary right'>clear</a></th></tr>";
			for (var i = 0; i < data.length; i++) {
				tr += "<tr>";
				tr += "<td>" + escapeHTML(data[i][0]) + "</td>";
				if((data[i][1] == 1)) 
					var lockIcon = '<div class="edit enc"><svg viewBox="0 0 24 24"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg></div>'
				else
					var lockIcon = ''
				tr += '<td><div class="edit delete" onclick="deleteSSID(' + i + ')">&times;</div>' + lockIcon + '</td>';
				tr += "</tr>";
			}
			ssidList.innerHTML = tr;
		}
		fadeIn();


	}, function() {
		fadeIn();
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
				getResponse("addSSID.json?ssid=" + _ssidName + "&num=" + num.value + "&enc=" + enc.checked, getResults);
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
	notify()
}

function saveSSID() {
	indicate(true);
	getResponse("saveSSID.json", getResults);
}

function resetSSID(skipPrompt) {
	if(skipPrompt) {
		indicate(true);
		getResponse("resetSSID.json", getResults);
		return;
	}
	if(confirm("Are you sure you want to permanently remove all saved SSIDs?") == true) {
		indicate(true);
		getResponse("resetSSID.json", getResults);
	}
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