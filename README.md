# Wi-PWN
<img src="https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/Wi-PWN.png" height="120px">

Project based upon [spacehuhn/esp8266_deauther](http://github.com/spacehuhn/esp8266_deauther).<br>Deauthentication attack and other hacks using an ESP8266.

**Try a live demo at [https://Wi-PWN.github.io](https://Wi-PWN.github.io)**
<br><br>

![Deauther with phone](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/smartphone_esp_1.jpg)  


## Contents
- [Introduction](#introduction)
  - [What it is](#what-it-is)
  - [How it works](#how-it-works)
  - [How to protect against it](#how-to-protect-against-it)
- [Disclaimer](#disclaimer)
- [Installation](#installation)
  - [Flashing with NodeMCU-Flasher](#Method-1:-Flashing-with-NodeMCU-Flasher)  
  - [Compiling with Arduino](#Method-2:-Compiling-with-Arduino)
- [How to use it](#how-to-use)
- [FAQ](#faq)
- [License](#license)
- [Sources and additional links](#sources-and-additional-links)

## Introduction ##

### What it is

Basically it’s a device which performs a [deauth attack](https://en.wikipedia.org/wiki/Wi-Fi_deauthentication_attack).  
You select the clients you want to disconnect from their network and start the attack. As long as the attack is running, the
selected devices are unable to connect to their network.  
Other attacks also have been implemented, such as beacon or probe request flooding.  


The [ESP8266](https://en.wikipedia.org/wiki/ESP8266) is a cheap micro controller with built-in Wi-Fi. It contains a powerful 160 MHz processor and it can be programmed using [Arduino](https://www.arduino.cc/en/Main/Software).  

You can buy these chips for under $2 from China!

### How it works

The 802.11 Wi-Fi protocol contains a so called [deauthentication frame](https://mrncciew.com/2014/10/11/802-11-mgmt-deauth-disassociation-frames/). It is used to disconnect clients safely from a wireless
network.

Because these management packets are unencrypted, you just need the mac address of the Wi-Fi router and of the client device which you want to disconnect from the network. You don’t need to be in the network or know the password, it’s enough to be in its range.


### How to protect against it

With [802.11w-2009](https://en.wikipedia.org/wiki/IEEE_802.11w-2009) Wi-Fi got an update to encrypt management frames.
So make sure your router is up to date and has management frame protection enabled. But note that your client device needs to 
support it too, both ends need to have it enabled!

The only problem is that most devices don’t use it. I tested it with different Wi-Fi networks and devices, it worked every time! It seems that even newer devices which support frame protection don’t use it by default.

I made a [Deauth Detector](https://github.com/spacehuhn/DeauthDetector) using the same chip to indicate if such an attack is running against a nearby network. It doesn't protect you against it, but it can help you figure out if and when an attack is running.  

## Disclaimer

Use it only for testing purposes on your own devices!  
**Wi-PWN and its contributors don't take any responsibility for what you do with this program.** 

Any redistributing, advertising or selling of this project as "jammer" without clearly stating it as a pentesting device for testing purposes only, is prohibited!  
 

## Installation

Requirements:

- ESP8266 module (any board)  
- Micro-USB cable
- Computer

I would recommend getting a USB breakout/developer board, mainly due to the 4Mb of flash and simplicity.  

In order to upload the Wi-PWN firmware, you can use one of two methods. The first method is easier overall but using Arduino is better for debugging.
**YOU ONLY NEED TO DO ONE OF THE INSTALLATION METHODS!**

### Method 1: Flashing with NodeMCU-Flasher  

1. [Download](https://github.com/Wi-PWN/Wi-PWN/releases)   the current release of Wi-PWN

2. Upload the `.bin` file using the [nodemcu-flasher](https://github.com/nodemcu/nodemcu-flasher/raw/master/Win64/Release/ESP8266Flasher.exe). Alternatively you can use the official [esptool](https://github.com/espressif/esptool) from espressif.

3. Connect your ESP8266 (making sure the drivers are installed) and open up the *NodeMCU Flasher*
4. Go to the `Advanced` tab and select the correct values for your board.
5. Navigate to the `config` tab and click the gear icon for the first entry.
6. Browse for the `.bin` file you just downloaded and click open.
7. Switch back to the `Operation` tab and click <kbd>Flash(F)</kbd>.

### Method 2: Compiling with Arduino

1. [Download the source code](https://github.com/Wi-PWN/Wi-PWN/archive/master.zip) of this project.

2. Install [Arduino](https://www.arduino.cc/en/Main/Software) and open it.

3. Go to `File` > `Preferences`

4. Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` to the *Additional Boards Manager URLs.* (refer to [https://github.com/esp8266/Arduino](https://github.com/esp8266/Arduino))

5. Go to `Tools` > `Board` > `Boards Manager`

6. Type in `esp8266`

7. Select version `2.0.0` and click on `Install` (**must be version 2.0.0!**)<br><br>
![screenshot of arduino, selecting the right version](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/arduino_screenshot_1.JPG)

8. Go to `File` > `Preferences`

9. Open the folder path under `More preferences can be edited directly in the file`<br><br>
![screenshot of arduino, opening folder path](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/arduino_screenshot_2.JPG)

10. Go to `packages` > `esp8266` > `hardware` > `esp8266` > `2.0.0` > `tools` > `sdk` > `include`

11. Open `user_interface.h` with a text editor

12. Just before the last line `#endif`, add the following:

    typedef void (*freedom_outside_cb_t)(uint8 status);
    int wifi_register_send_pkt_freedom_cb(freedom_outside_cb_t cb);  
    void wifi_unregister_send_pkt_freedom_cb(void);
    int wifi_send_pkt_freedom(uint8 *buf, int len, bool sys_seq);  
   <br>![screenshot of notepad, copy paste the right code](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/notepad_screenshot_1.JPG)

13. Go to the [arduino/SDK_fix](https://github.com/Wi-PWN/Wi-PWN/arduino/SDK_fix) folder of this project

14. Copy `ESP8266Wi-Fi.cpp` and `ESP8266Wi-Fi.h` to
    `C:\%username%\AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\2.0.0\libraries\ESP8266WiFi\src`

16. Open `arduino/Wi-PWN/esp8266_deauther.ino` in Arduino

17. Select your ESP8266 board at `Tools` > `Board` and the right port at `Tools` > `Port`  
**If no port shows up you need to reinstall the drivers**, search online for chip part number + 'driver Windows' 

18. Depending on your board you may have to adjust the `Tools` > `Board` > `Flash Frequency` and the `Tools` > `Board` > `Flash Size`. I used the `80MHz` Flash Frequency, and the `4M (1M SPIFFS)` Flash Size

19. Upload! <kbd>CTRL-U</kbd>

**Note:** If you use a 512kb version of the ESP8266, you need to comment out a part of the mac vendor list in `data.h`

**Your ESP8266 Deauther is now ready!**

## How to use

1. Connect your ESP8266 to a USB power source (you can power it with your phone using USB OTG cable)

2. Scan for Wi-Fi networks on your device and connect to `Wi-PWN`. The password is `rootaccess`.  

3. Once connected, open up your browser and go to `192.168.4.1`  

4. Accept the warning<br><br>
![](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/web_screenshot_1.jpg)

5. Click on the <kbd>Scan</kbd> to scan for Wi-Fi networks<br><br>
![](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/web_screenshot_2.jpg)<br>
**Note: You may have to reconnect to the Wi-Fi network.**

6. Select the WiFi network(s) you want to perform the attack on. Once finished, click on the <kbd>Attack</kbd> button
7. Select the attack you wish to perform <br><br>
![](https://raw.githubusercontent.com/Wi-PWN/Wi-PWN/master/screenshots/web_screenshot_3.jpg)<br>

**Happy hacking :)**

## FAQ

**Can it sniff handshakes?**

The ESP8266 has a promiscuous mode in which you can sniff packets, but handshake packets are dropped and there is no other way to get them with the functions provided by the SDK.  
Maybe someone will find a way around this barrier in the future.

**espcomm_sync failed/espcomm_open when uploading**

The ESP upload tool can't communicate with the chip, make sure the right port is selected!  
You can also try out different USB ports and cables.  
If this doesn't solve it you may have to install USB drivers.  
Which drivers you need depends on the board, most boards use a cp2102 or ch340.

**AP scan doesn't work**

There is a reported issue on this: [https://github.com/spacehuhn/esp8266_deauther/issues/5  ](https://github.com/spacehuhn/esp8266_deauther/issues/5  )
Try switching the browser or opening the website with another device.   

**Deauth attack won't work**

If you see 0 pkts/s on the website then you've made a mistake. Check that you have followed the the installation steps correctly and that the right SDK installed, it must be version 2.0.0!
If it can send packets but your target doesn't loose its connection, then the Wi-Fi router either uses [802.11w](#how-to-protect-against-it) and it's protected against such attacks, or it communicates on the 5GHz band, which the ESP8266 doesn't support because of its 2.4GHz antenna.

### If you have other questions or problems with the ESP8266 you can also check out the official [community forum](http://www.esp8266.com/).

## License

This project is licensed under the MIT License - see the [license file](LICENSE) file for details.

**The License file must be included in any redistributed version of this program!**  
Any redistributing, advertising or selling of this project as "jammer" without clearly stating it as a pentesting device for testing purposes only, is prohibited!  

## Sources and additional links

**Original project - [https://github.com/spacehuhn/esp8266_deauther](https://github.com/spacehuhn/esp8266_deauther)**

Deauth attack: [https://en.wikipedia.org/wiki/Wi-Fi-deauthentication-attack](https://en.wikipedia.org/wiki/Wi-Fi_deauthentication_attack)

Deauth frame: [https://mrncciew.com/2014/10/11/802-11-mgmt-deauth-disassociation-frames/](https://mrncciew.com/2014/10/11/802-11-mgmt-deauth-disassociation-frames/)

ESP8266:
 
- [https://wikipedia.org/wiki/ESP8266](https://wikipedia.org/wiki/ESP8266)
- [https://espressif.com/en/products/hardware/esp8266ex/overview](https://espressif.com/en/products/hardware/esp8266ex/overview)

Packet Injection with ESP8266:
 
- [http://hackaday.com/2016/01/14/inject-packets-with-an-esp8266/](http://hackaday.com/2016/01/14/inject-packets-with-an-esp8266/)
- [http://bbs.espressif.com/viewtopic.php?f=7&t=1357&p=10205&hilit=Wi-Fi_pkt_freedom#p10205](http://bbs.espressif.com/viewtopic.php?f=7&t=1357&p=10205&hilit=Wi-Fi_pkt_freedom#p10205)
- [https://github.com/pulkin/esp8266-injection-example](https://github.com/pulkin/esp8266-injection-example)

802.11w-2009: [https://en.wikipedia.org/wiki/IEEE_802.11w-2009](https://en.wikipedia.org/wiki/IEEE_802.11w-2009)

`Wi-Fi_send_pkt_freedom` function limitations: [http://esp32.com/viewtopic.php?f=13&t=586&p=2648&hilit=Wi-Fi_send_pkt_freedom#p2648](http://esp32.com/viewtopic.php?f=13&t=586&p=2648&hilit=Wi-Fi_send_pkt_freedom#p2648)
