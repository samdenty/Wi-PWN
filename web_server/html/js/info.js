var versionCell = getE("version"),
	freememory = getE("freememory"),
	flashsize = getE("flashsize"),
	bootversion = getE("bootversion"),
	chipid = getE("chipid"),
    deauthpackets = getE("deauthpackets"),
    beaconpackets = getE("beaconpackets"),
	flashid = getE("flashid"),
	sdk = getE("sdk"),
	bootmode = getE("bootmode"),
    uptime = getE("uptime"),
	fm, fz, bm, bv, fi, ci, sk, dp, ut, bp;

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
            dp = res.deauthpackets;
            bp = res.beaconpackets;
            ut = res.uptime.slice(0, -3);

    	freememory.innerHTML = "<b>" + fm + "</b> / 64,000";
    	flashsize.innerHTML = bytesToSize(fz);
    	bootmode.innerHTML = bm;
    	bootversion.innerHTML = bv;
    	flashid.innerHTML = fi;
    	chipid.innerHTML = ci;
        deauthpackets.innerHTML = dp;
        beaconpackets.innerHTML = bp;
    	sdk.innerHTML = "v." + sk;
        uptime.innerHTML = new Date(ut * 1000).toISOString().substr(11, 8);;
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
    window.open("https://samdenty99.github.io/r?https://Wi-PWN.samdd.me/update?installed="+version+"&sdk="+sk+"&freememory="+fm+"&flashsize="+fz+"&bootmode="+bm+"&bootversion="+bv+"&flashid="+fi+"&chipid="+ci+"&deauthpackets="+dp+"&beaconpackets="+bp,'_blank');
}

getData();
infoInterval = setInterval(getData, 900);