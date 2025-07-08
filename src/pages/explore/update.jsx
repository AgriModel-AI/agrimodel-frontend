// ExploreUpdate.jsx
import React, { useEffect, useState } from "react";
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
import { updateExplore, fetchExplore } from "../../redux/slices/exploreSlice";
import { useParams, useNavigate } from "react-router-dom";

const ExploreUpdate = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { exploreItems, hasFetched } = useSelector((state) => state.explore);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const exploreTypes = [
    { value: 'UPDATES', label: 'Updates' },
    { value: 'ONLINE_SERVICES', label: 'Online Services' },
    { value: 'DISEASE_LIBRARY', label: 'Disease Library' }
  ];

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "UPDATES",
    image: null,
    otherImages: [],
    link: "",
  });
  const [errors, setErrors] = useState({});
  const [existingImageUrl, setExistingImageUrl] = useState("");

  // Fetch explore items if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchExplore());
    }
  }, [hasFetched, dispatch]);

  // Populate form data for update
  useEffect(() => {
    if (id && hasFetched && exploreItems.length > 0) {
      const existingItem = exploreItems.find((item) => item.id === Number(id));
      
      if (existingItem) {
        setFormData({
          title: existingItem.title || "",
          content: existingItem.content || "",
          type: existingItem.type || "UPDATES",
          image: null, // We don't prefill file inputs
          otherImages: [], // We don't prefill file inputs
          link: existingItem.link || "",
        });
        setExistingImageUrl(existingItem.image || "");
      } else {
        toast({
          title: "Error",
          description: "Item not found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/explore");
      }
    }
  }, [id, hasFetched, exploreItems, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTypeChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      type: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleOtherImagesChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      otherImages: Array.from(e.target.files),
    }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.title.trim()) tempErrors.title = "Title is required.";
    if (!formData.content.trim()) tempErrors.content = "Content is required.";
    if (!formData.type) tempErrors.type = "Type is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("type", formData.type);
      if (formData.image) {
        payload.append("image", formData.image);
      }
      formData.otherImages.forEach((file) => payload.append("otherImages", file));
      payload.append("link", formData.link);

      try {
          await dispatch(updateExplore({ id, updatedData: payload })).unwrap();
          toast({
            title: "Explore item updated successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        navigate("/dashboard/explore");
      } catch (error) {
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to update explore item. Please try again later.";
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
        <BreadcrumbItem href="/dashboard/explore">Explore</BreadcrumbItem>
        <BreadcrumbItem isCurrent href={`/dashboard/explore/update/${id}`}>Edit</BreadcrumbItem>
      </Breadcrumbs>

      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">EDIT EXPLORE ITEM</h3>

            {/* Item Type */}
            <Select 
              label="Type"
              placeholder="Select item type"
              selectedKeys={[formData.type]}
              onChange={handleTypeChange}
              isRequired
              helperText={errors.type}
              helperColor="error"
              isDisabled={isSubmitting}
            >
              {exploreTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </Select>

            {existingImageUrl && (
              <div className="mb-4">
                <p className="text-sm mb-2">Current Image:</p>
                <img 
                  src={existingImageUrl} 
                  alt="Current" 
                  className="w-full max-h-40 object-contain rounded-lg"
                />
              </div>
            )}

            <Input
              type="file"
              fullWidth
              label="Update Main Image (optional)"
              name="image"
              onChange={handleImageChange}
              helperText="Leave empty to keep the current image"
              isDisabled={isSubmitting}
            />

            <Input
              type="file"
              fullWidth
              label="Other Images (optional)"
              name="otherImages"
              onChange={handleOtherImagesChange}
              helperText="You can upload multiple images"
              multiple
              isDisabled={isSubmitting}
            />

            <Input
              label="Title"
              placeholder="Enter title"
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              helperText={errors.title}
              helperColor="error"
              clearable
              isDisabled={isSubmitting}
              isRequired
            />

            <Textarea
              label="Content"
              placeholder="Enter content"
              fullWidth
              name="content"
              value={formData.content}
              onChange={handleChange}
              helperText={errors.content}
              helperColor="error"
              minRows={3}
              isDisabled={isSubmitting}
              isRequired
            />

            <Input
              label="Link (Optional)"
              placeholder="Enter link URL"
              fullWidth
              name="link"
              value={formData.link}
              onChange={handleChange}
              clearable
              isDisabled={isSubmitting}
            />

            <Spacer y={1} />
            <Button 
              color="primary" 
              type="submit" 
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ExploreUpdate;