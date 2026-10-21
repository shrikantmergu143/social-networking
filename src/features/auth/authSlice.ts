import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '../../types';
import { CURRENT_USER } from '../../mocks/users';

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  authToken: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  // Pre-load in authenticated state with rich demo profile as confirmed in Phase 1
  isAuthenticated: true,
  currentUser: CURRENT_USER,
  authToken: 'demo_session_token_alexmorgan',
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserProfile; token: string }>
    ) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload.user;
      state.authToken = action.payload.token;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.authToken = null;
      state.error = null;
    },
    updateCurrentUserProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const {
  loginSuccess,
  logout,
  updateCurrentUserProfile,
  setError,
  setLoading
} = authSlice.actions;

export default authSlice.reducer;
