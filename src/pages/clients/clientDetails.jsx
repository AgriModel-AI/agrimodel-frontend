import React, { useState } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
  Image,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@nextui-org/react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaBirthdayCake,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";

const ClientDetails = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");

  const handleOpenModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirmAction = () => {
    // Handle the action based on modalAction
    console.log(`${modalAction} confirmed`);
    setModalOpen(false);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 bg-gray-100">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/users">Users</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/users/view">View</BreadcrumbItem>
      </Breadcrumbs>

      {/* User Profile Card */}
      <Card className="flex flex-col md:flex-row items-start p-8 max-w-4xl mx-auto shadow-lg rounded-lg mb-6">
        <div className="flex flex-col items-center justify-center w-full md:w-1/3 p-4">
          <Image
            src="https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg"
            size="xl"
            radius="lg"
            className="mb-4"
            width={200}
          />
          <h2 className="text-xl font-bold mt-2">MUHIRE jackson kelly</h2>
          <p className="text-sm text-gray-600">jackson@gmail.com</p>
          <span className="text-blue-500 mt-2">✔ Verified</span>
        </div>

        <Divider orientation="vertical" className="hidden md:block h-full mx-4" />

        <div className="w-full md:w-2/3 flex flex-col space-y-6">
          {/* About Section */}
          <div>
            <h4 className="font-semibold text-gray-800">ABOUT</h4>
            <p className="flex items-center text-gray-700 mt-2">
              <FaEnvelope className="mr-2 text-gray-500" /> Email: kelly@gmail.com
            </p>
            <p className="flex items-center text-gray-700 mt-2">
              <FaPhone className="mr-2 text-gray-500" /> Phone number: +2570789470000
            </p>
          </div>

          {/* Address Section */}
          <div>
            <h4 className="font-semibold text-gray-800">ADDRESS</h4>
            <p className="flex items-center text-gray-700 mt-2">
              <FaMapMarkerAlt className="mr-2 text-gray-500" /> Address: KG 48 st
            </p>
            <p className="flex items-center text-gray-700 mt-2">
              <FaCity className="mr-2 text-gray-500" /> City: Kigali city
            </p>
          </div>

          {/* Other Details Section */}
          <div>
            <h4 className="font-semibold text-gray-800">OTHER DETAILS</h4>
            <p className="flex items-center text-gray-700 mt-2">
              <FaBirthdayCake className="mr-2 text-gray-500" /> Date Of Birth: Sept 28, 1990
            </p>
            <p className="flex items-center text-gray-700 mt-2">
              <FaIdCard className="mr-2 text-gray-500" /> National ID: 1199080128731005
            </p>
            <p className="flex items-center text-gray-700 mt-2">
              <FaCalendarAlt className="mr-2 text-gray-500" /> Joined At: Jun 29, 2024
            </p>
          </div>
        </div>
      </Card>

      {/* Action Buttons Card */}
      <Card className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white">
        <div className="flex space-x-4">
          <Button color="success" auto onPress={() => handleOpenModal("Activate")}>
            Activate
          </Button>
          <Button color="warning" auto onPress={() => handleOpenModal("Deactivate")}>
            Deactivate
          </Button>
          <Button color="danger" auto onPress={() => handleOpenModal("Block")}>
            Block
          </Button>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>{`${modalAction} Confirmation`}</ModalHeader>
          <ModalBody>
            Are you sure you want to {modalAction.toLowerCase()} this user?
          </ModalBody>
          <ModalFooter>
            <Button flat color="error" onPress={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleConfirmAction}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientDetails;
