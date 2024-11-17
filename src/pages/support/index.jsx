import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  useDisclosure,
  DropdownMenu,
  DropdownItem,
  CardHeader,
  Image,
  Chip,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaQuestionCircle } from 'react-icons/fa';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { MdSupportAgent } from "react-icons/md";
import { fetchSupportRequests } from '../../redux/slices/supportRequestSlice';
import { useDispatch, useSelector } from 'react-redux';

function formatDateToCustom(dateString) {
  const originalDate = new Date(dateString);

  // Array of month names
  const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get the day, month, and year
  const day = String(originalDate.getDate()).padStart(2, '0'); // Ensure two digits (e.g. 07, 10)
  const month = monthNames[originalDate.getMonth()];          // Get the month name
  const year = originalDate.getFullYear();                   // Get the year

  // Return formatted string: "07 Nov 2024"
  return `${day} ${month} ${year}`;
}

const ReportCard = ({ title, description, date, status, user, type, onStatusChange }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(status);

  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });

  const handleStatusChange = (key) => {
    if (key === 'closed') {
      onOpen();
    } else {
      setSelectedStatus(key);
      onStatusChange(key, { title, description });
    }
  };

  const handleModalSubmit = () => {
    onStatusChange('Closed', { title: modalTitle, description: modalDescription });
    onOpenChange();
  };

  const statusColorMap = {
    open: 'success',
    'in-progress': 'warning',
    closed: 'danger',
  };

  return (
    <Card className="w-full mx-auto mb-4">
      <CardHeader className="flex gap-3 items-start w-full">
        <Image
          alt="nextui logo"
          height={60}
          radius="sm"
          src={
            user.profilePicture || "https://via.placeholder.com/150"
          }
          width={60}
          onClick={() => setImageModal({ isOpen: true, src: user.profilePicture })}
        />
        <div className="flex flex-col w-full">
          <p className="text-lg font-bold">{title}</p>
          <div className="flex items-start space-x-4 w-full justify-between">
            <div>
              <p className="text-sm">{description}</p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-1">
                  <AiOutlineCalendar className="w-4 h-4 text-gray-500" />
                  <p className="text-sm text-gray-500">{date}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <FaQuestionCircle className="w-4 h-4 text-gray-500 ml-6"/>
                  <p className="text-sm text-gray-500">{type}</p>
                </div>
                <Chip color={statusColorMap[selectedStatus.toLowerCase()]} className='ml-6' variant="solid">
                  {selectedStatus}
                </Chip>
              </div>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly color="warning" variant="faded" aria-label="Options">
                  <BsThreeDotsVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Status Actions" onAction={handleStatusChange}>
                <DropdownItem key="open">Open</DropdownItem>
                <DropdownItem key="in-progress">In Progress</DropdownItem>
                <DropdownItem key="closed">Closed</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardHeader>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Close Report</ModalHeader>
              <ModalBody>
                <Input
                  clearable
                  fullWidth
                  label="Title"
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                />
                <Input
                  clearable
                  fullWidth
                  label="Description"
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button flat color="error" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleModalSubmit}>
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>Diagnosis Image</ModalHeader>
          <ModalBody>
            <img src={imageModal.src} alt="Diagnosis" className="w-full h-auto" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

const ReportList = () => {

  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { supportRequests, hasFetched } = useSelector(state => state.supportRequests);

  const dispatch = useDispatch();

  useEffect(()=> {
    if(!hasFetched) {
      dispatch(fetchSupportRequests());
    }
  }, [hasFetched, dispatch]);

  useEffect(()=> {
    setFilteredReports(supportRequests);
  }, [supportRequests])

  const handleStatusChange = (newStatus, data) => {
    console.log(`Status changed to: ${newStatus}`, data);
  };

  const handleFilterChange = (key) => {
    setSelectedFilter(key);
    filterReports(searchTerm, key);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    filterReports(term, selectedFilter);
  };

  const filterReports = (term, status) => {
    const lowerTerm = term.toLowerCase();
    const filtered = supportRequests.filter(report => {
      const matchesSearch = report.subject.toLowerCase().includes(lowerTerm) ||
                            report.description.toLowerCase().includes(lowerTerm);
      const matchesStatus = status === 'all' || report.status.toLowerCase() === status;
      return matchesSearch && matchesStatus;
    });
    setFilteredReports(filtered);
  };

  return (
    <div className="px-4 sm:px-2 md:px-10 lg:px-20 mt-4">
      <Breadcrumbs className="mb-5">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/support">Support</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex items-center my-4 space-x-3">
        <MdSupportAgent size={28} color="#1a73e8" />
        <h2 className="text-2xl font-bold text-gray-800">Support</h2>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-[700px] mx-auto my-6 gap-4">
        <Input
          placeholder="Search reports..."
          value={searchTerm}
          onChange={handleSearchChange}
          clearable
          fullWidth
          size="lg"
          variant="faded"
        />
        <Dropdown>
          <DropdownTrigger>
            <Button flat color="primary">
              Filter by Status
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Status Filter" onAction={handleFilterChange} selectedKeys={selectedFilter}>
            <DropdownItem key="all">All</DropdownItem>
            <DropdownItem key="open">Open</DropdownItem>
            <DropdownItem key="in-progress">In Progress</DropdownItem>
            <DropdownItem key="closed">Closed</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Report Cards */}
      <div className="flex flex-col items-center md:justify-center mx-auto max-w-[700px] my-8">
        {filteredReports.map((report, index) => (
          <ReportCard
            key={index}
            title={report.subject}
            description={report.description}
            date={formatDateToCustom(report.createdAt)}
            status={report.status}
            user={report.user}
            type={report.type}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportList;
