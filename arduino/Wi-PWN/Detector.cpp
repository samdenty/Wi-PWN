#include "Detector.h"

Detector d;

void detectorSniffer(uint8_t *buf, uint16_t len) {
  if(buf[12] == 0xA0 || buf[12] == 0xC0) d.c++;
};

void Detector::start() {
  wifi_promiscuous_enable(0);
  WiFi.disconnect();
  wifi_set_opmode(STATION_MODE);
  wifi_set_promiscuous_rx_cb(detectorSniffer);
  wifi_set_channel(curChannel);
  wifi_promiscuous_enable(1);
  
  pinMode(settings.alertPin, OUTPUT);
  detecting = true;
}
