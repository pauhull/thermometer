#include "Storage.h"

void Storage::begin() {

    prefs.begin("storage");

    alarmTemp = prefs.getInt("alarmTemp", 35);
    String numbers = prefs.getString("numbers");

    String s;
    for(int32_t i = 0; i < numbers.length(); i++) {
        if(numbers[i] == '\n') {
            phoneNumbers.push_back(s);
            s = "";
            continue;
        }
        s += numbers[i];
        if(i == numbers.length() - 1) {
            phoneNumbers.push_back(s);
        }
    }
}

void Storage::update() {
    String s;
    for(int32_t i = 0; i < phoneNumbers.size(); i++) {
        if(s.length()) s += '\n';
        s += phoneNumbers[i];
    }
    prefs.putString("numbers", s);
    prefs.putInt("alarmTemp", alarmTemp);
}

