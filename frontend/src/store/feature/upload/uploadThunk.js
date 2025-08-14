import axiosInstance from "@/config/axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const uploadFile = createAsyncThunk(
    "upload/uploadFile", 
    async (file, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/upload", file);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Failed to upload file");
        }
    }
);
    