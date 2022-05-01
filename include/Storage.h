#pragma once
#include <Preferences.h>
#include <QList.h>

class Storage {

public:
    void begin();
    void update();
    QList<String> phoneNumbers;
    int32_t alarmTemp;

private:
    Preferences prefs;

};