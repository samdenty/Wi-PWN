## How to open a local copy of the WebOS
1. Launch `local-server.bat` which will start a localhost server and open it up in your default browser.

Alternatively you can just directly open the HTML files, but you won't be able to fully load the pages as they rely on importing files (which doesn't work without being on a server)

**NOTE:** The included `.json` file are there to simulate example output from the ESP8266 module. Do not include them in the final binary! 


##How to update web-server files
1. Open `minifier.html` and paste the HTML source in input field  
2. Click on <kbd>minifiy + byte-ify</kbd>  
3. Copy the results  
4. Go to [arduino/Wi-PWN/data.h](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/data.h) and replace the array (of the changed html file) with the copied bytes  

You can now compile the binary using the Arduino project file ([arduino/Wi-PWN/Wi-PWN.ino](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/Wi-PWN.ino))

**Remember to upload your sketch :)**

##Better compression rates

It is possible to get better compression rates by using [kangax/html-minifier](https://github.com/kangax/html-minifier)