#pragma once

#include <boost/beast/websocket.hpp>
#include <boost/asio.hpp>
#include <memory>
#include <string>

/**
 * Holds a WebSocket stream + user info for broadcasting.
 */
struct WebSocketSession {
    std::shared_ptr<boost::beast::websocket::stream<boost::beast::tcp_stream>> ws;
    std::string username;
};
