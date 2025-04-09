// src/Auth.cpp
#include "Auth.hpp"
#include <nlohmann/json.hpp>
#include <sstream>
#include <ctime>
#include <fstream>
#include <iostream>

using json = nlohmann::json;

// ... existing code omitted for brevity

// Quick base64 decode (naive). In real code, use a robust library:
static const std::string base64_chars =
             "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
             "abcdefghijklmnopqrstuvwxyz"
             "0123456789+/";

static inline bool is_base64(unsigned char c) {
    return (isalnum(c) || (c == '+') || (c == '/'));
}
std::string Auth::base64Decode(const std::string &encoded) {
    // A minimal example that does not handle all errors
    int in_len = (int)encoded.size();
    int i = 0, j = 0;
    int in_ = 0;
    unsigned char char_array_4[4], char_array_3[3];
    std::string ret;

    while (in_len-- && ( encoded[in_] != '=') && is_base64(encoded[in_])) {
        char_array_4[i++] = encoded[in_]; in_++;
        if (i ==4) {
            for (i = 0; i <4; i++)
                char_array_4[i] = (unsigned char)base64_chars.find(char_array_4[i]);

            char_array_3[0] = (unsigned char) (( char_array_4[0] << 2       ) + ((char_array_4[1] & 0x30) >> 4));
            char_array_3[1] = (unsigned char) (((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2));
            char_array_3[2] = (unsigned char) (((char_array_4[2] & 0x3) << 6) +   char_array_4[3]);

            for (i = 0; i < 3; i++)
                ret += char_array_3[i];
            i = 0;
        }
    }

    if (i) {
        for (int k = i; k <4; k++) {
            char_array_4[k] = 0;
        }
        for (int k = 0; k <4; k++) {
            char_array_4[k] = (unsigned char) base64_chars.find(char_array_4[k]);
        }
        char_array_3[0] = (unsigned char) (( char_array_4[0] << 2       ) + ((char_array_4[1] & 0x30) >> 4));
        char_array_3[1] = (unsigned char) (((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2));
        char_array_3[2] = (unsigned char) (((char_array_4[2] & 0x3) << 6) +   char_array_4[3]);
        for (int k = 0; k < i - 1; k++) ret += char_array_3[k];
    }
    return ret;
}

// -------------- /api/upload --------------
std::string Auth::handleFileUpload(const std::string &requestBody, const std::string &token)
{
    // parse user from token
    int userId = parseUserIdFromToken(token);
    if (userId < 1) {
        return R"({"error":"Invalid token"})";
    }

    // parse JSON to get fileData
    std::string fileData = parseJsonField(requestBody, "fileData");
    if (fileData.empty()) {
        return R"({"error":"No fileData provided"})";
    }

    // fileData might look like "data:image/png;base64,iVBORw0KGgo..."
    // We should strip the prefix "data:xxxxxx;base64,"
    const std::string base64prefix = ";base64,";
    auto pos = fileData.find(base64prefix);
    if (pos == std::string::npos) {
        return R"({"error":"Invalid base64 data format"})";
    }
    // move past the prefix
    std::string encodedPart = fileData.substr(pos + base64prefix.size());

    // decode
    std::string decodedBinary = base64Decode(encodedPart);
    if (decodedBinary.empty()) {
        return R"({"error":"Failed to decode base64"})";
    }

    // Save the file to disk for demonstration; e.g. /tmp/upload_<userId>.png
    // For a real system, you'd store in a unique path or S3, etc.
#if defined(_WIN32)
    std::string filename = "C:\\temp\\upload_" + std::to_string(userId) + ".png";
#else
    std::string filename = "/tmp/upload_" + std::to_string(userId) + ".png";
#endif
    std::ofstream out(filename, std::ios::binary);
    out.write(decodedBinary.data(), decodedBinary.size());
    out.close();

    // Return something
    std::ostringstream oss;
    oss << R"({"message":"File uploaded","path":")" << filename << "\"}";
    return oss.str();
}


// -------------- /api/messages POST --------------
std::string Auth::handleCreateMessage(const std::string& requestBody) {
    // (same as your original code, then broadcast below)
    // parse out senderId, content

    int senderId = -1;
    std::string content = "";

    try {
        auto parsed = json::parse(requestBody);
        if(parsed.contains("senderId")) {
            senderId = parsed["senderId"].get<int>();
        }
        if(parsed.contains("content")) {
            content = parsed["content"].get<std::string>();
        }
    } catch (...) {
        return "{\"error\":\"JSON parse error\"}";
    }

    if (senderId < 1 || content.empty()) {
        return "{\"error\":\"Missing fields or invalid senderId\"}";
    }

    // Insert into DB (same as before)
    std::ostringstream query;
    query << "INSERT INTO messages (sender_id, content) VALUES ("
          << senderId << ", '" << content << "') RETURNING id, sender_id, content, created_at;";
    auto res = db_.executeQuery(query.str());
    if (!res || PQntuples(res) < 1) {
        if(res) PQclear(res);
        return "{\"error\":\"Insert message failed\"}";
    }

    int msgId = std::stoi(PQgetvalue(res, 0, 0));
    int sId   = std::stoi(PQgetvalue(res, 0, 1));
    std::string msgContent = PQgetvalue(res, 0, 2);
    std::string createdAt   = PQgetvalue(res, 0, 3);
    PQclear(res);

    // Build JSON for the newly created message
    std::ostringstream resp;
    resp << "{\"id\":" << msgId
         << ",\"sender_id\":" << sId
         << ",\"content\":\"" << msgContent << "\""
         << ",\"created_at\":\"" << createdAt << "\"}";

    // >>> BROADCAST via SSE <<<
    broadcastNewMessage(resp.str());

    return resp.str();
}
