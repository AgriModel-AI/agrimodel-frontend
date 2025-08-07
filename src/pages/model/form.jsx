// ModelForm.jsx
import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  Tooltip
} from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addModel } from "../../redux/slices/modelSlice";
import { useNavigate } from "react-router-dom";
import { MdInfo } from "react-icons/md";

const ModelForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    version: "",
    model_file: null,
    accuracy: "",
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

  // Handle file input change
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  // Validate required fields
  const validate = () => {
    let tempErrors = {};
    
    if (!formData.version.trim()) {
      tempErrors.version = "Version is required.";
    } else if (!formData.version.match(/^\d+\.\d+\.\d+$/)) {
      tempErrors.version = "Version must be in format x.y.z (e.g., 1.0.0)";
    }
    
    if (!formData.model_file) {
      tempErrors.model_file = "Model file is required.";
    }
    
    if (formData.accuracy && (isNaN(formData.accuracy) || formData.accuracy < 0 || formData.accuracy > 100)) {
      tempErrors.accuracy = "Accuracy must be a number between 0 and 100.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      const payload = new FormData();
      payload.append("version", formData.version);
      payload.append("model_file", formData.model_file);
      if (formData.accuracy) {
        payload.append("accuracy", formData.accuracy);
      }
      
      try {
        await dispatch(addModel(payload)).unwrap();
        toast({
          title: "Model uploaded successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/models"); // Redirect on success
      } catch (error) {
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to upload model. Please try again later.";
          
        toast({
          title: "Error",
          description: errorMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast({
        title: "Please fill in all required fields correctly.",
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
        <BreadcrumbItem href="/dashboard/models">AI Models</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/models/add">Upload</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">UPLOAD NEW AI MODEL</h3>

            {/* Version */}
            <Input
              label="Version"
              placeholder="e.g., 1.0.0"
              fullWidth
              name="version"
              value={formData.version}
              onChange={handleChange}
              helperText={errors.version}
              helperColor="error"
              clearable
              isRequired
              isDisabled={isSubmitting}
              endContent={
                <Tooltip content="Use semantic versioning format: MAJOR.MINOR.PATCH">
                  <MdInfo className="text-default-400" />
                </Tooltip>
              }
            />

            {/* Model File */}
            <Input
              type="file"
              label="Model File"
              fullWidth
              name="model_file"
              onChange={handleFileChange}
              helperText={errors.model_file}
              helperColor="error"
              isRequired
              isDisabled={isSubmitting}
              accept=".tflite,.pb,.h5,.onnx,.pt,.pth"
              description="Upload the trained model file (.tflite, .pb, .h5, .onnx, .pt, .pth)"
            />

            {/* Accuracy */}
            <Input
              type="number"
              label="Accuracy (%)"
              placeholder="e.g., 95.5"
              fullWidth
              name="accuracy"
              value={formData.accuracy}
              onChange={handleChange}
              helperText={errors.accuracy}
              helperColor="error"
              min={0}
              max={100}
              step={0.1}
              isDisabled={isSubmitting}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">%</span>
                </div>
              }
              description="Enter the model's accuracy percentage (if available)"
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
              {isSubmitting ? "Uploading..." : "Upload Model"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ModelForm;