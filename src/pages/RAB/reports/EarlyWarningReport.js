import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ReportStyles.css';

const EarlyWarningReport = ({ data }) => {
  const anomalyChartRef = useRef(null);
  const seasonalCalendarChartRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => {
    if (data) {
      renderAnomalyChart();
      renderSeasonalCalendarChart();
      setMapReady(true);
    }
    
    return () => {
      const charts = [
        anomalyChartRef.current, 
        seasonalCalendarChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderAnomalyChart = () => {
    const ctx = document.getElementById('anomalyChart').getContext('2d');
    
    if (anomalyChartRef.current) {
      anomalyChartRef.current.destroy();
    }
    
    // Get anomaly data
    const anomalyData = data.anomaly_detection;
    
    anomalyChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: anomalyData.labels,
        datasets: [
          {
            label: 'Expected Range',
            data: Array(anomalyData.labels.length).fill(null),
            backgroundColor: 'rgba(46, 125, 50, 0.2)',
            borderColor: 'rgba(46, 125, 50, 0.2)',
            fill: '+1',
          },
          {
            label: 'Expected Upper Bound',
            data: anomalyData.expected_upper,
            backgroundColor: 'rgba(46, 125, 50, 0)',
            borderColor: 'rgba(46, 125, 50, 0.5)',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'Expected Lower Bound',
            data: anomalyData.expected_lower,
            backgroundColor: 'rgba(46, 125, 50, 0.2)',
            borderColor: 'rgba(46, 125, 50, 0.5)',
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'Actual Cases',
            data: anomalyData.actual,
            backgroundColor: 'rgba(220, 53, 69, 0)',
            borderColor: '#dc3545',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: '#dc3545',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: anomalyData.title
          },
          legend: {
            display: true
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Number of Cases'
            }
          }
        }
      }
    });
  };
  
  const renderSeasonalCalendarChart = () => {
    const ctx = document.getElementById('seasonalCalendarChart').getContext('2d');
    
    if (seasonalCalendarChartRef.current) {
      seasonalCalendarChartRef.current.destroy();
    }
    
    const seasonalData = data.seasonal_calendar;
    
    // Create datasets for each disease
    const datasets = seasonalData.diseases.map((disease, index) => {
      const color = getColor(index);
      return {
        label: disease.name,
        data: disease.risk_levels,
        borderColor: color,
        backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
        fill: true,
        tension: 0.4
      };
    });
    
    seasonalCalendarChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: seasonalData.months,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Seasonal Disease Prevalence (Risk Level)'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Risk Level'
            }
          }
        }
      }
    });
  };
  
  // Helper function to get colors for multiple datasets
  const getColor = (index) => {
    const colors = [
      '#dc3545', '#ffc107', '#2e7d32', '#0277bd', 
      '#7b1fa2', '#00695c', '#ff5722', '#3949ab'
    ];
    return colors[index % colors.length];
  };
  
  // Function to get appropriate recommendation based on seasonal data
  const getSeasonalRecommendation = () => {
    if (!data || !data.seasonal_calendar || !data.seasonal_calendar.diseases || data.seasonal_calendar.diseases.length === 0) {
      return "No seasonal data available for recommendations.";
    }
    
    // Get current month index (0-11)
    const currentMonth = new Date().getMonth();
    // Get next month index (0-11)
    const nextMonth = (currentMonth + 1) % 12;
    
    // Find diseases with high risk in current or next month
    const highRiskDiseases = data.seasonal_calendar.diseases
      .filter(disease => disease.risk_levels[currentMonth] > 60 || disease.risk_levels[nextMonth] > 60)
      .map(disease => disease.name);
    
    if (highRiskDiseases.length === 0) {
      return "No high-risk diseases identified for the current season.";
    }
    
    const currentMonthName = data.seasonal_calendar.months[currentMonth];
    const nextMonthName = data.seasonal_calendar.months[nextMonth];
    
    return `Based on the seasonal disease calendar, farmers should implement preventive measures for ${highRiskDiseases.join(', ')} during ${currentMonthName}-${nextMonthName}.`;
  };
  
  if (!data) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">Recent Disease Outbreaks</h2>
        <div id="outbreakMapContainer" style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
          {mapReady && (
            <MapContainer center={[-1.9403, 29.8739]} zoom={8} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {/* In a real app, we would use actual district coordinates */}
              {/* This is a simplified placeholder that creates markers for outbreaks */}
              {data.recent_outbreaks.map((outbreak, index) => {
                // Create semi-random coordinates around Rwanda center
                const angle = (index / data.recent_outbreaks.length) * Math.PI * 2;
                const radius = 0.5 + Math.random() * 0.5;
                const lat = -1.9403 + Math.cos(angle) * radius;
                const lng = 29.8739 + Math.sin(angle) * radius;
                
                // Determine marker size and color based on case count
                const markerRadius = 10 + (outbreak.case_count / 10) * 10;
                let color = '#2e7d32'; // Green for low
                
                if (outbreak.case_count > 20) {
                  color = '#dc3545'; // Red for high
                } else if (outbreak.case_count > 10) {
                  color = '#ffc107'; // Yellow for medium
                }
                
                return (
                  <CircleMarker
                    key={index}
                    center={[lat, lng]}
                    radius={markerRadius}
                    fillColor={color}
                    color="#fff"
                    weight={1}
                    opacity={1}
                    fillOpacity={0.8}
                  >
                    <Popup>
                      <strong>{outbreak.disease_name}</strong><br />
                      {outbreak.district_name}<br />
                      Cases: {outbreak.case_count}<br />
                      Latest: {outbreak.latest_date}
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}
        </div>
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Disease</th>
                <th>District</th>
                <th>Case Count</th>
                <th>Latest Date</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_outbreaks.length > 0 ? (
                data.recent_outbreaks.map((item, index) => (
                  <tr key={index}>
                    <td>{item.disease_name}</td>
                    <td>{item.district_name}</td>
                    <td>{item.case_count}</td>
                    <td>{item.latest_date}</td>
                    <td>
                      {item.case_count > 20 ? (
                        <span className="badge bg-danger">High</span>
                      ) : item.case_count > 10 ? (
                        <span className="badge bg-warning text-dark">Medium</span>
                      ) : (
                        <span className="badge bg-success">Low</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">No recent outbreaks detected</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {data.message && (
        <div className="alert alert-info mb-4">
          <i className="bi bi-info-circle-fill me-2"></i>
          <strong>Note:</strong> {data.message}
        </div>
      )}
      
      <div className="report-section">
        <h2 className="section-title">Disease Forecast</h2>
        <div className="report-row">
          {data.disease_forecast.map((forecast, index) => (
            <div key={index} className={`forecast-card severity-${forecast.risk_level}`}>
              <div className="forecast-body">
                <h3 className="forecast-title">{forecast.disease}</h3>
                <h4 className="forecast-subtitle">{forecast.locations.join(', ')}</h4>
                <div className="forecast-details">
                  <div className="forecast-item">
                    <span className="forecast-label">Forecast:</span>
                    <span className={`forecast-value ${forecast.risk_level}`}>
                      {forecast.risk_level.charAt(0).toUpperCase() + forecast.risk_level.slice(1)} Risk
                    </span>
                  </div>
                  <div className="forecast-item">
                    <span className="forecast-label">Expected in:</span>
                    <span className="forecast-value">{forecast.expected_timeframe}</span>
                  </div>
                  <div className="forecast-description">
                    {forecast.description}
                  </div>
                </div>
                <div className="forecast-footer">
                  <span className="forecast-confidence">Confidence: {forecast.confidence}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Anomaly Detection</h2>
        <div className="report-row">
          <div className="half-width">
            <div className="chart-container">
              <canvas id="anomalyChart"></canvas>
            </div>
          </div>
          <div className="half-width">
            {data.anomaly_detection.alerts.map((alert, index) => (
              <div key={index} className="alert-area mb-3">
                <div className="outbreak-details">
                  <div className="alert-icon">⚠️</div>
                  <div>
                    <h5 className="mb-1">{alert.title}</h5>
                    <p className="mb-1">{alert.description}</p>
                    <small className="text-muted">Detected on {alert.date}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Seasonal Disease Calendar</h2>
        <div className="chart-container" style={{ height: '400px' }}>
          <canvas id="seasonalCalendarChart"></canvas>
        </div>
        <div className="alert alert-success mt-4">
          <strong>Recommendation:</strong> {getSeasonalRecommendation()}
        </div>
      </div>
    </div>
  );
};

export default EarlyWarningReport;