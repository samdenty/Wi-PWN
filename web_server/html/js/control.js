var tr,
    pin,
    high,
    controlPins = getE('controlPins')
res = "";

function getData() {
    getResponse("controlStatus.json", function(responseText) {
        try {
            res = JSON.parse(responseText);
        } catch (e) {
            notify("ERROR: Reset the entries (E36)");
            return;
        }
        tr = "<tr><th>Name</th><th>PIN</th><th>HIGH</th></tr>";
        pin = 3;
        for (var i = 0; i < res.control[0].length; i++) {
            tr += "<tr><td>" + res.control[1][i] + "</td><td>D" + pin + "</td>"
            if (res.control[0][i] == "high") { high = "checked" } else { high = "" }
            tr += "<td onclick=\"switchPin('" + pin + "')\"><input type='checkbox' name='check" + pin + "' id='check" + pin + "' value='false'" + high + "><label class='checkbox no-events' for='check" + pin + "'></label></td></tr>"
            pin += 1;
        }
        controlPins.innerHTML = tr;
    });
}

function switchPin(pin) {
    var pinCheckbox = document.getElementById("check" + pin);
    getResponse("controlSet.json?"+pin+"="+!pinCheckbox.checked, function(responseText) {
        if (responseText == "true") {
            getData();
        } else {
            notify("Failed to switch PIN "+pin+"! (E37)");
        }
    }, function() {
        notify("Failed to switch PIN "+pin+"! (E38)");
    });
}

function resetPins() {
    if (confirm("Reset saved entries?") == true) {
        showLoading();
        getResponse("controlReset.json", function(responseText) {
            if (responseText == "true") {
                getData();
                indicate(true);
                restart(true);
                setTimeout(function() { window.location = "/" }, 3000)
            } else {
                notify("Failed to reset saved entries! (E34)");
                indicate(false);
            }
        }, function() {
            notify("Failed to reset saved entries (E35)");
            indicate(false);
        });
    }
}

getData();