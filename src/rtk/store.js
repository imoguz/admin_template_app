import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/rtk/features/authSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '@/rtk/api/authApi';
import { userApi } from '@/rtk/api/userApi';
import { projectApi } from '@/rtk/api/projectApi';
import { sectionTemplateApi } from '@/rtk/api/sectionTemplateApi';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const rootReducer = combineReducers({
  auth: authReducer,

  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [sectionTemplateApi.reducerPath]: sectionTemplateApi.reducer,
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
  blacklist: [
    authApi.reducerPath,
    userApi.reducerPath,
    projectApi.reducerPath,
    sectionTemplateApi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      userApi.middleware,
      projectApi.middleware,
      sectionTemplateApi.middleware
    ),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
