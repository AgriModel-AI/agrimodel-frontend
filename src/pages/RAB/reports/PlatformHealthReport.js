import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';

const PlatformHealthReport = ({ data }) => {
  const supportTypeChartRef = useRef(null);
  const supportStatusChartRef = useRef(null);
  const modelRatingsChartRef = useRef(null);
  
  useEffect(() => {
    if (data) {
      renderSupportTypeChart();
      renderSupportStatusChart();
      renderModelRatingsChart();
    }
    
    return () => {
      const charts = [
        supportTypeChartRef.current, 
        supportStatusChartRef.current,
        modelRatingsChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderSupportTypeChart = () => {
    const ctx = document.getElementById('supportTypeChart').getContext('2d');
    
    if (supportTypeChartRef.current) {
      supportTypeChartRef.current.destroy();
    }
    
    const supportTypeData = data.support_by_type;
    const typeLabels = supportTypeData.map(item => item.type);
    const typeCounts = supportTypeData.map(item => item.count);
    
    supportTypeChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: typeLabels,
        datasets: [{
          data: typeCounts,
          backgroundColor: [
            '#2e7d32', '#a5d6a7', '#f57c00', '#ffcc80', '#78909c'
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
  
  const renderSupportStatusChart = () => {
    const ctx = document.getElementById('supportStatusChart').getContext('2d');
    
    if (supportStatusChartRef.current) {
      supportStatusChartRef.current.destroy();
    }
    
    const supportStatusData = data.support_by_status;
    const statusLabels = supportStatusData.map(item => item.status);
    const statusCounts = supportStatusData.map(item => item.count);
    
    supportStatusChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: statusLabels,
        datasets: [{
          data: statusCounts,
          backgroundColor: [
            '#f57c00', '#2e7d32', '#78909c', '#e53935'
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
  
  const renderModelRatingsChart = () => {
    const ctx = document.getElementById('modelRatingsChart').getContext('2d');
    
    if (modelRatingsChartRef.current) {
      modelRatingsChartRef.current.destroy();
    }
    
    const modelRatingsData = data.model_ratings;
    const versionLabels = modelRatingsData.map(item => item.version);
    const avgRatings = modelRatingsData.map(item => item.avg_rating);
    const accuracyPcts = modelRatingsData.map(item => item.accuracy_pct);
    
    modelRatingsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: versionLabels,
        datasets: [
          {
            label: 'Avg. Rating (1-5)',
            data: avgRatings,
            backgroundColor: '#2e7d32',
            borderColor: '#2e7d32',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Accuracy %',
            data: accuracyPcts,
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
            max: 5,
            title: {
              display: true,
              text: 'Average Rating'
            }
          },
          y1: {
            beginAtZero: true,
            max: 100,
            position: 'right',
            grid: {
              drawOnChartArea: false
            },
            title: {
              display: true,
              text: 'Accuracy %'
            }
          }
        }
      }
    });
  };
  
  return (
    <div className="report">
      <div className="report-row">
        <div className="report-section half-width">
          <h2 className="section-title">Support Requests by Type</h2>
          <div className="chart-container">
            <canvas id="supportTypeChart"></canvas>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request Type</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.support_by_type.map((item, index) => (
                  <tr key={index}>
                    <td>{item.type}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="report-section half-width">
          <h2 className="section-title">Support Requests by Status</h2>
          <div className="chart-container">
            <canvas id="supportStatusChart"></canvas>
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
                {data.support_by_status.map((item, index) => (
                  <tr key={index}>
                    <td>{item.status}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Resolution Performance</h2>
        <div className="metric-cards">
          <div className="metric-card">
            <h3 className="metric-title">Average Resolution Time</h3>
            <div className="metric-value">{data.avg_resolution_time_hours.toFixed(1)}</div>
            <div className="metric-unit">hours</div>
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Model Ratings & Performance</h2>
        <div className="chart-container">
          <canvas id="modelRatingsChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Model Version</th>
                <th>Average Rating</th>
                <th>Rating Count</th>
                <th>Correct Diagnoses</th>
                <th>Incorrect Diagnoses</th>
                <th>Accuracy %</th>
              </tr>
            </thead>
            <tbody>
              {data.model_ratings.map((item, index) => (
                <tr key={index}>
                  <td>{item.version}</td>
                  <td>{item.avg_rating.toFixed(1)}</td>
                  <td>{item.rating_count}</td>
                  <td>{item.correct_count}</td>
                  <td>{item.incorrect_count}</td>
                  <td>{item.accuracy_pct.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlatformHealthReport;