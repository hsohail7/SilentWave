cmake_minimum_required(VERSION 3.15)
project(SilentWaveServer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(Boost REQUIRED COMPONENTS system thread)
find_package(PostgreSQL REQUIRED)
find_package(nlohmann_json CONFIG REQUIRED)

include_directories(
    ${Boost_INCLUDE_DIRS}
    ${PostgreSQL_INCLUDE_DIRS}
    include
)

add_executable(SilentWaveServer
    src/main.cpp
    src/Server.cpp
    src/Auth.cpp
    src/Database.cpp
    src/Messaging.cpp
)

target_link_libraries(SilentWaveServer
    ${Boost_LIBRARIES}
    ${PostgreSQL_LIBRARY}
    nlohmann_json::nlohmann_json
)
