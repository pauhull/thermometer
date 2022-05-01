#include "TempSensor.h"
#include "pins.h"

void TempSensor::begin() {
    dht.setup(DHT_PIN, DHT::DHT22);
    for(uint32_t i = 0; i < NUM_RECORDS; i++) {
        temps[i] = NAN;
        hums[i] = NAN;
    }
}

void TempSensor::run() {
    uint32_t now = millis();
    if(now - last > dht.getMinimumSamplingPeriod()) {
        last = now;
        float_t _temp = dht.getTemperature();
        float_t _hum = dht.getHumidity();
        if(!isnan(_temp)) temp = _temp;
        if(!isnan(_hum)) hum = _hum;

        for(uint32_t i = 0; i < NUM_RECORDS-1; i++) {
            temps[i] = temps[i+1];
            hums[i] = hums[i+1];
        }
        temps[NUM_RECORDS-1] = temp;
        hums[NUM_RECORDS-1] = hum;
    }
}