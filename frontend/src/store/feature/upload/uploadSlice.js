// features/upload/uploadSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { uploadFile } from "./uploadThunk";

const initialState = {
  uploading: false,
  uploadType: null,           // "chat" or "avatar"
  uploadedFileUrl: null,      // returned URL
  error: null,
};

const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    startUpload: (state, action) => {
      state.uploading = true;
      state.uploadType = action.payload; // 'chat' or 'avatar'
      state.error = null;
      state.uploadedFileUrl = null;
    },
    uploadSuccess: (state, action) => {
      state.uploading = false;
      state.uploadedFileUrl = action.payload; // URL
    },
    uploadFailure: (state, action) => {
      state.uploading = false;
      state.error = action.payload;
    },
    resetUpload: (state) => {
      state.uploading = false;
      state.uploadType = null;
      state.uploadedFileUrl = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadedFileUrl = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload;
      });
  },
});

export const {
  startUpload,
  uploadSuccess,
  uploadFailure,
  resetUpload,
} = uploadSlice.actions;

export default uploadSlice.reducer;
