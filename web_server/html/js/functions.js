function showMessage(msg, closeAfter){
	document.getElementById("error").innerHTML = msg;
	if(closeAfter !== undefined){
		setTimeout(function(){
			document.getElementById("error").innerHTML = "";
		},closeAfter);
	}
}

function getE(name){
	return document.getElementById(name);
}

function getResponse(adr, callback, timeoutCallback, timeout, method){
	if(timeoutCallback === undefined) {
		timeoutCallback = function(){
			showMessage("INFO: Reconnect to WiFi and try again ('"+adr+")'");
			document.getElementById("nav").classList.add("connectionError");
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
var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEU7kPA5i+Q5jOgqPkyt+AKBAAAAA3RSTlP9DX3ccFeRAAAAS0lEQVR4XmMIjVoayhDKwBDKEMHAoMoQwMDAyuBw+A8jg/Pn/wcZmv/8P8TQ8N+eiaHB/gyI+MDE4MD/h5HBgfkwI1gxWBvYALBRAJ1UFdKnTdr/AAAAAElFTkSuQmCC';
document.getElementsByTagName('head')[0].appendChild(link);
document.getElementsByTagName("footer")[0].innerHTML = "<div class=footer><ul><li><a href=https://github.com/spacehuhn target=blank_ style=color:#fff;font-weight:400>Stefan Kremser &copy; 2017</a><li><a href=https://github.com/spacehuhn/esp8266_deauther target=blank_>Github</a><li><a href=https://github.com/spacehuhn/esp8266_deauther/blob/master/README.md target=blank_>Documentation</a></ul></div><div class=sub-section-attribution><a href=http://mirum.weebly.com/samuel-denty.html target=blank_>Web design / logo &copy; 2017 Sam Denty</a></div>";
var svgLogo = '<svg height=100% viewBox="0 0 48 48"width=100%><path d="M47.28 14c-.9-.68-9.85-8-23.28-8-3.01 0-5.78.38-8.3.96l20.66 20.64 10.92-13.6zm-40.73-11.11l-2.55 2.55 4.11 4.11c-4.28 1.97-6.92 4.1-7.39 4.46l23.26 28.98.02.01.02-.02 7.8-9.72 6.63 6.63 2.55-2.55-34.45-34.45z"fill=#29363C></path></svg>'
document.getElementById("logo-img").innerHTML=svgLogo; 