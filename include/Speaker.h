#pragma once

class Speaker {

public:
    void begin();
    void run();
    void play(uint32_t duration);
    void start();
    void stop();
    void wait();

private:
    uint32_t playUntil;
    bool pin, running;

};