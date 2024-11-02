import React, { useState } from "react";
import { Card, Input, Button, Avatar, Divider, Modal, ModalBody, ModalFooter, ModalContent, ModalHeader, useDisclosure, Spacer } from "@nextui-org/react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    zipCode: "",
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSave = () => {
    console.log("Form Data:", formData);
  };

  const handleDelete = () => {
    console.log("Account deleted");
    onClose();
  };

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h3 className="text-2xl font-bold mb-4">Personal Information</h3>
      <Divider className="my-4" />

      <form className="space-y-6">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <Avatar
            size="xl"
            src={formData.photo ? URL.createObjectURL(formData.photo) : "https://img.freepik.com/free-photo/people-showing-support-respect-with-yellow-background-suicide-prevention-day_23-2151607937.jpg"}
            alt="User Avatar"
            className="mr-0 md:mr-4 mb-4 md:mb-0"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-sm text-gray-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            clearable
            label="First Name"
            placeholder="Enter first name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="Last Name"
            placeholder="Enter last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <Input
            clearable
            label="Email Address"
            placeholder="Enter email address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <Input
            label="Phone Number"
            placeholder="+880 1681 788 203"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
          <Input
            label="Zip Code"
            placeholder="Enter zip code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </div>

        <Button color="primary" auto onPress={handleSave} className="w-full mt-6">
          Save
        </Button>
      </form>

      <Divider className="my-6" />

      <Card variant="bordered" className="bg-gray-50 p-4">
        <h4 className="text-lg font-semibold mb-2">Delete Account</h4>
        <p className="text-sm text-gray-600 mb-4">
          After making a deletion request, you will have <strong>6 months</strong> to maintain this account.
        </p>
        <Button color="danger" auto onPress={onOpen}>
          Delete Account
        </Button>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Deletion</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button flat color="default" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="error" onPress={handleDelete}>
                  Confirm Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

const EmailPassword = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Card className="p-6 md:p-8 shadow-md">
      <h3 className="text-2xl font-bold mb-4">Change Password</h3>
      <Divider className="my-4" />

      <Input
        label="Current Password"
        variant="flat"
        placeholder="Enter current password"
        endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
            {isVisible ? <AiFillEye className="text-2xl text-default-400" /> : <AiFillEyeInvisible className="text-2xl text-default-400" />}
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
        endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
            {isVisible ? <AiFillEye className="text-2xl text-default-400" /> : <AiFillEyeInvisible className="text-2xl text-default-400" />}
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
        endContent={
          <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
            {isVisible ? <AiFillEye className="text-2xl text-default-400" /> : <AiFillEyeInvisible className="text-2xl text-default-400" />}
          </button>
        }
        type={isVisible ? "text" : "password"}
        className="w-full"
      />

      <Button color="primary" className="mt-6 w-full" auto>
        Update Password
      </Button>
    </Card>
  );
};

export default ProfileManagement;
