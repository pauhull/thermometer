#include <Arduino.h>
#include "Speaker.h"
#include "pins.h"

void Speaker::begin() {
    pinMode(SPEAKER_PIN, OUTPUT);
    digitalWrite(SPEAKER_PIN, LOW);
}

void Speaker::run() {
    if(running && millis() > playUntil) {
        stop();
    }
}

void Speaker::start() {
    if(running) return;
    running = true;
    playUntil = 0xffffffff;
    digitalWrite(SPEAKER_PIN, HIGH);
}

void Speaker::stop() {
    if(!running) return;
    running = false;
    playUntil = 0;
    digitalWrite(SPEAKER_PIN, LOW);
}

void Speaker::play(uint32_t duration) {
    start();
    playUntil = millis() + duration;
}

void Speaker::wait() {
    while(running) run();
}
