import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import userDetailsReducer from './slices/userDetailsSlice';
import diseaseReducer from './slices/diseaseSlice';
import clientReducer from './slices/clientsSlice'
import communitiesReducer from './slices/communitySlice'
import supportRequestReducer from './slices/supportRequestSlice'


const appReducer = combineReducers({
  user: userReducer,
  userDetails: userDetailsReducer,
  diseases: diseaseReducer,
  clients: clientReducer,
  communities: communitiesReducer,
  supportRequests: supportRequestReducer
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;