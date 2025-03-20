import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Avatar,
  Divider,
  Modal,
  ModalBody,
  ModalFooter,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Spacer,
  Select,
  SelectItem,
} from "@nextui-org/react";
import {  Autocomplete,  AutocompleteSection,  AutocompleteItem} from "@nextui-org/autocomplete";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useToast } from "@chakra-ui/react";
import { fetchUserDetails, addUserDetail } from "../../redux/slices/userDetailsSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosConfig";
import { useNavigate } from "react-router-dom";
import { fetchProvinces } from "../../redux/slices/provincesSlice";

const ProfileManagement = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");

  const renderContent = () => {
    switch (activeTab) {
      case "personalInfo":
        return <PersonalInfo />;
      case "emailPassword":
        return <EmailPassword />;
      default:
        return <PersonalInfo />;
    }
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-8 bg-gray-100 min-h-screen">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrent>Profile Management</BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col md:flex-row max-w-5xl mx-auto">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:mr-6">
          <Card className="p-4 shadow-md">
            <h3 className="text-lg font-bold mb-4">User Profile Management</h3>
            <Button
              flat
              color={activeTab === "personalInfo" ? "primary" : "default"}
              onPress={() => setActiveTab("personalInfo")}
              className="w-full mb-2"
            >
              Personal Info
            </Button>
            <Button
              flat
              color={activeTab === "emailPassword" ? "primary" : "default"}
              onPress={() => setActiveTab("emailPassword")}
              className="w-full mb-2"
            >
              Change Password
            </Button>
          </Card>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4">{renderContent()}</div>
      </div>
    </div>
  );
};

const PersonalInfo = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { userDetails, loading, error, hasFetched } = useSelector((state) => state.userDetails);
  const { provinces, hasFetched: hasFetchedProvince } = useSelector((state) => state.provinces);
 
  const [imageModal, setImageModal] = React.useState({ isOpen: false, src: "" });
  const onCloseModal = () => setImageModal({ isOpen: false, src: "" });

  useEffect(() => {
    if(!hasFetchedProvince) {
      dispatch(fetchProvinces());
    }
  }, [dispatch, hasFetchedProvince]);

  const [formData, setFormData] = useState({
    names: "",
    national_id: "",
    phone_number: "",
    district: "",
    address: "",
    gender: "",
    birthdate: null,
    profilePicture: null,
    imageChanged: false,
  });

  useEffect(() => {
    if(!hasFetched) {
      dispatch(fetchUserDetails());
    }
  }, [dispatch, hasFetched]);


  useEffect(() => {
    if (userDetails) {
      setFormData({
        names: userDetails.names || "",
        national_id: userDetails.national_id || "",
        phone_number: userDetails.phone_number || "",
        district: userDetails.district?.name || "",
        address: userDetails.address || "",
        gender: userDetails.gender || "",
        dob: userDetails.dob ?userDetails.dob : null,
        profilePicture: userDetails.profilePicture || null,
        imageChanged: false,
      });
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file, imageChanged: true });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Validate inputs
    
    if (
      !formData.names ||
      !formData.national_id ||
      !formData.phone_number ||
      !formData.district ||
      !formData.address ||
      !formData.gender ||
      !formData.dob
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        status: "error",
      });
      return;
    }

    
    const data = new FormData();
    data.append("names", formData.names);
    data.append("national_id", formData.national_id);
    data.append("phone_number", formData.phone_number);
    data.append("district", formData.district);
    data.append("address", formData.address);
    data.append("gender", formData.gender);
    data.append("dob", formData.dob);
    
    console.log(formData)
    
    // Only append profilePicture if it has changed
    if (formData.imageChanged) {
      data.append("profilePicture", formData.profilePicture);
    }
    setIsSubmitting(true);
  // Dispatch addUserDetail thunk
  dispatch(addUserDetail(data))
    .unwrap()
    .then(() => {
      toast({
        title: "Profile Updated",
        description: "Your personal information has been saved successfully.",
        status: "success",
      });
    })
    .catch((error) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update profile.",
        status: "error",
      });
    });
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.patch("/user-details/block-account", {
        isBlocked: "true",
      });

      setConfirmationModalOpen(true);

      setTimeout(() => {
        setConfirmationModalOpen(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.description ||
          "Failed to delete account. Please try again.",
        status: "error",
      });
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h3 className="text-2xl font-bold mb-4">Personal Information</h3>
      <Divider className="my-4" />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form className="space-y-6" onSubmit={handleSave}>
        <div className="flex flex-col md:flex-row items-center mb-6">
          {
            formData.imageChanged ?

            <Avatar
              size="xl"
              src={
                formData.profilePicture
                  ? URL.createObjectURL(formData.profilePicture)
                  : "https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg"
              }
              alt="User Avatar"
              className="mr-0 md:mr-4 mb-4 md:mb-0"
              onClick={() => setImageModal({ isOpen: true, src: URL.createObjectURL(formData.profilePicture) })}
            />

            : 

            <Avatar
              size="xl"
              src={formData.profilePicture || "https://via.placeholder.com/150"}
              alt="User Avatar"
              className="mr-0 md:mr-4 mb-4 md:mb-0"
            />
          }
          
          
          <Input
            type="file"
            accept="image/*"
            className="text-sm text-gray-600"
            onChange={handleFileChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            clearable
            label="Fullname"
            placeholder="Enter fullname"
            name="names"
            value={formData.names}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="National ID"
            placeholder="Enter National ID"
            name="national_id"
            value={formData.national_id}
            onChange={handleInputChange}
          />
          <Input
            label="Phone Number"
            placeholder="+250 700 000 000"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
          />
          <Autocomplete
            label="Districts"
            placeholder="Search a district"
            defaultItems={provinces} 
            selectedKey={formData.district}
            onSelectionChange={(value) => setFormData({ ...formData, district: value })}
          >
            {(item) => (
              <AutocompleteSection title={item.name} key={item.id} >
                {item.districts.map((district) => (
                  <AutocompleteItem key={district.name}>
                    {district.name}
                  </AutocompleteItem>
                ))}
              </AutocompleteSection>
            )}
          </Autocomplete>
          <Input
            label="Address"
            placeholder="Enter Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Select
            labelPlacement="inside"
            label="Gender"
            placeholder="Select your gender"
            value={formData.gender}
            selectedKeys={[formData.gender]}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          >
            <SelectItem key="male">Male</SelectItem>
            <SelectItem key="female">Female</SelectItem>
          </Select>
          <Input
            clearable
            label="Birth date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            type="date"
          />
        </div>

        <Button type="submit" color="primary" auto className="w-full mt-6"
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>

      <Divider className="my-6" />

      <Card variant="bordered" className="bg-gray-50 p-4">
        <h4 className="text-lg font-semibold mb-2">Delete Account</h4>
        <p className="text-sm text-gray-600 mb-4">
          Once your account is deleted, it will be <strong>permanently blocked.</strong> To
          restore access, you must contact the admin for assistance.
        </p>
        <Button color="danger" auto onPress={onOpen}>
          Delete Account
        </Button>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Confirm Deletion</ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete your account? This action cannot
                be undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button flat color="default" onPress={onClose}>
                Cancel
              </Button>
              <Button
                color="error"
                auto
                onPress={() => {
                  onClose();
                  handleDelete();
                }}
              >
                Confirm Delete
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Success Modal */}
        <Modal isOpen={confirmationModalOpen} onClose={() => setConfirmationModalOpen(false)}>
          <ModalContent>
            <ModalHeader>Account Deleted</ModalHeader>
            <ModalBody>
              <p>
                Your account has been successfully deleted and blocked. You will
                be automatically redirected to the login page.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button flat color="primary" auto onPress={() => navigate("/login")}>
                Go to Login
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={imageModal.isOpen} onClose={onCloseModal}>
        <ModalContent>
          <ModalHeader>Profile Image</ModalHeader>
          <ModalBody>
            <img src={imageModal.src} alt="Diagnosis" className="w-full h-auto" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  );
};

const EmailPassword = () => {
  const [formData, setFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!formData.current_password) {
      toast({
        title: "Validation Error",
        description: "Current password is required.",
        status: "error",
      });
      return;
    }
    if (!formData.new_password || formData.new_password.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters long.",
        status: "error",
      });
      return;
    }
    if (formData.new_password !== formData.confirm_password) {
      toast({
        title: "Validation Error",
        description: "New password and confirm password do not match.",
        status: "error",
      });
      return;
    }

    try {
      console.log(formData)
      // Send data to the API
      await axiosInstance.post("/user-details/password-change", formData);

      // Show success modal
      setModalOpen(true);

      // Auto logout and redirect after 3 seconds
      setTimeout(() => {
        setModalOpen(false);
        navigate("/login");
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.response?.data?.description || "Failed to update the password.",
        status: "error",
      });
    }
  };

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h3 className="text-2xl font-bold mb-4">Change Password</h3>

      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <Input
          label="Current Password"
          variant="flat"
          placeholder="Enter current password"
          name="current_password"
          value={formData.current_password}
          onChange={handleInputChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <AiFillEye className="text-2xl text-default-400" />
              ) : (
                <AiFillEyeInvisible className="text-2xl text-default-400" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="w-full"
        />

        <Spacer y={2} />

        <Input
          label="New Password"
          variant="flat"
          placeholder="Enter new password"
          name="new_password"
          value={formData.new_password}
          onChange={handleInputChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <AiFillEye className="text-2xl text-default-400" />
              ) : (
                <AiFillEyeInvisible className="text-2xl text-default-400" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="w-full"
        />

        <Spacer y={2} />

        <Input
          label="Confirm Password"
          variant="flat"
          placeholder="Confirm new password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleInputChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
              aria-label="toggle password visibility"
            >
              {isVisible ? (
                <AiFillEye className="text-2xl text-default-400" />
              ) : (
                <AiFillEyeInvisible className="text-2xl text-default-400" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="w-full"
        />

        <Button type="submit" color="primary" className="mt-6 w-full" auto>
          Update Password
        </Button>
      </form>

      {/* Success Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Password Changed</ModalHeader>
          <ModalBody>
            <p>
              Your password has been successfully changed. You will be
              automatically logged out and redirected to the login page.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button flat color="primary" auto onPress={() => navigate("/login")}>
              Go to Login
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Card>
  );
};


export default ProfileManagement;
