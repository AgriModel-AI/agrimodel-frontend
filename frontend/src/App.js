import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/login';
import SignUp from './pages/authentication/signup';
import Resetpassword from './pages/authentication/resetPassword';
import CodeVerification from './pages/authentication/codeVerification';
import ResetPasswordSuccessful from './pages/authentication/resetPasswordSuccessful';
import ForgotPass from './pages/authentication/forgot';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/*  Routes */}
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgot-password" element={< ForgotPass/>} />
          <Route path="/verification-code" element={<CodeVerification />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/reset-password-successful" element={<ResetPasswordSuccessful />} />

          </Routes>
        </Router>
    </Provider>
  );
}

export default App;
