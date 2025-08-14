import axiosInstance from "@/config/axios.config";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { updateProblemStatusRealtime } from "./dsaSlice";

// ✅ Fetch all DSA problems
export const getDsaProblems = createAsyncThunk(
  "dsa/getDsaProblems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dsa/dsa-problems");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get DSA problems");
    }
  }
);

// ✅ Fetch targeted DSA problems
export const getTargetedDsaProblems = createAsyncThunk(
  "dsa/getTargetedDsaProblems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dsa/targeted-dsa-problems");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get targeted DSA problems");
    }
  }
);

// ✅ Fetch daily challenge
export const getDailyChallenge = createAsyncThunk(
  "dsa/getDailyChallenge",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dsa/daily-challenge");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get daily challenge");
    }
  }
);

// ✅ Mark normal DSA problem as solved (optimistic update + socket will finalize)
export const markProblemAsSolved = createAsyncThunk(
  "dsa/markProblemAsSolved",
  async (problemId, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      dispatch(updateProblemStatusRealtime({
        problemId,
        problemModel: 'DSAProblem',
        status: 1 // solved
      }));

      const response = await axiosInstance.post(`/dsa/mark-problem-as-solved/${problemId}`);
      return response.data;
    } catch (error) {
      // Revert on error
      dispatch(updateProblemStatusRealtime({
        problemId,
        problemModel: 'DSAProblem',
        status: 0 // not solved
      }));
      return rejectWithValue(error.response?.data?.message || "Failed to mark problem as solved");
    }
  }
);

// ✅ Mark daily challenge problem as solved (optimistic update + socket will finalize)
export const markDailyChallengeProblemAsSolved = createAsyncThunk(
  "dsa/markDailyChallengeProblemAsSolved",
  async (problemId, { dispatch, rejectWithValue }) => {
    try {
      // Optimistic update
      dispatch(updateProblemStatusRealtime({
        problemId,
        problemModel: 'RandomProblem',
        status: 1 // solved
      }));

      const response = await axiosInstance.post(`/dsa/mark-daily-challenge-problem-as-solved/${problemId}`);
      return response.data.message;
    } catch (error) {
      // Revert on error
      dispatch(updateProblemStatusRealtime({
        problemId,
        problemModel: 'RandomProblem',
        status: 0 // not solved
      }));
      return rejectWithValue(error.response?.data?.message || "Failed to mark daily challenge problem as solved");
    }
  }
);


// ✅ Fetch daily progress
export const getDailyProgress = createAsyncThunk(
  "dsa/getDailyProgress",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/dsa/daily-progress");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get daily progress");
    }
  }
);
