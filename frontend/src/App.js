import React from 'react';
// import { DrawerProvider } from '../src/components/context/DrawerContext';
import { Provider } from 'react-redux';
import store from './redux/store'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/login';
import SignUp from './pages/authentication/signup';
import Resetpassword from './pages/authentication/resetPassword';
import CodeVerification from './pages/authentication/codeVerification';
import ResetPasswordSuccessful from './pages/authentication/resetPasswordSuccessful';
import ForgotPass from './pages/authentication/forgot';
import Dashboard from './pages/dashboard';
import UsersRegisteredPage from './pages/usersPage';
import CommunityPage from './pages/communityPage';
import DiagnosisResultsPage from './pages/diagnosisResults';
import DiseasePage from './pages/diseases';
import SupportPage from './pages/support';

function App() {
  return (
    <Provider store={store}>
     
        <Router>
          <Routes>
            {/*routes */}
            <Route path="/login" element={<Signin />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/verification-code" element={<CodeVerification />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<Resetpassword />} />
            <Route path="/reset-password-successful" element={<ResetPasswordSuccessful />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/registered-users" element={<UsersRegisteredPage/>} />
            <Route path="/dashboard/community" element={<CommunityPage/>} />
            <Route path="/dashboard/diagnosis-results" element={<DiagnosisResultsPage />} />
            <Route path="/dashboard/diseases" element={<DiseasePage />} />
            <Route path="/dashboard/support" element={<SupportPage />} />
          </Routes>
        </Router>
    </Provider>
  );
}

export default App;
