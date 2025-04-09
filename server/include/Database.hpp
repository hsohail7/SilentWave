#pragma once
#include <string>
#include <libpq-fe.h>

class Database {
public:
    Database();
    ~Database();

    bool connect(const std::string &conninfo);
    void disconnect();

    PGresult* executeQuery(const std::string& query);

private:
    PGconn* conn_;
};
