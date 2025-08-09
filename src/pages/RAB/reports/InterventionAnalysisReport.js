import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';

const InterventionAnalysisReport = ({ data }) => {
  const treatmentSuccessChartRef = useRef(null);
  const diseaseSpecificChartRef = useRef(null);
  const preventionAdoptionChartRef = useRef(null);
  const improvedDistrictsChartRef = useRef(null);
  const improvedCropsChartRef = useRef(null);
  
  useEffect(() => {
    if (data) {
      renderTreatmentSuccessChart();
      renderDiseaseSpecificChart();
      renderPreventionAdoptionChart();
      renderImprovedDistrictsChart();
      renderImprovedCropsChart();
    }
    
    return () => {
      const charts = [
        treatmentSuccessChartRef.current, 
        diseaseSpecificChartRef.current,
        preventionAdoptionChartRef.current,
        improvedDistrictsChartRef.current,
        improvedCropsChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderTreatmentSuccessChart = () => {
    const ctx = document.getElementById('treatmentSuccessChart').getContext('2d');
    
    if (treatmentSuccessChartRef.current) {
      treatmentSuccessChartRef.current.destroy();
    }
    
    const treatmentData = data.sample_data.treatment_success_rates;
    const treatmentLabels = treatmentData.map(item => item.treatment);
    const successRates = treatmentData.map(item => item.success_rate);
    const applicationCounts = treatmentData.map(item => item.application_count);
    
    treatmentSuccessChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: treatmentLabels,
        datasets: [
          {
            label: 'Success Rate (%)',
            data: successRates,
            backgroundColor: '#2e7d32',
            borderColor: '#2e7d32',
            borderWidth: 1,
            yAxisID: 'y'
          },
          {
            label: 'Applications',
            data: applicationCounts,
            backgroundColor: '#f57c00',
            borderColor: '#f57c00',
            borderWidth: 1,
            yAxisID: 'y1',
            type: 'line'
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
              text: 'Success Rate (%)'
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
              text: 'Number of Applications'
            }
          }
        }
      }
    });
  };
  
  // Example of how to update chart rendering
const renderDiseaseSpecificChart = () => {
  const ctx = document.getElementById('diseaseSpecificChart').getContext('2d');
  
  if (diseaseSpecificChartRef.current) {
    diseaseSpecificChartRef.current.destroy();
  }
  
  const diseaseSpecificData = data.sample_data.disease_specific_treatments;
  
  diseaseSpecificChartRef.current = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: diseaseSpecificData.map(item => item.disease),
      datasets: [{
        label: 'Success Rate (%)',
        data: diseaseSpecificData.map(item => item.success_rate),
        backgroundColor: [
          '#2e7d32', '#a5d6a7', '#f57c00', '#ffcc80', '#0277bd'
        ],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
};

// In the render section, update table rendering:
<div className="table-container mt-4">
  <table className="data-table">
    <thead>
      <tr>
        <th>Disease</th>
        <th>Most Effective Treatment</th>
        <th>Success Rate (%)</th>
      </tr>
    </thead>
    <tbody>
      {data.sample_data.disease_specific_treatments.map((item, index) => (
        <tr key={index}>
          <td>{item.disease}</td>
          <td>{item.treatment}</td>
          <td>{item.success_rate}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  
  const renderPreventionAdoptionChart = () => {
    const ctx = document.getElementById('preventionAdoptionChart').getContext('2d');
    
    if (preventionAdoptionChartRef.current) {
      preventionAdoptionChartRef.current.destroy();
    }
    
    // Simulated data
    const preventionData = [
      { strategy: 'Crop Rotation', adoption: 68.3, effectiveness: 82.7 },
      { strategy: 'Resistant Varieties', adoption: 45.9, effectiveness: 91.5 },
      { strategy: 'Field Sanitation', adoption: 73.2, effectiveness: 78.9 },
      { strategy: 'Regular Monitoring', adoption: 89.5, effectiveness: 86.2 },
      { strategy: 'Proper Spacing', adoption: 81.7, effectiveness: 74.1 }
    ];
    
    preventionAdoptionChartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: preventionData.map(item => item.strategy),
        datasets: [
          {
            label: 'Adoption Rate (%)',
            data: preventionData.map(item => item.adoption),
            backgroundColor: 'rgba(46, 125, 50, 0.2)',
            borderColor: '#2e7d32',
            borderWidth: 2,
            pointBackgroundColor: '#2e7d32'
          },
          {
            label: 'Effectiveness (%)',
            data: preventionData.map(item => item.effectiveness),
            backgroundColor: 'rgba(245, 124, 0, 0.2)',
            borderColor: '#f57c00',
            borderWidth: 2,
            pointBackgroundColor: '#f57c00'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              stepSize: 20
            }
          }
        }
      }
    });
  };
  
  const renderImprovedDistrictsChart = () => {
    const ctx = document.getElementById('improvedDistrictsChart').getContext('2d');
    
    if (improvedDistrictsChartRef.current) {
      improvedDistrictsChartRef.current.destroy();
    }
    
    // Simulated data
    const improvedDistrictsData = [
      { district: 'Nyamagabe', before: 82, after: 37 },
      { district: 'Muhanga', before: 76, after: 41 },
      { district: 'Rubavu', before: 68, after: 32 },
      { district: 'Huye', before: 61, after: 29 }
    ];
    
    improvedDistrictsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: improvedDistrictsData.map(item => item.district),
        datasets: [
          {
            label: 'Before Intervention',
            data: improvedDistrictsData.map(item => item.before),
            backgroundColor: '#dc3545',
            borderColor: '#dc3545',
            borderWidth: 1
          },
          {
            label: 'After Intervention',
            data: improvedDistrictsData.map(item => item.after),
            backgroundColor: '#2e7d32',
            borderColor: '#2e7d32',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Disease Incidents'
            }
          }
        }
      }
    });
  };
  
  const renderImprovedCropsChart = () => {
    const ctx = document.getElementById('improvedCropsChart').getContext('2d');
    
    if (improvedCropsChartRef.current) {
      improvedCropsChartRef.current.destroy();
    }
    
    // Simulated data
    const improvedCropsData = [
      { crop: 'Coffee', before: 89, after: 42 },
      { crop: 'Banana', before: 72, after: 35 },
      { crop: 'Beans', before: 65, after: 31 },
      { crop: 'Cassava', before: 58, after: 27 }
    ];
    
    improvedCropsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: improvedCropsData.map(item => item.crop),
        datasets: [
          {
            label: 'Before Intervention',
            data: improvedCropsData.map(item => item.before),
            backgroundColor: '#dc3545',
            borderColor: '#dc3545',
            borderWidth: 1
          },
          {
            label: 'After Intervention',
            data: improvedCropsData.map(item => item.after),
            backgroundColor: '#2e7d32',
            borderColor: '#2e7d32',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Disease Incidents'
            }
          }
        }
      }
    });
  };
  
  return (
    <div className="report">
      <div className="alert alert-info mb-4">
        <i className="bi bi-info-circle-fill me-2"></i>
        <strong>Note:</strong> {data.message}
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Treatment Success Rates</h2>
        <div className="chart-container">
          <canvas id="treatmentSuccessChart"></canvas>
        </div>
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Treatment</th>
                <th>Success Rate (%)</th>
                <th>Applications</th>
              </tr>
            </thead>
            <tbody>
              {data.sample_data.treatment_success_rates.map((item, index) => (
                <tr key={index}>
                  <td>{item.treatment}</td>
                  <td>{item.success_rate}</td>
                  <td>{item.application_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-row">
        <div className="report-section half-width">
          <h2 className="section-title">Disease-Specific Treatments</h2>
          <div className="chart-container">
            <canvas id="diseaseSpecificChart"></canvas>
          </div>
          <div className="table-container mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Disease</th>
                  <th>Most Effective Treatment</th>
                  <th>Success Rate (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Coffee Leaf Rust</td>
                  <td>Copper-based Fungicide</td>
                  <td>87.2</td>
                </tr>
                <tr>
                  <td>Banana Bacterial Wilt</td>
                  <td>Plant Removal + Sterilization</td>
                  <td>93.5</td>
                </tr>
                <tr>
                  <td>Cassava Mosaic Disease</td>
                  <td>Resistant Varieties</td>
                  <td>96.8</td>
                </tr>
                <tr>
                  <td>Bean Anthracnose</td>
                  <td>Seed Treatment</td>
                  <td>82.3</td>
                </tr>
                <tr>
                  <td>Maize Lethal Necrosis</td>
                  <td>Crop Rotation</td>
                  <td>76.9</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="report-section half-width">
          <h2 className="section-title">Prevention Strategy Adoption</h2>
          <div className="chart-container">
            <canvas id="preventionAdoptionChart"></canvas>
          </div>
          <div className="table-container mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Prevention Strategy</th>
                  <th>Adoption Rate (%)</th>
                  <th>Effectiveness (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Crop Rotation</td>
                  <td>68.3</td>
                  <td>82.7</td>
                </tr>
                <tr>
                  <td>Resistant Varieties</td>
                  <td>45.9</td>
                  <td>91.5</td>
                </tr>
                <tr>
                  <td>Field Sanitation</td>
                  <td>73.2</td>
                  <td>78.9</td>
                </tr>
                <tr>
                  <td>Regular Monitoring</td>
                  <td>89.5</td>
                  <td>86.2</td>
                </tr>
                <tr>
                  <td>Proper Spacing</td>
                  <td>81.7</td>
                  <td>74.1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Before & After Analysis</h2>
        <div className="report-row">
          <div className="half-width">
            <div className="insights-card">
              <div className="insights-header">Most Improved Districts</div>
              <div className="insights-body">
                <div className="chart-container" style={{ height: '300px' }}>
                  <canvas id="improvedDistrictsChart"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="half-width">
            <div className="insights-card">
              <div className="insights-header">Most Improved Crops</div>
              <div className="insights-body">
                <div className="chart-container" style={{ height: '300px' }}>
                  <canvas id="improvedCropsChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="alert alert-success mt-4">
          <strong>Key Insight:</strong> Implementing targeted interventions based on AgriModel AI recommendations has shown a 43% average reduction in disease prevalence across most affected districts.
        </div>
      </div>
    </div>
  );
};

export default InterventionAnalysisReport;