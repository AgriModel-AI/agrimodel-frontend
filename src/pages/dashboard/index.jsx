import React, { useEffect } from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon, point } from "leaflet";
import 'animate.css';
import {Card, CardBody, CardHeader, Modal, ModalBody, ModalContent, ModalHeader, Spinner, User} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Link, useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../../redux/slices/dashboardStatsSlice';
import { useDispatch, useSelector } from 'react-redux';



ChartJS.register(CategoryScale, LinearScale, BarElement);

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

const Dashboard = () => {

  const dispatch = useDispatch();

  const {stats, loading, hasFetched} = useSelector((state) => state.dashboardStats);

  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });


  useEffect(()=> {
    if(!hasFetched) {
      dispatch(fetchDashboardStats());
    }
  }, [dispatch, hasFetched])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner color="success" size="lg">Loading...</Spinner>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen p-6 md:space-x-6 bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-col w-full md:w-3/4 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate__animated animate__fadeIn">
          <Card className="p-4 bg-white rounded-lg shadow hover:bg-green-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-600">Total Clients</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalClients}</p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:bg-green-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-600">Total Diseases</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalDiseases}</p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:bg-green-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-600">Total Communities</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalCommunities}</p>
          </Card>
        </div>

        <Card className="p-6 bg-white rounded-lg shadow h-75 animate__animated animate__fadeInUp">
          <CardHeader>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">Disease Cases Over Months</h3>
          </CardHeader>
          <CardBody>
          <Bar data={stats.diseaseCasesOverMonths} options={options} />
          </CardBody>
        </Card>

        {/* Diseases Table */}
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
      </div>

      {/* Sidebar Content */}
      <div className="w-full md:w-1/4 space-y-6 mt-6 md:mt-0">
        {/* Map */}
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

        {/* Provinces Table */}
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
      </div>
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>Disease Image</ModalHeader>
          <ModalBody>
            <img src={imageModal.src} alt="Diagnosis" className="w-full h-auto" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Dashboard;
