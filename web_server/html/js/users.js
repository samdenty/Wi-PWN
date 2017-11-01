---
---
var table = document.getElementsByTagName('table')[0],
	scanBtn = getE("startScan"),
	clientsFound = getE("clientsFound"),
	scanStatus = getE("spinner-container"),
	clientNames = getE('clientNames'),
	nameListTable = getE('nameList'),
	res = '', scanTime = '',
	previousCall = new Date().getTime(),
	selectAllState = 'not-checked',
	countdownRemaining = 0,
	startCountdown,
	tableHeaderHTML = '<tr><th width="11%"></th><th>{% t global.name %}</th><th>{% t users.card-1.table.info %}</th><th>{% t users.card-1.table.packets %}</th></tr>';

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
			log("RESPONSE  ~ ", res,  true)
			notify()
		} catch(err) {
			log("INVALID   ~ ", responseText, false)
			console.error(err)
			if (confirm("{% t users.strings.A %}") == true) {
				notify("{% t users.strings.B %}");
				clearNameList(true);
				getResults();
			}
			return
		}

		res.clients = res.clients.sort(compare);

		clientsFound.innerHTML = '(' + res.clients.length + ')';

		var tr = '';
		if (res.clients.length > 1) tableHeaderHTML = '<tr><th width="11%"><input type="checkbox" name="selectAll" id="selectAll" value="false" onclick="selAll()" '+selectAllState+'><label class="checkbox" for="selectAll"></th><th>{% t global.name %}</th><th>{% t users.card-1.table.info %}</th><th>{% t users.card-1.table.packets %}</th></tr>';
		tr += tableHeaderHTML;

		for (var i = 0; i < res.clients.length; i++) {

			if (res.clients[i].s == 1) tr += '<tr class="selected">';
			else tr += '<tr>';
			if (res.clients[i].s == 1) tr += '<td onclick="select(' + res.clients[i].i + ')"><input type="checkbox" name="check' + res.clients[i].i + '" id="check' + res.clients[i].i + '" value="false" checked><label class="checkbox" for="check' + res.clients[i].i + '"></label></td>';
			else tr += '<td onclick="select(' + res.clients[i].i + ')"><input type="checkbox" name="check' + res.clients[i].i + '" id="check' + res.clients[i].i + '" value="false"><label class="checkbox" for="check' + res.clients[i].i + '"></label></td>';
			if (res.clients[i].l >= 0) {
				tr += '<td class="darken-on-hover" onclick="setName(' + res.clients[i].i + ')"><span class="a b">' + escapeHTML(res.clients[i].n) + '</span><br>' +  escapeHTML(res.clients[i].v)  +'</td>';
			} else {
				tr += '<td class="darken-on-hover" onclick="setName(' + res.clients[i].i + ')"><span class="a light-6">{% t global.save %}</span><br>' + escapeHTML(res.clients[i].v) + '</td>';
			}
			tr += '<td onclick="select(' + res.clients[i].i + ')"><b>' + res.clients[i].m + '</b><br>' +  escapeHTML(res.clients[i].a) + '</td>';
			tr += '<td onclick="select(' + res.clients[i].i + ')">' + res.clients[i].p + '</td>';

			tr += '</tr>';
		}
		if (tr != tableHeaderHTML) table.innerHTML = tr;
		if (res.nameList.length != 0) {
			document.getElementById('saved-users').className = "";
		}
		clientNames.innerHTML = "(" + res.nameList.length + "/50)";
		var tr = '<tr><th>{% t global.name %}</th><th><a onclick="clearNameList()" class="button secondary right">{% t global.reset %}</a></th></tr>';
		for (var i = 0; i < res.nameList.length; i++) {

			tr += '<tr>';
			tr += '<td><b>' + escapeHTML(res.nameList[i].n) + '</b><br>' + res.nameList[i].m + '</td>';
			tr += '<td><div class="edit delete" onclick="deleteName(' + i + ')">&times;</div><div class="clearfix"></div><div class="edit add" onclick="add(' + i + ')">+</div><div class="clearfix"></div><div class="edit" onclick="editNameList(' + i + ')"><svg style=width:22px;height:24px viewBox="0 0 24 24"><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"></path></svg></div></td>';
			tr += '</tr>';
		}

		nameListTable.innerHTML = tr;
		Waves.attach('.edit');
		fadeIn();

	}, function() {
		fadeIn();
		notify("{% t errors.E6 %} (E6)");
		checkConnection();
	}, 3000);

}

function scan() {
	countdownRemaining = scanTime;
	startCountdown = setInterval(function(){countdown()}, 1000);
	getResponse("ClientScan.json?time=" + scanTime, function(responseText) {
		if (responseText == "true") {
			toggleBtn(true);
			
		} else {
			notify("{% t errors.E7 %} (E7)");
			countdown(true);
		}
	});
}

function select(num) {
	var time = new Date().getTime();
	if ((time - previousCall) >= 80) {
		previousCall = time;
		getResponse("clientSelect.json?num=" + num, function(responseText) {
			if (responseText == "true") getResults();
			else notify("{% t errors.bad-response %} 'clientSelect.json' (E8)");
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

function clearNameList(bypass) {
	if (bypass || confirm("Remove all saved users?") == true) {
		getResponse("clearNameList.json", function(responseText) {
			if (responseText == "true") getResults();
			else notify("{% t errors.bad-response %} 'clearNameList.json' (E9)");
		});
	}
}

function addClient() {
	getResponse("addClient.json?mac=" + cMac.value + "&name=" + cName.value, function(responseText) {
		if (responseText == "true") {
			getResults();
			var macReset = document.getElementById('cMac');
			var nameReset = document.getElementById('cName');
			macReset.value = '';
			nameReset.value = '';
		} else notify("{% t errors.E10 %} (E10)");
	});
}

function setName(id) {
	var newName = prompt("Name for " + res.clients[id].m, res.clients[id].n);
	if (newName != null) {
		getResponse("setName.json?id=" + id + "&name=" + newName, function(responseText) {
			if (responseText == "true") getResults();
			else notify("{% t errors.bad-response %}e 'editNameList.json' (E11)");
		});
	}
}

function editNameList(id) {
	var newName = prompt("Name for " + res.nameList[id].m, res.nameList[id].n);

	if (newName != null) {
		getResponse("editNameList.json?id=" + id + "&name=" + newName, function(responseText) {
			if (responseText == "true") getResults();
			else notify("{% t errors.bad-response %} 'editNameList.json' (E12)");
		});
	}
}

function deleteName(id) {
	getResponse("deleteName.json?num=" + id, function(responseText) {
		if (responseText == "true") getResults();
		else notify("{% t errors.bad-response %} 'deleteName.json' (E13)");
	});
}

function add(id) {
	getResponse("addClientFromList.json?num=" + id, function(responseText) {
		if (responseText == "true") getResults();
		else notify("{% t errors.bad-response %} 'addClientFromList.json' (E14)");
	});
}
function countdown(stop) {
	if (stop == true) {
		clearInterval(startCountdown)
	} else if (countdownRemaining == 0) {
		notify("{% t users.strings.C %}");
		indicate(true);
		clearInterval(startCountdown);
		autoReload();
	} else {
		if (countdownRemaining == '') countdownRemaining = scanTime;
		notify("{{site.translations[site.lang].users.strings.D | replace_first: '$$', '"+countdownRemaining+"'}}");
		countdownRemaining--;
	}
}

getResponse("ClientScanTime.json", function(responseText) {
	scanTime = responseText;
});

getResults();
toggleBtn(false);