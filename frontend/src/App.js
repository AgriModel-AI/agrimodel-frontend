import React from 'react';
import { DrawerProvider } from './context/DrawerContext'; 
import { Provider } from 'react-redux';
import store from './redux/store'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './pages/authentication/login';
import SignUp from './pages/authentication/signup';
import Resetpassword from './pages/authentication/resetPassword';
import CodeVerification from './pages/authentication/codeVerification';
import ResetPasswordSuccessful from './pages/authentication/resetPasswordSuccessful';
import ForgotPass from './pages/authentication/forgot';
import HomePage from './pages/home';

function App() {
  return (
    <Provider store={store}>
      <DrawerProvider>
        <Router>
          <Routes>
            {/*routes */}
            <Route path="/signin" element={<Signin />} />
            <Route path="/forgot-password" element={<ForgotPass />} />
            <Route path="/verification-code" element={<CodeVerification />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/reset-password" element={<Resetpassword />} />
            <Route path="/reset-password-successful" element={<ResetPasswordSuccessful />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
        </Router>
      </DrawerProvider>
    </Provider>
  );
}

export default App;
