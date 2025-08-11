import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

export const store = configureStore({
  reducer: rootReducer,
});

const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');
const role = localStorage.getItem('role');

if (jwtToken && refreshToken) {
  store.dispatch({
    type: 'user/login',
    payload: { access_token: jwtToken, refresh_token: refreshToken, role: role },
  });
}


export default store;