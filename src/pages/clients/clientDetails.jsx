import React, { useState, useEffect } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaBirthdayCake,
  FaIdCard,
  FaCalendarAlt,
  FaUserSlash,
  FaShieldAlt,
  FaUnlock,
  FaLock
} from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, toggleBlockStatus } from "../../redux/slices/clientsSlice";
import { Spinner, Center, useToast } from "@chakra-ui/react";

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user ? (
          <>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              
              {/* User Profile Info */}
              <div className="px-6 py-8 sm:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div className="sm:flex sm:space-x-5">
                    <div className="flex-shrink-0">
                      <img 
                        className="mx-auto h-24 w-24 rounded-full border-4 border-white shadow" 
                        src={user.profilePicture || '../../assets/user1.png'} 
                        alt={user.username}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mt-4 sm:mt-0 text-center sm:text-left">
                      <h1 className="text-xl font-bold text-gray-900 sm:flex sm:items-center">
                        {user.username || "Unknown User"}
                        {user.isVerified ? (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <FaShieldAlt className="mr-1" /> Verified
                          </span>
                        ) : (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Not Verified
                          </span>
                        )}
                      </h1>
                      <p className="text-sm font-medium text-gray-500">{user.email}</p>
                      <p className="text-sm font-medium text-gray-500">
                        {user.isBlocked ? (
                          <span className="text-red-500 flex items-center mt-1">
                            <FaLock className="mr-1" /> Account Blocked
                          </span>
                        ) : (
                          <span className="text-green-500 flex items-center mt-1">
                            <FaUnlock className="mr-1" /> Account Active
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 flex justify-center sm:mt-0">
                    {user.isBlocked ? (
                      <button
                        type="button"
                        onClick={() => handleOpenModal("Unblock")}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FaUnlock className="-ml-1 mr-2 h-4 w-4" />
                        Unblock User
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenModal("Block")}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaLock className="-ml-1 mr-2 h-4 w-4" />
                        Block User
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* User Information Sections */}
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 gap-x-6">
                  {/* Contact Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaEnvelope className="mr-2 text-blue-500" />
                      Contact Information
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaEnvelope className="mr-2 text-gray-400" />
                          {user.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaPhone className="mr-2 text-gray-400" />
                          {user.phone_number || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Address Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaMapMarkerAlt className="mr-2 text-blue-500" />
                      Address
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-gray-400" />
                          {user.address || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">City</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaCity className="mr-2 text-gray-400" />
                          {user.city || "Not provided"}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Personal Information */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <FaIdCard className="mr-2 text-blue-500" />
                      Personal Details
                    </h2>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaBirthdayCake className="mr-2 text-gray-400" />
                          {user.dob || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">National ID</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaIdCard className="mr-2 text-gray-400" />
                          {user.national_id || "Not provided"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Joined</dt>
                        <dd className="mt-1 text-sm text-gray-900 flex items-center">
                          <FaCalendarAlt className="mr-2 text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white shadow rounded-lg p-10 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
              <FaUserSlash className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-5 text-lg font-medium text-gray-900">User Not Found</h3>
            <p className="mt-2 text-sm text-gray-500">
              We couldn't find the user you're looking for. They may have been removed.
            </p>
            <div className="mt-6">
              <a
                href="/dashboard/clients"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Users
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed z-40 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setModalOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${modalAction === "Block" ? "bg-red-100" : "bg-green-100"} sm:mx-0 sm:h-10 sm:w-10`}>
                    {modalAction === "Block" ? (
                      <FaLock className="h-6 w-6 text-red-600" />
                    ) : (
                      <FaUnlock className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {modalAction} User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {modalAction.toLowerCase()} this user? {modalAction === "Block" ? "They will not be able to access their account." : "This will restore their access to the system."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${modalAction === "Block" ? "bg-red-600 hover:bg-red-700 focus:ring-red-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm`}
                  onClick={handleConfirmAction}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
