import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

export const store = configureStore({
  reducer: rootReducer,
});

const jwtToken = localStorage.getItem('jwtToken');
const refreshToken = localStorage.getItem('refreshToken');

if (jwtToken && refreshToken) {
  store.dispatch({
    type: 'user/login',
    payload: { access_token: jwtToken, refresh_token: refreshToken },
  });
}


export default store;