import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer';

export const store = configureStore({
  reducer: rootReducer,
});

const jwtToken = localStorage.getItem('jwtToken');

if (jwtToken) {
  store.dispatch({
    type: 'user/login',
    payload: { jwtToken },
  });
}

export default store;