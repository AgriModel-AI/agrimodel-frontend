import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import userDetailsReducer from './slices/userDetailsSlice';


const appReducer = combineReducers({
  user: userReducer,
  userDetails: userDetailsReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;