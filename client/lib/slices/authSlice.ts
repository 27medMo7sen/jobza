import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  token: string | null;
  user: Record<string, any> | null;
  files: Record<string, any> | null;
}

// Initialize from localStorage if available
const getInitialFiles = () => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      const storedFiles = localStorage.getItem("files");
      return storedFiles ? JSON.parse(storedFiles) : {};
    } catch (error) {
      console.warn("Error parsing files from localStorage:", error);
      return {};
    }
  }
  return {};
};

const initialState: AuthState = {
  token: null,
  user: null,
  files: getInitialFiles(),
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
      state.files = {};
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("files");
    },
    addFile(state: AuthState, action: PayloadAction<Record<string, any>>) {
      state.files = { ...state.files, ...action.payload };
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        try {
          localStorage.setItem("files", JSON.stringify(state.files));
        } catch (error) {
          console.warn("Error saving files to localStorage:", error);
        }
      }
    },
    setFiles(
      state: AuthState,
      action: PayloadAction<Record<string, any> | null>
    ) {
      state.files = action.payload || {};
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        try {
          if (action.payload) {
            localStorage.setItem("files", JSON.stringify(action.payload));
          } else {
            localStorage.removeItem("files");
          }
        } catch (error) {
          console.warn("Error managing files in localStorage:", error);
        }
      }
    },
    clearFiles(state: AuthState) {
      state.files = {};
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        try {
          localStorage.removeItem("files");
        } catch (error) {
          console.warn("Error clearing files from localStorage:", error);
        }
      }
    },
    updateFileStatus(
      state: AuthState,
      action: PayloadAction<{
        fileId: string;
        status: string;
        rejectionReason?: string;
      }>
    ) {
      const { fileId, status, rejectionReason } = action.payload;
      if (state.files && state.files[fileId]) {
        state.files[fileId] = {
          ...state.files[fileId],
          status,
          rejectionReason,
        };
        if (
          typeof window !== "undefined" &&
          typeof localStorage !== "undefined"
        ) {
          try {
            localStorage.setItem("files", JSON.stringify(state.files));
          } catch (error) {
            console.warn("Error updating file status in localStorage:", error);
          }
        }
      }
    },
  },
});

export const {
  setToken,
  setUser,
  clearAuth,
  addFile,
  setFiles,
  clearFiles,
  updateFileStatus,
} = authSlice.actions;
export default authSlice.reducer;
