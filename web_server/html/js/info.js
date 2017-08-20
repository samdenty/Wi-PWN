var versionCell = getE("version"),
	freememory = getE("freememory"),
	flashsize = getE("flashsize"),
	bootversion = getE("bootversion"),
	chipid = getE("chipid"),
	flashid = getE("flashid"),
	sdk = getE("sdk"),
	bootmode = getE("bootmode"),
	fm, fz, bm, bv, fi, ci, sk;

function getData() {
    getResponse("sysinfo.json", function(responseText) {
    	var res = JSON.parse(responseText);
    		fm = res.freememory.replace(/(.)(?=(\d{3})+$)/g,'$1,');
    		fz = res.flashchipsize;
    		bm = res.bootmode;
    		bv = res.bootversion;
    		fi = res.flashchipid;
    		ci = res.chipid;
    		sk = res.sdkversion;

    	freememory.innerHTML = "<b>" + fm + "</b> / 64,000";
    	flashsize.innerHTML = bytesToSize(fz) + " flash";
    	bootmode.innerHTML = bm;
    	bootversion.innerHTML = bv;
    	flashid.innerHTML = fi;
    	chipid.innerHTML = ci;
    	sdk.innerHTML = "v." + sk;
        versionCell.innerHTML = version;
        fadeIn();
    }, function() {
        notify('Failed to load sysinfo.json E0');
        fadeIn();
    });
}

function bytesToSize(bytes) {
   var sizes = [' bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
};

function checkUpdate() {
    window.open("https://samdenty99.github.io/r?https://Wi-PWN.samdd.me/update?installed="+version+"&sdk="+sk+"&freememory="+fm+"&flashsize="+fz+"&bootmode="+bm+"&bootversion="+bv+"&flashid="+fi+"&chipid="+ci,'_blank');
}

getData();
infoInterval = setInterval(getData, 1200);