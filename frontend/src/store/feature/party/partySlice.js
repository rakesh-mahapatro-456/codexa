import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { askHelp, updateStatus, endSession } from './partyThunk';

const initialState = {
  status: 'idle', // 'idle' | 'matching' | 'matched' | 'in-session' | 'error'
  roomId: null,
  sessionDuration: 0,
  participants: [],
  error: null,
  isLoading: false,
  currentSession: null,
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {
    resetPartyState: () => ({ ...initialState }),
    setPartyStatus: (state, action) => {
      state.status = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setSessionDuration: (state, action) => {
      state.sessionDuration = action.payload;
    },
    setParticipants: (state, action) => {
      state.participants = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'error';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // askHelp
    builder.addCase(askHelp.pending, (state) => {
      state.isLoading = true;
      state.status = 'matching';
      state.error = null;
    });
    builder.addCase(askHelp.fulfilled, (state, action) => {
      state.isLoading = false;
      state.status = 'in-session';
      state.roomId = action.payload.roomId;
      state.sessionDuration = action.payload.duration || 0;
      state.currentSession = {
        roomId: action.payload.roomId,
        helperId: action.payload.helperId || null,
        matchedAt: action.payload.matchedAt || Date.now(),
      };
    
      if (action.payload.currentUserId && action.payload.helperId) {
        state.participants = [
          { _id: action.payload.currentUserId },
          { _id: action.payload.helperId }
        ];
      } else {
        state.participants = [];
      }
    });
    
    builder.addCase(askHelp.rejected, (state, action) => {
      state.isLoading = false;
      state.status = 'error';
      state.error = action.payload || 'Failed to find a match';
    });

    // updateStatus
    builder.addCase(updateStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      if (action.payload.status) {
        state.status = action.payload.status;
      }
      if (action.payload.session) {
        state.currentSession = {
          ...state.currentSession,
          ...action.payload.session,
        };
      }
    });
    builder.addCase(updateStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.status = 'error';
      state.error = action.payload || 'Failed to update status';
    });

    // endSession
    builder.addCase(endSession.fulfilled, () => {
      return { ...initialState };
    });
  },
});


export const { 
  resetPartyState, 
  setPartyStatus, 
  setRoomId, 
  setSessionDuration, 
  setParticipants, 
  setError, 
  clearError 
} = partySlice.actions;

export default partySlice.reducer;