#pragma once
#include <ESPAsyncWebServer.h>
#include <DNSServer.h>

class Program;

class WebServer {

public:
    void begin(Program *program);
    void accept();

private:
    AsyncWebServer server{80};
    DNSServer dns;

};