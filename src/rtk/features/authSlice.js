import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';
import Cookies from 'js-cookie';
import { getAuthVerifyFromToken } from '@/utils/helpers';

const initialState = {
  token: Cookies.get('accessToken') || null,
  user: null,
  isAuthenticated: getAuthVerifyFromToken(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = getAuthVerifyFromToken(action.payload);
      Cookies.set('accessToken', action.payload, { expires: 1 });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          const { accessToken, refreshToken, user } = payload;
          state.token = accessToken;
          state.user = user;
          state.isAuthenticated = getAuthVerifyFromToken(accessToken);
          state.loading = false;
          state.error = null;

          Cookies.set('accessToken', accessToken, { expires: 1 });
          Cookies.set('refreshToken', refreshToken, { expires: 7 });
        }
      )
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || 'Login failed';
      })

      // Refresh Token
      .addMatcher(
        authApi.endpoints.refreshToken?.matchFulfilled,
        (state, { payload }) => {
          const { accessToken, user } = payload;
          state.token = accessToken;
          state.user = user;
          state.isAuthenticated = getAuthVerifyFromToken(token);

          Cookies.set('accessToken', token, { expires: 1 });
        }
      )

      // Logout if refresh failed
      .addMatcher(authApi.endpoints.refreshToken?.matchRejected, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;

        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      });
  },
});

export const { logout, setUser, setToken, clearError } = authSlice.actions;
export default authSlice.reducer;
