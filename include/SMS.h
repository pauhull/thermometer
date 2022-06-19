#pragma once

#define DEBUG
#define SerialMon Serial
#define SerialAT Serial1
#define TINY_GSM_MODEM_SIM800
#define TINY_GSM_RX_BUFFER 650
#define TINY_GSM_DEBUG SerialMon
#include <TinyGsmClient.h>

#ifdef DEBUG
#include <StreamDebugger.h>
#endif

class SMS {

public:
    void begin();
    bool sendSMS(const String& number, const String& text);
    String getTime();
    bool ready();
    SimStatus getStatus();

private:
    void setupModem();
    bool setPowerBoost(bool en);
#ifdef DEBUG
    StreamDebugger debugger{SerialAT, SerialMon};
    TinyGsm modem{debugger};
#else
    TinyGsm modem{SerialAT};
#endif

};