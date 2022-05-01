#include "Alarm.h"
#include "Program.h"
#include "../strings.h"

void Alarm::setup(Program *_program) {
    program = _program;
    speaker.begin();
}

void Alarm::begin() {
    speaker.play(5);
    speaker.wait();
}

void Alarm::activate() {
    if(activated) return;
    activated = true;
    temp = program->sensor.temp;
    time = program->sms.getTime();
    program->led.setStatus(ALARM);

    String alertMessage = String(ALERT);
    String tempString = String(temp);
    tempString.replace('.', ',');
    alertMessage.replace("{temp}", tempString);
    alertMessage.replace("{time}", time.substring(0, 5));

    for(int32_t i = 0; i < program->storage.phoneNumbers.size(); i++) {
        String number = program->storage.phoneNumbers[i];
        Serial.println(number);
        Serial.println(program->sms.sendSMS(number, alertMessage));
    }
}

void Alarm::run() {

    if(activated) {
        uint32_t section = (millis() % 1000) / 200;
        if(section == 0 || section == 2) {
            speaker.start();
        } else {
            speaker.stop();
        }
        speaker.run();
        program->led.run();
    } else if(program->sensor.temp >= (float_t) program->storage.alarmTemp) {
        activate();
    }
}

