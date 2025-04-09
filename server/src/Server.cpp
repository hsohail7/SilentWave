// src/Server.cpp
#include "Server.hpp"
#include "Auth.hpp"
#include <boost/asio.hpp>
#include <iostream>
#include <sstream>
#include <thread>

// Global references for SSE
std::mutex Server::sseMutex_;
std::vector<std::shared_ptr<Server::SSEClient>> Server::sseClients_;

static HttpRequest readRequest(boost::asio::ip::tcp::socket& socket);

//-------------------------------------
// The "bridge" so that Auth can broadcast new messages
void broadcastNewMessage(const std::string &jsonMsg) {
    Server::broadcastToAllSSE(jsonMsg);
}
//-------------------------------------

struct HttpResponse {
    int status = 200;
    std::string body;
    std::string contentType = "application/json";
};

// SSE responses must have contentType = text/event-stream, and never close
// We'll handle that separately

// Write a normal HTTP response with CORS
static void writeResponse(boost::asio::ip::tcp::socket& socket, const HttpResponse& resp) {
    std::ostringstream responseStream;
    responseStream << "HTTP/1.1 " << resp.status << " OK\r\n"
                   << "Content-Type: " << resp.contentType << "\r\n"
                   << "Access-Control-Allow-Origin: *\r\n"
                   << "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                   << "Access-Control-Allow-Headers: Content-Type, Authorization\r\n"
                   << "Connection: close\r\n"
                   << "Content-Length: " << resp.body.size() << "\r\n\r\n"
                   << resp.body;

    boost::asio::write(socket, boost::asio::buffer(responseStream.str()));
}

// Handle SSE handshake
static void writeSSEHandshake(boost::asio::ip::tcp::socket& socket) {
    std::ostringstream responseStream;
    responseStream << "HTTP/1.1 200 OK\r\n"
                   << "Content-Type: text/event-stream\r\n"
                   << "Cache-Control: no-cache\r\n"
                   << "Connection: keep-alive\r\n"
                   << "Access-Control-Allow-Origin: *\r\n"
                   << "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
                   << "Access-Control-Allow-Headers: Content-Type, Authorization\r\n\r\n";

    boost::asio::write(socket, boost::asio::buffer(responseStream.str()));
}

//------------------------------------
// SSE Broadcasting
//------------------------------------
void Server::broadcastToAllSSE(const std::string& msg) {
    // Build an SSE event: "data: { ... }\n\n"
    std::string ssePayload = "data: " + msg + "\n\n";

    std::lock_guard<std::mutex> lock(sseMutex_);
    for (auto &client : sseClients_) {
        if (!client->open) continue;
        try {
            boost::asio::write(*(client->socket), boost::asio::buffer(ssePayload));
        } catch (...) {
            client->open = false;
        }
    }
}

Server::Server(boost::asio::io_context& io, unsigned short port)
  : io_(io),
    acceptor_(io, boost::asio::ip::tcp::endpoint(boost::asio::ip::tcp::v4(), port))
{
}

void Server::start() {
    doAccept();
}

void Server::doAccept() {
    auto socket = std::make_shared<boost::asio::ip::tcp::socket>(io_);
    acceptor_.async_accept(*socket, [this, socket](const boost::system::error_code& ec){
        if (!ec) {
            {
                std::lock_guard<std::mutex> lock(connectionsMutex_);
                connections_.push_back(socket);
            }
            std::thread(&Server::handleConnection, this, socket).detach();
        }
        doAccept();
    });
}

// Minimal naive parser for HTTP request
struct HttpRequest {
    std::string method;
    std::string path;
    std::string body;
    std::string authorization;
};

static HttpRequest readRequest(boost::asio::ip::tcp::socket& socket) {
    HttpRequest req;
    boost::asio::streambuf buffer;
    boost::asio::read_until(socket, buffer, "\r\n\r\n");

    std::istream stream(&buffer);
    std::string httpVersion;
    stream >> req.method >> req.path >> httpVersion;

    // read headers
    std::string line;
    std::getline(stream, line); 
    while(std::getline(stream, line)) {
        if(line == "\r" || line.empty()) break;
        if(line.rfind("Authorization:", 0) == 0) {
            // e.g. "Authorization: Bearer XYZ"
            size_t pos = line.find("Bearer ");
            if(pos != std::string::npos) {
                req.authorization = line.substr(pos + 7);
                if(!req.authorization.empty() && req.authorization.back() == '\r') {
                    req.authorization.pop_back();
                }
            }
        }
    }
    // body leftover
    if (stream.rdbuf()->in_avail() > 0) {
        std::ostringstream oss;
        oss << stream.rdbuf();
        req.body = oss.str();
    }
    return req;
}


void Server::handleConnection(std::shared_ptr<boost::asio::ip::tcp::socket> socket) {
    try {
        HttpRequest req = readRequest(*socket);
        HttpResponse resp;
        Auth auth;

        // 1) Handle OPTIONS
        if (req.method == "OPTIONS") {
            resp.status = 200;
            resp.body = "";
            writeResponse(*socket, resp);
            socket->close();
            return;
        }

        // 2) Check routes
        if (req.path == "/api/signup" && req.method == "POST") {
            resp.body = auth.handleSignup(req.body);
            writeResponse(*socket, resp);
        }
        else if (req.path == "/api/login" && req.method == "POST") {
            resp.body = auth.handleLogin(req.body);
            writeResponse(*socket, resp);
        }
        else if (req.path == "/api/messages" && req.method == "POST") {
            resp.body = auth.handleCreateMessage(req.body);
            writeResponse(*socket, resp);
        }
        else if (req.path == "/api/messages" && req.method == "GET") {
            resp.body = auth.handleGetMessages();
            writeResponse(*socket, resp);
        }
        else if (req.path == "/api/user" && req.method == "GET") {
            resp.body = auth.handleGetUser(req.authorization);
            writeResponse(*socket, resp);
        }
        else if (req.path == "/api/upload" && req.method == "POST") {
            resp.body = auth.handleFileUpload(req.body, req.authorization);
            writeResponse(*socket, resp);
        }
        else if (req.path == "/api/sse" && req.method == "GET") {
            // SSE endpoint
            // 1) Start SSE handshake
            writeSSEHandshake(*socket);

            // 2) Add to SSE clients
            auto client = std::make_shared<SSEClient>();
            client->socket = socket;
            client->open = true;

            {
                std::lock_guard<std::mutex> lock(sseMutex_);
                sseClients_.push_back(client);
            }

            // 3) Keep the connection open - we can do a keep-alive loop
            // Typically you'd do this in async code, but we can block here in a thread.
            while(client->open) {
                // If you want to do periodic keep-alive pings, you can do something like:
                // std::string ping = ":keep-alive\n\n";
                // boost::asio::write(*(client->socket), boost::asio::buffer(ping));
                // Then sleep a bit:
                std::this_thread::sleep_for(std::chrono::seconds(30));
            }

            // exit, close socket
            socket->close();
        }
        else {
            resp.status = 404;
            resp.body   = "{\"error\":\"Not Found\"}";
            writeResponse(*socket, resp);
        }
    } catch(std::exception &e) {
        std::cerr << "Exception in handleConnection: " << e.what() << std::endl;
    }
    socket->close();
}
