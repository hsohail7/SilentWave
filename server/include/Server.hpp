// include/Server.hpp
#pragma once

#include <boost/asio.hpp>
#include <thread>
#include <memory>
#include <mutex>
#include <vector>
#include <map>

class Server {
public:
    Server(boost::asio::io_context& io, unsigned short port);
    void start();

    // We declare a static function to broadcast SSE from Auth:
    // (In a more advanced design, you might do it differently.)
    static void broadcastToAllSSE(const std::string& msg);

private:
    void doAccept();
    void handleConnection(std::shared_ptr<boost::asio::ip::tcp::socket> socket);

    boost::asio::io_context& io_;
    boost::asio::ip::tcp::acceptor acceptor_;

    // We'll store normal connections here, but for SSE we'll store them differently
    std::mutex connectionsMutex_;
    std::vector<std::shared_ptr<boost::asio::ip::tcp::socket>> connections_;

    // SSE stuff
    struct SSEClient {
        std::shared_ptr<boost::asio::ip::tcp::socket> socket;
        bool open;
    };
    static std::mutex sseMutex_;
    static std::vector<std::shared_ptr<SSEClient>> sseClients_;
};

// Provide forward declare for broadcast:
void broadcastNewMessage(const std::string &jsonMsg);
