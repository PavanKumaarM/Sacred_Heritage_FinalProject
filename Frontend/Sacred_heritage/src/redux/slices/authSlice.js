
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// Helper to handle API errors consistently
const handleError = (error, thunkAPI) => {
  return thunkAPI.rejectWithValue({
    message: error.message || "Something went wrong",
    status: error.status || null,
  });
};

// Register user
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      const result = response.data;

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      return result;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (loginData, thunkAPI) => {
    try {
      const response = await authService.login(loginData);
      const result = response.data;

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      return result;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Fetch logged-in user's profile
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return handleError(error, thunkAPI);
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: Boolean(localStorage.getItem("token")),
    loading: false,
    error: null,
    successMessage: "",
  },

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = "";

      localStorage.removeItem("token");
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    clearAuthMessage: (state) => {
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    builder

      // Registration
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = Boolean(action.payload?.token);

        state.successMessage = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload?.user || null;
        state.token = action.payload?.token || null;
        state.isAuthenticated = Boolean(action.payload?.token);

        state.successMessage = "Login successful!";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Unable to fetch profile";

        // Only log out when authentication is actually rejected
        if (
          action.payload?.status === 401 ||
          action.payload?.status === 403
        ) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;

          localStorage.removeItem("token");
        }
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = "";
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = "Profile updated successfully!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Profile update failed";
      });
  },
});

export const {
  logout,
  clearAuthError,
  clearAuthMessage,
} = authSlice.actions;

export default authSlice.reducer;
