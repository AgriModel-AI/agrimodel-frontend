import React from 'react';
import { Provider } from 'react-redux';
import store from './redux/store'; 

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidebarWithHeader from "./components/sidebar/SidebarWithHeader";
import Home from './pages/home/index';
import Dashboard from './pages/dashboard/index';
import Diseases from './pages/diseases/index';
import DiseasesAdd from './pages/diseases/form';
import Crops from './pages/crops/index';
import CropsAdd from './pages/crops/form';
import CropUpdate from './pages/crops/update';
import Explore from './pages/explore/index';
import ExploreAdd from './pages/explore/form';
import ExploreUpdate from './pages/explore/update';
import ExploreView from './pages/explore/view';
import ModelList from './pages/model';
import ModelForm from './pages/model/form';
import ModelView from './pages/model/view';
import Diagnosis from './pages/diagnosis/index';
import Clients from './pages/clients/index';
import Community from './pages/community/index';
import CommunityForm from './pages/community/form';
import Support from './pages/support/index';

import Signin from "./pages/auth/login";
import SignUp from "./pages/auth/signup";
import ForgotPass from "./pages/auth/forgot";
import Resetpassword from "./pages/auth/resetPassword";
import ResetPasswordSuccessful from "./pages/auth/resetPasswordSuccessful";
import ClientDetails from './pages/clients/clientDetails';
import ProfileManagement from './pages/profile/ProfileManagement';
import NotFoundPage from './pages/404';
import ForbiddenPage from './pages/403';
import VerifyAccount from './components/auth/verifyAccount';
import DiseaseUpdate from './pages/diseases/update';
import AccountBlocked from './pages/auth/AccountBlocked';
import CommunityUpdate from './pages/community/update';
import CommunityDetails from './pages/community/CommunityDetails';
import TokenExpiredPage from './pages/auth/TokenExpiredPage';
import CreateAdminUserPage from './pages/clients/CreateAdminUserPage';

import ReportsDashboard from './pages/RAB/ReportsDashboard';
import UserEngagementReport from './pages/RAB/reports/UserEngagementReport';
import CommunityInteractionsReport from './pages/RAB/reports/CommunityInteractionsReport';
import PlatformHealthReport from './pages/RAB/reports/PlatformHealthReport';
import DiseaseAnalyticsReport from './pages/RAB/reports/DiseaseAnalyticsReport';
import CropMonitoringReport from './pages/RAB/reports/CropMonitoringReport';
import GeographicalInsightsReport from './pages/RAB/reports/GeographicalInsightsReport';
import InterventionAnalysisReport from './pages/RAB/reports/InterventionAnalysisReport';
import KnowledgeImpactReport from './pages/RAB/reports/KnowledgeImpactReport';
import EarlyWarningReport from './pages/RAB/reports/EarlyWarningReport';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/token-expired" element={<TokenExpiredPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-account" element={<VerifyAccount />} />
          <Route path="/account-block" element={<AccountBlocked />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/reset-password-successful" element={<ResetPasswordSuccessful />} />

          <Route element={<SidebarWithHeader />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<ProfileManagement />} />
            <Route path="/dashboard/diseases" element={<Diseases />} />
            <Route path="/dashboard/diseases/add" element={<DiseasesAdd />} />
            <Route path="/dashboard/diseases/update" element={<DiseaseUpdate />} />
            <Route path="/dashboard/crops" element={<Crops />} />
            <Route path="/dashboard/crops/add" element={<CropsAdd />} />
            <Route path="/dashboard/crops/update" element={<CropUpdate />} />
            <Route path="/dashboard/explore" element={<Explore />} />
            <Route path="/dashboard/explore/add" element={<ExploreAdd />} />
            <Route path="/dashboard/explore/view/:id" element={<ExploreView />} />
            <Route path="/dashboard/explore/update/:id" element={<ExploreUpdate />} />
            <Route path="/dashboard/models" element={<ModelList />} />
            <Route path="/dashboard/models/add" element={<ModelForm />} />
            <Route path="/dashboard/models/view/:id" element={<ModelView />} />
            <Route path="/dashboard/diagnosis" element={<Diagnosis />} />
            <Route path="/dashboard/clients" element={<Clients />} />
            <Route path="/dashboard/clients/view" element={<ClientDetails />} />
            <Route path="/dashboard/clients/create-admin" element={<CreateAdminUserPage />} />
            <Route path="/dashboard/community" element={<Community />} />
            <Route path="/dashboard/community/view" element={<CommunityDetails />} />
            <Route path="/dashboard/community/add" element={<CommunityForm />} />
            <Route path="/dashboard/community/update" element={<CommunityUpdate />} />
            <Route path="/dashboard/support" element={<Support />} />
          </Route>

          {/* Reports Section */}
            <Route path="/dashboard/reports" element={<ReportsDashboard />} />
            <Route path="/dashboard/reports/:reportType" element={<ReportsDashboard />} />
            <Route path="/user_engagement" element={<UserEngagementReport />} />
            <Route path="/community-interactions" element={<CommunityInteractionsReport />} />
            <Route path="/platform-health" element={<PlatformHealthReport />} />
            <Route path="/disease-analytics" element={<DiseaseAnalyticsReport />} />
            <Route path="/crop-monitoring" element={<CropMonitoringReport />} />
            <Route path="/geographical-insights" element={<GeographicalInsightsReport />} />
            <Route path="/intervention-analysis" element={<InterventionAnalysisReport />} />
            <Route path="/knowledge-impact" element={<KnowledgeImpactReport />} />
            <Route path="/early-warning" element={<EarlyWarningReport />} />
          

          {/* Keep this alternative route for backward compatibility or direct access */}
          <Route path="/reports/:reportType?" element={<ReportsDashboard />} />

          <Route path="/forbidden-page" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}
