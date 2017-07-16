# Compiling with Arduino

1. [Download the source code](https://github.com/Wi-PWN/Wi-PWN/archive/master.zip) of this project.

2. Open up the [drivers](https://github.com/samdenty99/Wi-PWN/drivers) folder and install the appropriate driver for your board (Install both if you are unsure).

2. Install [Arduino](https://www.arduino.cc/en/Main/Software) and open it.

3. Go to `File` > `Preferences`

4. Add `http://arduino.esp8266.com/stable/package_esp8266com_index.json` to the *Additional Boards Manager URLs.* (refer to [https://github.com/esp8266/Arduino](https://github.com/esp8266/Arduino))

5. Go to `Tools` > `Board` > `Boards Manager`

6. Type in `esp8266` and select version `2.0.0`, then click on `Install` (**must be version 2.0.0!**)<br><br>
![screenshot of arduino, selecting the right version](https://raw.githubusercontent.com/samdenty99/Wi-PWN/master/pictures/arduino_screenshot_1.JPG)

8. Open `C:\Users\%username%\AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\2.0.0\tools\sdk\include\user_interface.h` in your preferred text editor.
 
9. Just before the last line `#endif`, add the following:

<b></b>

    typedef void (*freedom_outside_cb_t)(uint8 status);
    int wifi_register_send_pkt_freedom_cb(freedom_outside_cb_t cb);  
    void wifi_unregister_send_pkt_freedom_cb(void);
    int wifi_send_pkt_freedom(uint8 *buf, int len, bool sys_seq);  
   ![screenshot of notepad, copy paste the right code](https://raw.githubusercontent.com/samdenty99/Wi-PWN/master/pictures/notepad_screenshot_1.JPG)

10. Navigate to the [arduino/SDK_fix](https://github.com/samdenty99/Wi-PWN/arduino/SDK_fix) folder of this project

11. Copy `ESP8266Wi-Fi.cpp` and `ESP8266Wi-Fi.h` to `C:\Users\%username%\AppData\Local\Arduino15\packages\esp8266\hardware\esp8266\2.0.0\libraries\ESP8266WiFi\src` replacing the originals

12. Open `arduino/Wi-PWN/Wi-PWN.ino` in Arduino

13. Go to `Tools` > `Board` and select the appropriate board for your ESP8266 module, along with the correct port in `Tools` > `Port`.

14. Depending on your board you may have to adjust the `Tools` > `Board` > `Flash Frequency` and the `Tools` > `Board` > `Flash Size`. Select `80MHz` `4M (1M SPIFFS)` as these are the most common.

15. Upload the sketch! <kbd>CTRL-U</kbd>

**Note:** If you use a 512kb version of the ESP8266, you need to comment out a part of the mac vendor list in `data.h`