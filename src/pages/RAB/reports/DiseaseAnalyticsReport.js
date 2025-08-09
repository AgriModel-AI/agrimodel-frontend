import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';
import LoadingIndicator from './LoadingIndicator';

const DiseaseAnalyticsReport = ({ data }) => {
  const commonDiseasesChartRef = useRef(null);
  const diseaseTrendsChartRef = useRef(null);
  const detectionRatioChartRef = useRef(null);
  const modelPerformanceChartRef = useRef(null);


  const hasRequiredData = data && 
    data.common_diseases && 
    data.disease_trends && 
    data.detection_ratio && 
    data.model_performance;
  
  useEffect(() => {
    if (hasRequiredData) {
      renderCommonDiseasesChart();
      renderDiseaseTrendsChart();
      renderDetectionRatioChart();
      renderModelPerformanceChart();
    }
    
    return () => {
      const charts = [
        commonDiseasesChartRef.current, 
        diseaseTrendsChartRef.current,
        detectionRatioChartRef.current,
        modelPerformanceChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [hasRequiredData]);
  
  const renderCommonDiseasesChart = () => {
    const ctx = document.getElementById('commonDiseasesChart').getContext('2d');
    
    if (commonDiseasesChartRef.current) {
      commonDiseasesChartRef.current.destroy();
    }
    
    const diseaseNames = data?.common_diseases.map(item => item.name);
    const diseaseCounts = data?.common_diseases.map(item => item.count);
    
    commonDiseasesChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: diseaseNames,
        datasets: [{
          label: 'Detection Count',
          data: diseaseCounts,
          backgroundColor: '#2e7d32',
          borderColor: '#2e7d32',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false
      }
    });
  };
  
  const renderDiseaseTrendsChart = () => {
    const ctx = document.getElementById('diseaseTrendsChart').getContext('2d');
    
    if (diseaseTrendsChartRef.current) {
      diseaseTrendsChartRef.current.destroy();
    }
    
    // Group data by disease and date
    const diseases = [...new Set(data?.disease_trends.map(item => item.disease))];
    const dates = [...new Set(data?.disease_trends.map(item => item.date))].sort();
    
    // Create datasets for each disease
    const datasets = diseases.map((disease, index) => {
      const color = getColor(index);
      const dataPoints = dates.map(date => {
        const item = data?.disease_trends.find(i => i.disease === disease && i.date === date);
        return item ? item.count : 0;
      });
      
      return {
        label: disease,
        data: dataPoints,
        backgroundColor: color,
        borderColor: color,
        borderWidth: 2,
        fill: false
      };
    });
    
    diseaseTrendsChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };
  
  const renderDetectionRatioChart = () => {
    const ctx = document.getElementById('detectionRatioChart').getContext('2d');
    
    if (detectionRatioChartRef.current) {
      detectionRatioChartRef.current.destroy();
    }
    
    const statusLabels = data?.detection_ratio.map(item => item.status);
    const statusCounts = data?.detection_ratio.map(item => item.count);
    
    detectionRatioChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusCounts,
          backgroundColor: [
            '#e53935', '#2e7d32'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  };
  
  const renderModelPerformanceChart = () => {
    const ctx = document.getElementById('modelPerformanceChart').getContext('2d');
    
    if (modelPerformanceChartRef.current) {
      modelPerformanceChartRef.current.destroy();
    }
    
    const versionLabels = data?.model_performance.map(item => item.version);
    const accuracyPcts = data?.model_performance.map(item => item.accuracy_pct);
    const totalDiagnoses = data?.model_performance.map(item => item.total_diagnoses);
    
    modelPerformanceChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: versionLabels,
        datasets: [
          {
            label: 'Accuracy %',
            data: accuracyPcts,
            backgroundColor: '#2e7d32',
            borderColor: '#2e7d32',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Total Diagnoses',
            data: totalDiagnoses,
            backgroundColor: '#f57c00',
            borderColor: '#f57c00',
            borderWidth: 1,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Accuracy %'
            }
          },
          y1: {
            beginAtZero: true,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: 'Total Diagnoses'
            }
          }
        }
      }
    });
  };
  
  // Helper function to get colors for multiple datasets
  const getColor = (index) => {
    const colors = [
      '#2e7d32', '#f57c00', '#0277bd', '#c2185b', 
      '#7b1fa2', '#00695c', '#ff5722', '#3949ab'
    ];
    return colors[index % colors.length];
  };
  
  if (!hasRequiredData) {
    return LoadingIndicator ? <LoadingIndicator /> : (
      <div className="report-section">
        <h2 className="section-title">Loading Data</h2>
        <p>Please wait while we load the report data...</p>
      </div>
    );
  }

  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">Most Common Diseases</h2>
        <div className="chart-container">
          <canvas id="commonDiseasesChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Disease</th>
                <th>Detection Count</th>
              </tr>
            </thead>
            <tbody>
              {data?.common_diseases.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Disease Trends Over Time</h2>
        <div className="chart-container large-chart">
          <canvas id="diseaseTrendsChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Disease</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {data?.disease_trends.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.disease}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              {data?.disease_trends.length > 10 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    Showing 10 of {data?.disease_trends.length} entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-row">
        <div className="report-section half-width">
          <h2 className="section-title">Detection Results</h2>
          <div className="chart-container">
            <canvas id="detectionRatioChart"></canvas>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {data?.detection_ratio.map((item, index) => (
                  <tr key={index}>
                    <td>{item.status}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="report-section half-width">
          <h2 className="section-title">Model Version Performance</h2>
          <div className="chart-container">
            <canvas id="modelPerformanceChart"></canvas>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Version</th>
                  <th>Total</th>
                  <th>Rated</th>
                  <th>Correct</th>
                  <th>Accuracy %</th>
                </tr>
              </thead>
              <tbody>
                {data?.model_performance.map((item, index) => (
                  <tr key={index}>
                    <td>{item.version}</td>
                    <td>{item.total_diagnoses}</td>
                    <td>{item.rated_count}</td>
                    <td>{item.correct_count}</td>
                    <td>{item.accuracy_pct.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseAnalyticsReport;



