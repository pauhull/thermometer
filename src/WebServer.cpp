#include <WiFi.h>
#include <LittleFS.h>
#include "WebServer.h"
#include "Program.h"
#include "../strings.h"

void WebServer::begin(Program *program) {

    IPAddress apIP(8, 8, 4, 4);
    WiFi.disconnect();
    WiFi.mode(WIFI_AP);
    WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
    WiFi.softAP(SSID, PASSWORD);
    dns.start(53, "*", WiFi.softAPIP());
    Serial.println("Created WiFi AP");

    LittleFS.begin();

    server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");

    server.on("/temps/history", HTTP_GET, [=](AsyncWebServerRequest *request) {

        String response;
        for(uint32_t i = 0; i < NUM_RECORDS; i++) {
            if(i) response += ",";
            response += program->sensor.temps[i];
        }
        response += ";";
        for(uint32_t i = 0; i < NUM_RECORDS; i++) {
            if(i) response += ",";
            response += program->sensor.hums[i];
        }

        request->send(200, "text/plain", response);
    });

    server.on("/temps/now", HTTP_GET, [=](AsyncWebServerRequest *request) {
        request->send(200, "text/plain", program->sensor.temp + String(";") + program->sensor.hum);
    });

    server.on("/numbers/list", HTTP_GET, [=](AsyncWebServerRequest *request) {
        String response;
        for(int32_t i = 0; i < program->storage.phoneNumbers.size(); i++) {
            response += program->storage.phoneNumbers[i] + "\n";
        }
        request->send(200, "text/plain", response);
    });

    server.on("/numbers/add", HTTP_GET, [=](AsyncWebServerRequest *request) {
         if(!request->hasParam("number")) {
             request->send(400);
             return;
         }
         String number = request->getParam("number")->value();
         Serial.println(number);
         program->storage.phoneNumbers.push_back(number);
         program->storage.update();
         request->send(200);
    });

    server.on("/numbers/remove", HTTP_GET, [=](AsyncWebServerRequest *request) {
        if(!request->hasParam("index")) {
            request->send(400);
            return;
        }
        int32_t i = request->getParam("index")->value().toInt();
        program->storage.phoneNumbers.clear(i);
        request->send(200);
    });

    server.on("/alarm/get", HTTP_GET, [=](AsyncWebServerRequest *request) {
        request->send(200, "text/plain", String(program->storage.alarmTemp));
    });

    server.on("/alarm/set", HTTP_GET, [=](AsyncWebServerRequest *request) {
        if(!request->hasParam("temp")) {
            request->send(400);
            return;
        }
        program->storage.alarmTemp = request->getParam("temp")->value().toInt();
        program->storage.update();
        request->send(200);
    });

    server.on("/alarm/test", HTTP_GET, [=](AsyncWebServerRequest *request) {
        program->alarm.activate();
        request->send(200);
    });

    server.on("/alarm/status", HTTP_GET, [=](AsyncWebServerRequest *request) {
        String response;
        response += (program->alarm.activated ? "true\n" : "false\n");
        if(program->alarm.activated) {
            response += program->alarm.temp + String("\n");
            response += program->alarm.time + "\n";
        }
        request->send(200, "text/plain", response);
    });

    server.onNotFound([](AsyncWebServerRequest *request) {
        request->redirect("/");
    });

    server.begin();
}

void WebServer::accept() {
    dns.processNextRequest();
}