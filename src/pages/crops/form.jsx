import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addCrop } from "../../redux/slices/cropSlice"; // Update with correct path
import { useNavigate } from "react-router-dom";

const CropForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    growingConditions: "",
    harvestTime: "",
    images: [],
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files),
    }));
  };

  // Validate required fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Crop name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (!formData.growingConditions.trim()) tempErrors.growingConditions = "Growing Conditions is required.";
    if (!formData.harvestTime.trim()) tempErrors.harvestTime = "Harvest Time is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("growingConditions", formData.growingConditions);
      payload.append("harvestTime", formData.harvestTime);
      formData.images.forEach((file) => payload.append("images", file));
      
      try {
        await dispatch(addCrop(payload)).unwrap();
        toast({
          title: "Crop added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/crops"); // Redirect on success
      } catch (error) {
        // Check if the error is an object and has a message property
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to add crop. Please try again later.";
          
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "Please fill in all required fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <div className={`px-4 md:px-8 lg:px-16 py-8`}>
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/crops">crops</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/crops/add">Add</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">ADD CROPS INFORMATION</h3>

            <Input
              type="file"
              fullWidth
              name="images"
              onChange={handleImageChange}
              helperText="You can upload multiple images."
              multiple
            />

            {/* Crop Name */}
            <Input
              label="Crop Name"
              placeholder="Enter crop name"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              helperText={errors.name}
              helperColor="error"
              clearable
            />

            {/* Crop Description */}
            <Textarea
              label="Description"
              placeholder="Enter a brief description"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              helperText={errors.description}
              helperColor="error"
              minRows={3}
            />

            {/* growingConditions */}
            <Textarea
              label="Growing Conditions"
              placeholder="Growing Conditions"
              fullWidth
              name="growingConditions"
              value={formData.growingConditions}
              onChange={handleChange}
              helperText={errors.growingConditions}
              helperColor="error"
              minRows={2}
            />

            {/* harvestTime */}
            <Textarea
              label="Harvest Time"
              placeholder="Harvest Times"
              fullWidth
              name="harvestTime"
              value={formData.harvestTime}
              onChange={handleChange}
              helperText={errors.harvestTime}
              helperColor="error"
              minRows={2}
            />

            {/* Submit Button */}
            <Spacer y={1} />
            <Button color="primary" type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CropForm;
