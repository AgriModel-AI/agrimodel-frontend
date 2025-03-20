import React, { useState, useEffect } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  Select,
  SelectItem
} from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { addDisease } from "../../redux/slices/diseaseSlice"; // Update with correct path
import { useNavigate } from "react-router-dom";
import { fetchCrop } from "../../redux/slices/cropSlice";

const DiseaseForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { crops, hasFetched } = useSelector((state) => state.crops);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchCrop());
    }
  }, [hasFetched, dispatch]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    label: "",
    cropId: "",
    symptoms: "",
    treatment: "",
    prevention: "",
    images: [],
    relatedDiseases: "",
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
    if (!formData.name.trim()) tempErrors.name = "Disease name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (!formData.label.trim()) tempErrors.label = "label is required.";
    if (!formData.cropId) tempErrors.cropId = "cropId is required.";
    if (!formData.symptoms.trim()) tempErrors.symptoms = "Symptoms are required.";
    if (!formData.treatment.trim()) tempErrors.treatment = "Treatment is required.";
    if (!formData.prevention.trim()) tempErrors.prevention = "Prevention is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSelectChange = (e) => {
    console.log(e.target.value)
    setFormData((prevData) => ({
      ...prevData,
      cropId: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("label", formData.label);
      payload.append("cropId", parseInt(formData.cropId));
      payload.append("symptoms", formData.symptoms);
      payload.append("treatment", formData.treatment);
      payload.append("prevention", formData.prevention);
      payload.append("relatedDiseases", formData.relatedDiseases);
      formData.images.forEach((file) => payload.append("images", file));
      
      try {
        await dispatch(addDisease(payload)).unwrap();
        toast({
          title: "Disease added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/diseases"); // Redirect on success
      } catch (error) {
        // Check if the error is an object and has a message property
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to add disease. Please try again later.";
          
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
        <BreadcrumbItem href="/dashboard/diseases">Diseases</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/diseases/add">Add</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">ADD DISEASE INFORMATION</h3>

            <Input
              type="file"
              fullWidth
              name="images"
              onChange={handleImageChange}
              helperText="You can upload multiple images."
              multiple
            />

            {/* Disease Name */}
            <Input
              label="Disease Name"
              placeholder="Enter disease name"
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

            <Input
              label="Label"
              placeholder="Enter label"
              fullWidth
              name="label"
              value={formData.label}
              onChange={handleChange}
              helperText={errors.label}
              helperColor="error"
              clearable
            />

            <Select
              label="Crop"
              placeholder="Select a crop"
              fullWidth
              value={formData.cropId}
              onChange={handleSelectChange}
              helperText={errors.cropId}
              helperColor="error"
            >
              {crops.map((crop) => (
                <SelectItem key={crop.cropId} value={crop.cropId}>
                  {crop.name}
                </SelectItem>
              ))}
            </Select>

            {/* Symptoms */}
            <Textarea
              label="Symptoms"
              placeholder="List symptoms, separated by commas"
              fullWidth
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              helperText={errors.symptoms}
              helperColor="error"
              minRows={2}
            />

            {/* Treatment */}
            <Textarea
              label="Treatment"
              placeholder="List treatments, separated by commas"
              fullWidth
              name="treatment"
              value={formData.treatment}
              onChange={handleChange}
              helperText={errors.treatment}
              helperColor="error"
              minRows={2}
            />

            {/* Prevention */}
            <Textarea
              label="Prevention"
              placeholder="List prevention methods, separated by commas"
              fullWidth
              name="prevention"
              value={formData.prevention}
              onChange={handleChange}
              helperText={errors.prevention}
              helperColor="error"
              minRows={2}
            />

            {/* Images (multiple file input) */}
            

            {/* Related Diseases */}
            <Input
              label="Related Diseases"
              placeholder="Enter related disease IDs, separated by commas"
              fullWidth
              name="relatedDiseases"
              value={formData.relatedDiseases}
              onChange={handleChange}
              clearable
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

export default DiseaseForm;
