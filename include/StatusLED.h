#pragma once
#include <FastLED.h>

enum Status {
    OFF,
    BOOT,
    READY,
    ALARM
};

class StatusLED {

public:
    void begin();
    void setStatus(Status status);
    void run();
    Status status;

private:
    CRGB led[1];

};