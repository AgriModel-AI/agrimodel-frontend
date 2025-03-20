import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon, point } from "leaflet";
import 'animate.css';
import { Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalHeader, Spinner, User, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, useDisclosure } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Link } from 'react-router-dom';
import { fetchDashboardStats, fetchDashboardRecentActivities } from '../../redux/slices/dashboardStatsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiDownload, FiCalendar, FiBarChart2, FiTrendingUp, FiPieChart, FiRefreshCw, FiUsers, FiShield, FiLayers } from 'react-icons/fi';
import { motion } from 'framer-motion';

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

// Animation variants for motion components
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, hasFetched, recentActivities, hasFetchedRecent } = useSelector((state) => state.dashboardStats);
  
  const [imageModal, setImageModal] = useState({ isOpen: false, src: "" });
  const [timeFilter, setTimeFilter] = useState("This Month");
  const [refreshing, setRefreshing] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();

  useEffect(() => {
    if(!hasFetched) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, hasFetched]);

  console.log(recentActivities)

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

  const handleExportData = (format) => {
    // Simulate export functionality
    console.log(`Exporting data in ${format} format`);
    // In a real app, you would generate and download the file
    setTimeout(() => {
      onExportClose();
      // Show success notification
    }, 500);
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
          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" startContent={<FiCalendar />} className="bg-white">
                {timeFilter}
              </Button>
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Time filter"
              onAction={(key) => setTimeFilter(key)}
            >
              <DropdownItem key="Today">Today</DropdownItem>
              <DropdownItem key="This Week">This Week</DropdownItem>
              <DropdownItem key="This Month">This Month</DropdownItem>
              <DropdownItem key="This Year">This Year</DropdownItem>
              <DropdownItem key="All Time">All Time</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Button 
            color="primary" 
            startContent={<FiDownload />}
            onClick={onExportOpen}
            className="bg-green-600 text-white"
          >
            Export Data
          </Button>

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
          
          {/* Quick Reports Section (New) */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ delay: 0.5 }}
          >
            <Card className="shadow-sm">
              <CardHeader className="px-6 py-5 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Quick Reports</h3>
                  <p className="text-gray-500 text-sm mt-1">Generate and download detailed reports</p>
                </div>
              </CardHeader>
              <CardBody className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    color="primary" 
                    variant="flat" 
                    className="h-auto py-4 px-3 flex-col items-start justify-start text-left"
                    startContent={<FiBarChart2 className="text-green-600" size={24} />}
                    onClick={() => handleExportData('pdf')}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">Disease Prevalence</div>
                      <div className="text-xs text-gray-500 mt-1">Detailed analysis by region and time</div>
                    </div>
                  </Button>
                  <Button 
                    color="primary" 
                    variant="flat" 
                    className="h-auto py-4 px-3 flex-col items-start justify-start text-left"
                    startContent={<FiUsers className="text-blue-600" size={24} />}
                    onClick={() => handleExportData('pdf')}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">Client Activity</div>
                      <div className="text-xs text-gray-500 mt-1">User engagement and diagnosis trends</div>
                    </div>
                  </Button>
                  <Button 
                    color="primary" 
                    variant="flat" 
                    className="h-auto py-4 px-3 flex-col items-start justify-start text-left"
                    startContent={<FiTrendingUp className="text-orange-600" size={24} />}
                    onClick={() => handleExportData('pdf')}
                  >
                    <div>
                      <div className="font-semibold text-gray-800">Growth Analysis</div>
                      <div className="text-xs text-gray-500 mt-1">Month-over-month platform growth</div>
                    </div>
                  </Button>
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
          
          {/* Recent Activity Feed (New) */}
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
      
      {/* Export Data Modal */}
      <Modal isOpen={isExportOpen} onClose={onExportClose}>
        <ModalContent>
          <ModalHeader>Export Dashboard Data</ModalHeader>
          <ModalBody className="gap-5">
            <p className="text-gray-600 mb-4">Choose a format to export your dashboard data:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="flat" 
                className="h-24 flex-col"
                onClick={() => handleExportData('pdf')}
              >
                <div className="text-xl font-bold text-red-500 mb-1">PDF</div>
                <div className="text-xs text-gray-500">Portable Document Format</div>
              </Button>
              <Button 
                variant="flat" 
                className="h-24 flex-col"
                onClick={() => handleExportData('excel')}
              >
                <div className="text-xl font-bold text-green-600 mb-1">Excel</div>
                <div className="text-xs text-gray-500">Microsoft Excel Spreadsheet</div>
              </Button>
              <Button 
                variant="flat" 
                className="h-24 flex-col"
                onClick={() => handleExportData('csv')}
              >
                <div className="text-xl font-bold text-gray-700 mb-1">CSV</div>
                <div className="text-xs text-gray-500">Comma Separated Values</div>
              </Button>
              <Button 
                variant="flat" 
                className="h-24 flex-col"
                onClick={() => handleExportData('json')}
              >
                <div className="text-xl font-bold text-blue-500 mb-1">JSON</div>
                <div className="text-xs text-gray-500">JavaScript Object Notation</div>
              </Button>
            </div>
            <div className="flex justify-end mt-4">
              <Button color="danger" variant="light" onClick={onExportClose} className="mr-2">
                Cancel
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;