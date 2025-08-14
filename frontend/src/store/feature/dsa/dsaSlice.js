import { createSlice } from "@reduxjs/toolkit";
import { getDsaProblems, getTargetedDsaProblems, getDailyChallenge } from "./dsaThunk";

const initialState = {
  problems: {},
  targetedProblems: {
    solvedToday: [],
    unsolvedToday: [],
    backlog: []
  },
  dailyChallenge: [],
  loading: false,
  error: null,
  message: null,
  // Track loaded data
  dataLoaded: {
    problems: false,
    targetedProblems: false,
    dailyChallenge: false
  }
};

const dsaSlice = createSlice({
  name: "dsa",
  initialState,
  reducers: {
    reset: () => initialState,
    
    // Real-time problem status updates
    updateProblemStatusRealtime: (state, action) => {
      const { problemId, problemModel, status } = action.payload;
      
      // Update in main problems (grouped by topic)
      for (const topic in state.problems) {
        const problemIndex = state.problems[topic].findIndex(p => p._id === problemId);
        if (problemIndex !== -1) {
          state.problems[topic][problemIndex].status = status;
          break;
        }
      }

      // Update in targeted problems
      ['solvedToday', 'unsolvedToday', 'backlog'].forEach(category => {
        const problemIndex = state.targetedProblems[category].findIndex(p => p._id === problemId);
        if (problemIndex !== -1) {
          state.targetedProblems[category][problemIndex].status = status;
        }
      });

      // Update in daily challenge (for RandomProblem)
      if (problemModel === "RandomProblem") {
        const problemIndex = state.dailyChallenge.findIndex(p => p._id === problemId);
        if (problemIndex !== -1) {
          state.dailyChallenge[problemIndex].status = status;
        }
      }
    },
    
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get DSA Problems - Load once
      .addCase(getDsaProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload.data || {};
        state.dataLoaded.problems = true;
      })
      
      // Get Targeted Problems - Load once  
      .addCase(getTargetedDsaProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.targetedProblems = action.payload.data || state.targetedProblems;
        state.dataLoaded.targetedProblems = true;
      })
      
      // Get Daily Challenge - Load once
      .addCase(getDailyChallenge.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyChallenge = action.payload || [];
        state.dataLoaded.dailyChallenge = true;
      });
  },
});

export const { 
  reset, 
  updateProblemStatusRealtime, 
  clearError, 
  clearMessage 
} = dsaSlice.actions;

export default dsaSlice.reducer;
