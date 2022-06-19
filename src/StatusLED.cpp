#include "StatusLED.h"
#include "pins.h"

void StatusLED::begin() {
    CFastLED::addLeds<WS2812B, STATUS_LED_PIN>(led, 1);
    led[0] = CRGB::Black;
    FastLED.setBrightness(128);
    FastLED.show();
}

void StatusLED::setStatus(Status _status) {
    status = _status;
    switch(status) {
        case OFF:
            led[0] = CRGB::Black;
            break;
        case BOOT:
            led[0] = CRGB::Yellow;
            break;
        case READY:
            led[0] = CRGB::Green;
            break;
        case ALARM:
            led[0] = CRGB::Red;
            break;
    }
    FastLED.show();
}

void StatusLED::run() {
    switch(status) {
        case OFF:
            led[0] = CRGB::Black;
            break;
        case BOOT:
            led[0] = (millis() % 1000 < 500) ? CRGB::Yellow : CRGB::Black;
            break;
        case READY:
            led[0] = (millis() % 5000 < 200) ? CRGB::Green : CRGB::Black;
            break;
        case ALARM:
            led[0] = (millis() % 1000 < 500) ? CRGB::Red : CRGB::Black;
            break;
    }
    FastLED.show();
}
