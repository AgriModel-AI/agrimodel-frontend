import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';

const CropMonitoringReport = ({ data }) => {
  const cropDiseasesChartRef = useRef(null);
  const seasonalPatternsChartRef = useRef(null);
  const cropVulnerabilityChartRef = useRef(null);
  
  useEffect(() => {
    if (data) {
      renderCropDiseasesChart();
      renderSeasonalPatternsChart();
      renderCropVulnerabilityChart();
    }
    
    return () => {
      const charts = [
        cropDiseasesChartRef.current, 
        seasonalPatternsChartRef.current,
        cropVulnerabilityChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderCropDiseasesChart = () => {
    const ctx = document.getElementById('cropDiseasesChart').getContext('2d');
    
    if (cropDiseasesChartRef.current) {
      cropDiseasesChartRef.current.destroy();
    }
    
    // Group data by crop
    const cropNames = [...new Set(data.crop_diseases.map(item => item.crop_name))];
    
    // Create datasets for each crop
    const cropDatasets = cropNames.map(cropName => {
      const cropData = data.crop_diseases.filter(item => item.crop_name === cropName);
      return {
        crop: cropName,
        diseases: cropData.map(item => item.disease_name),
        counts: cropData.map(item => item.count),
        total: cropData.reduce((sum, item) => sum + item.count, 0)
      };
    }).sort((a, b) => b.total - a.total);
    
    // Create stacked bar chart for top 5 crops
    const topCrops = cropDatasets.slice(0, 5);
    
    // Get all unique diseases across top crops
    const allDiseases = [...new Set(topCrops.flatMap(crop => crop.diseases))];
    
    // Create datasets for each disease
    const diseaseDatasets = allDiseases.map((disease, index) => {
      return {
        label: disease,
        data: topCrops.map(crop => {
          const diseaseItem = data.crop_diseases.find(item => 
            item.crop_name === crop.crop && item.disease_name === disease);
          return diseaseItem ? diseaseItem.count : 0;
        }),
        backgroundColor: getColor(index),
        borderColor: getColor(index),
        borderWidth: 1
      };
    });
    
    cropDiseasesChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topCrops.map(crop => crop.crop),
        datasets: diseaseDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Disease Distribution in Top 5 Crops'
          },
          legend: {
            position: 'right'
          }
        }
      }
    });
  };
  
  const renderSeasonalPatternsChart = () => {
    const ctx = document.getElementById('seasonalPatternsChart').getContext('2d');
    
    if (seasonalPatternsChartRef.current) {
      seasonalPatternsChartRef.current.destroy();
    }
    
    // Convert month numbers to names
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Get top 3 crops for seasonal analysis
    const topSeasonalCrops = [...new Set(data.seasonal_patterns.map(item => item.crop_name))]
      .map(cropName => {
        const cropItems = data.seasonal_patterns.filter(item => item.crop_name === cropName);
        return {
          crop: cropName,
          total: cropItems.reduce((sum, item) => sum + item.count, 0)
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 3)
      .map(item => item.crop);
    
    // Create datasets for each top crop
    const seasonalDatasets = topSeasonalCrops.map((crop, index) => {
      const monthlyValues = Array(12).fill(0);
      
      data.seasonal_patterns.forEach(item => {
        if (item.crop_name === crop && item.month >= 1 && item.month <= 12) {
          monthlyValues[item.month - 1] += item.count;
        }
      });
      
      return {
        label: crop,
        data: monthlyValues,
        backgroundColor: getColor(index),
        borderColor: getColor(index),
        borderWidth: 2,
        fill: false,
        tension: 0.4
      };
    });
    
    seasonalPatternsChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthNames,
        datasets: seasonalDatasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Seasonal Disease Patterns for Top 3 Crops'
          }
        }
      }
    });
  };
  
  const renderCropVulnerabilityChart = () => {
    const ctx = document.getElementById('cropVulnerabilityChart').getContext('2d');
    
    if (cropVulnerabilityChartRef.current) {
      cropVulnerabilityChartRef.current.destroy();
    }
    
    // Get unique crop names
    const cropNames = [...new Set(data.crop_diseases.map(item => item.crop_name))];
    
    // Calculate vulnerability scores (simulated as we don't have real scores)
    const vulnerabilityData = cropNames.map(crop => {
      const cropItems = data.crop_diseases.filter(item => item.crop_name === crop);
      const diseaseCount = cropItems.reduce((sum, item) => sum + item.count, 0);
      
      // Calculate disease diversity (number of different diseases)
      const diseaseTypes = new Set(cropItems.map(item => item.disease_name)).size;
      
      // Normalize scores between 0-100
      const maxDiseaseCount = Math.max(...cropNames.map(c => {
        return data.crop_diseases
          .filter(item => item.crop_name === c)
          .reduce((sum, item) => sum + item.count, 0);
      }));
      
      const normalizedCount = (diseaseCount / maxDiseaseCount) * 100;
      
      // Get seasonal spread (estimate from seasonal_patterns data)
      const affectedMonths = new Set(
        data.seasonal_patterns.filter(item => item.crop_name === crop).map(item => item.month)
      ).size;
      
      const monthScore = (affectedMonths / 12) * 100;
      const diversityScore = Math.min(diseaseTypes * 20, 100);
      
      return {
        crop,
        diseaseCount,
        affectedMonths,
        diseaseTypes,
        normalizedCount,
        monthScore,
        diversityScore,
        vulnerabilityScore: (normalizedCount * 0.5) + (monthScore * 0.3) + (diversityScore * 0.2)
      };
    }).sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore).slice(0, 6);
    
    cropVulnerabilityChartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Disease Prevalence', 'Seasonal Spread', 'Disease Diversity'],
        datasets: vulnerabilityData.map((item, index) => {
          const color = getColor(index);
          return {
            label: item.crop,
            data: [item.normalizedCount, item.monthScore, item.diversityScore],
            backgroundColor: color.replace(')', ', 0.2)').replace('rgb', 'rgba'),
            borderColor: color,
            borderWidth: 2,
            pointBackgroundColor: color
          };
        })
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
        },
        plugins: {
          title: {
            display: true,
            text: 'Crop Vulnerability Analysis'
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
  
  // Find most vulnerable crop
  const getMostVulnerableCrop = () => {
    const cropCounts = {};
    data.crop_diseases.forEach(item => {
      cropCounts[item.crop_name] = (cropCounts[item.crop_name] || 0) + item.count;
    });
    
    let maxCount = 0;
    let maxCrop = '';
    
    Object.entries(cropCounts).forEach(([crop, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxCrop = crop;
      }
    });
    
    return { crop: maxCrop, count: maxCount };
  };
  
  // Find peak disease month
  const getPeakMonth = () => {
    const monthCounts = {};
    data.seasonal_patterns.forEach(item => {
      monthCounts[item.month] = (monthCounts[item.month] || 0) + item.count;
    });
    
    let maxCount = 0;
    let maxMonth = 1;
    
    Object.entries(monthCounts).forEach(([month, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMonth = month;
      }
    });
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return { month: monthNames[maxMonth - 1], count: maxCount };
  };
  
  // Find most common disease
  const getMostCommonDisease = () => {
    const diseaseCounts = {};
    data.crop_diseases.forEach(item => {
      diseaseCounts[item.disease_name] = (diseaseCounts[item.disease_name] || 0) + item.count;
    });
    
    let maxCount = 0;
    let maxDisease = '';
    
    Object.entries(diseaseCounts).forEach(([disease, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxDisease = disease;
      }
    });
    
    return { disease: maxDisease, count: maxCount };
  };
  
  const mostVulnerableCrop = getMostVulnerableCrop();
  const peakMonth = getPeakMonth();
  const mostCommonDisease = getMostCommonDisease();
  
  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">Diseases by Crop Type</h2>
        <div className="chart-container" style={{ height: '450px' }}>
          <canvas id="cropDiseasesChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Disease</th>
                <th>Detection Count</th>
              </tr>
            </thead>
            <tbody>
              {data.crop_diseases.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.crop_name}</td>
                  <td>{item.disease_name}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              {data.crop_diseases.length > 10 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    Showing 10 of {data.crop_diseases.length} entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Seasonal Disease Patterns</h2>
        <div className="chart-container" style={{ height: '450px' }}>
          <canvas id="seasonalPatternsChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Crop</th>
                <th>Disease</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {data.seasonal_patterns.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.month}</td>
                  <td>{item.crop_name}</td>
                  <td>{item.disease_name}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              {data.seasonal_patterns.length > 10 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    Showing 10 of {data.seasonal_patterns.length} entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Crop Vulnerability Analysis</h2>
        <div className="report-row">
          <div className="half-width">
            <div className="chart-container">
              <canvas id="cropVulnerabilityChart"></canvas>
            </div>
          </div>
          <div className="half-width">
            <div className="insights-card">
              <div className="insights-header">Key Insights</div>
              <div className="insights-body">
                <div className="insight-item">
                  <strong>Most Vulnerable Crop:</strong> {mostVulnerableCrop.crop} with {mostVulnerableCrop.count} disease detections
                </div>
                <div className="insight-item">
                  <strong>Peak Disease Month:</strong> {peakMonth.month} with {peakMonth.count} detections
                </div>
                <div className="insight-item">
                  <strong>Most Common Disease:</strong> {mostCommonDisease.disease} with {mostCommonDisease.count} detections
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropMonitoringReport;