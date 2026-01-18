import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./authTypes";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  websocketToken: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  websocketToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
      }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setWebsocketToken: (state, action: PayloadAction<string>) => {
      state.websocketToken = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.websocketToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setWebsocketToken, setLoading, logout } =
  authSlice.actions;
export default authSlice.reducer;
