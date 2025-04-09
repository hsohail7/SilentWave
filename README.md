# SilentWave Setup Checklist

1. Clone the repo
   - git clone https://github.com/hsohail7/SilentWave.git
   - cd SilentWave

2. Run the React Frontend
   - cd client
   - npm install
   - npm start
   - Visit: http://localhost:3000

3. Build the C++ Server
   - cd server
   - mkdir build && cd build
   - cmake .. -DCMAKE_TOOLCHAIN_FILE=C:/vcpkg/scripts/buildsystems/vcpkg.cmake
   - cmake --build . --config Release
   - .\Release\SilentWaveServer.exe

4. Set Up PostgreSQL Database
   - CREATE DATABASE "3313";
   - \c 3313
   - Run these SQL queries:

     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(255) UNIQUE NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password_hash TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

     CREATE TABLE messages (
       id SERIAL PRIMARY KEY,
       sender_id INTEGER REFERENCES users(id),
       content TEXT NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
     ```

   - Check DB config in: `server/src/Auth.cpp`
     - Make sure it has:
       `host=localhost port=5432 user=postgres password=123 dbname=3313`

5. App Flow
   - Go to `/signup` → create account
   - Login at `/login` → stores token in localStorage
   - View user info at `/profile`
   - Start chatting on `/chat` → see live messages

