#include "Program.h"
#include "pins.h"

void Program::setup() {

    alarm.setup(this);
    led.begin();

    delay(500);

    alarm.begin();
    led.setStatus(BOOT);

    SerialMon.begin(115200);
    sms.begin();
    sensor.begin();
    storage.begin();
    server.begin(this);
    led.setStatus(READY);
}

void Program::loop() {
    yield();
    led.run();
    sensor.run();
    server.accept();
    alarm.run();
}
