---
---
var tr,
	pin,
	high,
	controlPins = getE('controlPins'),
	res = "",
	newPinNames,
	newPinStates,
	prevState;

function getData() {
	getResponse("settings.json", function(responseText) {
		try {
			res = JSON.parse(responseText);
			log("RESPONSE  ~ ", res,  true)
		} catch(err) {
			log("INVALID   ~ ", responseText, false)
			console.error(err)
			notify("ERROR: Reset the settings (E36)");
			return
		}
		tr = "<tr><th>{% t global.name %}</th><th>{% t control.card-1.table.pin %}</th><th>{% t control.card-1.table.high %}</th></tr>";
		pin = 3;
		var split = res.pinNames.split(';');
		for (var i = 0; i < split.length; i++) {
			tr += "<tr><td class='darken-on-hover' onclick='setPin(" + pin + "," + i + ")'>" + split[i] + "</td><td onclick=\"switchPin(" + pin + "," + i + ")\">D" + pin + "</td>"
			if (res.pins[i] == "1") { high = "checked" } else { high = "" }
			tr += "<td onclick=\"switchPin(" + pin + "," + i + ")\"><input type='checkbox' name='check" + pin + "' id='check" + pin + "' value='false'" + high + "><label class='checkbox no-events' for='check" + pin + "'></label></td></tr>"
			pin += 1;
		}
		controlPins.innerHTML = tr;
		fadeIn();
	}, function() {
		fadeIn();
		notify('{% t errors.E34 %} (E34)')
	});
}

function switchPin(pin, id) {
	showLoading()
	var pinCheckbox = document.getElementById("check" + pin);
	prevState = pinCheckbox.checked;
	getResponse("settings.json?" + pin + "=" + !pinCheckbox.checked, function(responseText) {
		try {
			res = JSON.parse(responseText);
		} catch (e) {
			notify("{% t control.strings.1 %} " + pin + "! (E37)");
			showLoading('hide')
			return;
		}
		newPinStates = '';
		for (var i = 0; i < res.pins.length; i++) {
			if ([i] == id) {
				if (pinCheckbox.checked == true) {
					newPinStates += '0';
					pinCheckbox.checked = false;
				} else {
					newPinStates += '1';
					pinCheckbox.checked = true;
				}
			} else {
				newPinStates += res.pins[i]
			}
		}
		getResponse("settingsSave.json?pins=" + newPinStates, function(responseText) {
			if (responseText == "true") {
				getData();
				showLoading('hide')
			} else {
				notify("{% t control.strings.1 %} " + pin + "! (E41)");
				showLoading('hide')
				pinCheckbox.checked = prevState;
			}
		}, function() {
			notify("{% t control.strings.1 %} " + pin + "! (E42)");
			showLoading('hide')
			pinCheckbox.checked = prevState;
		});
	}, function() {
		notify("{% t control.strings.1 %} " + pin + "! (E38)");
		showLoading('hide')
	});
}

function setPin(pin, id) {
	var newName = prompt("{% t control.strings.2 %} D" + pin);
	if (newName) {
		if (newName.length <= 10) {
			getResponse("settings.json", function(responseText) {
				try {
					res = JSON.parse(responseText);
				} catch (e) {
					notify("{% t errors.E37 %} (E37)");
					return;
				}
				var split = res.pinNames.split(';');
				newPinNames = '';
				for (var i = 0; i < split.length; i++) {
					if (id != [i]) {
						newPinNames += split[i] + ';'
					} else {
						newPinNames += newName + ';';
					}
				}
				newPinNames = newPinNames.substring(0, newPinNames.length - 1);
				getResponse("settingsSave.json?pinNames=" + newPinNames, function(responseText) {
					if (responseText == "true") {
						getData();
					} else {
						notify("{% t errors.E39 %} (E39)");
					}
				}, function() {
					notify("{% t errors.E40 %} (E40)");
				});
			});
		} else {
			notify('{% t control.strings.3 %}')
		}
	}
}

function resetPins() {
	if (confirm("{% t control.strings.4 %}") == true) {
		showLoading();
		getResponse("settingsSave.json?pinNames=Pin%203%3BPin%204%3BPin%205%3BPin%206%3BPin%207%3BPin%208&pins=000000", function(responseText) {
			if (responseText == "true") {
				getData();
				indicate(true);
			} else {
				notify("{% t errors.E41 %} (E41)");
				indicate();
			}
		}, function() {
			notify("{% t errors.E42 %} (E42)");
			indicate();
		});
	}
}

getData();