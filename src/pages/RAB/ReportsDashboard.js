import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ReportViewer from './ReportViewer';
import ReportsSidebar from './ReportsSidebar';
import { formatDate } from '../../utils/dateUtils';
import html2pdf from 'html2pdf.js';
import { saveAs } from 'file-saver';
import { motion, AnimatePresence } from 'framer-motion';
import './ReportsDashboard.css';
import axiosInstance from '../../utils/axiosConfig';
import { logout } from '../../redux/slices/userSlice';
import { Button } from "@nextui-org/react";
import { FiRefreshCw } from 'react-icons/fi';

const ReportsDashboard = () => {
  const { reportType } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState(null);
  const [availableReports, setAvailableReports] = useState([]);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  useEffect(() => {
    setReportData(null);
    setLoading(true);
    setError(null);
  }, [reportType]);
  
  useEffect(() => {
    const fetchReportTypes = async () => {
      try {
        const response = await axiosInstance.get('/dashboard/reports-new');
        setAvailableReports(response.data.report_types);
        if (!reportType && response.data.report_types.length > 0) {
          navigate(`/reports/${response.data.report_types[0].id}`);
        }
      } catch (error) {
        console.error('Error fetching report types:', error);
        setError('Failed to load report types. Please try again later.');
      }
    };
    fetchReportTypes();
  }, []);
  
  useEffect(() => {
    if (reportType) {
      fetchReportData();
    }
  }, [reportType, startDate, endDate]);
  
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/dashboard/reports-new/${reportType}`, {
        params: {
          start_date: formatDate(startDate),
          end_date: formatDate(endDate)
        }
      });
      if (response.data && response.data.data) {
        setReportData(response.data.data);
      } else {
        setError('The server returned an invalid response format.');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to load report data. Please try again later.');
      setReportData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReportChange = (reportId) => {
    setReportData(null);
    setLoading(true);
    setError(null);
    navigate(`/reports/${reportId}`);
  };
  
// const downloadPDF = () => {
//   setIsExporting(true);
  
//   const reportElement = document.getElementById('report-container');

//   // Ensure the element is fully visible & expanded
//   reportElement.style.width = '100%';
//   reportElement.style.overflow = 'visible';

//   const options = {
//     margin: [10, 10, 10, 10], // top, left, bottom, right in mm
//     filename: `AgriModel_${reportType}_Report.pdf`,
//     image: { type: 'jpeg', quality: 1 }, // max image quality
//     html2canvas: {
//       scale: 1, // higher = sharper output
//       useCORS: true,
//       logging: false,
//       letterRendering: true, // improves font sharpness
//       removeContainer: true
//     },
//     jsPDF: {
//       unit: 'mm',
//       format: 'a4',
//       orientation: 'portrait'
//     },
//     pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // prevent cutting between elements
//   };

//   html2pdf()
//     .set(options)
//     .from(reportElement)
//     .save()
//     .then(() => setIsExporting(false));
// };

const downloadPDF = async () => {
    if (!reportType) return;
    try {
      setIsExporting(true);
      const response = await axiosInstance.get(
        `/dashboard/reports-pdf/${reportType}`,
        {
          params: {
            start_date: formatDate(startDate),
            end_date: formatDate(endDate)
          },
          responseType: 'blob' // Important for binary files
        }
      );

      const blob = new Blob([response.data], { type: 'application/pdf' });
      saveAs(blob, `AgriModel_${reportType}_Report.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF. Please try again later.');
    } finally {
      setIsExporting(false);
    }
  };
  const downloadExcel = async () => {
    if (!reportType) return;
    try {
      const response = await axiosInstance.get(
        `/dashboard/reports-excel/${reportType}`,
        {
          params: {
            start_date: formatDate(startDate),
            end_date: formatDate(endDate)
          },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      saveAs(blob, `AgriModel_${reportType}_Report.xlsx`);
    } catch (error) {
      console.error('Error downloading Excel:', error);
      setError('Failed to download Excel file. Please try again later.');
    }
  };

  const currentReport = availableReports.find(r => r.id === reportType) || { name: 'Loading...' };
  
  return (
    <div className="reports-dashboard">
      <ReportsSidebar 
        reports={availableReports} 
        activeReport={reportType}
        onReportChange={handleReportChange}
      />
      
      <div className="report-content">
        <motion.div 
          className="report-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="report-title-container">
            <div className="report-icon">
              <i className="bi bi-file-earmark-bar-graph"></i>
            </div>
            <div className="report-title">
              <h1>{currentReport.name}</h1>
              <p className="date-range">
                <i className="bi bi-calendar3"></i>
                {formatDate(startDate)} - {formatDate(endDate)}
              </p>
            </div>
            {currentReport.status === 'preview' && (
              <span className="preview-badge">Preview</span>
            )}
          </div>
          
          <div className="report-actions">
            <div className="date-picker-container">
              <button 
                className="date-picker-button" 
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <i className="bi bi-calendar-range"></i>
                <span>Change Date Range</span>
              </button>
              
              {showDatePicker && (
                <div className="date-picker-dropdown">
                  <div className="date-range-picker">
                    <div className="date-picker-header">
                      <h4>Select Date Range</h4>
                      <button 
                        className="close-button"
                        onClick={() => setShowDatePicker(false)}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                    <div className="date-picker-inputs">
                      <div className="date-picker-input">
                        <label>Start Date</label>
                        <DatePicker
                          selected={startDate}
                          onChange={date => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          className="date-input"
                        />
                      </div>
                      <div className="date-picker-input">
                        <label>End Date</label>
                        <DatePicker
                          selected={endDate}
                          onChange={date => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          className="date-input"
                        />
                      </div>
                    </div>
                    <button 
                      className="apply-button"
                      onClick={() => {
                        setShowDatePicker(false);
                        fetchReportData();
                      }}
                    >
                      Apply Dates
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="export-buttons">
              <button 
                className="export-button pdf" 
                onClick={downloadPDF}
                disabled={isExporting || loading || !reportData}
              >
                <i className="bi bi-file-pdf"></i>
                <span>PDF</span>
              </button>
               <button
                className="export-button excel"
                onClick={downloadExcel}
                disabled={loading || !reportData}
              >
                <i className="bi bi-file-earmark-excel"></i>
                <span>Excel</span>
              </button>
              <Button
                isIconOnly
                variant="flat"
                onClick={fetchReportData}
                className="bg-blue-100 mr-16"
                isLoading={loading}
              >
                {!loading && <FiRefreshCw />}
              </Button>
              <button 
                className="export-button logout bg-red-600" 
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className='text-white'>Logout</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          id="report-container" 
          className="report-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <AnimatePresence>
            {error ? (
              <motion.div 
                className="error-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="error-icon">
                  <i className="bi bi-exclamation-triangle"></i>
                </div>
                <div className="error-content">
                  <h3>Something went wrong</h3>
                  <p>{error}</p>
                  <button 
                    className="retry-button"
                    onClick={fetchReportData}
                  >
                    <i className="bi bi-arrow-repeat"></i> Try Again
                  </button>
                </div>
              </motion.div>
            ) : loading ? (
              <motion.div 
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="spinner">
                  <div className="spinner-border"></div>
                </div>
                <p>Loading report data...</p>
              </motion.div>
            ) : reportData ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ReportViewer reportType={reportType} data={reportData} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportsDashboard;