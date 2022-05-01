#include "Program.h"
#include "pins.h"

void Program::setup() {

    SerialMon.begin(115200);

    alarm.setup(this);
    led.begin();

    delay(500);

    alarm.begin();
    led.setStatus(BOOT);

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
