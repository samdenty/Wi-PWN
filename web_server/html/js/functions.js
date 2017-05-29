function showMessage(msg, closeAfter){
	if (msg) {document.body.className = "error"} else {document.body.className = "";}
	document.getElementById("error").innerHTML = msg;
	if(closeAfter !== undefined){
		setTimeout(function(){
			document.body.className = "";
			document.getElementById("error").innerHTML = "";
		},closeAfter);
	}
}

function checkConnection() {
    getResponse("ClientScanTime.json", function(responseText) {
        if (responseText) location.reload()
    });
    setTimeout(checkConnection, 2000);
}

function restart(){
  getResponse("restartESP.json?", function(responseText) {
    if (responseText == "true") {
      showMessage("Restarting Wi-PWN...");
    }
    else showMessage("ERROR: Failed to restart Wi-PWN!");
  });
}

function getE(name){
	return document.getElementById(name);
}

function getResponse(adr, callback, timeoutCallback, timeout, method){
	if(timeoutCallback === undefined) {
		timeoutCallback = function(){
			showMessage("INFO: Reconnect to WiFi and try again ('"+adr+")'");
		};
	}
	if(timeout === undefined) timeout = 8000; 
	if(method === undefined) method = "GET";
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4){
			if(xmlhttp.status == 200){
				showMessage("");
				callback(xmlhttp.responseText);
			}
			else timeoutCallback();
		}
	};
	xmlhttp.open(method, adr, true);
	xmlhttp.send();
	xmlhttp.timeout = timeout;
	xmlhttp.ontimeout = timeoutCallback;
}

/* Dynamically add favicon (low-res) */
	var link = document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEU7kPA5i+Q5jOgqPkyt+AKBAAAAA3RSTlP9DX3ccFeRAAAAS0lEQVR4XmMIjVoayhDKwBDKEMHAoMoQwMDAyuBw+A8jg/Pn/wcZmv/8P8TQ8N+eiaHB/gyI+MDE4MD/h5HBgfkwI1gxWBvYALBRAJ1UFdKnTdr/AAAAAElFTkSuQmCC';
	document.getElementsByTagName('head')[0].appendChild(link);

/* Dynamically add footer */
	document.getElementsByTagName("footer")[0].innerHTML = "<div class=footer><ul><li><a href=https://github.com/spacehuhn target=blank_ style=color:#fff;font-weight:400>Wi-PWN © 2017</a><li><a href=https://github.com/Wi-PWN/Wi-PWN target=blank_>GitHub</a><li><a href=https://github.com/Wi-PWN/Wi-PWN/blob/master/README.md target=blank_>Documentation</a></ul></div><div class=sub-section-attribution><a href=http://mirum.weebly.com/samuel-denty.html target=blank_><b>Samuel Denty</b> @samdenty99</a></div>";

/* Dynamically add SVG version of Wi-PWN logo */
	var svgLogo = '<svg height=100% viewBox="0 0 48 48"width=100%><path d="M47.28 14c-.9-.68-9.85-8-23.28-8-3.01 0-5.78.38-8.3.96l20.66 20.64 10.92-13.6zm-40.73-11.11l-2.55 2.55 4.11 4.11c-4.28 1.97-6.92 4.1-7.39 4.46l23.26 28.98.02.01.02-.02 7.8-9.72 6.63 6.63 2.55-2.55-34.45-34.45z"fill=#29363C></path></svg>'
	document.getElementById("logo-img").innerHTML=svgLogo; 

/* Dynamically add SVG background to desktop version */
	background = document.createElement('div');
	background.innerHTML = '<div class="background"><svg viewBox="0 0 1440 810"xmlns=http://www.w3.org/2000/svg><path d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"fill=#efefee></path><path d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"fill=#f6f6f6></path><path d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"fill=#f7f7f7></path><path d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"fill=#fbfbfc></path><path d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"fill=#ebebec></path><path d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"fill=#e1e1e1></path><path d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"fill=#e7e7e7></path></svg></div>';
	document.body.prepend(background);

/* Dynamically add reboot button */
	reboot = document.createElement('div');
	reboot.className = "reboot-container";
	reboot.innerHTML = '<svg onclick="restart()" class=reboot viewBox="0 0 22 23"><path d="M11,4C13.05,4 15.09,4.77 16.65,6.33C19.78,9.46 19.77,14.5 16.64,17.64C14.81,19.5 12.3,20.24 9.91,19.92L10.44,17.96C12.15,18.12 13.93,17.54 15.24,16.23C17.58,13.89 17.58,10.09 15.24,7.75C14.06,6.57 12.53,6 11,6V10.58L6.04,5.63L11,0.68V4M5.34,17.65C2.7,15 2.3,11 4.11,7.94L5.59,9.41C4.5,11.64 4.91,14.39 6.75,16.23C7.27,16.75 7.87,17.16 8.5,17.45L8,19.4C7,19 6.12,18.43 5.34,17.65Z"fill=#fff /></svg><span class="tooltip">Reboot</span>';
	document.body.prepend(reboot);