import axiosInstance from "@/config/axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signupUser = createAsyncThunk(
    "auth/signupUser", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/signup", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Signup failed");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/loginUser", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/login", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Login failed");
        }
    }
);


export const getUserInfo = createAsyncThunk(
    "auth/getUserInfo", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/user/user-info");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to get user info");
        }
    }
);


export const updateUser = createAsyncThunk(
    "auth/updateUser", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/user/update-user", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to update user");
        }
    }
);


export const updatePassword = createAsyncThunk(
    "auth/updatePassword", 
    async (user, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put("/user/update-password", user);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to update password");
        }
    }
);


export const dailyProgress = createAsyncThunk(
    "auth/dailyProgress", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/dsa/daily-progress");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to get daily progress");
        }
    }
);

export const getStreak = createAsyncThunk(
    "auth/getStreak", 
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/dsa/streak");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to get streak");
        }
    }
);
    