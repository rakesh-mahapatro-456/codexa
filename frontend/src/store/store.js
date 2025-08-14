// store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./feature/auth/authSlice";
import uploadReducer from "./feature/upload/uploadSlice";
import dsaReducer from "./feature/dsa/dsaSlice";
import partyReducer from "./feature/party/partySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    upload: uploadReducer,
    dsa: dsaReducer,
    party: partyReducer,
  },
});
