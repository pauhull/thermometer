#pragma once
#include <DHT.h>
#define NUM_RECORDS 512

class TempSensor {

public:
    void begin();
    void run();
    float_t temp = 0.0f, hum = 0.0f;
    uint32_t last = 0;
    float_t temps[NUM_RECORDS], hums[NUM_RECORDS];

private:
    DHT dht{};

};
