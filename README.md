
# LinkerNet

LinkerNet is a local network emergency communication system designed to enable real-time chat between devices connected to the same Wi-Fi or LAN, even when internet connectivity is lost. It is ideal for use during disasters and emergency situations, allowing easy, reliable peer communication using a lightweight backend and a responsive web-based frontend.

---

## Table of Contents

- [Introduction](#introduction)  
- [Project Structure](#project-structure)  
- [How It Works](#how-it-works)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Running the Backend](#running-the-backend)  
  - [Running the Frontend](#running-the-frontend)  
- [Using LinkerNet on a Local Network](#using-linkernet-on-a-local-network)  
- [Chatting Across Devices](#chatting-across-devices)  
- [Screenshots](#screenshots)  

---

## Introduction

LinkerNet facilitates offline-first, peer-to-peer chat within a local network environment. When traditional communication channels fail during emergencies, LinkerNet allows users to connect via a local Wi-Fi or LAN, share messages in real time, and coordinate relief efforts or share vital information.

---

## Project Structure

```
LinkerNet/
├── backend/                    # Spring Boot backend service
│   ├── src/main/java/
│   │   └── com/LinkerNet/
│   │       ├── LinkerNetApplication.java         # Main Spring Boot app
│   │       ├── config/                            # Configuration (CORS, WebSocket)
│   │       ├── controller/                        # REST and WebSocket controllers
│   │       ├── model/                             # JPA entities (Message)
│   │       ├── repository/                        # Data access layer
│   │       └── service/                           # Business logic layer
│   └── resources/
│       └── application.properties                 # Application settings (DB, CORS, ports)
├── frontend/                   # React frontend app (Vite + Tailwind CSS)
│   ├── src/
│   │   └── App.jsx                               # React main component with STOMP + SockJS
│   ├── public/                                   # Public assets
│   ├── index.html                                # Root HTML
│   └── vite.config.js                            # Vite config for dev server and build
└── README.md                                   # This file
```

---

## How It Works

1. The **backend** is a Spring Boot application running as a chat server, exposing:
   - REST API to fetch chat history (`/api/messages`),
   - WebSocket endpoint `/chat` using STOMP over SockJS for real-time messaging.

2. The **frontend** is a React app that:
   - Fetches chat history on load,
   - Connects to backend WebSocket via SockJS + STOMP,
   - Sends/receives chat messages in real time,
   - Displays a modern, responsive chat UI.

3. Messages sent from any device are broadcasted to all connected devices on the same network via the local backend server.

---

## Tech Stack

- **Backend:**
  - Java with Spring Boot  
  - Spring WebSocket with STOMP messaging  
  - JPA + Hibernate + MySQL for message persistence  
  - CORS and WebSocket configuration
  
- **Frontend:**
  - React  
  - Vite development server  
  - Tailwind CSS for styling  
  - `@stomp/stompjs` client for STOMP over SockJS WebSocket support  
  - Axios for REST API calls
  
---

## Getting Started

### Running the Backend

1. Ensure you have Java 17+ and Maven installed.
2. Build the backend jar:
   ```
   mvn clean package
   ```
3. Run the backend server:
   ```
   java -jar target/disasternet-backend.jar
   ```
4. Backend listens on port 8080 by default.

---

### Running the Frontend

1. Navigate to the frontend directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server (accessible in browser):
   ```
   npm run dev
   ```
4. By default, frontend runs on port 5173.

---

## Using LinkerNet on a Local Network

1. **Connect all devices (laptop, phones, tablets) to the same Wi-Fi or LAN.**

2. **Identify your laptop's local IP address** (where backend runs):

   - On Windows: open Command Prompt, run `ipconfig`, find IPv4 address.
   - On macOS/Linux: run `ifconfig` or `ip a`, find local IP.

3. **Update frontend backend connection** in `App.jsx`:

   ```
   const backendHost = "192.168.x.y"; // Replace with your laptop's IP
   ```
   
4. **Rebuild frontend** if needed and serve it (or run dev server bound to all interfaces).

5. **Open browser on phones or other LAN devices:**

   ```
   http://192.168.x.y:5173
   ```

6. Devices will connect to the backend server running on the laptop on port 8080 and chat in real time.

---

## Chatting Across Devices

- Open the frontend page on all devices.
- Enter a nickname (optional).
- Type messages and send by pressing Enter or Send button.
- Messages appear instantly on all connected devices.
- Messages are stored persistently in the backend’s MySQL database.
- Supports offline-first experience as long as devices remain connected to the same network.

---

## Screenshots

*(Add screenshot images of your app here — replace paths with your actual screenshots)*

| Chat on Laptop                   | Chat on Mobile Browser               |
|---------------------------------|------------------------------------|
| !(resources/web.jpg) | !(resources/phone.jpg) |

---

## Contact & Support

For issues, feature requests, or contributions, please open an issue or pull request on the GitHub repository.

---

**Thank you for using LinkerNet — your reliable local network emergency chat!**

## By Shivam Kumar / Shivammiyyy
