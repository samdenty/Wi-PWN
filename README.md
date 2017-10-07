<p align="center">
  <a href="https://wi-pwn.samdd.me/?ref=logo">
    <img src="https://github.com/samdenty99/Wi-PWN/raw/master/pictures/Wi-PWN.png" width="100">
  </a>

  <h3 align="center">Wi-PWN</h3>

  <p align="center">
    ESP8266 Deauther with a clean & minimalistic web interface 
    <br>
    <b><a href="https://wi-pwn.samdd.me/?ref=online-demo">Online demo</a> | <a href="https://discord.gg/yN2x7sp">Discord</a> | <a href="https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN/wiki">Browse the docs</a> | <a href="https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN/projects/1?fullscreen=true">Upcoming features</a></b>
    <br>
    <br>
    <a href="https://samdenty99.github.io/r?https://travis-ci.org/samdenty99/Wi-PWN">
		<img src="https://img.shields.io/travis/samdenty99/Wi-PWN.svg?colorB=0082ff&style=flat">
	</a>
    <a href="https://wi-pwn.samdd.me/discord/?ref=chat">
		<img src="https://img.shields.io/discord/335836376031428618.svg?colorB=0082ff&style=flat">
	</a>
    <a href="https://samdenty99.github.io/r?http://www.somsubhra.com/github-release-stats/?username=samdenty99&repository=Wi-PWN">
		<img src="https://img.shields.io/github/downloads/samdenty99/Wi-PWN/total.svg?colorB=437FB9&style=flat">
	</a>
	<a href="https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN/subscription">
    	<img src="https://img.shields.io/github/watchers/samdenty99/Wi-PWN.svg?style=social&label=Watch&style=flat">
	</a>
    <a href="https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN">
		<img src="https://img.shields.io/github/stars/samdenty99/Wi-PWN.svg?style=social&label=Star&style=flat">
	</a>
	<a href="https://samdenty99.github.io/r?https://github.com/samdenty99/Wi-PWN/fork">
		<img src="https://img.shields.io/github/forks/samdenty99/Wi-PWN.svg?style=social&label=Fork&style=flat">
	</a>
</p>
<h2></h2>

**[Wi-PWN on the Google Play store](https://play.google.com/store/apps/details?id=samdd.wipwn)**

## Advantages

- Fast & responsive Material Design UI, with optional dark mode
- Integrated [Deauth Detector](https://github.com/spacehuhn/DeauthDetector) (with full customization)
- WiFi client mode - Access Wi-PWN on a WiFi network
- Info page with total packets sent, uptime, memory usage, check for updates...


<img src="pictures/secondary-banner.png">


## Table of Contents
- [Introduction](#introduction)
  - [What is Wi-PWN](#what-is-Wi-PWN)
  - [How it works](#how-it-works)
  - [How to protect against it](#how-to-protect-against-it)
- [Installation](#installation)
  - [Flashing with NodeMCU-Flasher](#nodemcu)  
  - [Compiling with Arduino](#arduino)
- [How to use it](#how-to-use)
- [FAQ](#faq)
- [License](#license)
- [Sources and additional links](#sources-and-additional-links)

## Introduction ##

### What is Wi-PWN

Wi-PWN is a firmware that performs [deauth attacks](https://en.wikipedia.org/wiki/Wi-Fi_deauthentication_attack) on cheap Arduino boards. The [ESP8266](https://en.wikipedia.org/wiki/ESP8266) is a cheap micro controller with built-in Wi-Fi. It contains a powerful 160 MHz processor and it can be programmed using [Arduino](https://www.arduino.cc/en/Main/Software).

A deauthentication attack is often confused with [Wi-Fi jamming](https://en.wikipedia.org/wiki/Radio_jamming#Method), as they both block users from accessing Wi-Fi networks.

### How it works

The 802.11 Wi-Fi protocol contains a so called [deauthentication frame](https://mrncciew.com/2014/10/11/802-11-mgmt-deauth-disassociation-frames/). It is used to disconnect clients safely from a wireless
network.

Because these management packets are unencrypted, you just need the MAC address of the Wi-Fi router and of the client device which you want to disconnect from the network. You don’t need to be in the network or know the password, it’s enough to be in its range.


### How to protect against it

With the [802.11w-2009](https://en.wikipedia.org/wiki/IEEE_802.11w-2009) updated standards, management frames are encrypted by default.

[802.11w](https://en.wikipedia.org/wiki/IEEE_802.11w-2009) is rarely used in the real world as both the router **and the client device** need to support this standard, otherwise they won't be able to connect to the routers.

Updating to the [802.11w](https://en.wikipedia.org/wiki/IEEE_802.11w-2009) standard is often expensive and difficult due to the vast devices of legacy devices not supporting the new standard. Because of the maintenance nightmare, over 95% of devices use the vulnerable 802.11 standard — even though newer devices support newer standards.

## Installation

Requirements:

- ESP8266 module (any board)  
- Micro-USB cable
- Computer

I would recommend getting a USB breakout/developer board, mainly due to the 4Mb of flash and simplicity.  

In order to upload the Wi-PWN firmware, you can use one of two methods. The first method is easier overall but using Arduino is better for debugging.
**YOU ONLY NEED TO DO ONE OF THE INSTALLATION METHODS!**

### Install the necessary drivers

There are two variants of UART converters that ESP8266 boards use:

|CP210x|CH34x|
|:---:|:---:|
| [Drivers](https://github.com/samdenty99/Wi-PWN/tree/master/drivers/CP210x) | [Drivers](https://github.com/samdenty99/Wi-PWN/tree/master/drivers/CH34x) |
|<img src="drivers/CP210x-board.png" height="200px">|<img src="drivers/CH34x-board.png" height="200px">|


### <a name="nodemcu"></a>Method 1: Flashing with NodeMCU-Flasher  

1. [Download](https://github.com/samdenty99/Wi-PWN/releases/latest) the current release of Wi-PWN

2. Upload the `.bin` file using the [nodemcu-flasher](https://github.com/nodemcu/nodemcu-flasher/raw/master/Win64/Release/ESP8266Flasher.exe). Alternatively you can use the official [esptool](https://github.com/espressif/esptool) from espressif.

3. Connect your ESP8266 (making sure the drivers are installed) and open up the *NodeMCU Flasher*
4. Go to the `Advanced` tab and select the correct values for your board.
5. Navigate to the `config` tab and click the gear icon for the first entry.
6. Browse for the `.bin` file you just downloaded and click open.
7. Switch back to the `Operation` tab and click <kbd>Flash(F)</kbd>.

### <a name="arduino"></a>Method 2: Compiling with Arduino

1. [Download the source code](https://github.com/samdenty99/Wi-PWN/archive/master.zip) of this project.

2. Install [Arduino](https://www.arduino.cc/en/Main/Software) and open it.

3. Go to `File` > `Preferences`

4. Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` to the *Additional Boards Manager URLs.* (refer to [https://github.com/esp8266/Arduino](https://github.com/esp8266/Arduino))

5. Go to `Tools` > `Board` > `Boards Manager`

6. Type in `esp8266`

7. Select version `2.0.0` and click on `Install` (**must be version 2.0.0!**)<br><br>
![Screenshot of Arduino, selecting the right version](pictures/arduino_screenshot_1.JPG)

8. Go to `File` > `Preferences`

9. Open the folder path under `More preferences can be edited directly in the file`<br><br>
![Screenshot of Arduino, opening folder path](pictures/arduino_screenshot_2.JPG)

10. Go to `packages` > `esp8266` > `hardware` > `esp8266` > `2.0.0` > `tools` > `sdk` > `include`

11. Open `user_interface.h` with a text editor

12. Just before the last line `#endif`, add the following:

<b></b>

    typedef void (*freedom_outside_cb_t)(uint8 status);
    int wifi_register_send_pkt_freedom_cb(freedom_outside_cb_t cb);
    void wifi_unregister_send_pkt_freedom_cb(void);
    int wifi_send_pkt_freedom(uint8 *buf, int len, bool sys_seq);

![screenshot of notepad, copy paste the right code](pictures/notepad_screenshot_1.JPG)

13. Go to the [arduino/SDK_fix](https://github.com/samdenty99/Wi-PWN/arduino/SDK_fix) folder of this project

14. Copy `ESP8266Wi-Fi.cpp` and `ESP8266Wi-Fi.h` to
    `C:\Users\%username%\AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\2.0.0\libraries\ESP8266WiFi\src`

16. Open `arduino/Wi-PWN/Wi-PWN.ino` in Arduino

17. Select your ESP8266 board at `Tools` > `Board` and the right port at `Tools` > `Port`  
**If no port shows up you need to reinstall the drivers**, search online for chip part number + 'driver Windows'

18. Depending on your board you may have to adjust the `Tools` > `Board` > `Flash Frequency` and the `Tools` > `Board` > `Flash Size`. I used the `80MHz` Flash Frequency, and the `4M (1M SPIFFS)` Flash Size

19. Upload! <kbd>CTRL-U</kbd>

**Note:** If you use a 512kb version of the ESP8266, you need to comment out a part of the mac vendor list in `data.h`

## How to use

1. Connect your ESP8266 to a USB power source (you can power it with your phone using an OTG cable)

2. Scan for Wi-Fi networks on your device and connect to `Wi-PWN` (no password by default).  

3. Once connected, open up your browser and go to `http://192.168.4.1`  

4. Click on <kbd>ACCEPT</kbd> to accept the Terms &amp; Conditions<br><br>
![](pictures/windows/chrome/default/index.png)

5. Specify a SSID and password for Wi-PWN to use and click on <kbd>CONTINUE</kbd><br><br>
![](pictures/windows/chrome/default/setup.png)

6. Reconnect to the new network using the SSID &amp; Password you specified in the previous step.
7. Go back to your browser and the page should reload (open `http://192.168.4.1` again if the page doesn't reload)<br><br>
8. Click on the <kbd>Scan</kbd> button to scan for Wi-Fi networks<br><br>
![](pictures/windows/chrome/default/scan.png)<br>
**Note: You may have to reconnect to the Wi-Fi network.**

9. Select the WiFi network(s) you want to perform the attack on. Once finished, click on the <kbd>Attack</kbd> button
10. Select the attack you wish to perform <br><br>
![](pictures/windows/chrome/default/attack.png)<br>


## FAQ

#### Only able to connect to Wi-Fi network on some devices

This happens due to a channel conflict. Simply navigate to `192.168.4.1/settings.html` on a device that is able to connect to the Wi-Fi network and **change the Channel number** from `1` to any number up to `14`.

#### `espcomm_sync failed` / `espcomm_open` when uploading

The ESP upload tool can't communicate with the chip.

- Reconnect the chip using a different USB port and cable.
- Install the USB drivers (cp2102 or ch340).
- Make sure the right COM port is selected.

#### SSID's wont load? (No clear button)

Try resetting the SSID list by visiting `192.168.4.1/clearSSID.json` while connected to your ESP.
If this doesnt solve your problem, ask for help in the [official discord](https://discord.gg/yN2x7sp).

#### Deauth attack won't work

If you see 0 pkts/s on the website, then you've made a mistake. Check that you have followed the installation steps correctly and that the right SDK installed, it must be version 2.0.0!
If it can send packets but your target doesn't lose its connection, then the Wi-Fi router either uses [802.11w](#how-to-protect-against-it) and it's protected against such attacks, or it communicates on the 5GHz band, which the ESP8266 doesn't support because of its 2.4GHz antenna.

#### If you have other questions or problems with the ESP8266 you can also check out the official [community forum](http://www.esp8266.com/).

[![Analytics](https://ga-beacon.appspot.com/UA-85426772-5/Wi-PWN/?flat)](https://github.com/igrigorik/ga-beacon)
