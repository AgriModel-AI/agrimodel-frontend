import React from 'react';
import UserEngagementReport from './reports/UserEngagementReport';
import CommunityInteractionsReport from './reports/CommunityInteractionsReport';
import PlatformHealthReport from './reports/PlatformHealthReport';
import DiseaseAnalyticsReport from './reports/DiseaseAnalyticsReport';
import CropMonitoringReport from './reports/CropMonitoringReport';
import GeographicalInsightsReport from './reports/GeographicalInsightsReport';
import InterventionAnalysisReport from './reports/InterventionAnalysisReport';
import KnowledgeImpactReport from './reports/KnowledgeImpactReport';
import EarlyWarningReport from './reports/EarlyWarningReport';

const ReportViewer = ({ reportType, data }) => {
  // Create a loading indicator function
  const LoadingIndicator = () => (
    <div className="loading-spinner">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  // Show empty state if no data
  if (!data) {
    return (
      <div className="report-section">
        <h2 className="section-title">No Data Available</h2>
        <p>No data is available for this report. Please try a different date range or report type.</p>
      </div>
    );
  }
  
  // Render the appropriate report based on the reportType
  const renderReport = () => {
    switch(reportType) {
      case 'user_engagement':
        return <UserEngagementReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'community_interactions':
        return <CommunityInteractionsReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'platform_health':
        return <PlatformHealthReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'disease_analytics':
        return <DiseaseAnalyticsReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'crop_monitoring':
        return <CropMonitoringReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'geographical_insights':
        return <GeographicalInsightsReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'intervention_analysis':
        return <InterventionAnalysisReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'knowledge_impact':
        return <KnowledgeImpactReport data={data} LoadingIndicator={LoadingIndicator} />;
      case 'early_warning':
        return <EarlyWarningReport data={data} LoadingIndicator={LoadingIndicator} />;
      default:
        return <div>Unknown report type: {reportType}</div>;
    }
  };
  
  // Show message if data has an information message
  const showMessage = () => {
    if (data && data.message) {
      return (
        <div className="alert alert-info mb-4">
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>Note:</strong> {data.message}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="report-viewer">
      {showMessage()}
      {renderReport()}
    </div>
  );
};

export default ReportViewer;