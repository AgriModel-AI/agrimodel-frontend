import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jwtToken: null,
  refreshToken: null,
  role: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {

      state.jwtToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.role = action.payload.role;

      localStorage.setItem('jwtToken', action.payload.access_token);
      localStorage.setItem('refreshToken', action.payload.refresh_token);
      localStorage.setItem('role', action.payload.role);

    },
    logout: (state) => {
      state.jwtToken = null;
      state.refreshToken = null;
      state.role = null;

      localStorage.clear();
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;