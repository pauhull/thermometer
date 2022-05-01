#pragma once
#include "SMS.h"
#include "TempSensor.h"
#include "WebServer.h"
#include "Storage.h"
#include "StatusLED.h"
#include "Speaker.h"
#include "Alarm.h"

class Program {

public:
    void setup();
    void loop();
    StatusLED led;
    SMS sms;
    TempSensor sensor;
    WebServer server;
    Storage storage;
    Alarm alarm;

};