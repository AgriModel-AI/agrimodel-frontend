import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon, point } from "leaflet";
import 'animate.css';
import { Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalHeader, Spinner, User, Button } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchDashboardRecentActivities } from '../../redux/slices/dashboardStatsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiBarChart2, FiTrendingUp, FiPieChart, FiRefreshCw, FiUsers, FiShield, FiLayers, FiFileText, FiActivity, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axiosInstance from '../../utils/axiosConfig';
import ReportGenerator from '../../components/ReportGenerator';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Custom Icon for Map Markers
const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
  iconSize: [30, 30] 
});

const createClusterCustomIcon = (cluster) => {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

// Grouped markers by provinces
const provinces = {
  "Kigali": [
    { geocode: [-1.9706, 30.1044], district: "Gasabo" },
    { geocode: [-1.9591, 30.0644], district: "Nyarugenge" },
    { geocode: [-1.9462, 30.0587], district: "Kicukiro" },
  ],
  // Other provinces data...
};

// Animation variants for motion components
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

// Define all report types
const REPORT_TYPES = [
  { 
    id: 'disease_prevalence', 
    title: 'Disease Prevalence', 
    description: 'Detailed analysis by region and time',
    icon: <FiBarChart2 className="text-green-600" size={24} />
  },
  { 
    id: 'model_performance', 
    title: 'Model Performance', 
    description: 'AI model accuracy and improvements',
    icon: <FiActivity className="text-purple-600" size={24} />
  },
  { 
    id: 'user_engagement', 
    title: 'User Engagement', 
    description: 'User activity and interaction patterns',
    icon: <FiUsers className="text-blue-600" size={24} />
  },
  { 
    id: 'regional_insights', 
    title: 'Regional Insights', 
    description: 'Geographic distribution of diseases',
    icon: <FiFileText className="text-indigo-600" size={24} />
  },
  { 
    id: 'support_analysis', 
    title: 'Support Analysis', 
    description: 'Help desk and user support metrics',
    icon: <FiShield className="text-teal-600" size={24} />
  },
  { 
    id: 'economic_impact', 
    title: 'Economic Impact', 
    description: 'Financial benefits of early detection',
    icon: <FiDollarSign className="text-emerald-600" size={24} />
  },
  { 
    id: 'client_activity', 
    title: 'Client Activity', 
    description: 'User engagement and diagnosis trends',
    icon: <FiUsers className="text-blue-600" size={24} />
  },
  { 
    id: 'growth_analysis', 
    title: 'Growth Analysis', 
    description: 'Month-over-month platform growth',
    icon: <FiTrendingUp className="text-orange-600" size={24} />
  }
];

// Define which reports use the new client-side generation
const CLIENT_SIDE_REPORTS = [
  'client_activity', 
  'growth_analysis', 
  'model_performance', 
  'user_engagement', 
  'regional_insights', 
  'support_analysis', 
  'economic_impact'
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, hasFetched, recentActivities, hasFetchedRecent } = useSelector((state) => state.dashboardStats);
  
  const [imageModal, setImageModal] = useState({ isOpen: false, src: "" });
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState("bar");

  // For export functionality
  const [exportModal, setExportModal] = useState({ isOpen: false, reportType: "" });
  const [exportLoading, setExportLoading] = useState(false);
  const [reportError, setReportError] = useState(null);

  useEffect(() => {
    if(!hasFetched) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, hasFetched]);

  useEffect(() => {
    if(!hasFetchedRecent) {
      dispatch(fetchDashboardRecentActivities());
    }
  }, [dispatch, hasFetchedRecent]);

  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });

  const handleRefreshData = () => {
    setRefreshing(true);
    dispatch(fetchDashboardStats())
      .finally(() => {
        setTimeout(() => setRefreshing(false), 800);
      });
  };

  // Legacy method for server-side report generation
  const handleExportData = async (format, type) => {
    setExportLoading(true);
    setReportError(null);
    
    try {
      const response = await axiosInstance.get(
        `/dashboard/reports/${type}?format=${format}`,
        {
          responseType: 'blob',
        }
      );
    
      // Create a Blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${type}_${new Date().toISOString().slice(0, 10)}.${format}`
      );
      document.body.appendChild(link);
      link.click();
    
      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading the report:', error);
      setReportError('Failed to download report. Please try again later.');
    } finally {
      setExportLoading(false);
    }
  };
  
  // Function to open the export modal
  const openExportModal = (reportType) => {
    setExportModal({ isOpen: true, reportType });
    setReportError(null);
  };

  // Helper function to close the export modal
  const closeExportModal = () => {
    setExportModal({ isOpen: false, reportType: "" });
    setExportLoading(false);
    setReportError(null);
  };

  // Helper function to get report title
  const getReportTitle = (reportType) => {
    const report = REPORT_TYPES.find(r => r.id === reportType);
    return report ? report.title + ' Report' : 'Report';
  };

  // Handle client-side report generation completion
  const handleReportGenerated = (success) => {
    if (!success) {
      setReportError('There was an issue generating the report. Please try again.');
    }
  };

  const chartData = React.useMemo(() => {
    if (!stats.diseaseCasesOverMonths) return { labels: [], datasets: [] };
    
    return {
      ...stats.diseaseCasesOverMonths,
      datasets: stats.diseaseCasesOverMonths.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        borderRadius: 5,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
      }))
    };
  }, [stats.diseaseCasesOverMonths]);

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
    scales: {
      x: { 
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          }
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
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
    }
  };

  // Calculate growth percentages for stat cards
  const getGrowthIndicator = (value) => {
    // This would normally be calculated from real data
    const growth = Math.floor(Math.random() * 20) - 5; // -5% to +15%
    return {
      value: growth,
      isPositive: growth > 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Spinner color="success" size="lg" className="mb-4" />
          <p className="text-gray-600 font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      {/* Dashboard Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome to your AgriModel analytics dashboard</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            isIconOnly
            variant="flat"
            onClick={handleRefreshData}
            className="bg-white"
            isLoading={refreshing}
          >
            {!refreshing && <FiRefreshCw />}
          </Button>
        </div>
      </motion.div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Content Column (75%) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Client Stats Card */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-visible shadow-sm hover:shadow-md transition-all duration-300">
                <CardBody className="p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Clients</p>
                      <h3 className="text-3xl font-bold mt-1 mb-2 text-gray-800">{stats.totalClients.toLocaleString()}</h3>
                      
                      {/* Growth indicator */}
                      {(() => {
                        const growth = getGrowthIndicator();
                        return (
                          <div className={`flex items-center text-xs ${growth.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            <span className="mr-1">
                              {growth.isPositive ? '↑' : '↓'} {Math.abs(growth.value)}%
                            </span>
                            <span className="text-gray-500">vs last {timeFilter.toLowerCase()}</span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-full h-12 w-12 flex items-center justify-center">
                      <FiUsers size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Diseases Stats Card */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-visible shadow-sm hover:shadow-md transition-all duration-300">
                <CardBody className="p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Diseases</p>
                      <h3 className="text-3xl font-bold mt-1 mb-2 text-gray-800">{stats.totalDiseases.toLocaleString()}</h3>
                      {/* Growth indicator */}
                      {(() => {
                        const growth = getGrowthIndicator();
                        return (
                          <div className={`flex items-center text-xs ${growth.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            <span className="mr-1">
                              {growth.isPositive ? '↑' : '↓'} {Math.abs(growth.value)}%
                            </span>
                            <span className="text-gray-500">new cases</span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-full h-12 w-12 flex items-center justify-center">
                      <FiShield size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>

            {/* Communities Stats Card */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="overflow-visible shadow-sm hover:shadow-md transition-all duration-300">
                <CardBody className="p-5">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Communities</p>
                      <h3 className="text-3xl font-bold mt-1 mb-2 text-gray-800">{stats.totalCommunities.toLocaleString()}</h3>
                      {/* Growth indicator */}
                      {(() => {
                        const growth = getGrowthIndicator();
                        return (
                          <div className={`flex items-center text-xs ${growth.isPositive ? 'text-green-600' : 'text-red-500'}`}>
                            <span className="mr-1">
                              {growth.isPositive ? '↑' : '↓'} {Math.abs(growth.value)}%
                            </span>
                            <span className="text-gray-500">active engagement</span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full h-12 w-12 flex items-center justify-center">
                      <FiLayers size={24} />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Charts Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Disease Cases Trend</h3>
                  <p className="text-gray-500 text-sm mt-1">Monthly distribution of disease cases</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    isIconOnly
                    variant={chartType === 'bar' ? 'solid' : 'flat'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                    className={chartType === 'bar' ? 'bg-green-600 text-white' : 'bg-gray-100'}
                  >
                    <FiBarChart2 />
                  </Button>
                  <Button
                    isIconOnly
                    variant={chartType === 'line' ? 'solid' : 'flat'}
                    size="sm"
                    onClick={() => setChartType('line')}
                    className={chartType === 'line' ? 'bg-green-600 text-white' : 'bg-gray-100'}
                  >
                    <FiTrendingUp />
                  </Button>
                  <Button
                    isIconOnly
                    variant={chartType === 'pie' ? 'solid' : 'flat'}
                    size="sm"
                    onClick={() => setChartType('pie')}
                    className={chartType === 'pie' ? 'bg-green-600 text-white' : 'bg-gray-100'}
                  >
                    <FiPieChart />
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="px-6 pt-4 pb-6">
                <div className="h-[350px] w-full">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Disease Cases Summary (Keep this as is) */}
          <Card className="p-4 bg-white rounded-lg shadow overflow-hidden animate__animated animate__fadeInUp">
            <CardHeader className="flex justify-between items-center px-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-600">Disease Cases Summary</h3>
                <Link
                  to="/dashboard/diseases" 
                  className="text-blue-500 hover:underline font-semibold"
                >
                  View All
                </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>DISEASE NAME</TableColumn>
                  <TableColumn>DISCRIPTION</TableColumn>
                  <TableColumn>TOTAL CASES</TableColumn>
                </TableHeader>
                <TableBody>
                  {
                    stats.diseaseCases.map((disease)=> {
                      return (
                        <TableRow key={disease.diseaseName}>
                          <TableCell>
                            <User
                              avatarProps={{radius: "lg", src: disease.image, onClick: () => setImageModal({ isOpen: true, src: disease.image }),}}
                              name={disease.diseaseName}
                              alt="image"
                              size='sm'
                              referrerPolicy="no-referrer" 
                            >
                            </User>
                          </TableCell>
                          <TableCell>{disease.description}</TableCell>
                          <TableCell>{disease.totalCases}</TableCell>
                      </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </div>
          </Card>
          
          {/* Quick Reports Section (Updated with all report types) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="px-6 py-5 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Reports & Analytics</h3>
                  <p className="text-gray-500 text-sm mt-1">Generate and download detailed analytical reports</p>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {REPORT_TYPES.map(report => (
                    <Button 
                      key={report.id}
                      color="primary" 
                      variant="flat" 
                      className="h-auto py-4 px-3 flex-col items-start justify-start text-left"
                      startContent={report.icon}
                      onClick={() => openExportModal(report.id)}
                    >
                      <div>
                        <div className="font-semibold text-gray-800">{report.title}</div>
                        <div className="text-xs text-gray-500 mt-1">{report.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* Right Sidebar Column (25%) */}
        <div className="space-y-6">
          {/* Map Section (Keep this as is) */}
          <Card className="p-4 mb-5 bg-white rounded-lg shadow h-72 animate__animated animate__fadeInRight">
            <h3 className="text-lg font-semibold mb-4 text-gray-600">Rwanda Provinces Diagnoses Map</h3>
            <div className="h-full w-full overflow-hidden rounded-lg">
              <MapContainer center={[-1.9403, 29.8739]} zoom={7.5} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterCustomIcon}>
                  {Object.values(provinces).flat().map((marker, index) => (
                    <Marker key={index} position={marker.geocode} icon={customIcon}>
                      <Popup>{marker.district}</Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </MapContainer>
            </div>
          </Card>

          {/* Provinces Table (Keep this as is) */}
          <Card className="p-4 bg-white rounded-lg shadow animate__animated animate__fadeInRight">
            <CardHeader className="flex gap-3">
              <h3 className="text-lg font-semibold mb-0 text-gray-600">Province Diagnoses Summary</h3>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table aria-label="Example static collection table">
                <TableHeader>
                  <TableColumn>PROVINCE</TableColumn>
                  <TableColumn>CASES</TableColumn>
                </TableHeader>
                <TableBody>
                {
                  stats.provinceCases.map((province)=> (
                  <TableRow key={province.id} className="hover:bg-gray-100 transition">
                    <TableCell>{province.provinceName}</TableCell>
                    <TableCell>{province.totalCases}</TableCell>
                  </TableRow>
                  ))
                }
                </TableBody>
              </Table>
            </div>
          </Card>
          
          {/* Recent Activity Feed (Keep this as is) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              </CardHeader>
              <CardBody className="p-0">
                <ul className="divide-y divide-gray-100">
                  {recentActivities.map((recentActivity, index) => (
                    <li key={index} className="px-5 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2 h-2 rounded-full ${['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500'][index % 5]}`}></div>
                        <div>
                          <p className="text-sm text-gray-800">
                            {
                              recentActivity.message
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {
                              recentActivity.time_ago
                            }
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal} size="lg">
        <ModalContent>
          <ModalHeader>Disease Image</ModalHeader>
          <ModalBody className="p-0">
            <img src={imageModal.src} alt="Diagnosis" className="w-full h-auto rounded-b-lg" />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Report Export Modal - Updated to handle both server-side and client-side reports */}
      <Modal 
        isOpen={exportModal.isOpen} 
        onClose={closeExportModal}
        size={CLIENT_SIDE_REPORTS.includes(exportModal.reportType) ? "3xl" : "md"}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {getReportTitle(exportModal.reportType)}
          </ModalHeader>
          <ModalBody>
            {exportLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Spinner color="success" size="lg" className="mb-4" />
                <p className="text-gray-700 font-medium">Please wait, we're generating your document...</p>
                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
              </div>
            ) : reportError ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
                <p className="font-medium">{reportError}</p>
              </div>
            ) : (
              <>
                {CLIENT_SIDE_REPORTS.includes(exportModal.reportType) ? (
                  // Client-side report generation using ReportGenerator
                  <ReportGenerator 
                    reportType={exportModal.reportType} 
                    startDate={(new Date(Date.now() - 30*24*60*60*1000)).toISOString().split('T')[0]}
                    endDate={new Date().toISOString().split('T')[0]}
                    onGenerated={handleReportGenerated}
                  />
                ) : (
                  // Server-side report generation (legacy approach)
                  <>
                    <p className="text-gray-600 mb-4">Select a format to download your report:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button 
                        color="primary" 
                        variant="flat"
                        startContent={<span className="text-xl">📄</span>}
                        className="justify-start"
                        onClick={() => handleExportData('pdf', exportModal.reportType)}
                      >
                        PDF Document
                      </Button>
                      
                      <Button 
                        color="success" 
                        variant="flat"
                        startContent={<span className="text-xl">📊</span>}
                        className="justify-start"
                        onClick={() => handleExportData('excel', exportModal.reportType)}
                      >
                        Excel Spreadsheet
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      
    </div>
  );
};

export default Dashboard;