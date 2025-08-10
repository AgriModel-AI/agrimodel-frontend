import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';

const UserEngagementReport = ({ data }) => {
  const newUsersChartRef = useRef(null);
  const activeUsersChartRef = useRef(null);
  const userRolesChartRef = useRef(null);
  const verificationChartRef = useRef(null);
  
  useEffect(() => {
    if (data) {
      renderNewUsersChart();
      renderActiveUsersChart();
      renderUserRolesChart();
      renderVerificationChart();
    }
    
    return () => {
      const charts = [
        newUsersChartRef.current, 
        activeUsersChartRef.current,
        userRolesChartRef.current,
        verificationChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderNewUsersChart = () => {
    const ctx = document.getElementById('newUsersChart').getContext('2d');
    
    if (newUsersChartRef.current) {
      newUsersChartRef.current.destroy();
    }
    
    const newUsersData = data.new_users_trend;
    const labels = newUsersData.map(item => `${item.year}-${item.month}`);
    const counts = newUsersData.map(item => item.count);
    
    newUsersChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'New Users',
          data: counts,
          backgroundColor: '#2e7d32',
          borderColor: '#2e7d32',
          borderWidth: 1
        }]
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
  
  const renderActiveUsersChart = () => {
    const ctx = document.getElementById('activeUsersChart').getContext('2d');
    
    if (activeUsersChartRef.current) {
      activeUsersChartRef.current.destroy();
    }
    
    const activeUsersData = data.active_users;
    const labels = activeUsersData.map(item => item.date);
    const counts = activeUsersData.map(item => item.count);
    
    activeUsersChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Active Users',
          data: counts,
          backgroundColor: 'rgba(46, 125, 50, 0.2)',
          borderColor: '#2e7d32',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
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
  
  const renderUserRolesChart = () => {
    const ctx = document.getElementById('userRolesChart').getContext('2d');
    
    if (userRolesChartRef.current) {
      userRolesChartRef.current.destroy();
    }
    
    const userRolesData = data.user_roles;
    const labels = userRolesData.map(item => item.role);
    const counts = userRolesData.map(item => item.count);
    
    userRolesChartRef.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
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
  
  const renderVerificationChart = () => {
    const ctx = document.getElementById('verificationChart').getContext('2d');
    
    if (verificationChartRef.current) {
      verificationChartRef.current.destroy();
    }
    
    const verificationData = data.verification_status;
    const labels = verificationData.map(item => item.status);
    const counts = verificationData.map(item => item.count);
    
    verificationChartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: [
            '#2e7d32', '#f57c00'
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

  if(!data){
    return <div><h2>Loading</h2></div>
  }

  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">New Users Trend</h2>
        <div className="chart-container">
          <canvas id="newUsersChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Month</th>
                <th>New Users</th>
              </tr>
            </thead>
            <tbody>
              {data.new_users_trend.map((item, index) => (
                <tr key={index}>
                  <td>{item.year}</td>
                  <td>{item.month}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Active Users Daily Trend</h2>
        <div className="chart-container">
          <canvas id="activeUsersChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Active Users</th>
              </tr>
            </thead>
            <tbody>
              {data.active_users.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              {data.active_users.length > 10 && (
                <tr>
                  <td colSpan="2" className="text-center">
                    Showing 10 of {data.active_users.length} entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-row">
        <div className="report-section half-width">
          <h2 className="section-title">User Roles Distribution</h2>
          <div className="chart-container">
            <canvas id="userRolesChart"></canvas>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {data.user_roles.map((item, index) => (
                  <tr key={index}>
                    <td>{item.role}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="report-section half-width">
          <h2 className="section-title">Verification Status</h2>
          <div className="chart-container">
            <canvas id="verificationChart"></canvas>
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
                {data.verification_status.map((item, index) => (
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
    </div>
  );
};

export default UserEngagementReport;