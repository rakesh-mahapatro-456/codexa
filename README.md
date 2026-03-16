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
![Express](https://img.shields.io/badge/Express_5-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=flat-square&logo=socket.io&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=flat-square&logo=redux&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-002C61?style=flat-square&logo=cloudinary&logoColor=white)

🌐 **[Live Demo](https://codexa-tau.vercel.app)** · 🎥 **[Demo Video](https://www.youtube.com/embed/aoWtPYEPPtg)**

> ⚠️ Backend on Render free tier — first request after inactivity may take 30–60 seconds.

</div>

---

## `$ cat overview.txt`

Codexa is a gamified DSA practice platform with a **WebSocket-heavy backend** and an **automated cron job system**. The real-time layer powers live help sessions, room-based chat, and presence tracking. The progression engine (XP, streaks) runs entirely server-side. Badge and leaderboard models exist in the schema but are not yet implemented. Cron jobs auto-assign daily targets and generate daily challenges at midnight IST.

```
┌──────────────────┐     ┌──────────────────────────────────────────┐
│  Next.js 15      │     │  Express.js 5 Backend                    │
│  React 19        │◄───►│                                          │
│  Redux Toolkit   │     │  ┌────────────┐  ┌──────────────────┐   │
│  Socket.io Client│     │  │ REST API   │  │  Socket.io       │   │
│  Three.js / R3F  │     │  │ /api/user  │  │  Room mgmt       │   │
│  Framer Motion   │     │  │ /api/dsa   │  │  Presence        │   │
│  JWT Auth      │     │  │ /api/party │  │  Chat events     │   │
└──────────────────┘     │  │ /api/upload│  │  Session mgmt    │   │
                         │  └────────────┘  └──────────────────┘   │
                         │                                          │
                         │  ┌────────────────────────────────────┐ │
                         │  │  Cron Jobs (node-cron, IST)        │ │
                         │  │  dailyTarget.cron    → midnight    │ │
                         │  │  dailyChallenge.cron → midnight    │ │
                         │  └────────────────────────────────────┘ │
                         └──────────────────────────────────────────┘
                                        │
                   ┌────────────────────┼────────────────────┐
                   ▼                    ▼                    ▼
             MongoDB Atlas          Cloudinary           JWT Auth
```

---

## `$ cat backend_architecture.txt`

### MVC Structure

```
backend/src/
├── controllers/
│   ├── user.controller.js
│   ├── dsa.controller.js
│   ├── party.controller.js
│   ├── upload.controller.js
│   └── SocketManager.js        ← all Socket.io event handling
├── models/                     ← 9 Mongoose schemas
│   ├── User.js
│   ├── DSAProblem.js
│   ├── UserProblemLog.js
│   ├── DailyChallenge.js
│   ├── InstantSolveSession.js
│   ├── HelpSessionLog.js
│   ├── Badge.js
│   ├── Level.js
│   └── RandomProblem.js
├── routes/                     ← 4 route files
│   ├── user.routes.js
│   ├── dsa.routes.js
│   ├── party.routes.js
│   └── upload.routes.js
├── middlewares/
│   ├── auth.middleware.js
│   └── wrapAsync.middleware.js
└── cron/
    ├── dailyTarget.cron.js     ← assigns problems per user at midnight
    └── dailyChallenge.cron.js  ← generates 5-problem challenge daily
```

### Data Models

```
User
  ├── name, username (unique), email (unique)
  ├── passwordHash, xp, streak, problemsSolved
  ├── helpCount, dailyTarget, lastStreakDate
  ├── levelId → Level
  └── badges  → [Badge]

DSAProblem
  ├── title (unique), link, topic
  ├── difficulty, xpReward
  └── sheetName, orderInSheet

UserProblemLog              ← solve status per user per problem
  ├── user → User
  ├── problemId (polymorphic) → DSAProblem | RandomProblem
  ├── status: -1 | 0 | 1 | 2
  └── xpAwarded, solvedAt

InstantSolveSession         ← real-time help session state
  ├── userId → User
  ├── status: available | doubt | in-session | offline
  └── socketId, roomId, lastMatchedUser

HelpSessionLog              ← completed session analytics
  ├── helper → User, asker → User
  ├── roomId, duration (minutes)
  └── status, startedAt, endedAt, endedBy
```

### Problem Status System
```
-1  →  backlog  (red)
 0  →  today    (blue)  ← auto-assigned by cron at midnight
 1  →  solved   (green)
 2  →  future   (grey)
```

---

## `$ cat realtime_architecture.txt`

### Socket.IO — Room-based Chat & Help Sessions

```
Help Request Flow:
──────────────────
User A (asker)          SocketManager           User B (helper)
     │                       │                        │
     ├── askHelp ────────────┤                        │
     │                       ├── find available helper│
     │                       ├── create roomId        │
     │                       ├── update sessions      │
     │                       ├── emit "matched" ───────┤
     ├── matched ────────────┤                        │
     ├── join-room ──────────┤                        ├── join-room
     └──────────── Chat session active ───────────────┘

Room ID format: userId_helperId_timestamp

Socket Events:
  join-room         →  validate + enter private room
  send-message      →  broadcast text/file to room
  receive-message   →  incoming message handler
  typing            →  typing indicator broadcast
  end-session       →  terminate + update HelpSessionLog
  disconnect        →  cleanup InstantSolveSession
```

### Cron Job System

```
Midnight IST — dailyTarget.cron.js
  ├── query all users
  ├── select unsolved problems per user
  ├── set status: 0 (today's target)
  └── create UserProblemLog entries

Midnight IST — dailyChallenge.cron.js
  ├── select 5 random problems
  └── create DailyChallenge { date, randomProblemIds }
```

---

## `$ cat api_reference.txt`

### User
```
POST  /api/user/signup           →  register + bcrypt hash
POST  /api/user/login            →  validate + JWT
GET   /api/user/user-info        →  profile + stats
PUT   /api/user/update-user      →  update profile
PUT   /api/user/update-password  →  change password
```

### DSA
```
GET   /api/dsa/dsa-problems             →  full problem library
GET   /api/dsa/targeted-dsa-problems    →  user's daily targets
GET   /api/dsa/daily-challenge          →  today's 5-problem challenge
POST  /api/dsa/mark-problem-as-solved   →  solve + award XP
GET   /api/dsa/streak                   →  streak data
GET   /api/dsa/daily-progress           →  today's completion stats
```

### Party
```
POST  /api/party/set-status          →  set availability
POST  /api/party/ask-help            →  request a helper
POST  /api/party/end-session         →  terminate session
GET   /api/party/session-stats       →  help session analytics
GET   /api/party/available-helpers   →  list of available users
```

### Upload
```
POST  /api/upload                    →  file → Cloudinary → URL
```

---

## `$ cat frontend_architecture.txt`

```
Next.js 15.4.5 + React 19
Redux Toolkit       →  centralized store, async thunks, normalized state
Socket.io Client    →  real-time events
JWT (custom)         →  authentication
Three.js + R3F + Rapier  →  3D visualizations
Framer Motion       →  animations
shadcn/ui + Radix UI →  accessible components (33 UI + 31 custom)
Tailwind CSS 4.0    →  styling

frontend/src/
├── components/
│   ├── ui/        # 33 reusable shadcn/ui components
│   ├── custom/    # 31 business components
│   └── magicui/   # 10 animation components
├── pages/
│   ├── DSA/       # problem solving interface
│   ├── chat/      # real-time chat
│   ├── party/     # collaboration sessions
│   └── settings/  # user preferences
└── store/
    └── feature/
        ├── auth/   dsa/   party/   upload/
```

---

## `$ cat stack.txt`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  BACKEND                                                        │
│  Node.js (ES modules) · Express.js 5                           │
│  MongoDB + Mongoose   →  9 data models                         │
│  Socket.io            →  rooms, presence, events               │
│  JWT + bcrypt         →  auth + password hashing               │
│  Cloudinary + Multer  →  file upload pipeline                  │
│  node-cron            →  daily automation (IST timezone)       │
│                                                                 │
│  FRONTEND                                                       │
│  Next.js 15 + React 19 · Redux Toolkit                         │
│  Socket.io Client · JWT Auth                                  │
│  Three.js + React Three Fiber + Rapier  →  3D                  │
│  Framer Motion · shadcn/ui · Tailwind CSS 4                    │
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
Not required
```

### Install
```bash
git clone https://github.com/rakesh-mahapatro-456/codexa.git
cd codexa

npm install
cd client && npm install && cd ..
```

### Backend `.env`
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
npm run dev      # client + server concurrently

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
