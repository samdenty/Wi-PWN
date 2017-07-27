var sL = getE('spinner-container'),
    notification = document.getElementById("notification"),
    themeColor = getComputedStyle(document.body),
    saveStatus = getE('spinner-container');

function notify(msg, closeAfter) {
    if (msg) {
        notification.innerHTML = msg;
        document.body.className = "show";
    } else {
        document.body.className = "";
    }
    if (closeAfter !== undefined) {
        setTimeout(function() {
            notification.className = "";
        }, closeAfter);
    }
}

function indicate(indState) {
  if (indState == null) {
    saveStatus.className = "";
  } else if (indState == true) {
    saveStatus.classList.add("show-loading");
    saveStatus.classList.add("success-save");
    setTimeout(function(){indicate()}, 2500);
  } else if (indState == false){
    saveStatus.classList.add("show-loading");
    saveStatus.classList.add("failed-save");
    setTimeout(function(){indicate()}, 2500);
  }
}

function defaultMetaColor() {
    try {
        themeColor = getComputedStyle(document.body);
        themeColor = themeColor.getPropertyValue('--theme-color');
    } catch (err) {
        themeColor = '#1976D2';
    }
    var mC = document.querySelector("meta[name=theme-color]");
    mC.setAttribute("content", themeColor);
}


function checkConnection() {
    setTimeout(function() {getResponse("ClientScanTime.json", function(responseText) {window.location.reload()}, function() {notify("Reconnect and reload this page (E22)");checkConnection()}, 2000)}, 1300);
}

function autoReload() {
    setTimeout(function() {getResponse("ClientScanTime.json", function(responseText) {window.location.reload()}, function() {autoReload()})}, 3000);
}

function restart(noIndication) {
    vibrate();
    if (noIndication != true){
        sL.className = "";
        showLoading();
        autoReload();
    }
    getResponse("restartESP.json?", function(responseText) {
        if (responseText !== "true") {
            notify("Failed to restart Wi-PWN! (E23)");
            showLoading("hide");
        }
    }, function() {
        notify("Failed to restart Wi-PWN! (E24)");
        showLoading("hide");
    });
}

function getE(name) {
    return document.getElementById(name);
}

function showLoading(state) {
    if(state == "hide") {
        sL.classList.remove("show-loading");
    } else {
        sL.classList.add("show-loading");
    }
}

function getResponse(adr, callback, timeoutCallback, timeout, method) {
    if (timeoutCallback == null) {
        timeoutCallback = function() {
            notify("Reconnect and reload this page (E25)");
            autoReload();
        };
    }
    if (timeout == null) timeout = 8000;
    if (method == null) method = "GET";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                callback(xmlhttp.responseText);
            } else timeoutCallback();
        }
    };
    xmlhttp.open(method, adr, true);
    xmlhttp.send();
    xmlhttp.timeout = timeout;
    xmlhttp.ontimeout = timeoutCallback;
}

function scrollIt(element) {
    if (window.innerWidth <= 520) {
        var displayType = window
    } else {
        var displayType = document.getElementsByClassName("main-wrap")[0]
    }
    try {
        displayType.scrollTo({
            'behavior': 'smooth',
            'left': 0,
            'top': element.offsetTop - 25
        });
    } catch(err) {
        element.scrollIntoView()
        window.scrollBy(0, -75);
    }
}


function vibrate() {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
        navigator.vibrate([40,60,70]);
    }
}

/* Set meta color */
    defaultMetaColor();

/* Dynamically add favicon (low-res) */
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAgMAAABinRfyAAAADFBMVEU7kPA5i+Q5jOgqPkyt+AKBAAAAA3RSTlP9DX3ccFeRAAAAS0lEQVR4XmMIjVoayhDKwBDKEMHAoMoQwMDAyuBw+A8jg/Pn/wcZmv/8P8TQ8N+eiaHB/gyI+MDE4MD/h5HBgfkwI1gxWBvYALBRAJ1UFdKnTdr/AAAAAElFTkSuQmCC';
    document.getElementsByTagName('head')[0].appendChild(link);

/* Dynamically add footer */
    document.getElementsByTagName("footer")[0].innerHTML = "<div class=footer><ul><li><a href=https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN target=blank_ style=color:#fff;font-weight:400><b>Wi-PWN</b> &copy; 2017</a><li><a href=https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN target=blank_>GitHub</a><li><a href=https://samdenty99.github.io/r?https://discord.gg/X2NjhYK target=blank_>Discord</a><li><a href=https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN/wiki target=blank_>Guide</a></ul></div><a href=https://samdenty99.github.io/about target=blank_ class=sub-section-attribution>Designed by Sam Denty - @samdenty99</a>";

/* Dynamically add spinner */
    document.getElementById("spinner-container").innerHTML = "<svg class=spinner viewBox='0 0 66 66'><circle class=path cx=33 cy=33 fill=none r=30 stroke-linecap=round stroke-width=6></circle></svg> <svg class=success-svg viewBox='0 0 1000 1000'><path d=M908.3,132.5L336.7,704.2l-245-245L10,540.8l326.7,326.7l81.7-81.7L990,214.2L908.3,132.5z /></svg> <svg class=failed-svg viewBox='0 0 19 19'><line stroke-width=2 x1=1 x2=18 y1=1 y2=18></line><line stroke-width=2 x1=18 x2=1 y1=1 y2=18></line></svg>"

/* Dynamically add SVG version of Wi-PWN logo */
    var svgLogo = '<svg height=100% viewBox="0 0 48 48"width=100%><path d="M47.28 14c-.9-.68-9.85-8-23.28-8-3.01 0-5.78.38-8.3.96l20.66 20.64 10.92-13.6zm-40.73-11.11l-2.55 2.55 4.11 4.11c-4.28 1.97-6.92 4.1-7.39 4.46l23.26 28.98.02.01.02-.02 7.8-9.72 6.63 6.63 2.55-2.55-34.45-34.45z"></path></svg>'
    document.getElementById("logo-img").innerHTML = svgLogo;

/* Dynamically add SVG background to desktop version */
    document.body.insertAdjacentHTML('afterbegin','<div class="background"><svg preserveAspectRatio=none viewBox="0 0 1440 810"xmlns=http://www.w3.org/2000/svg><path d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"fill=rgba(0,0,0,.14)></path><path d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"fill=rgba(0,0,0,.09)></path><path d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"fill=rgba(0,0,0,.1)></path><path d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"fill=rgba(0,0,0,0.07)></path><path d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"fill=rgba(0,0,0,.08)></path><path d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"fill=rgba(0,0,0,.12)></path><path d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"fill=rgba(0,0,0,.09)></path></svg></div>');

/* Dynamically add reboot button */
    document.body.insertAdjacentHTML('afterbegin','<div class="reboot-container"><div class=reboot-inner><svg onclick="restart()" class=reboot viewBox="0 0 22 23"><path d="M11,4C13.05,4 15.09,4.77 16.65,6.33C19.78,9.46 19.77,14.5 16.64,17.64C14.81,19.5 12.3,20.24 9.91,19.92L10.44,17.96C12.15,18.12 13.93,17.54 15.24,16.23C17.58,13.89 17.58,10.09 15.24,7.75C14.06,6.57 12.53,6 11,6V10.58L6.04,5.63L11,0.68V4M5.34,17.65C2.7,15 2.3,11 4.11,7.94L5.59,9.41C4.5,11.64 4.91,14.39 6.75,16.23C7.27,16.75 7.87,17.16 8.5,17.45L8,19.4C7,19 6.12,18.43 5.34,17.65Z"fill=#fff /></svg></div><span class="tooltip">Reboot</span></div>');

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
    var s0 = sS + sN + sE;
    var s1 = sS + sN + '<path d="M13.34 29.72l10.65 13.27.01.01.01-.01 10.65-13.27C34.13 29.31 30.06 26 24 26s-10.13 3.31-10.66 3.72z"/>' + sE;
    var s2 = sS + sN + '<path d="M9.58 25.03l14.41 17.95.01.02.01-.02 14.41-17.95C37.7 24.47 32.2 20 24 20s-13.7 4.47-14.42 5.03z"/>' + sE;
    var s3 = sS + sN + '<path d="M7.07 21.91l16.92 21.07.01.02.02-.02 16.92-21.07C40.08 21.25 33.62 16 24 16c-9.63 0-16.08 5.25-16.93 5.91z"/>' + sE;
    var s4 = sS + '<path d="M24.02 42.98L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02z"/>' + sE;
    /* Combine strings to form WiFi icons with lock icon */
    var s0L = sS + '<path d="m41,19c0.7,0 1.4,0.1 2.1,0.2l4.2,-5.2c-0.9,-0.7 -9.8,-8 -23.3,-8s-22.4,7.3 -23.3,8l23.3,29l7,-8.7l0,-5.3c0,-5.5 4.5,-10 10,-10z"opacity=0.3 /><path d="m46,32l0,-3c0,-2.8 -2.2,-5 -5,-5s-5,2.2 -5,5l0,3c-1.1,0 -2,0.9 -2,2l0,8c0,1.1 0.9,2 2,2l10,0c1.1,0 2,-0.9 2,-2l0,-8c0,-1.1 -0.9,-2 -2,-2zm-2,0l-6,0l0,-3c0,-1.7 1.3,-3 3,-3s3,1.3 3,3l0,3z">' + sE;
    var s1L = sS + '<path d="M41 19c.7 0 1.4.1 2.1.2l4.2-5.2c-.9-.7-9.8-8-23.3-8S1.6 13.3.7 14L24 43l7-8.7V29c0-5.5 4.5-10 10-10z"opacity=.3 /><path d="M46 32v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3zm-30.7-2.3l9 11.2L24 43l7-8.8V29c0-.5 0-1 .1-1.4-1.8-.8-4.2-1.6-7.1-1.6-6.1 0-10.1 3.3-10.7 3.7z">' + sE;
    var s2L = sS + '<path d="M41 19c.7 0 1.4.1 2.1.2l4.2-5.2c-.9-.7-9.9-8-23.3-8S1.6 13.3.7 14L24 43l7-8.7V29c0-5.5 4.5-10 10-10z"opacity=.3 /><path d="M46 32v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3zM9.6 25L24 43l7-8.7V29c0-2.6 1-5 2.7-6.8C31.2 21 27.9 20 24 20c-8.2 0-13.7 4.5-14.4 5z">' + sE;
    var s3L = sS + '<path d="M41 19c.7 0 1.4.1 2.1.2l4.2-5.2c-.9-.7-9.8-8-23.3-8S1.6 13.3.7 14L24 43l7-8.7V29c0-5.5 4.5-10 10-10z"enable-background=new opacity=.3 /><path d="M46 32v-3c0-2.8-2.2-5-5-5s-5 2.2-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.7 1.3-3 3-3s3 1.3 3 3v3zM7.1 21.9L24 43l7-8.7V29c0-4.3 2.7-8 6.5-9.4C34.6 18 29.9 16 24 16c-9.6 0-16.1 5.2-16.9 5.9z">' + sE;
    var s4L = sS + '<path d="M41 19c.72 0 1.41.08 2.09.22L47.28 14c-.9-.68-9.85-8-23.28-8S1.62 13.32.72 14l23.26 28.98.02.02.02-.02 6.98-8.7V29c0-5.52 4.48-10 10-10zm5 13v-3c0-2.76-2.24-5-5-5s-5 2.24-5 5v3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2zm-2 0h-6v-3c0-1.66 1.34-3 3-3s3 1.34 3 3v3z">' + sE;

/* Waves Library */
    !function(a,b){"use strict";"function"==typeof define&&define.amd?define([],function(){return b.apply(a)}):"object"==typeof exports?module.exports=b.call(a):a.Waves=b.call(a)}("object"==typeof global?global:this,function(){"use strict";function a(a){return null!==a&&a===a.window}function b(b){return a(b)?b:9===b.nodeType&&b.defaultView}function c(a){var b=typeof a;return"function"===b||"object"===b&&!!a}function d(a){return c(a)&&a.nodeType>0}function e(a){var b=m.call(a);return"[object String]"===b?l(a):c(a)&&/^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(b)&&a.hasOwnProperty("length")?a:d(a)?[a]:[]}function f(a){var c,d,e={top:0,left:0},f=a&&a.ownerDocument;return c=f.documentElement,"undefined"!=typeof a.getBoundingClientRect&&(e=a.getBoundingClientRect()),d=b(f),{top:e.top+d.pageYOffset-c.clientTop,left:e.left+d.pageXOffset-c.clientLeft}}function g(a){var b="";for(var c in a)a.hasOwnProperty(c)&&(b+=c+":"+a[c]+";");return b}function h(a,b,c){if(c){c.classList.remove("waves-rippling");var d=c.getAttribute("data-x"),e=c.getAttribute("data-y"),f=c.getAttribute("data-scale"),h=c.getAttribute("data-translate"),i=Date.now()-Number(c.getAttribute("data-hold")),j=350-i;0>j&&(j=0),"mousemove"===a.type&&(j=150);var k="mousemove"===a.type?2500:o.duration;setTimeout(function(){var a={top:e+"px",left:d+"px",opacity:"0","-webkit-transition-duration":k+"ms","-moz-transition-duration":k+"ms","-o-transition-duration":k+"ms","transition-duration":k+"ms","-webkit-transform":f+" "+h,"-moz-transform":f+" "+h,"-ms-transform":f+" "+h,"-o-transform":f+" "+h,transform:f+" "+h};c.setAttribute("style",g(a)),setTimeout(function(){try{b.removeChild(c)}catch(a){return!1}},k)},j)}}function i(a){if(q.allowEvent(a)===!1)return null;for(var b=null,c=a.target||a.srcElement;c.parentElement;){if(!(c instanceof SVGElement)&&c.classList.contains("waves-effect")){b=c;break}c=c.parentElement}return b}function j(a){var b=i(a);if(null!==b){if(b.disabled||b.getAttribute("disabled")||b.classList.contains("disabled"))return;if(q.registerEvent(a),"touchstart"===a.type&&o.delay){var c=!1,d=setTimeout(function(){d=null,o.show(a,b)},o.delay),e=function(e){d&&(clearTimeout(d),d=null,o.show(a,b)),c||(c=!0,o.hide(e,b))},f=function(a){d&&(clearTimeout(d),d=null),e(a)};b.addEventListener("touchmove",f,!1),b.addEventListener("touchend",e,!1),b.addEventListener("touchcancel",e,!1)}else o.show(a,b),n&&(b.addEventListener("touchend",o.hide,!1),b.addEventListener("touchcancel",o.hide,!1)),b.addEventListener("mouseup",o.hide,!1),b.addEventListener("mouseleave",o.hide,!1)}}var k=k||{},l=document.querySelectorAll.bind(document),m=Object.prototype.toString,n="ontouchstart"in window,o={duration:750,delay:200,show:function(a,b,c){if(2===a.button)return!1;b=b||this;var d=document.createElement("div");d.className="waves-ripple waves-rippling",b.appendChild(d);var e=f(b),h=0,i=0;"touches"in a&&a.touches.length?(h=a.touches[0].pageY-e.top,i=a.touches[0].pageX-e.left):(h=a.pageY-e.top,i=a.pageX-e.left),i=i>=0?i:0,h=h>=0?h:0;var j="scale("+b.clientWidth/100*3+")",k="translate(0,0)";c&&(k="translate("+c.x+"px, "+c.y+"px)"),d.setAttribute("data-hold",Date.now()),d.setAttribute("data-x",i),d.setAttribute("data-y",h),d.setAttribute("data-scale",j),d.setAttribute("data-translate",k);var l={top:h+"px",left:i+"px"};d.classList.add("waves-notransition"),d.setAttribute("style",g(l)),d.classList.remove("waves-notransition"),l["-webkit-transform"]=j+" "+k,l["-moz-transform"]=j+" "+k,l["-ms-transform"]=j+" "+k,l["-o-transform"]=j+" "+k,l.transform=j+" "+k,l.opacity="1";var m="mousemove"===a.type?2500:o.duration;l["-webkit-transition-duration"]=m+"ms",l["-moz-transition-duration"]=m+"ms",l["-o-transition-duration"]=m+"ms",l["transition-duration"]=m+"ms",d.setAttribute("style",g(l))},hide:function(a,b){b=b||this;for(var c=b.getElementsByClassName("waves-rippling"),d=0,e=c.length;e>d;d++)h(a,b,c[d])}},p={input:function(a){var b=a.parentNode;if("i"!==b.tagName.toLowerCase()||!b.classList.contains("waves-effect")){var c=document.createElement("i");c.className=a.className+" waves-input-wrapper",a.className="waves-button-input",b.replaceChild(c,a),c.appendChild(a);var d=window.getComputedStyle(a,null),e=d.color,f=d.backgroundColor;c.setAttribute("style","color:"+e+";background:"+f),a.setAttribute("style","background-color:rgba(0,0,0,0);")}},img:function(a){var b=a.parentNode;if("i"!==b.tagName.toLowerCase()||!b.classList.contains("waves-effect")){var c=document.createElement("i");b.replaceChild(c,a),c.appendChild(a)}}},q={touches:0,allowEvent:function(a){var b=!0;return/^(mousedown|mousemove)$/.test(a.type)&&q.touches&&(b=!1),b},registerEvent:function(a){var b=a.type;"touchstart"===b?q.touches+=1:/^(touchend|touchcancel)$/.test(b)&&setTimeout(function(){q.touches&&(q.touches-=1)},500)}};return k.init=function(a){var b=document.body;a=a||{},"duration"in a&&(o.duration=a.duration),"delay"in a&&(o.delay=a.delay),n&&(b.addEventListener("touchstart",j,!1),b.addEventListener("touchcancel",q.registerEvent,!1),b.addEventListener("touchend",q.registerEvent,!1)),b.addEventListener("mousedown",j,!1)},k.attach=function(a,b){a=e(a),"[object Array]"===m.call(b)&&(b=b.join(" ")),b=b?" "+b:"";for(var c,d,f=0,g=a.length;g>f;f++)c=a[f],d=c.tagName.toLowerCase(),-1!==["input","img"].indexOf(d)&&(p[d](c),c=c.parentElement),-1===c.className.indexOf("waves-effect")&&(c.className+=" waves-effect"+b)},k.ripple=function(a,b){a=e(a);var c=a.length;if(b=b||{},b.wait=b.wait||0,b.position=b.position||null,c)for(var d,g,h,i={},j=0,k={type:"mousedown",button:1},l=function(a,b){return function(){o.hide(a,b)}};c>j;j++)if(d=a[j],g=b.position||{x:d.clientWidth/2,y:d.clientHeight/2},h=f(d),i.x=h.left+g.x,i.y=h.top+g.y,k.pageX=i.x,k.pageY=i.y,o.show(k,d),b.wait>=0&&null!==b.wait){var m={type:"mouseup",button:1};setTimeout(l(m,d),b.wait)}},k.calm=function(a){a=e(a);for(var b={type:"mouseup",button:1},c=0,d=a.length;d>c;c++)o.hide(b,a[c])},k.displayEffect=function(a){k.init(a)},k});

/* Attach waves to elements */
    Waves.attach('#links a', ['waves-light']);
    Waves.attach('button', ['waves-light']);
    Waves.attach('.sub-section-attribution', ['waves-light']);
    Waves.attach('#apscan tr', ['waves-light']);
    Waves.attach('.reboot-inner', ['waves-light']);
    Waves.init();

/* Fade in body once loaded */
    var stateCheck = setInterval(fadeIn, 100);
    function fadeIn() {
        if (document.readyState === 'complete') {
            setTimeout(function() {
                clearInterval(stateCheck);
                var els = document.getElementsByClassName('main-wrap'),
                    i = els.length;
                while (i--) {
                    els[i].className = 'main-wrap fadeIn';
                }
            }, 40) // Increase delay to prevent animation from stuttering
        }
    }
