import { createSlice } from "@reduxjs/toolkit";
import {
  signupUser,
  loginUser,
  getUserInfo,
  updateUser,
  updatePassword,
  dailyProgress,
  getStreak,
} from "./authThunk";

const initialState = {
  user: null,
  isAuthenticated: false,
  streakDates: [],
  token: null,
  message: "",
  loading: false,
  error: null,
  // Real-time data that gets updated via sockets
  dailyProgressData: {
    solvedToday: 0,
    xpToday: 0,
    goal: 5
  },
  // Track if data is loaded to avoid unnecessary API calls
  dataLoaded: {
    user: false,
    dailyProgress: false,
    streakDates: false
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // Clean up localStorage first
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      // IMPORTANT: Don't return new state, modify existing state
      state.user = null;
      state.isAuthenticated = false;
      state.streakDates = [];
      state.token = null;
      state.message = "";
      state.loading = false;
      state.error = null;
      state.dailyProgressData = {
        solvedToday: 0,
        xpToday: 0,
        goal: 5
      };
      state.dataLoaded = {
        user: false,
        dailyProgress: false,
        streakDates: false
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = "";
    },
    setTokenFromStorage: (state, action) => {
      console.log("Setting token from storage:", !!action.payload);
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false; // Important: Set loading to false when token is set
    },
    
    // Add this new reducer to handle case when no token exists
    clearAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.loading = false; // This is crucial
      state.error = null;
      state.dataLoaded = {
        user: false,
        dailyProgress: false,
        streakDates: false
      };
    },
    
    // Real-time socket updates
    updateUserStatsRealtime: (state, action) => {
      const { xp, levelId, problemsSolved, streak } = action.payload;
      if (state.user) {
        state.user.xp = xp;
        state.user.levelId = levelId;
        state.user.problemsSolved = problemsSolved;
        state.user.streak = streak;
      }
    },
    
    updateDailyProgressRealtime: (state, action) => {
      const { solvedToday, xpToday, goal } = action.payload;
      state.dailyProgressData = {
        solvedToday,
        xpToday,
        goal
      };
    },
    
    // Mark data as loaded
    markDataLoaded: (state, action) => {
      const { type } = action.payload;
      if (state.dataLoaded[type] !== undefined) {
        state.dataLoaded[type] = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // ✅ Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        console.log("Signup fulfilled:", action.payload);
        state.loading = false; // Make sure this is set
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.dataLoaded.user = true;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ✅ Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.dataLoaded.user = true;
        if (typeof window !== "undefined") {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // ✅ Get User Info - UPDATED
      .addCase(getUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfo.fulfilled, (state, action) => {
        console.log("GetUserInfo fulfilled:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
        state.dataLoaded.user = true;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserInfo.rejected, (state, action) => {
        console.log("GetUserInfo rejected:", action.payload);
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.dataLoaded.user = false;
        state.error = action.payload;
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      })

      // ✅ Daily Progress (initial load only)
      .addCase(dailyProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(dailyProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyProgressData = action.payload.data;
        state.dataLoaded.dailyProgress = true;
      })
      .addCase(dailyProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Streak (initial load only)
      .addCase(getStreak.pending, (state) => {
        state.loading = true;
      })
      .addCase(getStreak.fulfilled, (state, action) => {
        state.loading = false;
        state.streakDates = action.payload;
        state.dataLoaded.streakDates = true;
      })
      .addCase(getStreak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.message;
      })

      // ✅ Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.message = action.payload.message;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload.message;
      });
  },
});

// Export actions
export const {
  logout,
  clearError,
  clearMessage,
  setTokenFromStorage,
  clearAuthState,
  updateUserStatsRealtime,
  updateDailyProgressRealtime,
  markDataLoaded
} = authSlice.actions;

export default authSlice.reducer;