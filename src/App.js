import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; 

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidebarWithHeader from "./components/sidebar/SidebarWithHeader";
import Home from './pages/home/index';
import Dashboard from './pages/dashboard/index';
import Diseases from './pages/diseases/index';
import DiseasesAdd from './pages/diseases/form';
import Diagnosis from './pages/diagnosis/index';
import Clients from './pages/clients/index';
import Community from './pages/community/index';
import CommunityForm from './pages/community/form';
import Support from './pages/support/index';

import Signin from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import CodeVerification from "./pages/auth/codeVerification";
import ForgotPass from "./pages/auth/forgot";
import Resetpassword from "./pages/auth/resetPassword";
import ResetPasswordSuccessful from "./pages/auth/resetPasswordSuccessful";
import ClientDetails from './pages/clients/clientDetails';
import ProfileManagement from './pages/profile/ProfileManagement';
import NotFoundPage from './pages/404';
import ForbiddenPage from './pages/403';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/verification-code" element={<CodeVerification />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/reset-password-successful" element={<ResetPasswordSuccessful />} />

          <Route element={<SidebarWithHeader />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<ProfileManagement />} />
            <Route path="/dashboard/diseases" element={<Diseases />} />
            <Route path="/dashboard/diseases/add" element={<DiseasesAdd />} />
            <Route path="/dashboard/diseases/update" element={<Diseases />} />
            <Route path="/dashboard/diagnosis" element={<Diagnosis />} />
            <Route path="/dashboard/clients" element={<Clients />} />
            <Route path="/dashboard/clients/view" element={<ClientDetails />} />
            <Route path="/dashboard/community" element={<Community />} />
            <Route path="/dashboard/community/add" element={<CommunityForm />} />
            <Route path="/dashboard/community/update" element={<Community />} />
            <Route path="/dashboard/support" element={<Support />} />
          </Route>

          <Route path="/forbidden-page" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}