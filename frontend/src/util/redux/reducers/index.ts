// reducers/index.ts

import { combineReducers } from '@reduxjs/toolkit';
import authSlice from '../slices/authSlice';
import userSlice from '../slices/userSlice';
// Import your slice reducers here
// import someFeatureReducer from './pathToYourSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  user: userSlice,
});

export default rootReducer;
