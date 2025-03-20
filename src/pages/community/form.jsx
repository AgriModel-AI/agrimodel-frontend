import React, { useState } from "react";
import { Card, Input, Button, Textarea, Select, Spacer, Breadcrumbs, BreadcrumbItem, SelectItem } from "@nextui-org/react";
import { useMediaQuery } from 'react-responsive';
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addCommunity } from "../../redux/slices/communitySlice"; // Update with correct path
import { useNavigate } from "react-router-dom";

const CommunityForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: [],
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
      image: Array.from(e.target.files),
    }));
  };

  // Validate required fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Disease name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("image", formData.image[0]);
      
      try {
        await dispatch(addCommunity(payload)).unwrap();
        toast({
          title: "Community added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/community"); // Redirect on success
      } catch (error) {
        // Check if the error is an object and has a message property
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to add community. Please try again later.";
          
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setIsSubmitting(false);
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
        <BreadcrumbItem href="/dashboard/community">Communities</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/community/add">Add</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? 'flex-col' : 'flex-row'} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">ADD COMMUNITY INFORMATION</h3>

            <Input
              type="file"
              fullWidth
              name="images"
              onChange={handleImageChange}
              helperText="You can upload single image."
            />

            {/* Disease Name */}
            <Input
              label="Disease Name"
              placeholder="Enter community name"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              helperText={errors.name}
              helperColor="error"
              clearable
            />

            {/* Disease Description */}
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

            {/* Submit Button */}
            <Spacer y={1} />
            <Button 
              color="primary" 
              type="submit" 
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CommunityForm;
