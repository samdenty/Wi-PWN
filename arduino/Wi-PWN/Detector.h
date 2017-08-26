#include <ESP8266WiFi.h>
#include "Mac.h"
#include "Settings.h"

extern "C" {
#include "user_interface.h"
}

extern Settings settings;

class Detector {
  public:
    void start();
    unsigned long c = 0;
    unsigned long prevTime = 0;
    unsigned long curTime = 0;
    int curChannel = settings.detectorChannel;
    bool detecting = false;
};
