import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/config/axios.config';
import { setError, clearError } from './partySlice';

export const askHelp = createAsyncThunk(
  'party/askHelp',
  async ({ duration }, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(clearError());
      const { data } = await axiosInstance.post('/party/ask-help', { duration });
      return {
        roomId: data.roomId,
        duration: data.duration || duration,
        helperId: data.helperId || null,
        currentUserId: userId,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to find a match';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const endSession = createAsyncThunk(
  'party/endSession',
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      dispatch(clearError());
      const { party } = getState();
      if (party.roomId) {
        await axiosInstance.post('/party/end-session', {
          roomId: party.roomId,
        });
      }
      return null;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to end session';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// Update user availability status
export const updateStatus = createAsyncThunk(
  'party/updateStatus',
  async ({ status, socketId, userId }, { getState, rejectWithValue, dispatch }) => {
    try {
      dispatch(clearError());

      const state = getState();
      const currentUserId = userId || state?.auth?.user?._id;
      if (!currentUserId) throw new Error('User ID is required');

      const { data } = await axiosInstance.post('/party/set-status', { 
        status,
        socketId, // optional, backend can ignore if not needed
        userId: currentUserId
      });

      if (!data.success && !data.session) {
        throw new Error(data.message || 'Failed to update status');
      }

      return {
        status,
        session: data.session || null
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ Get session statistics
export const getSessionStats = createAsyncThunk(
  'party/getSessionStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('[getSessionStats] Fetching session statistics');
      
      const response = await axiosInstance.get('/party/session-stats');

      console.log('[getSessionStats] Success:', response.data);
      return response.data.stats;
    } catch (error) {
      console.error('[getSessionStats] Error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Get available helpers count
export const getAvailableHelpers = createAsyncThunk(
  'party/getAvailableHelpers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/party/available-helpers');
      return response.data;
    } catch (error) {
      console.error('[getAvailableHelpers] Error:', error.message);
      return rejectWithValue(error.message);
    }
  }
);