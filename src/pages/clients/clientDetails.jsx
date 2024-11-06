import React, { useState, useEffect } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
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
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, toggleBlockStatus } from "../../redux/slices/clientsSlice";
import { Image, Spinner, Center, useToast } from "@chakra-ui/react";
import { FaUserSlash } from "react-icons/fa";

const ClientDetails = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [user, setUser] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Track loading state

  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const toast = useToast();

  const { clients, hasFetched } = useSelector((state) => state.clients);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchClients()).finally(() => setLoading(false)); // Stop loading once data is fetched
    } else {
      setLoading(false);
    }
  }, [dispatch, hasFetched]);

  useEffect(() => {
    if (clients.length !== 0) {
      const userFetched = clients.find((user) => user.userId === parseInt(id, 10));
      if (userFetched) {
        setUser(userFetched);
      }
    }
  }, [clients, id]);

  const handleOpenModal = (action) => {
    setModalAction(action);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    const isBlocked = modalAction === "Block";
    try {
      await dispatch(toggleBlockStatus({ userId: user.userId, isBlocked })).unwrap();
      setUser((prev) => ({ ...prev, isBlocked }));
      toast({
        title: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isBlocked ? "block" : "unblock"} user`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setModalOpen(false);
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 bg-gray-100">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/clients">Users</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/clients/view">View</BreadcrumbItem>
      </Breadcrumbs>

      {user ? (
        <>
          <Card className="flex flex-col md:flex-row items-start p-8 max-w-4xl mx-auto shadow-lg rounded-lg mb-6">
            <div className="flex flex-col items-center justify-center w-full md:w-1/3 p-4">
              <Image
                src={user.profilePicture || '../../assets/user1.png'}
                size="xl"
                radius="lg"
                className="mb-4"
                width={200}
                referrerPolicy="no-referrer" 
              />
              <h2 className="text-xl font-bold mt-2">{user.username || "Unknown User"}</h2>
              <p className="text-sm text-gray-600">{user.email}</p>
              {user.isVerified ? (
                <span className="text-blue-500 mt-2">✔ Verified</span>
              ) : (
                <span className="text-red-500 mt-2">✘ Not Verified</span>
              )}
            </div>

            <Divider orientation="vertical" className="hidden md:block h-full mx-4" />

            <div className="w-full md:w-2/3 flex flex-col space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800">ABOUT</h4>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaEnvelope className="mr-2 text-gray-500" /> Email: {user.email}
                </p>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaPhone className="mr-2 text-gray-500" /> Phone number: {user.phone_number || "Not provided"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">ADDRESS</h4>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaMapMarkerAlt className="mr-2 text-gray-500" /> Address: {user.address || "Not provided"}
                </p>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaCity className="mr-2 text-gray-500" /> City: {user.city || "Not provided"}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">OTHER DETAILS</h4>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaBirthdayCake className="mr-2 text-gray-500" /> Date Of Birth: {user.dob || "Not provided"}
                </p>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaIdCard className="mr-2 text-gray-500" /> National ID: {user.national_id || "Not provided"}
                </p>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaCalendarAlt className="mr-2 text-gray-500" /> Joined At: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white">
            <div className="flex space-x-4">
              <Button
                color="success"
                auto
                onPress={() => handleOpenModal("Unblock")}
                isDisabled={!user.isBlocked}
              >
                Unblock
              </Button>
              <Button
                color="danger"
                auto
                onPress={() => handleOpenModal("Block")}
                isDisabled={user.isBlocked}
              >
                Block
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <Card className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white">
          <p className="flex items-center text-gray-700">
            <FaUserSlash className="mr-2 text-gray-500"/> User Not Found
          </p>
        </Card>
      )}

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
