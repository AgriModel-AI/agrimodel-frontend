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
import { fetchSupportRequests, updateSupportRequest } from '../../redux/slices/supportRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from "@chakra-ui/react";

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

const ReportCard = ({ requestId, title, description, date, status, user, type, onStatusChange }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isResolvedOrClosed, setIsResolvedOrClosed] = useState(true);
  const [statusToConfirm, setStatusToConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();

  useEffect(() => {
    setSelectedStatus(status);
  }, [status]);

  useEffect(()=> {
    setIsResolvedOrClosed(selectedStatus.toLowerCase() === 'resolved' || selectedStatus.toLowerCase() === 'closed');
  }, [selectedStatus]);

  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });

  const handleStatusChange = (key) => {
    setStatusToConfirm(key);
    onOpen(); // Open confirmation modal for all status changes
  };

  const handleModalSubmit = async () => {
    const updateData = statusToConfirm === 'closed'
      ? { status: 'closed', title: modalTitle, description: modalDescription }
      : { status: statusToConfirm };

    setIsLoading(true); // Set loading state to true

    try {
      await dispatch(updateSupportRequest({ requestId, updateData })).unwrap();
      setSelectedStatus(statusToConfirm);
      onStatusChange(statusToConfirm, { title: modalTitle, description: modalDescription });
      toast({
        title: "Status updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onOpenChange();
    } catch (error) {
      toast({
        title: "Error updating status",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  const statusColorMap = {
    pending: 'default',
    'in_progress': 'warning',
    'resolved': 'success',
    closed: 'danger',
  };

  return (
    <Card className="w-full mx-auto mb-4">
      <CardHeader className="flex gap-3 items-start w-full">
        <Image
          alt="User profile"
          height={60}
          radius="sm"
          src={user.profilePicture || "https://via.placeholder.com/150"}
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
                  <FaQuestionCircle className="w-4 h-4 text-gray-500 ml-6" />
                  <p className="text-sm text-gray-500">{type}</p>
                </div>
                <Chip color={statusColorMap[selectedStatus.toLowerCase()]} className="ml-6" variant="solid">
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
              <DropdownMenu 
                aria-label="Status Actions" 
                onAction={handleStatusChange} 
                disabledKeys={selectedStatus.toLowerCase() === "in_progress" ? ["in_progress"] : isResolvedOrClosed ? ["in_progress", "resolved", "closed"] : []}
              >
                <DropdownItem key="in_progress">In Progress</DropdownItem>
                <DropdownItem key="resolved" >Resolved</DropdownItem>
                <DropdownItem key="closed" >Closed</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </CardHeader>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Confirm Status Change
              </ModalHeader>
              <ModalBody>
                {statusToConfirm === 'closed' ? (
                  <>
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
                  </>
                ) : (
                  <p>Are you sure you want to change the status to <strong>{statusToConfirm}</strong>?</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button flat color="error" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={handleModalSubmit} isLoading={isLoading}>
                  Confirm
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { supportRequests, hasFetched } = useSelector((state) => state.supportRequests);
  const dispatch = useDispatch();

  // Fetch support requests if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchSupportRequests());
    }
  }, [hasFetched, dispatch]);

  // Filtered reports logic
  const filteredReports = React.useMemo(() => {
    return supportRequests.filter((report) => {
      const matchesSearch =
        report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedFilter === 'all' || report.status.toLowerCase() === selectedFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [supportRequests, searchTerm, selectedFilter]);

  // Handle filter changes
  const handleFilterChange = (key) => {
    setSelectedFilter(key);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
          <DropdownMenu
            aria-label="Status Filter"
            onAction={handleFilterChange}
            selectedKeys={selectedFilter}
          >
            <DropdownItem key="all">All</DropdownItem>
            <DropdownItem key="pending">Pending</DropdownItem>
            <DropdownItem key="in_progress">In Progress</DropdownItem>
            <DropdownItem key="resolved">Resolved</DropdownItem>
            <DropdownItem key="closed">Closed</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Report Cards */}
      <div className="flex flex-col items-center md:justify-center mx-auto max-w-[700px] my-8">
        {filteredReports.map((report, index) => (
          <ReportCard
            key={index}
            requestId={report.requestId}
            title={report.subject}
            description={report.description}
            date={formatDateToCustom(report.createdAt)}
            status={report.status}
            user={report.user}
            type={report.type}
            onStatusChange={(newStatus) =>
              console.log(`Status changed to: ${newStatus}`, report)
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ReportList;
