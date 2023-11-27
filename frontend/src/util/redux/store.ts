// store.ts

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import persistStore from 'redux-persist/es/persistStore';

import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';

// Combine reducers if you have more than one
const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
});

// Configuration for redux-persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Add a whitelist or blacklist if you want to choose what to persist
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  // Add this middleware to avoid issues with redux-persist's actions
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);

export default store;
