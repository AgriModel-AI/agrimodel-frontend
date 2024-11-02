import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon, point } from "leaflet";
import 'animate.css';
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Link } from 'react-router-dom';




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
  const data = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [
      {
        label: 'Cases',
        data: [30, 20, 50, 40, 60, 55, 70, 65, 80, 90, 100, 75],
        backgroundColor: '#34d399',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-6 md:space-x-6 bg-gray-100">
      {/* Main Content */}
      <div className="flex flex-col w-full md:w-3/4 space-y-6">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate__animated animate__fadeIn">
          <Card className="p-4 bg-white rounded-lg shadow hover:bg-green-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-600">Total Clients</h3>
            <p className="text-3xl font-bold text-green-600">500</p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:bg-green-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-600">Total Diseases</h3>
            <p className="text-3xl font-bold text-green-600">20</p>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:bg-green-100 transition-all duration-300 ease-in-out">
            <h3 className="text-lg font-semibold text-gray-600">Total Communities</h3>
            <p className="text-3xl font-bold text-green-600">15</p>
          </Card>
        </div>

        <Card className="p-6 bg-white rounded-lg shadow h-75 animate__animated animate__fadeInUp">
          <CardHeader>
            <h3 className="text-lg font-semibold mb-4 text-gray-600">Disease Cases Over Months</h3>
          </CardHeader>
          <CardBody>
          <Bar data={data} options={options} />
          </CardBody>
        </Card>

        {/* Diseases Table */}
        <Card className="p-4 bg-white rounded-lg shadow overflow-hidden animate__animated animate__fadeInUp">
          <CardHeader className="flex justify-between items-center px-4 mb-4">
              <h3 className="text-lg font-semibold text-gray-600">Diseases</h3>
              <Link
                to="/dashboard/clients" 
                className="text-blue-500 hover:underline font-semibold"
              >
                View All
              </Link>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>NAME</TableColumn>
                <TableColumn>ROLE</TableColumn>
                <TableColumn>STATUS</TableColumn>
              </TableHeader>
              <TableBody>
                <TableRow key="1">
                  <TableCell>Tony Reichert</TableCell>
                  <TableCell>CEO</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow key="2">
                  <TableCell>Zoey Lang</TableCell>
                  <TableCell>Technical Lead</TableCell>
                  <TableCell>Paused</TableCell>
                </TableRow>
                <TableRow key="3">
                  <TableCell>Jane Fisher</TableCell>
                  <TableCell>Senior Developer</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
                <TableRow key="4">
                  <TableCell>William Howard</TableCell>
                  <TableCell>Community Manager</TableCell>
                  <TableCell>Vacation</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Sidebar Content */}
      <div className="w-full md:w-1/4 space-y-6 mt-6 md:mt-0">
        {/* Map */}
        <Card className="p-4 mb-5 bg-white rounded-lg shadow h-72 animate__animated animate__fadeInRight">
          <h3 className="text-lg font-semibold mb-4 text-gray-600">Rwanda Provinces Map</h3>
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
            <h3 className="text-lg font-semibold mb-0 text-gray-600">Province Diagnoses</h3>
          </CardHeader>
          <div className="overflow-x-auto">
            
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>PROVINCE</TableColumn>
                <TableColumn>CASES</TableColumn>
              </TableHeader>
              <TableBody>
              {Object.entries(provinces).map(([province, districts], index) => (
                <TableRow key={index} className="hover:bg-gray-100 transition">
                  <TableCell>{province}</TableCell>
                  <TableCell>
                    {districts.reduce((total, _) => total + Math.floor(Math.random() * 200), 0)}
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
