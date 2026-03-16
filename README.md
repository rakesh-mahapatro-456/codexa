<div align="center">

```
 ██████╗ ██████╗ ██████╗ ███████╗██╗  ██╗ █████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝╚██╗██╔╝██╔══██╗
██║     ██║   ██║██║  ██║█████╗   ╚███╔╝ ███████║
██║     ██║   ██║██║  ██║██╔══╝   ██╔██╗ ██╔══██║
╚██████╗╚██████╔╝██████╔╝███████╗██╔╝ ██╗██║  ██║
 ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
```

**Real-time collaborative DSA practice platform**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-002C61?style=flat-square&logo=cloudinary&logoColor=white)

🌐 **[Live Demo](https://codexa-tau.vercel.app)** · 🎥 **[Demo Video](https://www.youtube.com/embed/aoWtPYEPPtg)**

> ⚠️ Backend on Render free tier — first request after inactivity may take 30–60 seconds.

</div>

---

## `$ cat overview.txt`

Codexa is a gamified DSA practice platform built around a **WebSocket-heavy backend**. The real-time layer is the core product — presence tracking, live chat, file sharing, and collaborative problem solving all run through Socket.IO. The progression system (XP, streaks, badges, leaderboard) is computed entirely server-side.

```
  Client A ──────►                     ┌──────────────────────────┐
  Client B ──────► Socket.IO Server    │  Room Management         │
  Client C ──────►   (event loop)  ───►│  Presence tracking       │
                                       │  Message broadcasting     │
                                       │  File share via WS        │
                                       └──────────────────────────┘
                                                   │
                                       ┌──────────────────────────┐
                                       │  XP & Progression Engine │
                                       │  Streak calculation      │
                                       │  Level threshold logic   │
                                       │  Badge unlock triggers   │
                                       │  Leaderboard ranking     │
                                       └──────────────────────────┘
                                                   │
                                       ┌──────────────────────────┐
                                       │  Cloudinary Pipeline     │
                                       │  File/image ingestion    │
                                       │  URL metadata → MongoDB  │
                                       └──────────────────────────┘
```

---

## `$ cat features.txt`

### ⚡ Real-time Collaboration (Socket.IO)
```
Events:
  join_room       →  user joins collaborative session
  leave_room      →  presence update broadcast to room
  send_message    →  message + file broadcast to all room members
  problem_update  →  shared problem state synced across clients
  typing          →  typing indicators per room
```
- Room architecture with presence tracking — who's online, who's typing
- File sharing via WebSocket — images, PDFs, code snippets
- Collaborative problem solving — shared state across all room members

### 🧠 DSA Practice
- Curated problem set with topic-wise organization
- Difficulty filtering — Easy, Medium, Hard
- Progress tracking — mark problems solved to earn XP
- Personalized recommendations based on progress

### 🎮 Server-side Progression Engine
```
Solve problem → XP awarded → check level threshold
                                    │
                    ┌───────────────┴───────────────┐
                  Level up                    Check streak
                  Badge unlock                Calendar update
                  Leaderboard update          Streak badge trigger
```
- XP calculation, level thresholds, badge unlock logic — all server-side
- Daily streak tracking with interactive calendar view
- Global leaderboard with real-time ranking updates

### 🔐 Auth & Security
- JWT stored in httpOnly cookies — prevents XSS token theft
- bcrypt password hashing
- Protected REST API routes with middleware

---

## `$ cat stack.txt`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  BACKEND                                                        │
│  Node.js · Express    →  REST API + WebSocket server           │
│  Socket.IO            →  real-time rooms, events, presence     │
│  MongoDB + Mongoose   →  data modeling, progress tracking      │
│  JWT (httpOnly)       →  stateless auth                        │
│  bcrypt               →  password hashing                      │
│  Cloudinary           →  file/image upload pipeline            │
│                                                                 │
│  FRONTEND                                                       │
│  React · Redux Toolkit →  state management                     │
│  Tailwind CSS          →  styling                              │
│                                                                 │
│  DEPLOYMENT                                                     │
│  Frontend  →  Vercel                                           │
│  Backend   →  Render                                           │
│  Database  →  MongoDB Atlas                                    │
│  Files     →  Cloudinary                                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## `$ ls -la screenshots/`

<div align="center">
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238427/Screenshot_2025-08-15_at_10.55.52_drpxrh.png" width="280" style="margin:8px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238428/Screenshot_2025-08-15_at_10.58.13_ewbygd.png" width="280" style="margin:8px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238428/Screenshot_2025-08-15_at_10.58.23_q8ebr2.png" width="280" style="margin:8px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238429/Screenshot_2025-08-15_at_10.58.30_tlvpro.png" width="280" style="margin:8px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238430/Screenshot_2025-08-15_at_10.58.51_zn5eo6.png" width="280" style="margin:8px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238429/Screenshot_2025-08-15_at_10.58.42_zjxic2.png" width="280" style="margin:8px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238431/Screenshot_2025-08-15_at_11.04.15_be8ruv.png" width="280" style="margin:8px"/>
</div>

---

## `$ cat setup.txt`

### Prerequisites
```
Node.js v14+
MongoDB database
Cloudinary account
```

### Install
```bash
git clone https://github.com/rakesh-mahapatro-456/codexa.git
cd codexa

# Server dependencies
npm install

# Client dependencies
cd client && npm install && cd ..
```

### Environment
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Run
```bash
npm run dev      # both client + server

npm run server   # backend only  → http://localhost:5000
npm run client   # frontend only → http://localhost:3000
```

---

<div align="center">

```
$ echo $BUILT_FOR
  the coding community · built with ❤️
```

</div>
