import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { updateCrop, fetchCrop } from "../../redux/slices/cropSlice";
import { useLocation, useNavigate } from "react-router-dom";

const CropUdate = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { crops, hasFetched } = useSelector((state) => state.crops);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    growingConditions: "",
    harvestTime: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  // Fetch crops if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchCrop());
    }
  }, [hasFetched, dispatch]);

  // Populate form data for update
  useEffect(() => {
    if (id && hasFetched && crops.length > 0) {
      const existingCrop = crops.find((crop) => crop.cropId === Number(id));
      
      if (existingCrop) {
        
        setFormData({
          name: existingCrop.name || "",
          description: existingCrop.description || "",
          growingConditions: existingCrop.growingConditions || "",
          harvestTime: existingCrop.harvestTime || "",
          prevention: existingCrop.prevention || "",
          images: [], // Images not prefilled for updates
          relatedcrops: existingCrop.relatedcrops || "",
        });
      } else {
        console.log("No matching Crop found with ID:", id);
      }
    }
  }, [id, hasFetched, crops]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files),
    }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Crop name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (!formData.growingConditions.trim()) tempErrors.growingConditions = "Growing Conditions are required.";
    if (!formData.harvestTime.trim()) tempErrors.harvestTime = "Harvest Time is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description);
      payload.append("growingConditions", formData.growingConditions);
      payload.append("harvestTime", formData.harvestTime);
      formData.images.forEach((file) => payload.append("images", file));

      try {
          await dispatch(updateCrop({ cropId: id, updatedData: payload })).unwrap();
          toast({
            title: "Crop updated successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        navigate("/dashboard/crops");
      } catch (error) {
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to save crop. Please try again later.";
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
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/crops">crops</BreadcrumbItem>
        <BreadcrumbItem isCurrent href={`/dashboard/crops/update?id=${id}`}>Edit</BreadcrumbItem>
      </Breadcrumbs>

      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">EDIT CROP INFORMATION</h3>

            <Input
              label="Images"
              type="file"
              fullWidth
              name="images"
              onChange={handleImageChange}
              helperText="You can upload multiple images."
              multiple
            />

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
            <Spacer y={1} />
            {/* <Button color="primary" type="submit" className="w-full">Update</Button> */}
            <Button 
              color="primary" 
              type="submit" 
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Update"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CropUdate;
