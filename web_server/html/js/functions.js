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
    else showMessage("Failed to restart Wi-PWN!");
  });
}

function getE(name){
	return document.getElementById(name);
}

function getResponse(adr, callback, timeoutCallback, timeout, method){
	if(timeoutCallback === undefined) {
		timeoutCallback = function(){
			showMessage("Reconnect to Wi-Fi network");
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
	document.getElementsByTagName("footer")[0].innerHTML = "<div class=footer><ul><li><a href=https://github.com/spacehuhn target=blank_ style=color:#fff;font-weight:400>Wi-PWN © 2017</a><li><a href=https://github.com/Wi-PWN/Wi-PWN target=blank_>GitHub</a><li><a href=https://github.com/Wi-PWN/Wi-PWN/blob/master/README.md target=blank_>Documentation</a></ul></div><div class=sub-section-attribution><a href=http://mirum.weebly.com/samuel-denty.html target=blank_><b>Sam Denty</b> @samdenty99</a></div>";

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

/* Compressed Material design WiFi icons generator
 * AUTHOR: SAM DENTY         github.com/samdenty99
 * 
 * WiFi icons are stored in the variables:
 * s0, s1, s2, s3, s4   |   s0L, s1L, s2L, s3L, s4L
 * 
 */
	/* Universal Variables */
		var sS = '<svg viewBox="0 0 48 48"xmlns=http://www.w3.org/2000/svg>';
		var sN = '<path d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"fill-opacity=.3 />'
		var sE = '</svg>'
	/* Combine strings to form WiFi icons without lock icon */
		var s0 = sS+sN+sE;
		var s1 = sS+sN+'<path d="M13.34 29.72l10.65 13.27.01.01.01-.01 10.65-13.27C34.13 29.31 30.06 26 24 26s-10.13 3.31-10.66 3.72z"/>'+sE;
		var s2 = sS+sN+'<path d="M9.58 25.03l14.41 17.95.01.02.01-.02 14.41-17.95C37.7 24.47 32.2 20 24 20s-13.7 4.47-14.42 5.03z"/>'+sE;
		var s3 = sS+sN+'<path d="M7.07 21.91l16.92 21.07.01.02.02-.02 16.92-21.07C40.08 21.25 33.62 16 24 16c-9.63 0-16.08 5.25-16.93 5.91z"/>'+sE;
		var s4 = sS+'<path d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"/>'+sE;
	/* Combine strings to form WiFi icons with lock icon */
		var s0L = sS+'<path d="m41,19c0.7,0 1.4,0.1 2.1,0.2l4.2,-5.2c-0.9,-0.7 -9.8,-8 -23.3,-8s-22.4,7.3 -23.3,8l23.3,29l7,-8.7l0,-5.3c0,-5.5 4.5,-10 10,-10z"opacity=0.3 /><path d="m46,32l0,-3c0,-2.8 -2.2,-5 -5,-5s-5,2.2 -5,5l0,3c-1.1,0 -2,0.9 -2,2l0,8c0,1.1 0.9,2 2,2l10,0c1.1,0 2,-0.9 2,-2l0,-8c0,-1.1 -0.9,-2 -2,-2zm-2,0l-6,0l0,-3c0,-1.7 1.3,-3 3,-3s3,1.3 3,3l0,3z">'+sE;
		var s1L = sS+'<path d="M41 19c.7 0 1.4.1 2.1.2l4.2-5.2c-.9-.7-9.8-8-23.3-8S1.6 13.3.7 14L24 43l7-8.7V29c0-5.5 4.5-10 10-10z"opacity=.3 /><path d="M46 32v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3zm-30.7-2.3l9 11.2L24 43l7-8.8V29c0-.5 0-1 .1-1.4-1.8-.8-4.2-1.6-7.1-1.6-6.1 0-10.1 3.3-10.7 3.7z">'+sE;
		var s2L = sS+'<path d="M41 19c.7 0 1.4.1 2.1.2l4.2-5.2c-.9-.7-9.9-8-23.3-8S1.6 13.3.7 14L24 43l7-8.7V29c0-5.5 4.5-10 10-10z"opacity=.3 /><path d="M46 32v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3zM9.6 25L24 43l7-8.7V29c0-2.6 1-5 2.7-6.8C31.2 21 27.9 20 24 20c-8.2 0-13.7 4.5-14.4 5z">'+sE;
		var s3L = sS+'<path d="M41 19c.7 0 1.4.1 2.1.2l4.2-5.2c-.9-.7-9.8-8-23.3-8S1.6 13.3.7 14L24 43l7-8.7V29c0-5.5 4.5-10 10-10z"enable-background=new opacity=.3 /><path d="M46 32v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3zM7.1 21.9L24 43l7-8.7V29c0-4.3 2.7-8 6.5-9.4C34.6 18 29.9 16 24 16c-9.6 0-16.1 5.2-16.9 5.9z">'+sE;
		var s4L = sS+'<path d="M41 19c.72 0 1.41.08 2.09.22L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02 6.98-8.7V29c0-5.52 4.48-10 10-10zm5 13v-3c0-2.76-2.24-5-5-5s-5 2.24-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.66 1.34-3 3-3s3 1.34 3 3v3z">'+sE;