import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Reads from .env.local locally (localhost:4000) or Vercel env var in production
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://webcrafter-ai-server.vercel.app";
const AUTH_URL = `${BASE_URL}/api/auth`;
const USER_URL = `${BASE_URL}/api/user`;

// ── Helper: get token from localStorage ──────────────────────────────────────
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// ── Helper: build auth headers (cookie + Bearer fallback) ────────────────────
const authHeaders = () => {
  const token = getToken();
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

// ── Google Auth ───────────────────────────────────────────────────────────────
export const googleAuthUser = createAsyncThunk(
  "auth/google",
  async ({ credential }, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Google sign in failed");
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("auth_token", data.token);
      }
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ── Check Auth ────────────────────────────────────────────────────────────────
// Sends both cookie AND Bearer token so whichever works in the environment is used
export const checkAuthUser = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/check-auth`, {
        method: "GET",
        headers: authHeaders(),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Auth check failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ── Logout ────────────────────────────────────────────────────────────────────
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        headers: authHeaders(),
        credentials: "include",
      });
    } catch {
      // Even if the network call fails, we still clear local state
    } finally {
      // Always clear localStorage token on logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    }
  },
);

// ── Update Profile ────────────────────────────────────────────────────────────
export const updateProfileUserInfo = createAsyncThunk(
  "auth/updateProfile",
  async ({ name, bio }, thunkAPI) => {
    try {
      const res = await fetch(`${USER_URL}/update`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ name, bio }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ── Upload Avatar ─────────────────────────────────────────────────────────────
export const uploadAvatarUserInfo = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, thunkAPI) => {
    try {
      const token = getToken();
      const headers = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch(`${USER_URL}/upload-avatar`, {
        method: "POST",
        headers,
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

// ── Slice ─────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,
    isInitialized: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Keep synchronous logout as fallback
    logout: (state) => {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Google Auth
      .addCase(googleAuthUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(googleAuthUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Check Auth
      .addCase(checkAuthUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuthUser.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
      })
      // Logout (async — clears cookie and localStorage)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      // Update Profile
      .addCase(updateProfileUserInfo.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      // Upload Avatar
      .addCase(uploadAvatarUserInfo.fulfilled, (state, action) => {
        if (state.user) {
          state.user.profilePicture = action.payload.profilePicture;
        }
      });
  },
});

export const { clearError, logout, setEmailForVerification } = authSlice.actions;
export default authSlice.reducer;
