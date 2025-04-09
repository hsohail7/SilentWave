// include/Auth.hpp
#pragma once
#include <string>
#include "Database.hpp"

// Forward declare SSE broadcaster (we'll define it in Server.cpp)
void broadcastNewMessage(const std::string &jsonMsg);

class Auth {
public:
    Auth();
    std::string handleSignup(const std::string& requestBody);
    std::string handleLogin(const std::string& requestBody);
    std::string handleCreateMessage(const std::string& requestBody);
    std::string handleGetMessages();

    std::string handleGetUser(const std::string& token);

    // <--- Add new for file upload:
    std::string handleFileUpload(const std::string &requestBody, const std::string &token);

private:
    Database db_;
    std::string parseJsonField(const std::string& jsonStr, const std::string& field);
    std::string generateToken(int userId);
    int parseUserIdFromToken(const std::string& token);

    // This is a helper to decode base64 (implement a small function or use an existing library).
    std::string base64Decode(const std::string &base64Str);
};
