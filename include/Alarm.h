#pragma once
#include <Arduino.h>
#include "Speaker.h"

class Program;

class Alarm {

public:
    void setup(Program *program);
    void begin();
    void activate();
    void run();
    bool activated;
    float_t temp;
    String time;

private:
    Program *program;
    Speaker speaker;

};