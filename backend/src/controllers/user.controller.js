import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { assignDailyDSAProblems } from '../cron/dailyTarget.cron.js'; 

dotenv.config(); 

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const signup = async (req, res) => {
  const { name, email, password, username,dailyTarget,language } = req.body;

  // Validation
  if (!name || !email || !password || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    name,
    email,
    passwordHash: hashedPassword,
    username,
    dailyTarget,
    language,
  });

  // Save to DB
  await newUser.save();

  // Assign today's DSA problems for the new user
  await assignDailyDSAProblems(newUser._id);

  // Generate JWT
  const token = createToken(newUser._id);

  // Return response
  return res.status(201).json({
    message: "User registered successfully",
    token,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = createToken(user._id);

  // Return response
  return res.status(200).json({
    message: "Login successful",
    token,
  });
};

export const getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password").populate("levelId" , "name");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({ user });
};

export const updateUser = async (req, res) => {
  const { name, username, email, dailyTarget,language } = req.body;

  const user = await User.findById(req.user._id); // req.user._id comes from authMiddleware
  if (!user) return res.status(404).json({ message: "User not found" });

  // Only update if value is provided
  if (name !== undefined) user.name = name;
  if (username !== undefined) user.username = username;
  if (email !== undefined) user.email = email;
  if (dailyTarget !== undefined) user.dailyTarget = dailyTarget;
  if (language !== undefined) user.language = language;

  await user.save();

  return res.status(200).json({ message: "User updated successfully", user });
};

export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Both old and new passwords are required" });
  }

  const user = await User.findById(req.user._id); // `req.user` comes from authMiddleware
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Old password is incorrect" });
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hashedNewPassword;

  await user.save();

  return res.status(200).json({ message: "Password updated successfully" });
};


