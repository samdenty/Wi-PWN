var versionCell = getE("version"),
	availableram = getE("availableram");

function getData() {
    getResponse("sysinfo.json", function(responseText) {
    	var res = JSON.parse(responseText);
    	availableram.innerHTML = res.availableram;
    });
}

getData();
versionCell.innerHTML = version;
document.getElementsByClassName('main-wrap')[0].className = 'main-wrap fadeIn'

infoInterval = setInterval(getData, 1200);