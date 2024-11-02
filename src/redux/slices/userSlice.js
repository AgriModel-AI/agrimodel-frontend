import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jwtToken: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {

      state.jwtToken = action.payload.access_token;

      localStorage.setItem('jwtToken', action.payload.access_token);

    },
    logout: (state) => {
      state.jwtToken = null;

      localStorage.clear();
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;