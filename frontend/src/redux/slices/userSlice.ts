// userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user_uuid: string | null;
  name: string | null;
}

const initialState: UserState = {
  user_uuid: null,
  name: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.user_uuid = action.payload.user_uuid;
      state.name = action.payload.name;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
