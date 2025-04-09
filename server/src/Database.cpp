#include "Database.hpp"
#include <iostream>

Database::Database() : conn_(nullptr) {}

Database::~Database() {
    disconnect();
}

bool Database::connect(const std::string &conninfo) {
    conn_ = PQconnectdb(conninfo.c_str());
    if (PQstatus(conn_) != CONNECTION_OK) {
        std::cerr << "Database connection failed: " << PQerrorMessage(conn_) << std::endl;
        return false;
    }
    std::cout << "Database connected successfully." << std::endl;
    return true;
}

void Database::disconnect() {
    if (conn_) {
        PQfinish(conn_);
        conn_ = nullptr;
    }
}

PGresult* Database::executeQuery(const std::string& query) {
    if (!conn_) {
        std::cerr << "Database not connected.\n";
        return nullptr;
    }
    PGresult* res = PQexec(conn_, query.c_str());
    if (PQresultStatus(res) != PGRES_TUPLES_OK
        && PQresultStatus(res) != PGRES_COMMAND_OK)
    {
        std::cerr << "Query execution failed: " << PQerrorMessage(conn_) << std::endl;
    }
    return res;
}
