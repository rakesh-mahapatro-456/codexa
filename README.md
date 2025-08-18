# Codexa 
> ⚠️ **Note:** The backend is hosted on [Render Free Tier](https://render.com/).  
> Since free tier instances go to sleep after periods of inactivity, the **first request may take 30–60 seconds** to wake up the server. After that, performance will be normal. 🚀  
<div align="center">
  
![Codexa Banner](https://img.shields.io/badge/Codexa-DSA%20Practice-blue?style=for-the-badge&logo=github)

**Real-time collaborative platform for practicing Data Structures & Algorithms (DSA)**

Gamify your learning with XP, levels, streaks, badges, and collaborative coding sessions.  
Solve problems, track progress, and compete with others—all in one place!

🌐 **[Live Demo](https://codexa-tau.vercel.app)**

</div>

---

## ✨ Features

### 🧠 DSA Practice
- **Curated Problems** — Personalized problem recommendations based on your progress
- **Complete DSA Sheet** — Topic-wise organization with comprehensive coverage
- **Progress Tracking** — Mark problems as solved to earn XP & unlock new levels
- **Smart Filtering** — Filter by difficulty: Easy, Medium, Hard

### 🎮 Gamified Learning
- **XP & Level System** — Earn experience points and level up as you solve problems
- **Daily Coding Streaks** — Maintain streaks with interactive calendar view
- **Badges & Achievements** — Unlock special rewards for milestones
- **Global Leaderboard** — Compete with coders worldwide

### 🤝 Real-time Collaboration
- **Instant Messaging** — Live chat with file sharing capabilities
- **File Support** — Share images, PDFs, and code snippets seamlessly
- **Collaborative Problem Solving** — Work together on challenging problems

### 🎨 Modern UI/UX
- **Fully Responsive** — Optimized for both desktop and mobile devices
- **Dock Navigation** — Intuitive dock-based navigation system
- **Theme Support** — Switch between Dark and Light modes

---

## 🛠 Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Redux](https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-002C61?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

---

## 📸 Screenshots & Demo

### Screenshots
*Highlights of Codexa :*

<div align="center">
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238427/Screenshot_2025-08-15_at_10.55.52_drpxrh.png" alt="Landing Page" width="300" style="margin:10px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238428/Screenshot_2025-08-15_at_10.58.13_ewbygd.png" alt="Homepage Dark Mode" width="300" style="margin:10px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238428/Screenshot_2025-08-15_at_10.58.23_q8ebr2.png" alt="DSA Sheet 1" width="300" style="margin:10px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238429/Screenshot_2025-08-15_at_10.58.30_tlvpro.png" alt="DSA Sheet 2" width="300" style="margin:10px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238430/Screenshot_2025-08-15_at_10.58.51_zn5eo6.png" alt="Settings Page" width="300" style="margin:10px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238429/Screenshot_2025-08-15_at_10.58.42_zjxic2.png" alt="Party Page 1" width="300" style="margin:10px"/>
  <img src="https://res.cloudinary.com/dqz5xgr5v/image/upload/v1755238431/Screenshot_2025-08-15_at_11.04.15_be8ruv.png" alt="Party Page 2" width="300" style="margin:10px"/>
</div>

### 🎥 Demo Video
*Watch a complete walkthrough of Codexa:*

[![Codexa Demo](https://img.shields.io/badge/Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](https://www.youtube.com/embed/aoWtPYEPPtg)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account (for file storage)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/codexa.git
cd codexa
```

2. **Install dependencies**
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Run the application**
```bash
# Run both client and server concurrently
npm run dev

# Or run separately
npm run server  # Backend only
npm run client  # Frontend only
```

5. **Access the application**
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`



---

<div align="center">

**Built with ❤️ for the coding community**

</div>
