import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';  // Fixed import
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Card, CardBody, CardHeader, Spinner, Button, Tabs, Tab } from "@nextui-org/react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  PointElement, 
  LineElement,
  Filler  // Added Filler plugin
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import axiosInstance from '../utils/axiosConfig';
import { FiFileText, FiTable, FiBarChart2, FiDownload } from 'react-icons/fi';

// Register ChartJS components including Filler
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler  // Added Filler registration
);

// Agriculture-themed colors
const AGRI_COLORS = {
  primary: '#3E7B30',
  secondary: '#6DB63C',
  tertiary: '#A9D18E',
  accent: '#8B4513',
  light: '#F7F9F4',
  background: '#FFFFFF',
  text: '#333333',
  border: '#E2E8F0',
  highlight: '#FF5733'
};

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
};

const ReportGenerator = ({ reportType, startDate, endDate }) => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  
  const chartRefs = useRef({});

  // Fetch report data from backend
  useEffect(() => {
    const fetchReportData = async () => {
      if (!reportType || !startDate || !endDate) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance.get(
          `/dashboard/report-data/${reportType}?start_date=${startDate}&end_date=${endDate}`
        );
        
        setReportData(response.data);
      } catch (err) {
        console.error('Error fetching report data:', err);
        setError(err.response?.data?.message || 'Failed to fetch report data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [reportType, startDate, endDate]);

  // Generate PDF report
  const generatePDF = () => {
    if (!reportData) return;
    
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      
      // Add title and company info
      const primaryRgb = hexToRgb(AGRI_COLORS.primary);
      const textRgb = hexToRgb(AGRI_COLORS.text);
      const lightRgb = hexToRgb(AGRI_COLORS.light);
      
      doc.setFillColor(...primaryRgb);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(reportData.title, 14, 15);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('AgriModal AI - Crop Disease Management System', 14, 22);
      
      // Add date range
      doc.setTextColor(...textRgb);
      doc.setFontSize(11);
      doc.text(`Report Period: ${reportData.dateRange.start} to ${reportData.dateRange.end}`, 14, 40);
      
      // Add report generation info
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 45);
      
      // Add Executive Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryRgb);
      doc.text("Executive Summary", 14, 55);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textRgb);
      
      let yPos = 65;
      Object.entries(reportData.summary).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        doc.text(`• ${formattedKey}: ${value}`, 20, yPos);
        yPos += 7;
      });
      
      // Add charts if available
      if (chartRefs.current && Object.keys(chartRefs.current).length > 0) {
        yPos += 10;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryRgb);
        doc.text("Key Visualizations", 14, yPos);
        yPos += 10;
        
        // Only add first chart to save space
        const firstChartKey = Object.keys(chartRefs.current)[0];
        const firstChart = chartRefs.current[firstChartKey];
        
        if (firstChart && firstChart.canvas) {
          const canvas = firstChart.canvas;
          const imageData = canvas.toDataURL('image/png');
          doc.addImage(imageData, 'PNG', 20, yPos, 170, 90);
          yPos += 100;
        }
      }
      
      // Add data tables based on report type
      doc.addPage();
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryRgb);
      doc.text("Detailed Data Tables", 14, 20);
      
      // Add primary data table
      let primaryTable;
      let tableColumns;
      
      switch (reportType) {
        case 'disease_prevalence':
          primaryTable = reportData.tables?.diseaseByCrop;
          tableColumns = ['Crop', 'Disease', 'Count'];
          break;
        case 'model_performance':
          primaryTable = reportData.tables?.modelPerformance;
          tableColumns = ['Version', 'Accuracy (%)', 'Total Ratings'];
          break;
        case 'client_activity':
          primaryTable = reportData.tables?.activeUsers?.slice(0, 15);
          tableColumns = ['Username', 'Diagnosis Count', 'Last Diagnosis'];
          break;
        case 'growth_analysis':
          primaryTable = reportData.tables?.growthRates;
          tableColumns = ['Month', 'User Growth Rate', 'Diagnosis Growth Rate'];
          break;
        default:
          primaryTable = [];
          tableColumns = [];
      }
      
      if (primaryTable && primaryTable.length > 0) {
        const tableData = primaryTable.map(item => {
          switch (reportType) {
            case 'disease_prevalence':
              return [item.crop || '', item.disease || '', item.count || 0];
            case 'model_performance':
              return [item.version || '', item.accuracy || 0, item.totalRatings || 0];
            case 'client_activity':
              return [item.username || '', item.diagnosisCount || 0, item.lastDiagnosis || ''];
            case 'growth_analysis':
              return [item.month || '', (item.userGrowthRate || 0) + '%', (item.diagnosisGrowthRate || 0) + '%'];
            default:
              return [];
          }
        });
        
        // Fixed autoTable usage
        autoTable(doc, {
            startY: 30,
            head: [tableColumns],
            body: tableData,
            theme: 'grid',
            headStyles: { 
            fillColor: primaryRgb,
            textColor: [255, 255, 255],
            fontStyle: 'bold'
            },
            alternateRowStyles: { 
            fillColor: lightRgb
            },
            margin: { top: 30 }
        });
    
      }
      
      // Add footer to all pages
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(...primaryRgb);
        doc.setLineWidth(0.5);
        doc.line(
          10, 
          doc.internal.pageSize.getHeight() - 15, 
          doc.internal.pageSize.getWidth() - 10, 
          doc.internal.pageSize.getHeight() - 15
        );
        
        // Page number
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Page ${i} of ${pageCount}`, 
          doc.internal.pageSize.getWidth() - 25, 
          doc.internal.pageSize.getHeight() - 10
        );
      }
      
      // Save the PDF
      doc.save(`${reportType}_${reportData.dateRange.start}_to_${reportData.dateRange.end}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate PDF report');
    } finally {
      setGenerating(false);
    }
  };
  
  // Generate Excel report
  const generateExcel = () => {
    if (!reportData) return;
    
    setGenerating(true);
    
    try {
      const workbook = XLSX.utils.book_new();
      
      // Add Executive Summary sheet
      const summaryData = Object.entries(reportData.summary).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        return { Metric: formattedKey, Value: value };
      });
      
      const summarySheet = XLSX.utils.json_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive Summary');
      
      // Add data sheets based on report type
      if (reportType === 'disease_prevalence') {
        if (reportData.tables?.diseaseByCrop && reportData.tables.diseaseByCrop.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.diseaseByCrop);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Disease by Crop');
        }
        
        if (reportData.tables?.geographicHotspots && reportData.tables.geographicHotspots.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.geographicHotspots);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Geographic Hotspots');
        }
        
        if (reportData.tables?.diseaseTrends && reportData.tables.diseaseTrends.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.diseaseTrends);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Disease Trends');
        }
      } else if (reportType === 'model_performance') {
        if (reportData.tables?.modelPerformance && reportData.tables.modelPerformance.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.modelPerformance);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Model Performance');
        }
        
        if (reportData.tables?.diseasePerformance && reportData.tables.diseasePerformance.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.diseasePerformance);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Disease Performance');
        }
      } else if (reportType === 'client_activity') {
        if (reportData.tables?.activeUsers && reportData.tables.activeUsers.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.activeUsers);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Active Users');
        }
        
        if (reportData.tables?.activityTrends && reportData.tables.activityTrends.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.activityTrends);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Activity Trends');
        }
      } else if (reportType === 'growth_analysis') {
        if (reportData.tables?.userGrowth && reportData.tables.userGrowth.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.userGrowth);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'User Growth');
        }
        
        if (reportData.tables?.diagnosisGrowth && reportData.tables.diagnosisGrowth.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.diagnosisGrowth);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Diagnosis Growth');
        }
        
        if (reportData.tables?.growthRates && reportData.tables.growthRates.length > 0) {
          const worksheet = XLSX.utils.json_to_sheet(reportData.tables.growthRates);
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Growth Rates');
        }
      }
      
      // Add report metadata
      const metaSheet = XLSX.utils.json_to_sheet([
        { Property: 'Report Title', Value: reportData.title },
        { Property: 'Start Date', Value: reportData.dateRange.start },
        { Property: 'End Date', Value: reportData.dateRange.end },
        { Property: 'Generated On', Value: new Date().toLocaleString() },
        { Property: 'Generated By', Value: 'AgriModal AI System' }
      ]);
      XLSX.utils.book_append_sheet(workbook, metaSheet, 'Report Info');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `${reportType}_${reportData.dateRange.start}_to_${reportData.dateRange.end}.xlsx`);
    } catch (err) {
      console.error('Error generating Excel:', err);
      setError('Failed to generate Excel report');
    } finally {
      setGenerating(false);
    }
  };
  
  // Render chart based on report type and chart data
  const renderChart = (chartType, chartData, options = {}) => {
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) return null;
    
    const chartId = `${chartType}-${Math.random().toString(36).substring(2, 9)}`;
    
    let labels, datasets;
    
    // Define color palette
    const colors = [
      AGRI_COLORS.primary,
      AGRI_COLORS.secondary,
      AGRI_COLORS.tertiary,
      AGRI_COLORS.accent,
      '#4472C4',
      '#ED7D31',
      '#A5A5A5',
      '#FFC000',
      '#5B9BD5',
      '#70AD47'
    ];
    
    switch (chartType) {
      case 'bar':
        labels = chartData.map(item => item[options.labelKey || 'disease']);
        datasets = [{
          label: options.dataLabel || 'Count',
          data: chartData.map(item => item[options.dataKey || 'count']),
          backgroundColor: options.color || AGRI_COLORS.secondary,
          borderColor: options.borderColor || AGRI_COLORS.primary,
          borderWidth: 1
        }];
        break;
        
      case 'pie':
        labels = chartData.map(item => item[options.labelKey || 'province']);
        datasets = [{
          data: chartData.map(item => item[options.dataKey || 'cases']),
          backgroundColor: colors.slice(0, chartData.length),
          borderColor: Array(chartData.length).fill('#FFFFFF'),
          borderWidth: 2
        }];
        break;
        
      case 'line':
        labels = chartData.map(item => item[options.labelKey || 'date']);
        datasets = [{
          label: options.dataLabel || 'Count',
          data: chartData.map(item => item[options.dataKey || 'count']),
          borderColor: options.color || AGRI_COLORS.primary,
          backgroundColor: options.fill ? 'rgba(109, 182, 60, 0.2)' : 'transparent',
          fill: options.fill || false,
          tension: 0.2,
          pointRadius: 4,
          pointBackgroundColor: options.color || AGRI_COLORS.primary
        }];
        
        // Add second dataset if specified
        if (options.secondDataKey) {
          datasets.push({
            label: options.secondDataLabel || 'Second Value',
            data: chartData.map(item => item[options.secondDataKey]),
            borderColor: options.secondColor || AGRI_COLORS.accent,
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.2,
            pointRadius: 4,
            pointBackgroundColor: options.secondColor || AGRI_COLORS.accent
          });
        }
        break;
        
      default:
        return null;
    }
    
    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: "'Inter', sans-serif",
              size: 12
            }
          }
        },
        title: {
          display: options.title ? true : false,
          text: options.title || '',
          font: {
            family: "'Inter', sans-serif",
            size: 16,
            weight: 'bold'
          },
          color: AGRI_COLORS.text,
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            family: "'Inter', sans-serif",
            size: 14
          },
          bodyFont: {
            family: "'Inter', sans-serif",
            size: 13
          },
          padding: 12,
          cornerRadius: 8,
        }
      },
      scales: chartType !== 'pie' ? {
        x: { 
          grid: {
            display: false
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            },
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: { 
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              family: "'Inter', sans-serif",
              size: 11
            }
          }
        },
      } : undefined,
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      ...options.chartOptions
    };
    
    // Render chart based on type
    switch (chartType) {
      case 'bar':
        return (
          <div className="h-80 w-full mb-6">
            <Bar 
              ref={ref => { if (ref) chartRefs.current[chartId] = ref; }}
              data={{ labels, datasets }}
              options={chartOptions}
            />
          </div>
        );
        
      case 'pie':
        return (
          <div className="h-80 w-full mb-6">
            <Pie 
              ref={ref => { if (ref) chartRefs.current[chartId] = ref; }}
              data={{ labels, datasets }}
              options={chartOptions}
            />
          </div>
        );
        
      case 'line':
        return (
          <div className="h-80 w-full mb-6">
            <Line 
              ref={ref => { if (ref) chartRefs.current[chartId] = ref; }}
              data={{ labels, datasets }}
              options={chartOptions}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render report content based on report type
  const renderReportContent = () => {
    if (!reportData) return null;
    
    switch (activeTab) {
      case 'summary':
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Executive Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(reportData.summary).map(([key, value]) => {
                const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <p className="text-gray-500 text-sm">{formattedKey}</p>
                    <p className="text-xl font-semibold text-gray-800 mt-1">{value}</p>
                  </div>
                );
              })}
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Key Highlights</h3>
            
            {/* Render key highlight based on report type */}
            {renderReportHighlights()}
          </div>
        );
        
      case 'charts':
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Data Visualizations</h3>
            
            {/* Render charts based on report type */}
            {renderReportCharts()}
          </div>
        );
        
      case 'tables':
        return (
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Data Tables</h3>
            
            {/* Render tables based on report type */}
            {renderReportTables()}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Render report highlights based on report type
  const renderReportHighlights = () => {
    switch (reportType) {
      case 'disease_prevalence':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              During the selected period, a total of <span className="font-semibold">{reportData.summary.totalDiagnoses}</span> disease 
              cases were detected across <span className="font-semibold">{reportData.summary.uniqueCrops}</span> different crops. 
              The most prevalent disease was <span className="font-semibold">{reportData.summary.topDisease}</span> and the 
              most affected crop was <span className="font-semibold">{reportData.summary.topCrop}</span>.
            </p>
            
            {reportData.chartData?.topDiseases && reportData.chartData.topDiseases.length > 0 && (
              <div className="mt-6">
                {renderChart('bar', reportData.chartData.topDiseases, {
                  title: 'Top Diseases by Detection Count',
                  labelKey: 'disease',
                  dataKey: 'count',
                  dataLabel: 'Detection Count',
                  color: AGRI_COLORS.secondary
                })}
              </div>
            )}
          </div>
        );
        
      case 'model_performance':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              The AI model performance analysis shows an overall accuracy of <span className="font-semibold">{reportData.summary.overallAccuracy}%</span> based 
              on <span className="font-semibold">{reportData.summary.totalRatings}</span> user ratings. 
              Version <span className="font-semibold">{reportData.summary.bestModel}</span> demonstrated the highest accuracy. 
              The system performed best on <span className="font-semibold">{reportData.summary.strongestDisease}</span> and 
              had the most challenges with <span className="font-semibold">{reportData.summary.weakestDisease}</span>.
            </p>
            
            {reportData.chartData?.accuracyByVersion && reportData.chartData.accuracyByVersion.length > 0 && (
              <div className="mt-6">
                {renderChart('bar', reportData.chartData.accuracyByVersion, {
                  title: 'Model Accuracy by Version',
                  labelKey: 'version',
                  dataKey: 'accuracy',
                  dataLabel: 'Accuracy (%)',
                  color: AGRI_COLORS.secondary
                })}
              </div>
            )}
          </div>
        );
        
      case 'client_activity':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              During this period, <span className="font-semibold">{reportData.summary.totalActiveUsers}</span> users 
              actively used the system, performing a total of <span className="font-semibold">{reportData.summary.totalDiagnoses}</span> diagnoses. 
              The average user performed <span className="font-semibold">{reportData.summary.avgDiagnosesPerUser}</span> diagnoses.
              The most active user was <span className="font-semibold">{reportData.summary.mostActiveUser}</span>.
            </p>
            
            {reportData.chartData?.dailyActiveUsers && reportData.chartData.dailyActiveUsers.length > 0 && (
              <div className="mt-6">
                {renderChart('line', reportData.chartData.dailyActiveUsers, {
                  title: 'Daily Active Users',
                  labelKey: 'date',
                  dataKey: 'count',
                  dataLabel: 'Active Users',
                  color: AGRI_COLORS.primary,
                  fill: true
                })}
              </div>
            )}
          </div>
        );
        
      case 'growth_analysis':
        return (
          <div className="space-y-4">
            <p className="text-gray-700">
              The platform growth analysis shows <span className="font-semibold">{reportData.summary.totalNewUsers}</span> new users and 
              <span className="font-semibold"> {reportData.summary.totalNewCommunities}</span> new communities were created during this period. 
              The average monthly user growth rate was <span className="font-semibold">{reportData.summary.avgUserGrowthRate}%</span>, 
              while the diagnosis activity grew at an average rate of <span className="font-semibold">{reportData.summary.avgDiagnosisGrowthRate}%</span> per month.
            </p>
            
            {reportData.chartData?.growthRateTrend && reportData.chartData.growthRateTrend.length > 0 && (
              <div className="mt-6">
                {renderChart('line', reportData.chartData.growthRateTrend, {
                  title: 'Monthly Growth Rates',
                  labelKey: 'month',
                  dataKey: 'userRate',
                  dataLabel: 'User Growth (%)',
                  secondDataKey: 'diagnosisRate',
                  secondDataLabel: 'Diagnosis Growth (%)',
                  color: AGRI_COLORS.primary,
                  secondColor: AGRI_COLORS.accent
                })}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <p className="text-gray-700">
            This report provides an overview of key metrics for the selected period.
            Use the tabs above to explore visualizations and detailed data tables.
          </p>
        );
    }
  };
  
  // Render report charts based on report type
  const renderReportCharts = () => {
    switch (reportType) {
      case 'disease_prevalence':
        return (
          <div className="space-y-8">
            {reportData.chartData?.topDiseases && reportData.chartData.topDiseases.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Top Diseases by Detection Count</h4>
                {renderChart('bar', reportData.chartData.topDiseases, {
                  labelKey: 'disease',
                  dataKey: 'count',
                  dataLabel: 'Detection Count',
                  color: AGRI_COLORS.secondary
                })}
              </div>
            )}
            
            {reportData.chartData?.regionalDistribution && reportData.chartData.regionalDistribution.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Disease Distribution by Province</h4>
                {renderChart('pie', reportData.chartData.regionalDistribution, {
                  labelKey: 'province',
                  dataKey: 'cases'
                })}
              </div>
            )}
            
            {reportData.chartData?.trendData && reportData.chartData.trendData.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Disease Detection Trends</h4>
                {renderChart('line', reportData.chartData.trendData, {
                  labelKey: 'month',
                  dataKey: 'count',
                  dataLabel: 'Cases',
                  color: AGRI_COLORS.primary,
                  fill: true
                })}
              </div>
            )}
          </div>
        );
        
      case 'model_performance':
        return (
          <div className="space-y-8">
            {reportData.chartData?.accuracyByVersion && reportData.chartData.accuracyByVersion.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Model Accuracy by Version</h4>
                {renderChart('bar', reportData.chartData.accuracyByVersion, {
                  labelKey: 'version',
                  dataKey: 'accuracy',
                  dataLabel: 'Accuracy (%)',
                  color: AGRI_COLORS.secondary
                })}
              </div>
            )}
            
            {reportData.chartData?.diseaseAccuracy && reportData.chartData.diseaseAccuracy.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Diagnostic Accuracy by Disease</h4>
                {renderChart('bar', reportData.chartData.diseaseAccuracy, {
                  labelKey: 'disease',
                  dataKey: 'accuracy',
                  dataLabel: 'Accuracy (%)',
                  color: AGRI_COLORS.tertiary
                })}
              </div>
            )}
          </div>
        );
        
      case 'client_activity':
        return (
          <div className="space-y-8">
            {reportData.chartData?.dailyActiveUsers && reportData.chartData.dailyActiveUsers.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Daily Active Users</h4>
                {renderChart('line', reportData.chartData.dailyActiveUsers, {
                  labelKey: 'date',
                  dataKey: 'count',
                  dataLabel: 'Active Users',
                  color: AGRI_COLORS.primary,
                  fill: true
                })}
              </div>
            )}
            
            {reportData.chartData?.dailyDiagnoses && reportData.chartData.dailyDiagnoses.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Daily Diagnoses Performed</h4>
                {renderChart('line', reportData.chartData.dailyDiagnoses, {
                  labelKey: 'date',
                  dataKey: 'count',
                  dataLabel: 'Diagnoses',
                  color: AGRI_COLORS.accent,
                  fill: true
                })}
              </div>
            )}
            
            {reportData.chartData?.topUsers && reportData.chartData.topUsers.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Top 10 Most Active Users</h4>
                {renderChart('bar', reportData.chartData.topUsers, {
                  labelKey: 'username',
                  dataKey: 'count',
                  dataLabel: 'Diagnosis Count',
                  color: AGRI_COLORS.secondary
                })}
              </div>
            )}
          </div>
        );
        
      case 'growth_analysis':
        return (
          <div className="space-y-8">
            {reportData.chartData?.userTrend && reportData.chartData.userTrend.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Monthly New User Growth</h4>
                {renderChart('bar', reportData.chartData.userTrend, {
                  labelKey: 'month',
                  dataKey: 'count',
                  dataLabel: 'New Users',
                  color: AGRI_COLORS.primary
                })}
              </div>
            )}
            
            {reportData.chartData?.diagnosisTrend && reportData.chartData.diagnosisTrend.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Monthly Diagnosis Volume</h4>
                {renderChart('bar', reportData.chartData.diagnosisTrend, {
                  labelKey: 'month',
                  dataKey: 'count',
                  dataLabel: 'Diagnoses',
                  color: AGRI_COLORS.tertiary
                })}
              </div>
            )}
            
            {reportData.chartData?.growthRateTrend && reportData.chartData.growthRateTrend.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold mb-3 text-gray-700">Monthly Growth Rates</h4>
                {renderChart('line', reportData.chartData.growthRateTrend, {
                  labelKey: 'month',
                  dataKey: 'userRate',
                  dataLabel: 'User Growth (%)',
                  secondDataKey: 'diagnosisRate',
                  secondDataLabel: 'Diagnosis Growth (%)',
                  color: AGRI_COLORS.primary,
                  secondColor: AGRI_COLORS.accent
                })}
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <p className="text-gray-500 italic text-center py-8">
            No charts available for this report type.
          </p>
        );
    }
  };
  
  // Render report tables based on report type
  const renderReportTables = () => {
    const renderTable = (data, columns, title) => {
      if (!data || data.length === 0) return null;
      
      return (
        <div className="mb-8">
          {title && <h4 className="text-lg font-semibold mb-3 text-gray-700">{title}</h4>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {col.accessor ? item[col.accessor] : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    };
    
    switch (reportType) {
      case 'disease_prevalence':
        return (
          <div>
            {renderTable(
              reportData.tables?.diseaseByCrop,
              [
                { header: 'Crop', accessor: 'crop' },
                { header: 'Disease', accessor: 'disease' },
                { header: 'Detection Count', accessor: 'count' }
              ],
              'Disease Detection by Crop'
            )}
            
            {renderTable(
              reportData.tables?.geographicHotspots,
              [
                { header: 'Province', accessor: 'province' },
                { header: 'District', accessor: 'district' },
                { header: 'Disease', accessor: 'disease' },
                { header: 'Cases', accessor: 'cases' }
              ],
              'Geographic Disease Hotspots'
            )}
          </div>
        );
        
      case 'model_performance':
        return (
          <div>
            {renderTable(
              reportData.tables?.modelPerformance,
              [
                { header: 'Model Version', accessor: 'version' },
                { header: 'Avg Rating', accessor: 'avgRating' },
                { header: 'Correct Diagnoses', accessor: 'correctDiagnoses' },
                { header: 'Total Ratings', accessor: 'totalRatings' },
                { header: 'Accuracy (%)', accessor: 'accuracy' }
              ],
              'Model Version Performance'
            )}
            
            {renderTable(
              reportData.tables?.diseasePerformance,
              [
                { header: 'Disease', accessor: 'disease' },
                { header: 'Avg Rating', accessor: 'avgRating' },
                { header: 'Correct Diagnoses', accessor: 'correctDiagnoses' },
                { header: 'Total Ratings', accessor: 'totalRatings' },
                { header: 'Accuracy (%)', accessor: 'accuracy' }
              ],
              'Disease-Specific Performance'
            )}
          </div>
        );
        
      case 'client_activity':
        return (
          <div>
            {renderTable(
              reportData.tables?.activeUsers?.slice(0, 20),
              [
                { header: 'User ID', accessor: 'userId' },
                { header: 'Username', accessor: 'username' },
                { header: 'Diagnosis Count', accessor: 'diagnosisCount' },
                { header: 'Last Diagnosis', accessor: 'lastDiagnosis' }
              ],
              'Top Active Users'
            )}
            
            {renderTable(
              reportData.tables?.activityTrends?.slice(-15),
              [
                { header: 'Date', accessor: 'date' },
                { header: 'Active Users', accessor: 'activeUsers' },
                { header: 'Diagnoses', accessor: 'diagnoses' }
              ],
              'Recent Daily Activity'
            )}
          </div>
        );
        
      case 'growth_analysis':
        return (
          <div>
            {renderTable(
              reportData.tables?.userGrowth,
              [
                { header: 'Month', accessor: 'month' },
                { header: 'New Users', accessor: 'newUsers' }
              ],
              'Monthly User Growth'
            )}
            
            {renderTable(
              reportData.tables?.diagnosisGrowth,
              [
                { header: 'Month', accessor: 'month' },
                { header: 'Diagnoses', accessor: 'diagnoses' }
              ],
              'Monthly Diagnosis Activity'
            )}
            
            {renderTable(
              reportData.tables?.growthRates,
              [
                { header: 'Month', accessor: 'month' },
                { header: 'User Growth Rate (%)', accessor: 'userGrowthRate' },
                { header: 'Diagnosis Growth Rate (%)', accessor: 'diagnosisGrowthRate' }
              ],
              'Monthly Growth Rates'
            )}
          </div>
        );
        
      default:
        return (
          <p className="text-gray-500 italic text-center py-8">
            No tables available for this report type.
          </p>
        );
    }
  };
  
  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Spinner color="success" size="lg" className="mb-4" />
          <p className="text-gray-700">Loading report data...</p>
        </div>
      </div>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
        <p className="font-medium">Error: {error}</p>
        <p className="mt-2 text-sm">Please try again or contact support if the problem persists.</p>
      </div>
    );
  }
  
  // Display report preview and generation buttons
  if (reportData) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="flex justify-between items-center border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{reportData.title}</h2>
            <p className="text-gray-600 text-sm mt-1">Period: {reportData.dateRange.start} to {reportData.dateRange.end}</p>
          </div>
          
          <div className="flex gap-2">
            <Button
              color="primary"
              variant="flat"
              startContent={<FiDownload />}
              onClick={generatePDF}
              isLoading={generating}
              className="bg-white"
            >
              PDF
            </Button>
            <Button
              color="success"
              variant="flat"
              startContent={<FiDownload />}
              onClick={generateExcel}
              isLoading={generating}
              className="bg-white"
            >
              Excel
            </Button>
          </div>
        </CardHeader>
        
        <CardBody className="p-0">
          <Tabs 
            aria-label="Report Sections" 
            selectedKey={activeTab}
            onSelectionChange={setActiveTab}
            color="success"
            className="p-0"
          >
            <Tab
              key="summary"
              title={
                <div className="flex items-center gap-2">
                  <FiFileText />
                  <span>Summary</span>
                </div>
              }
            >
              {renderReportContent()}
            </Tab>
            <Tab
              key="charts"
              title={
                <div className="flex items-center gap-2">
                  <FiBarChart2 />
                  <span>Charts</span>
                </div>
              }
            >
              {renderReportContent()}
            </Tab>
            <Tab
              key="tables"
              title={
                <div className="flex items-center gap-2">
                  <FiTable />
                  <span>Tables</span>
                </div>
              }
            >
              {renderReportContent()}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    );
  }
  
  return null;
};

export default ReportGenerator;