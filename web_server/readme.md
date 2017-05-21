#How to update web-server files
**1** Open `minifier.html` and paste the HTML source in input field  
**3** Click on <kbd>minifiy + byte-ify</kbd>  
**4** Copy the results  
**5** Go to [arduino/Wi-PWN/data.h](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/data.h) and replace the array (of the changed html file) with the copied bytes  

You can now compile the binary using the Arduino project file ([arduino/Wi-PWN/Wi-PWN.ino](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/Wi-PWN.ino))

**Remember to upload your sketch :)**

#Better compression rates

It is possible to get better compression rates by using [kangax/html-minifier](https://github.com/kangax/html-minifier)