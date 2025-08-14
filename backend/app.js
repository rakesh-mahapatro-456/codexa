import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { createServer } from "node:http";
import './src/cron/dailyChallenge.cron.js'
import './src/cron/dailyTarget.cron.js'
import { connectToSocket } from "./src/controllers/SocketManager.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import partyRoutes from "./src/routes/party.routes.js";
import dsaRoutes from "./src/routes/dsa.routes.js";
import userRoutes from "./src/routes/user.routes.js";

dotenv.config();

const app = express(); 
const server = createServer(app); 
const io = connectToSocket(server); 

app.use(cors());
app.use(express.json());

//routes
app.use('/api', uploadRoutes);
app.use('/api/party', partyRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/user', userRoutes);

// ⛔️ Global error handler - must be at the end
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const start = async()=>{
    const connectDB = await mongoose.connect(process.env.MONGO_URI);

    server.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
        console.log("Connected to MongoDB:", connectDB.connection.host);
    })
}

start();