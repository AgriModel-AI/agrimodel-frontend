import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './ReportStyles.css';

const CommunityInteractionsReport = ({ data }) => {
  const topCommunitiesChartRef = useRef(null);
  const postsPerDayChartRef = useRef(null);
  const topContributorsChartRef = useRef(null);
  const postEngagementChartRef = useRef(null);
  
  useEffect(() => {
    if (data) {
      renderTopCommunitiesChart();
      renderPostsPerDayChart();
      renderTopContributorsChart();
      renderPostEngagementChart();
    }
    
    return () => {
      const charts = [
        topCommunitiesChartRef.current, 
        postsPerDayChartRef.current,
        topContributorsChartRef.current,
        postEngagementChartRef.current
      ];
      
      charts.forEach(chart => {
        if (chart) chart.destroy();
      });
    };
  }, [data]);
  
  const renderTopCommunitiesChart = () => {
    const ctx = document.getElementById('topCommunitiesChart').getContext('2d');
    
    if (topCommunitiesChartRef.current) {
      topCommunitiesChartRef.current.destroy();
    }
    
    const communitiesData = data.top_communities;
    const communityNames = communitiesData.map(item => item.name);
    const communityCounts = communitiesData.map(item => item.post_count);
    
    topCommunitiesChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: communityNames,
        datasets: [{
          label: 'Post Count',
          data: communityCounts,
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
  
  const renderPostsPerDayChart = () => {
    const ctx = document.getElementById('postsPerDayChart').getContext('2d');
    
    if (postsPerDayChartRef.current) {
      postsPerDayChartRef.current.destroy();
    }
    
    const postsPerDayData = data.posts_per_day;
    const postsPerDayLabels = postsPerDayData.map(item => item.date);
    const postsPerDayCounts = postsPerDayData.map(item => item.count);
    
    postsPerDayChartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: postsPerDayLabels,
        datasets: [{
          label: 'Posts',
          data: postsPerDayCounts,
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
  
  const renderTopContributorsChart = () => {
    const ctx = document.getElementById('topContributorsChart').getContext('2d');
    
    if (topContributorsChartRef.current) {
      topContributorsChartRef.current.destroy();
    }
    
    const contributorsData = data.top_contributors;
    const contributorNames = contributorsData.map(item => item.username);
    const contributorCounts = contributorsData.map(item => item.post_count);
    
    topContributorsChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: contributorNames,
        datasets: [{
          label: 'Posts',
          data: contributorCounts,
          backgroundColor: '#f57c00',
          borderColor: '#f57c00',
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
  
  const renderPostEngagementChart = () => {
    const ctx = document.getElementById('postEngagementChart').getContext('2d');
    
    if (postEngagementChartRef.current) {
      postEngagementChartRef.current.destroy();
    }
    
    const engagementData = data.post_engagement;
    const engagementLabels = engagementData.map(item => item.content.substring(0, 15) + '...');
    const likesData = engagementData.map(item => item.likes);
    const commentsData = engagementData.map(item => item.comments);
    
    postEngagementChartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: engagementLabels,
        datasets: [
          {
            label: 'Likes',
            data: likesData,
            backgroundColor: '#2e7d32',
            borderColor: '#2e7d32',
            borderWidth: 1
          },
          {
            label: 'Comments',
            data: commentsData,
            backgroundColor: '#f57c00',
            borderColor: '#f57c00',
            borderWidth: 1
          }
        ]
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
        }
      }
    });
  };
  
  return (
    <div className="report">
      <div className="report-section">
        <h2 className="section-title">Top Active Communities</h2>
        <div className="chart-container">
          <canvas id="topCommunitiesChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Community Name</th>
                <th>Post Count</th>
              </tr>
            </thead>
            <tbody>
              {data.top_communities.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.post_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-section">
        <h2 className="section-title">Posts Per Day Trend</h2>
        <div className="chart-container">
          <canvas id="postsPerDayChart"></canvas>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Post Count</th>
              </tr>
            </thead>
            <tbody>
              {data.posts_per_day.slice(0, 10).map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
              {data.posts_per_day.length > 10 && (
                <tr>
                  <td colSpan="2" className="text-center">
                    Showing 10 of {data.posts_per_day.length} entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="report-row">
        <div className="report-section half-width">
          <h2 className="section-title">Top Contributors</h2>
          <div className="chart-container">
            <canvas id="topContributorsChart"></canvas>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Post Count</th>
                </tr>
              </thead>
              <tbody>
                {data.top_contributors.map((item, index) => (
                  <tr key={index}>
                    <td>{item.username}</td>
                    <td>{item.post_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="report-section half-width">
          <h2 className="section-title">Post Engagement</h2>
          <div className="chart-container">
            <canvas id="postEngagementChart"></canvas>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Engagement Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.post_engagement.map((item, index) => (
                  <tr key={index}>
                    <td>{item.content.substring(0, 30)}...</td>
                    <td>{item.likes}</td>
                    <td>{item.comments}</td>
                    <td>{item.engagement_rate}</td>
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

export default CommunityInteractionsReport;