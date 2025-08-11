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
  Avatar,
  CardFooter,
  Divider,
} from "@nextui-org/react";
import { AiOutlineCalendar, AiOutlineSearch } from 'react-icons/ai';
import { BsThreeDotsVertical, BsFilter, BsCheckCircle } from 'react-icons/bs';
import { FaQuestionCircle } from 'react-icons/fa';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { MdSupportAgent } from "react-icons/md";
import { fetchSupportRequests, updateSupportRequest } from '../../redux/slices/supportRequestSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";

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

const statusColorMap = {
  pending: {
    color: 'default',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: null
  },
  'in_progress': {
    color: 'warning',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    icon: null
  },
  'resolved': {
    color: 'success',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: <BsCheckCircle className="mr-1" />
  },
  closed: {
    color: 'danger',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: null
  },
};

const ReportCard = ({ requestId, title, description, date, status, user, type, onStatusChange }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalTitle, setModalTitle] = useState('');
  const [modalDescription, setModalDescription] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isResolvedOrClosed, setIsResolvedOrClosed] = useState(true);
  const [statusToConfirm, setStatusToConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const statusConfig = statusColorMap[selectedStatus.toLowerCase()] || statusColorMap.pending;

  // Get user name or default to email username part
  const userName = user.username || user.names || (user.email ? user.email.split('@')[0] : 'User');
  console.log(user)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full mx-auto mb-4 overflow-hidden" shadow="sm">
        <CardHeader className="flex gap-4 items-start p-4">
          <div className="flex flex-col items-center gap-1">
            <Avatar
              src={user.profilePicture || "https://via.placeholder.com/150"}
              size="lg"
              isBordered
              color="primary"
              onClick={() => setImageModal({ isOpen: true, src: user.profilePicture })}
              className="cursor-pointer transition-transform hover:scale-105"
            />
            <p className="text-xs font-medium text-gray-600 mt-1 text-center max-w-[80px] truncate">
              {userName}
            </p>
          </div>
          
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-start w-full">
              <h3 className="text-lg font-semibold line-clamp-1">{title}</h3>
              <Chip 
                color={statusConfig.color} 
                variant="flat" 
                className={`ml-2 ${statusConfig.bgColor} ${statusConfig.textColor}`}
                startContent={statusConfig.icon}
              >
                {selectedStatus.replace('_', ' ').toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase())}
              </Chip>
            </div>
            <p className={`text-sm text-gray-600 mt-1 ${isExpanded ? '' : 'line-clamp-2'}`}>
              {description}
            </p>
            {description.length > 120 && (
              <Button 
                size="sm" 
                variant="light" 
                className="self-start pl-0 mt-1" 
                onClick={toggleExpand}
              >
                {isExpanded ? "Show less" : "Read more"}
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardFooter className="pt-0 px-4 pb-4 flex-col items-start">
          <Divider className="my-2" />
          <div className="flex items-center justify-between w-full pt-2">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <AiOutlineCalendar className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-500">{date}</p>
              </div>
              <div className="flex items-center space-x-1">
                <FaQuestionCircle className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-500">{type}</p>
              </div>
            </div>
            
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  isIconOnly 
                  variant="light" 
                  className="text-default-500"
                  radius="full"
                >
                  <BsThreeDotsVertical />
                </Button>
              </DropdownTrigger>
              <DropdownMenu 
                aria-label="Status Actions" 
                onAction={handleStatusChange} 
                disabledKeys={selectedStatus.toLowerCase() === "in_progress" ? ["in_progress"] : isResolvedOrClosed ? ["in_progress", "resolved", "closed"] : []}
              >
                <DropdownItem key="in_progress" startContent={<div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />}>
                  In Progress
                </DropdownItem>
                <DropdownItem key="resolved" startContent={<div className="w-2 h-2 rounded-full bg-green-500 mr-2" />}>
                  Resolved
                </DropdownItem>
                <DropdownItem key="closed" startContent={<div className="w-2 h-2 rounded-full bg-red-500 mr-2" />}>
                  Closed
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </CardFooter>
      </Card>
      
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900/50 to-zinc-900/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Status Change
                <p className="text-sm text-gray-500 font-normal">
                  Change status to <span className="font-medium">{statusToConfirm.replace('_', ' ').toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase())}</span>
                </p>
              </ModalHeader>
              <ModalBody>
                {statusToConfirm === 'closed' ? (
                  <>
                    <Input
                      label="Title"
                      value={modalTitle}
                      onChange={(e) => setModalTitle(e.target.value)}
                      variant="bordered"
                      className="mb-4"
                    />
                    <Input
                      label="Description"
                      value={modalDescription}
                      onChange={(e) => setModalDescription(e.target.value)}
                      variant="bordered"
                    />
                  </>
                ) : (
                  <p>Are you sure you want to change the status to <strong>{statusToConfirm.replace('_', ' ').toLowerCase().replace(/\b\w/g, ch => ch.toUpperCase())}</strong>?</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" color="danger" onPress={onClose}>
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
      
      <Modal isOpen={imageModal.isOpen} onClose={onCloseModal} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {userName}'s Profile Image
          </ModalHeader>
          <ModalBody className="p-0">
            <Image
              src={imageModal.src || "https://via.placeholder.com/400"}
              alt={`${userName}'s profile`}
              width="100%"
              className="object-cover max-h-[600px] rounded-b-lg"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </motion.div>
  );
};

const ReportList = () => {
  // Rest of the component remains unchanged
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isFiltered, setIsFiltered] = useState(false);

  const { supportRequests, hasFetched, loading } = useSelector((state) => state.supportRequests);
  const dispatch = useDispatch();

  // Fetch support requests if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchSupportRequests());
    }
  }, [hasFetched, dispatch]);

  // Filtered reports logic
  const filteredReports = React.useMemo(() => {
    const filtered = supportRequests.filter((report) => {
      const matchesSearch =
        report.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedFilter === 'all' || report.status.toLowerCase() === selectedFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
    
    setIsFiltered(searchTerm !== '' || selectedFilter !== 'all');
    return filtered;
  }, [supportRequests, searchTerm, selectedFilter]);

  // Handle filter changes
  const handleFilterChange = (key) => {
    setSelectedFilter(key);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFilterColor = (filter) => {
    if (filter === 'all') return 'default';
    return statusColorMap[filter]?.color || 'default';
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

      {/* Modern Search and Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm mb-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full">
            <Input
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              startContent={<AiOutlineSearch className="text-gray-400" />}
              variant="bordered"
              classNames={{
                inputWrapper: "bg-gray-50",
              }}
              isClearable
              size="lg"
              className="w-full"
            />
          </div>
          
          <Dropdown>
            <DropdownTrigger>
              <Button 
                endContent={<BsFilter />} 
                variant={selectedFilter !== 'all' ? 'flat' : 'bordered'}
                color={getFilterColor(selectedFilter)}
              >
                {selectedFilter === 'all' ? 'Filter by Status' : `Status: ${selectedFilter}`}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Status Filter"
              onAction={handleFilterChange}
              selectedKeys={[selectedFilter]}
              selectionMode="single"
            >
              <DropdownItem key="all">All Statuses</DropdownItem>
              <DropdownItem key="pending" startContent={<div className="w-2 h-2 rounded-full bg-gray-500" />}>
                Pending
              </DropdownItem>
              <DropdownItem key="in_progress" startContent={<div className="w-2 h-2 rounded-full bg-amber-500" />}>
                In Progress
              </DropdownItem>
              <DropdownItem key="resolved" startContent={<div className="w-2 h-2 rounded-full bg-green-500" />}>
                Resolved
              </DropdownItem>
              <DropdownItem key="closed" startContent={<div className="w-2 h-2 rounded-full bg-red-500" />}>
                Closed
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        
        {isFiltered && filteredReports.length > 0 && (
          <div className="mt-3 text-sm text-gray-500">
            Showing {filteredReports.length} of {supportRequests.length} support requests
          </div>
        )}
      </div>

      {/* Report Cards */}
      <div className="mx-auto max-w-4xl my-8">
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-solid border-current border-r-transparent text-primary-500 mb-4"></div>
            <p className="text-gray-500">Loading support requests...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <Card className="w-full py-10 px-6 text-center">
            <div className="mx-auto p-4 rounded-full bg-gray-100 w-16 h-16 flex items-center justify-center mb-3">
              <FaQuestionCircle size={28} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No support requests found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || selectedFilter !== 'all' 
                ? "Try adjusting your search or filter settings" 
                : "There are no support requests to display at this time"}
            </p>
            {(searchTerm || selectedFilter !== 'all') && (
              <div className="flex justify-center">
                <Button 
                  color="primary" 
                  variant="flat" 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </Card>
        ) : (
          filteredReports.map((report, index) => (
            <ReportCard
              key={report.requestId || index}
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
          ))
        )}
      </div>
    </div>
  );
};

export default ReportList;