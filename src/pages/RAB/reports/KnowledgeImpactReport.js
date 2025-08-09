import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';

const KnowledgeImpactReport = ({ data }) => {
  const discussionTopicsChartRef = useRef(null);
  const searchTopicsChartRef = useRef(null);
  const faqTopicsChartRef = useRef(null);
  const knowledgeGrowthChartRef = useRef(null);
  
  useEffect(() => {
    if (data) {
      renderDiscussionTopicsChart();
      renderSearchTopicsChart();
      renderFaqTopicsChart();
      renderKnowledgeGrowthChart();
    }
    
    return () => {
      const charts = [
        discussionTopicsChartRef.current, 
        searchTopicsChartRef.current,
        faqTopicsChartRef.current,
        knowledgeGrowthChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderDiscussionTopicsChart = () => {
    const ctx = document.getElementById('discussionTopicsChart').getContext('2d');
    
    if (discussionTopicsChartRef.current) {
      discussionTopicsChartRef.current.destroy();
    }
    
    const discussionTopicsData = data.discussion_topics;
    const communityNames = discussionTopicsData.map(item => item.community_name);
    const postCounts = discussionTopicsData.map(item => item.post_count);
    
    discussionTopicsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: communityNames,
        datasets: [{
          label: 'Post Count',
          data: postCounts,
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
  
  const renderSearchTopicsChart = () => {
    const ctx = document.getElementById('searchTopicsChart').getContext('2d');
    
    if (searchTopicsChartRef.current) {
      searchTopicsChartRef.current.destroy();
    }
    
    // Simulated data
    const searchTopicsData = [
      { topic: 'Coffee Leaf Rust Treatment', volume: 876, trend: 15 },
      { topic: 'Banana Disease Identification', volume: 743, trend: 23 },
      { topic: 'Organic Pest Control', volume: 629, trend: 8 },
      { topic: 'Disease-Resistant Varieties', volume: 582, trend: -5 },
      { topic: 'Soil Health Management', volume: 541, trend: 12 }
    ];
    
    searchTopicsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: searchTopicsData.map(item => item.topic),
        datasets: [{
          label: 'Search Volume',
          data: searchTopicsData.map(item => item.volume),
          backgroundColor: searchTopicsData.map(item => item.trend >= 0 ? '#2e7d32' : '#dc3545'),
          borderColor: searchTopicsData.map(item => item.trend >= 0 ? '#2e7d32' : '#dc3545'),
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
  
  const renderFaqTopicsChart = () => {
    const ctx = document.getElementById('faqTopicsChart').getContext('2d');
    
    if (faqTopicsChartRef.current) {
      faqTopicsChartRef.current.destroy();
    }
    
    // Simulated data
    const faqTopicsData = [
      { category: 'Disease Identification', frequency: 35 },
      { category: 'Treatment Methods', frequency: 27 },
      { category: 'App Usage Help', frequency: 18 },
      { category: 'Prevention Strategies', frequency: 12 },
      { category: 'Other', frequency: 8 }
    ];
    
    faqTopicsChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: faqTopicsData.map(item => item.category),
        datasets: [{
          data: faqTopicsData.map(item => item.frequency),
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
  
  const renderKnowledgeGrowthChart = () => {
    const ctx = document.getElementById('knowledgeGrowthChart').getContext('2d');
    
    if (knowledgeGrowthChartRef.current) {
      knowledgeGrowthChartRef.current.destroy();
    }
    
    // Simulated data
    const knowledgeGrowthData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Disease Identification Skills',
          data: [35, 42, 49, 58, 65, 68],
          borderColor: '#2e7d32',
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
          fill: true
        },
        {
          label: 'Prevention Knowledge',
          data: [28, 32, 36, 40, 42, 42],
          borderColor: '#f57c00',
          backgroundColor: 'rgba(245, 124, 0, 0.1)',
          fill: true
        },
        {
          label: 'Treatment Efficacy',
          data: [22, 28, 35, 40, 45, 51],
          borderColor: '#0277bd',
          backgroundColor: 'rgba(2, 119, 189, 0.1)',
          fill: true
        }
      ]
    };
    
    knowledgeGrowthChartRef.current = new Chart(ctx, {
      type: 'line',
      data: knowledgeGrowthData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: 'Knowledge Score (%)'
            }
          }
        }
      }
    });
  };
  
  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">Community Discussion Topics</h2>
        <div className="chart-container">
          <canvas id="discussionTopicsChart"></canvas>
        </div>
        <div className="table-container mt-4">
          <table className="data-table">
            <thead>
              <tr>
                <th>Community Topic</th>
                <th>Post Count</th>
              </tr>
            </thead>
            <tbody>
              {data.discussion_topics.map((item, index) => (
                <tr key={index}>
                  <td>{item.community_name}</td>
                  <td>{item.post_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="alert alert-info mb-4">
        <i className="bi bi-info-circle-fill me-2"></i>
        <strong>Note:</strong> {data.message}
      </div>
      
      <div className="report-row">
        <div className="report-section half-width">
          <h2 className="section-title">Most Searched Topics</h2>
          <div className="chart-container">
            <canvas id="searchTopicsChart"></canvas>
          </div>
          <div className="table-container mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Search Topic</th>
                  <th>Search Volume</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Coffee Leaf Rust Treatment</td>
                  <td>876</td>
                  <td><span className="text-success">↑ 15%</span></td>
                </tr>
                <tr>
                  <td>Banana Disease Identification</td>
                  <td>743</td>
                  <td><span className="text-success">↑ 23%</span></td>
                </tr>
                <tr>
                  <td>Organic Pest Control</td>
                  <td>629</td>
                  <td><span className="text-success">↑ 8%</span></td>
                </tr>
                <tr>
                  <td>Disease-Resistant Varieties</td>
                  <td>582</td>
                  <td><span className="text-danger">↓ 5%</span></td>
                </tr>
                <tr>
                  <td>Soil Health Management</td>
                  <td>541</td>
                  <td><span className="text-success">↑ 12%</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="report-section half-width">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="chart-container">
            <canvas id="faqTopicsChart"></canvas>
          </div>
          <div className="table-container mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Question Category</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Disease Identification</td>
                  <td>35%</td>
                </tr>
                <tr>
                  <td>Treatment Methods</td>
                  <td>27%</td>
                </tr>
                <tr>
                  <td>App Usage Help</td>
                  <td>18%</td>
                </tr>
                <tr>
                  <td>Prevention Strategies</td>
                  <td>12%</td>
                </tr>
                <tr>
                  <td>Other</td>
                  <td>8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Educational Impact Assessment</h2>
        <div className="report-row">
          <div className="half-width">
            <div className="insights-card">
              <div className="insights-header">Knowledge Growth Metrics</div>
              <div className="insights-body">
                <div className="chart-container" style={{ height: '300px' }}>
                  <canvas id="knowledgeGrowthChart"></canvas>
                </div>
              </div>
            </div>
          </div>
          <div className="half-width">
            <div className="insights-card">
              <div className="insights-header">Top Educational Content</div>
              <div className="insights-body">
                <ul className="content-list">
                  <li className="content-item">
                    <span className="content-name">Disease Identification Guide</span>
                    <span className="content-views">4,782 views</span>
                  </li>
                  <li className="content-item">
                    <span className="content-name">Preventive Farming Practices</span>
                    <span className="content-views">3,946 views</span>
                  </li>
                  <li className="content-item">
                    <span className="content-name">Organic Treatment Methods</span>
                    <span className="content-views">3,218 views</span>
                  </li>
                  <li className="content-item">
                    <span className="content-name">Climate-Smart Agriculture</span>
                    <span className="content-views">2,873 views</span>
                  </li>
                  <li className="content-item">
                    <span className="content-name">Crop Rotation Planning</span>
                    <span className="content-views">2,451 views</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="alert alert-success mt-4">
          <strong>Key Insight:</strong> AgriModel's educational resources have increased farmers' knowledge of disease identification by an estimated 68% and improved adoption of preventive practices by 42% across active user communities.
        </div>
      </div>
    </div>
  );
};

export default KnowledgeImpactReport;