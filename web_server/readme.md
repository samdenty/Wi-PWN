## What is [Jekyll](https://jekyllrb.com/)?

Jekyll is a pre-compiler for static content generation, it's basically makes everything easier to maintain - but the outputted HTML is the same.

In order to do any development (or even run the webserver) you need to do the following:

- Install [Ruby, Gem package manager & Jekyll](https://davidburela.wordpress.com/2015/11/28/easily-install-jekyll-on-windows-with-3-command-prompt-entries-and-chocolatey/) (see [here for Linux](http://michaelchelen.net/81fa/install-jekyll-2-ubuntu-14-04/))
- Run `bundler install` in the `/web_server/html` folder

## How to run a local server of Wi-PWN
- Make sure you have Jekyll & Gems installed (see above)
- Run `jekyll serve` in the `/web_server/html` folder

## How to initiate a local demo of Wi-PWN
- Open `localhost_server.bat` which will start a server accessible on your PC.
- Your default browser will open up and display the Wi-PWN local demo.

NOTE: You can just directly open the HTML files, but the pages won't load properly as you need a server to allow requests to be made.

**NOTE:** The included `.json` file are there to simulate example output from the ESP8266 module. Do not include them in the final binary! 


## How to update web-server files

### Auto Mode (Windows / Mac / Linux)

- Make sure you have Jekyll & Gems installed (see above)
- Launch `auto_generate.exe`
- Wait for it to finish
- That's it **¯\_(ツ)_/¯**

![](http://imgur.com/i9t0yr6.png)

<br>

### Script Mode (Linux/Mac)
**NOTE: This will fail to work as of Wi-PWN 9.0, due to GZIP being used to increase stability and performance. Please use Windows for now until the Node.js app is ported to other platforms.**

~~1. Open a terminal window at the `webserver` directory and execute `./convert_all.sh`
2. Open the generated file "data_h_temp" and copy the content (CTRL+C)
3. Go to [arduino/Wi-PWN/data.h](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/data.h) and replace the content between the comments like below:~~

<b></b>

    /*auto_generator*/
    const char data_attackHTML[] PROGMEM = {0x3c,0x68,0x65,0x61...<br>
    ...
    /*end_auto_generator*/

~~### Manual Mode~~

~~1. Open `minifier.html` and paste the HTML source in input field  
2. Click on <kbd>minifiy + byte-ify</kbd>  
3. Copy the results  
4. Go to [arduino/Wi-PWN/data.h](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/data.h) and replace the array (of the changed html file) with the copied bytes~~

You can now compile the binary using the Arduino project file ([arduino/Wi-PWN/Wi-PWN.ino](http://github.com/Wi-PWN/Wi-PWN/arduino/Wi-PWN/Wi-PWN.ino))
