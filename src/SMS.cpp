#include <Wire.h>
#include "SMS.h"
#include "pins.h"

void SMS::begin() {

    if(!setPowerBoost(false)) {
        SerialMon.println("Failed to enable power boost");
    }

    SerialMon.println("Initializing...");
    setupModem();
    SerialAT.begin(115200, SERIAL_8N1, MODEM_RX, MODEM_TX);
    modem.init();
    modem.waitForNetwork();

    SerialMon.println("Done");
}

void SMS::setupModem() {

    pinMode(MODEM_RST, OUTPUT);
    digitalWrite(MODEM_RST, HIGH);

    pinMode(MODEM_PWRKEY, OUTPUT);
    pinMode(MODEM_POWER_ON, OUTPUT);

    digitalWrite(MODEM_POWER_ON, HIGH);

    // Pull down PWRKEY for more than 1 second according to manual requirements
    digitalWrite(MODEM_PWRKEY, HIGH);
    delay(100);
    digitalWrite(MODEM_PWRKEY, LOW);
    delay(1000);
    digitalWrite(MODEM_PWRKEY, HIGH);
}

bool SMS::setPowerBoost(bool en) {
    Wire.begin(WIRE_SDA, WIRE_SCL);
    Wire.beginTransmission(0x75);
    Wire.write(0x00);
    Wire.write(en ? 0x37 : 0x35);
    return Wire.endTransmission() == 0;
}

String SMS::getTime() {
    return modem.getGSMDateTime(DATE_TIME);
}

bool SMS::sendSMS(const String& number, const String& text) {
    return modem.sendSMS(number, text);
}

bool SMS::ready() {
    return modem.isNetworkConnected();
}

