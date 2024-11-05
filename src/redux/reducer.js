import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import userDetailsReducer from './slices/userDetailsSlice';
import diseaseReducer from './slices/diseaseSlice';
import clientReducer from './slices/clientsSlice'


const appReducer = combineReducers({
  user: userReducer,
  userDetails: userDetailsReducer,
  diseases: diseaseReducer,
  clients: clientReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;