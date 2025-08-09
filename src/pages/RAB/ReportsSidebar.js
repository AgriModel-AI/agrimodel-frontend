import React from 'react';
import { motion } from 'framer-motion';
import './ReportsSidebar.css';

const ReportsSidebar = ({ reports, activeReport, onReportChange }) => {
  // Group reports by category for better organization
  const mainReports = reports.filter(report => !report.status || report.status === 'active');
  const previewReports = reports.filter(report => report.status === 'preview');

  return (
    <div className="reports-sidebar">
      <div className="sidebar-header">
        <div className="logo-container">
          <img src="/assets/logoBlack.png" alt="AgriModel" className="logo" />
        </div>
        <h2>Analytics Dashboard</h2>
      </div>
      
      <div className="sidebar-content">
        {mainReports.length > 0 && (
          <>
            <div className="category-title">Primary Reports</div>
            <ul className="report-list">
              {mainReports.map((report, index) => (
                <motion.li 
                  key={report.id}
                  className={activeReport === report.id ? 'active' : ''}
                  onClick={() => onReportChange(report.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="report-item-content">
                    <i className="bi bi-bar-chart-fill"></i>
                    <span className="report-name">{report.name}</span>
                  </div>
                  <div className="hover-indicator"></div>
                </motion.li>
              ))}
            </ul>
          </>
        )}
        
        {previewReports.length > 0 && (
          <>
            <div className="category-title">Preview Reports</div>
            <ul className="report-list">
              {previewReports.map((report, index) => (
                <motion.li 
                  key={report.id}
                  className={activeReport === report.id ? 'active' : ''}
                  onClick={() => onReportChange(report.id)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (mainReports.length + index) * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="report-item-content">
                    <i className="bi bi-graph-up"></i>
                    <span className="report-name">{report.name}</span>
                    <span className="preview-badge">Preview</span>
                  </div>
                  <div className="hover-indicator"></div>
                </motion.li>
              ))}
            </ul>
          </>
        )}
      </div>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-details">
            <p className="institution-name">Rwanda Agriculture Board</p>
            <p className="dashboard-label">Data Analytics & Insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsSidebar;