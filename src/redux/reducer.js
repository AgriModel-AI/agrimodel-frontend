import { combineReducers } from 'redux';
import userReducer from './slices/userSlice';
import userDetailsReducer from './slices/userDetailsSlice';
import diseaseReducer from './slices/diseaseSlice';
import clientReducer from './slices/clientsSlice';
import communitiesReducer from './slices/communitySlice';
import supportRequestReducer from './slices/supportRequestSlice';
import provinceReducer from './slices/provincesSlice';
import diagnosisReducer from './slices/diagnosisResult';
import DashboardStatsReducer from './slices/dashboardStatsSlice';
import NotificationReducer from './slices/notificationSlice';


const appReducer = combineReducers({
  user: userReducer,
  userDetails: userDetailsReducer,
  diseases: diseaseReducer,
  clients: clientReducer,
  communities: communitiesReducer,
  supportRequests: supportRequestReducer,
  provinces: provinceReducer,
  diagnosis: diagnosisReducer,
  dashboardStats: DashboardStatsReducer,
  notifications: NotificationReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'user/logout') {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;