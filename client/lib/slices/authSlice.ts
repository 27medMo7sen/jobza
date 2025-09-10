import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  user: Record<string, any> | null;
  isProfileLoaded: boolean;
  profileStatus: string | null;
}

// Initialize from localStorage if available

const getInitialToken = () => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      return localStorage.getItem("token");
    } catch (error) {
      console.warn("Error getting token from localStorage:", error);
      return null;
    }
  }
  return null;
};

const getInitialUser = () => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        // Process user data like in setUser
        const roleKeys = ["worker", "employer", "agency", "admin"];
        for (const key of roleKeys) {
          if (user[key]) {
            Object.assign(user, user[key]);
            delete user[key];
          }
        }
        return user;
      }
    } catch (error) {
      console.warn("Error parsing user from localStorage:", error);
    }
  }
  return null;
};

const initialState: AuthState = {
  token: getInitialToken(),
  user: getInitialUser(),
  isProfileLoaded: false,
  profileStatus: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state: AuthState, action: PayloadAction<string | null>) {
      localStorage.setItem("token", action.payload as string);
      state.token = action.payload;
    },
    setUser(state: AuthState, action: PayloadAction<any | null>) {
      if (!action.payload) {
        state.user = null;
        localStorage.removeItem("user");
        return;
      }
      console.log("action.payload", action.payload);
      let user = { ...action.payload };

      const roleKeys = ["worker", "employer", "agency", "admin"];
      for (const key of roleKeys) {
        if (user[key]) {
          user = { ...user, ...user[key] };
          delete user[key];
        }
      }

      localStorage.setItem("user", JSON.stringify(user));
      state.user = user;
    },
    clearAuth(state: AuthState) {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    setProfileLoaded(state: AuthState, action: PayloadAction<boolean>) {
      state.isProfileLoaded = action.payload;
    },
    setProfileStatus(state: AuthState, action: PayloadAction<string | null>) {
      state.profileStatus = action.payload;
    },
  },
});

export const {
  setToken,
  setUser,
  clearAuth,
  setProfileLoaded,
  setProfileStatus,
} = authSlice.actions;
export default authSlice.reducer;
