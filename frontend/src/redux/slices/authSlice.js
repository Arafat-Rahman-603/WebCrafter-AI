import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const AUTH_URL = "https://webcrafter-ai-server.vercel.app/api/auth";
const USER_URL = "https://webcrafter-ai-server.vercel.app/api/user";

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Signup failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Login failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const verifyEmailUser = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, code }, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Verification failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const forgotPasswordUser = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Request failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const resetPasswordUser = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Reset failed");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const checkAuthUser = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(`${AUTH_URL}/check-auth`, {
        method: "GET",
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

// ── Async logout — clears cookie on backend too ───────────────────────────────
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Even if the network call fails, we still clear local state
    }
  },
);

export const updateProfileUserInfo = createAsyncThunk(
  "auth/updateProfile",
  async ({ name, bio }, thunkAPI) => {
    try {
      const res = await fetch(`${USER_URL}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

export const uploadAvatarUserInfo = createAsyncThunk(
  "auth/uploadAvatar",
  async (formData, thunkAPI) => {
    try {
      const res = await fetch(`${USER_URL}/upload-avatar`, {
        method: "POST",
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    emailForVerification: null,
    isLoading: true,
    isInitialized: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setEmailForVerification: (state, action) => {
      state.emailForVerification = action.payload;
    },
    // Keep synchronous logout as fallback
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.emailForVerification = action.meta.arg.email;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Verify Email
      .addCase(verifyEmailUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyEmailUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.emailForVerification = null;
      })
      .addCase(verifyEmailUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPasswordUser.rejected, (state, action) => {
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
      // Logout (async — clears cookie)
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      // Update Profile
      .addCase(updateProfileUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfileUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfileUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Upload Avatar
      .addCase(uploadAvatarUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadAvatarUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.profilePicture = action.payload.profilePicture;
        }
      })
      .addCase(uploadAvatarUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setEmailForVerification, logout } =
  authSlice.actions;

export default authSlice.reducer;
