import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Divider,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  AutocompleteItem,
  Autocomplete,
  AutocompleteSection,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { FaUser, FaIdCard } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addAdminUser } from "../../redux/slices/clientsSlice";
import { fetchProvinces } from "../../redux/slices/provincesSlice";

const CreateAdminUserPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",
    names: "",
    national_id: "",
    district: "",
    address: "",
    gender: "",
    dob: "",
    role: "", // Added role field
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { provinces, hasFetched: hasFetchedProvince } = useSelector((state) => state.provinces);


  useEffect(() => {
    if(!hasFetchedProvince) {
      dispatch(fetchProvinces());
    }
  }, [dispatch, hasFetchedProvince]);

  const validate = () => {
    let tempErrors = {};
    if (step === 0) {
      if (!formData.email) tempErrors.email = "Email is required.";
      if (!formData.username) tempErrors.username = "Username is required.";
      if (!formData.phone_number) {
        tempErrors.phone_number = "Phone number is required.";
      } else if (!/^\+2507\d{8}$/.test(formData.phone_number)) {
        tempErrors.phone_number = "Phone number must start with +250 and be followed by 9 digits.";
      }
      if (!formData.names) tempErrors.names = "Names are required.";
      if (!formData.role) tempErrors.role = "Role is required."; // Added role validation
    } else if (step === 1) {
      if (!formData.national_id) {
        tempErrors.national_id = "National ID is required.";
      } else if (!/^\d{16}$/.test(formData.national_id)) {
        tempErrors.national_id = "National ID must be 16 digits.";
      }
      if (!formData.district) tempErrors.district = "district is required.";
      if (!formData.address) tempErrors.address = "Address is required.";
      if (!formData.gender) tempErrors.gender = "Gender is required.";
      if (!formData.dob) tempErrors.dob = "Date of birth is required.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (validate()) {
      if (step < 1) {
        setStep(step + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(addAdminUser(formData)).unwrap();
      toast({
        title: "Success",
        description: "Admin user created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/dashboard/clients");
    } catch (error) {
      toast({
        title: "Error",
        description: error?.message || "Failed to create admin user.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      label: "Basic Information",
      icon: <FaUser />,
    },
    {
      label: "Additional Details",
      icon: <FaIdCard />,
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 bg-gray-100">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/clients">Users</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/clients/create-admin">
          Create Admin
        </BreadcrumbItem>
      </Breadcrumbs>

      <div className="flex flex-col md:flex-row items-start max-w-4xl mx-auto rounded-lg mb-6">
        <Card className="w-full shadow-lg p-8">
          <CardHeader>
            <div className="flex w-full justify-between items-center mb-4">
              {steps.map((s, index) => (
                <div key={index} className={`flex items-center ${index < step ? "text-green-500" : ""}`}>
                  <div className="flex items-center space-x-2">
                    <span className={`text-2xl ${index === step ? "text-blue-500" : ""}`}>{s.icon}</span>
                    <h4 className={`text-md ${index === step ? "font-bold" : "text-gray-500"}`}>{s.label}</h4>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>

          <Divider />

          {step === 0 && (
            <CardBody>
              <Input
                label="Email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.email}
                isInvalid={!!errors.email}
              />
              <Input
                label="Username"
                placeholder="Enter username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.username}
                isInvalid={!!errors.username}
              />
              <Input
                label="Names"
                placeholder="Enter names"
                name="names"
                value={formData.names}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.names}
                isInvalid={!!errors.names}
              />
              <Input
                label="Phone Number"
                placeholder="Enter phone number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.phone_number}
                isInvalid={!!errors.phone_number}
              />
              <Select
                label="Role"
                placeholder="Select role"
                name="role"
                value={formData.role}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, role: e.target.value }))}
                className="mb-3"
                errorMessage={errors.role}
                isInvalid={!!errors.role}
              >
                <SelectItem key="admin" value="admin">Admin</SelectItem>
                <SelectItem key="rab" value="rab">RAB</SelectItem>
              </Select>
            </CardBody>
          )}

          {step === 1 && (
            <CardBody>
              <Input
                label="National ID"
                placeholder="Enter national ID"
                name="national_id"
                value={formData.national_id}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.national_id}
                isInvalid={!!errors.national_id}
              />
              <Autocomplete
                label="Districts"
                placeholder="Search a district"
                defaultItems={provinces} 
                selectedKey={formData.district}
                onSelectionChange={(value) => setFormData({ ...formData, district: value })}
                errorMessage={errors.district}
                isInvalid={!!errors.district}
                className="mb-3"
              >
                {(item) => (
                  <AutocompleteSection title={item.name} key={item.id} >
                    {item.districts.map((district) => (
                      <AutocompleteItem key={district.id} value={district.id}>
                        {district.name}
                      </AutocompleteItem>
                    ))}
                  </AutocompleteSection>
                )}
              </Autocomplete>
              <Input
                label="Address"
                placeholder="Enter address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.address}
                isInvalid={!!errors.address}
              />
              <Select
                label="Gender"
                placeholder="Select gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData((prevData) => ({ ...prevData, gender: e.target.value }))}
                className="mb-3"
                errorMessage={errors.gender}
                isInvalid={!!errors.gender}
              >
                <SelectItem key="male" value="Male">Male</SelectItem>
                <SelectItem key="female" value="Female">Female</SelectItem>
                <SelectItem key="other" value="Other">Other</SelectItem>
              </Select>
              <Input
                label="Date of Birth"
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                fullWidth
                className="mb-3"
                errorMessage={errors.dob}
                isInvalid={!!errors.dob}
              />
            </CardBody>
          )}

          <CardFooter>
            <div className="flex justify-between w-full">
              {step > 0 && (
                <Button color="default" onPress={handlePrevious} disabled={loading}>
                  Previous
                </Button>
              )}
              <Spacer />
              <Button color="primary" isLoading={loading} onPress={handleNext} isDisabled={loading}>
                {step < steps.length - 1 ? "Next" : "Submit"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CreateAdminUserPage;