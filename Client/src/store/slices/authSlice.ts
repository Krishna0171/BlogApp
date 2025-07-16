import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { LoginFormData, User } from "../../interfaces/interfaces";
import * as authService from "../../services/authService";
import {
  getTokenExpiry,
  getUserFromToken,
  isTokenValid,
  removeToken,
  setToken,
} from "../../utils/jwtUtils";
import { toast } from "react-toastify";
import { LoginSuccess, LogoutSuccess } from "../../constants/SuccessMessages";
import { logoutDialog } from "../../utils/sweetAlert";
import { ACCESS_TOKEN_REFRESH_BEFORE } from "../../constants/Constants";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logoutTimeoutRef: number | null;
  refreshTokenTimeoutRef: number | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  logoutTimeoutRef: null,
  refreshTokenTimeoutRef: null,
};

// Thunk
export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { rejectWithValue, dispatch }) => {
    const tokenValid = isTokenValid();

    if (tokenValid) {
      const user = getUserFromToken();
      dispatch(scheduleRefreshToken());
      return user;
    }

    // 🔁 Token expired, try refresh
    const result = await authService.refreshAccessToken();
    if (result.isSuccess) {
      const accessToken = result.Data.accessToken;
      setToken(accessToken);
      const user = getUserFromToken();
      dispatch(scheduleRefreshToken());
      return user;
    }
    removeToken();
    return rejectWithValue(result.Message);
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (data: LoginFormData, { rejectWithValue, dispatch }) => {
    const result = await authService.loginUser(data);
    if (result.isSuccess) {
      toast.success(LoginSuccess);
      setToken(result.Data.token);
      dispatch(scheduleRefreshToken());
      return getUserFromToken();
    }
    toast.error(result.Message);
    return rejectWithValue(result.Message);
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const result = await authService.logoutUser();
    if (result.isSuccess) {
      toast.success(LogoutSuccess);
      removeToken();
      return;
    }
    toast.error(result.Message);
    return rejectWithValue(result.Message);
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh-token",
  async (_, { rejectWithValue, dispatch }) => {
    const result = await authService.refreshAccessToken();
    if (result.isSuccess) {
      setToken(result.Data.accessToken);
      dispatch(scheduleRefreshToken());
      return getUserFromToken();
    }

    const timeUntilLogout = getTokenExpiry() * 1000 - Date.now();

    const shouldLogout = await logoutDialog(timeUntilLogout);
    if (shouldLogout) {
      dispatch(logout());
    } else {
      dispatch(scheduleLogout());
    }
    return rejectWithValue(result.Message);
  }
);

export const scheduleRefreshToken = createAsyncThunk(
  "schedule-refresh-token",
  async (_, { dispatch }) => {
    const tokenExpiry = getTokenExpiry();
    const timeUntilExpiry = tokenExpiry * 1000 - Date.now();
    const delay = Math.max(0, timeUntilExpiry - ACCESS_TOKEN_REFRESH_BEFORE);

    const refreshTokenTimeout = setTimeout(() => {
      dispatch(refreshAccessToken());
    }, delay);
    return refreshTokenTimeout;
  }
);

export const scheduleLogout = createAsyncThunk(
  "schedule-logout",
  async (_, { dispatch }) => {
    const tokenExpiry = getTokenExpiry();
    const timeUntilExpiry = tokenExpiry * 1000 - Date.now();
    const delay = Math.max(0, timeUntilExpiry);

    const logoutTimeout = setTimeout(() => {
      dispatch(logout());
    }, delay);
    return logoutTimeout;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state: AuthState, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser(state: AuthState) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    clearTimer(state: AuthState) {
      if (state.logoutTimeoutRef) {
        clearTimeout(state.logoutTimeoutRef);
        state.logoutTimeoutRef = null;
      }
      if (state.refreshTokenTimeoutRef) {
        clearTimeout(state.refreshTokenTimeoutRef);
        state.refreshTokenTimeoutRef = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    });
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;

        if (state.refreshTokenTimeoutRef) {
          clearTimeout(state.refreshTokenTimeoutRef);
          state.refreshTokenTimeoutRef = null;
        }
        if (state.logoutTimeoutRef) {
          clearTimeout(state.logoutTimeoutRef);
          state.logoutTimeoutRef = null;
        }
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
      });
    builder
      .addCase(scheduleLogout.fulfilled, (state, action) => {
        if (state.logoutTimeoutRef) clearTimeout(state.logoutTimeoutRef);
        state.logoutTimeoutRef = action.payload;
      })
      .addCase(scheduleLogout.rejected, (state) => {
        if (state.logoutTimeoutRef) {
          clearTimeout(state.logoutTimeoutRef);
          state.logoutTimeoutRef = null;
        }
      });
    builder
      .addCase(scheduleRefreshToken.fulfilled, (state, action) => {
        if (state.refreshTokenTimeoutRef)
          clearTimeout(state.refreshTokenTimeoutRef);
        state.refreshTokenTimeoutRef = action.payload;
      })
      .addCase(scheduleRefreshToken.rejected, (state) => {
        if (state.refreshTokenTimeoutRef) {
          clearTimeout(state.refreshTokenTimeoutRef);
          state.refreshTokenTimeoutRef = null;
        }
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
