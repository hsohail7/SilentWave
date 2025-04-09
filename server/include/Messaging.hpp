#pragma once
#include <string>

class Messaging {
public:
    std::string encrypt(const std::string& msg) { return msg; }
    std::string decrypt(const std::string& cipher) { return cipher; }
};
