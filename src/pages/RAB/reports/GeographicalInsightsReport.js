import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './ReportStyles.css';

const GeographicalInsightsReport = ({ data }) => {
  const topDistrictsChartRef = useRef(null);
  const diseaseByDistrictChartRef = useRef(null);
  const activeDistrictsChartRef = useRef(null);
  const [mapReady, setMapReady] = useState(false);
  
  // Rwanda district coordinates
  const provinces = {
    "Kigali": [
      { geocode: [-1.9706, 30.1044], district: "Gasabo" },
      { geocode: [-1.9591, 30.0644], district: "Nyarugenge" },
      { geocode: [-1.9462, 30.0587], district: "Kicukiro" },
    ],
    "Northern": [
      { geocode: [-1.5078, 29.6347], district: "Musanze" },
      { geocode: [-1.4795, 29.8566], district: "Burera" },
      { geocode: [-1.6956, 29.6013], district: "Gakenke" },
      { geocode: [-1.6004, 29.7174], district: "Gicumbi" },
      { geocode: [-1.7592, 29.9964], district: "Rulindo" },
    ],
    "Western": [
      { geocode: [-1.6745, 29.2629], district: "Rubavu" },
      { geocode: [-1.5711, 29.6437], district: "Nyabihu" },
      { geocode: [-1.9876, 29.4911], district: "Rutsiro" },
      { geocode: [-2.0635, 29.5763], district: "Karongi" },
      { geocode: [-2.5225, 29.6329], district: "Rusizi" },
      { geocode: [-2.3921, 29.7537], district: "Nyamasheke" },
    ],
    "Southern": [
      { geocode: [-2.4814, 29.5755], district: "Nyamagabe" },
      { geocode: [-2.4402, 29.7172], district: "Ruhango" },
      { geocode: [-2.3493, 29.7547], district: "Nyanza" },
      { geocode: [-2.2797, 29.7446], district: "Muhanga" },
      { geocode: [-2.3031, 29.7737], district: "Kamonyi" },
      { geocode: [-2.6023, 29.7883], district: "Huye" },
      { geocode: [-2.5179, 29.7896], district: "Gisagara" },
    ],
    "Eastern": [
      { geocode: [-1.5081, 30.2455], district: "Nyagatare" },
      { geocode: [-1.7007, 30.1443], district: "Gatsibo" },
      { geocode: [-1.5801, 30.4303], district: "Kayonza" },
      { geocode: [-1.9534, 30.4357], district: "Rwamagana" },
      { geocode: [-2.1934, 30.1076], district: "Bugesera" },
    ],
  };
  
  // Create a district-to-geocode mapping for easier lookup
  const districtGeocode = {};
  Object.keys(provinces).forEach(province => {
    provinces[province].forEach(item => {
      districtGeocode[item.district.toLowerCase()] = {
        geocode: item.geocode,
        province: province
      };
    });
  });
  
  useEffect(() => {
    if (data) {
      renderTopDistrictsChart();
      renderDiseaseByDistrictChart();
      renderActiveDistrictsChart();
      setMapReady(true);
    }
    
    return () => {
      const charts = [
        topDistrictsChartRef.current, 
        diseaseByDistrictChartRef.current,
        activeDistrictsChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderTopDistrictsChart = () => {
    const ctx = document.getElementById('topDistrictsChart').getContext('2d');
    
    if (topDistrictsChartRef.current) {
      topDistrictsChartRef.current.destroy();
    }
    
    // Group data by district
    const districts = {};
    data.district_distribution.forEach(item => {
      if (!districts[item.district_name]) {
        districts[item.district_name] = {
          province: item.province_name,
          totalCount: 0,
          diseases: {}
        };
      }
      
      districts[item.district_name].totalCount += item.count;
      
      if (!districts[item.district_name].diseases[item.disease_name]) {
        districts[item.district_name].diseases[item.disease_name] = 0;
      }
      districts[item.district_name].diseases[item.disease_name] += item.count;
    });
    
    // Get top districts by total count
    const topDistrictsData = Object.entries(districts)
      .map(([district, data]) => ({
        district,
        province: data.province,
        count: data.totalCount
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    
    topDistrictsChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: topDistrictsData.map(item => item.district),
        datasets: [{
          data: topDistrictsData.map(item => item.count),
          backgroundColor: [
            '#2e7d32', '#a5d6a7', '#f57c00', '#ffcc80', 
            '#0277bd', '#81d4fa', '#c2185b', '#f48fb1'
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
          },
          title: {
            display: true,
            text: 'Top Districts by Disease Count'
          }
        }
      }
    });
  };
  
  const renderDiseaseByDistrictChart = () => {
    const ctx = document.getElementById('diseaseByDistrictChart').getContext('2d');
    
    if (diseaseByDistrictChartRef.current) {
      diseaseByDistrictChartRef.current.destroy();
    }
    
    // Get top 5 diseases
    const topDiseases = [...new Set(data.district_distribution.map(item => item.disease_name))]
      .map(disease => {
        const count = data.district_distribution
          .filter(item => item.disease_name === disease)
          .reduce((sum, item) => sum + item.count, 0);
        return { disease, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.disease);
    
    // Get top 5 districts
    const topDistrictNames = [...new Set(data.district_distribution.map(item => item.district_name))]
      .map(district => {
        const count = data.district_distribution
          .filter(item => item.district_name === district)
          .reduce((sum, item) => sum + item.count, 0);
        return { district, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => item.district);
    
    // Create datasets for each disease
    const diseaseDatasets = topDiseases.map((disease, index) => {
      return {
        label: disease,
        data: topDistrictNames.map(district => {
          const item = data.district_distribution.find(item => 
            item.district_name === district && item.disease_name === disease);
          return item ? item.count : 0;
        }),
        backgroundColor: getColor(index),
        borderColor: getColor(index),
        borderWidth: 1
      };
    });
    
    diseaseByDistrictChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topDistrictNames,
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
            text: 'Disease Distribution in Top Districts'
          }
        }
      }
    });
  };
  
  const renderActiveDistrictsChart = () => {
    const ctx = document.getElementById('activeDistrictsChart').getContext('2d');
    
    if (activeDistrictsChartRef.current) {
      activeDistrictsChartRef.current.destroy();
    }
    
    const activeDistrictsData = data.active_districts;
    const districtNames = activeDistrictsData.map(item => item.district_name);
    const districtCounts = activeDistrictsData.map(item => item.diagnosis_count);
    
    activeDistrictsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: districtNames,
        datasets: [{
          label: 'Diagnosis Count',
          data: districtCounts,
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
  
  // Helper function to get colors for multiple datasets
  const getColor = (index) => {
    const colors = [
      '#2e7d32', '#f57c00', '#0277bd', '#c2185b', 
      '#7b1fa2', '#00695c', '#ff5722', '#3949ab'
    ];
    return colors[index % colors.length];
  };
  
  // Find potential disease hotspots
  const getDiseaseHotspots = () => {
    const diseaseDistrictCounts = {};
    
    data.district_distribution.forEach(item => {
      const key = `${item.disease_name}|${item.district_name}`;
      diseaseDistrictCounts[key] = (diseaseDistrictCounts[key] || 0) + item.count;
    });
    
    return Object.entries(diseaseDistrictCounts)
      .map(([key, count]) => {
        const [disease, district] = key.split('|');
        return { disease, district, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };
  
  const hotspots = getDiseaseHotspots();
  
  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">Disease Distribution by Region</h2>
        <div id="mapContainer" style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
          {mapReady && (
            <MapContainer center={[-1.9403, 29.8739]} zoom={8} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {data.district_distribution
                .filter((v, i, a) => 
                  a.findIndex(t => t.district_name === v.district_name) === i
                )
                .map((district, index) => {
                  // Find the district in our geocode mapping
                  const districtInfo = districtGeocode[district.district_name.toLowerCase()];
                  
                  // Skip districts we don't have coordinates for
                  if (!districtInfo) return null;
                  
                  // Calculate disease count for this district
                  const districtItems = data.district_distribution.filter(
                    item => item.district_name === district.district_name
                  );
                  const totalCount = districtItems.reduce((sum, item) => sum + item.count, 0);
                  
                  // Determine color intensity based on disease count
                  const maxCount = Math.max(...Object.values(
                    data.district_distribution.reduce((acc, item) => {
                      acc[item.district_name] = (acc[item.district_name] || 0) + item.count;
                      return acc;
                    }, {})
                  ));
                  const intensity = Math.min(0.9, 0.3 + (totalCount / maxCount) * 0.7);
                  const color = `rgba(220, 53, 69, ${intensity})`;
                  
                  return (
                    <CircleMarker
                      key={index}
                      center={districtInfo.geocode}
                      radius={10 + (totalCount / maxCount) * 20}
                      fillColor={color}
                      color="#fff"
                      weight={1}
                      opacity={1}
                      fillOpacity={0.8}
                    >
                      <Popup>
                        <strong>{district.district_name}, {districtInfo.province}</strong><br />
                        Total detections: {totalCount}<br />
                        <hr />
                        <strong>Top diseases:</strong><br />
                        {districtItems.slice(0, 3).map((item, i) => (
                          <div key={i}>{item.disease_name}: {item.count}</div>
                        ))}
                      </Popup>
                    </CircleMarker>
                  );
                })}
            </MapContainer>
          )}
        </div>
        <div className="alert alert-info mt-3">
          <i className="bi bi-info-circle-fill"></i> 
          The map shows disease concentration across districts. Darker colors indicate higher disease prevalence.
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">District-Level Disease Distribution</h2>
        <div className="report-row">
          <div className="half-width">
            <div className="chart-container">
              <canvas id="topDistrictsChart"></canvas>
            </div>
          </div>
          <div className="half-width">
            <div className="chart-container">
              <canvas id="diseaseByDistrictChart"></canvas>
            </div>
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Province</th>
                <th>District</th>
                <th>Disease</th>
                <th>Detection Count</th>
              </tr>
            </thead>
            <tbody>
              {data.district_distribution.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.province_name}</td>
                  <td>{item.district_name}</td>
                  <td>{item.disease_name}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              {data.district_distribution.length > 10 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    Showing 10 of {data.district_distribution.length} entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Most Active Districts</h2>
        <div className="chart-container">
          <canvas id="activeDistrictsChart"></canvas>
        </div>
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Province</th>
                <th>District</th>
                <th>Diagnosis Count</th>
              </tr>
            </thead>
            <tbody>
              {data.active_districts.map((item, index) => (
                <tr key={index}>
                  <td>{item.province_name}</td>
                  <td>{item.district_name}</td>
                  <td>{item.diagnosis_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Disease Spread Analysis</h2>
        <div className="row">
          <div className="col-md-12">
            <div className="alert alert-warning">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <strong>Potential Disease Hotspots:</strong>
              <ul className="mb-0 ml-4">
                {hotspots.map((hotspot, index) => (
                  <li key={index}>
                    <strong>{hotspot.disease}</strong> in {hotspot.district} with {hotspot.count} detections
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeographicalInsightsReport;