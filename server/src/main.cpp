#include "Server.hpp"
#include <boost/asio.hpp>
#include <iostream>
#include <thread>
#include <vector>

int main() {
    try {
        boost::asio::io_context io_context;
        unsigned short port = 8080;

        Server server(io_context, port);
        server.start();

        // thread pool
        unsigned int threadCount = std::thread::hardware_concurrency();
        if(threadCount == 0) threadCount = 2;

        std::vector<std::thread> threads;
        threads.reserve(threadCount);

        for(unsigned int i=0; i<threadCount; ++i) {
            threads.emplace_back([&io_context](){
                io_context.run();
            });
        }

        std::cout << "SilentWave Server running on port " << port
                  << " with " << threadCount << " threads.\n";

        for(auto &t : threads) {
            t.join();
        }
    } catch(std::exception &e) {
        std::cerr << "Exception in main: " << e.what() << std::endl;
    }
    return 0;
}
