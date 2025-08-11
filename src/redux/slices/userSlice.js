// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   jwtToken: null,
//   refreshToken: null,
//   role: null,
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     login: (state, action) => {

//       state.jwtToken = action.payload.access_token;
//       state.refreshToken = action.payload.refresh_token;
//       state.role = action.payload.role;

//       localStorage.setItem('jwtToken', action.payload.access_token);
//       localStorage.setItem('refreshToken', action.payload.refresh_token);
//       localStorage.setItem('role', action.payload.role);

//     },
//     logout: (state) => {
//       state.jwtToken = null;
//       state.refreshToken = null;
//       state.role = null;

//       localStorage.clear();
//     },
//   },
// });

// export const { login, logout } = userSlice.actions;
// export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

// Initialize state from localStorage if available
const getInitialState = () => {
  try {
    const jwtToken = localStorage.getItem('jwtToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const role = localStorage.getItem('role');
    
    return {
      jwtToken: jwtToken || null,
      refreshToken: refreshToken || null,
      role: role || null,
    };
  } catch (error) {
    // If localStorage is not available or there's an error, return default state
    return {
      jwtToken: null,
      refreshToken: null,
      role: null,
    };
  }
};

const initialState = getInitialState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.jwtToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.role = action.payload.role;

      // Update localStorage
      localStorage.setItem('jwtToken', action.payload.access_token);
      localStorage.setItem('refreshToken', action.payload.refresh_token);
      localStorage.setItem('role', action.payload.role);
    },
    logout: (state) => {
      state.jwtToken = null;
      state.refreshToken = null;
      state.role = null;

      // Clear localStorage
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('role');
    },
    // Add a hydrate action to sync Redux state with localStorage
    hydrate: (state) => {
      const jwtToken = localStorage.getItem('jwtToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const role = localStorage.getItem('role');
      
      state.jwtToken = jwtToken;
      state.refreshToken = refreshToken;
      state.role = role;
    }
  },
});

export const { login, logout, hydrate } = userSlice.actions;
export default userSlice.reducer;