import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  User,
  Divider,
} from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { Image, useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { updateCommunity, updateCommunityImage, fetchCommunities } from "../../redux/slices/communitySlice";
import { useLocation, useNavigate } from "react-router-dom";

const CommunityUpdate = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { communities, hasFetched } = useSelector((state) => state.communities);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [img, setImg] = useState()
  const [errors, setErrors] = useState({});

  // Fetch diseases if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchCommunities());
    }
  }, [hasFetched, dispatch]);

  // Populate form data for update
  useEffect(() => {
    if (id && hasFetched && communities.length > 0) {
      const existingCommunity = communities.find((community) => community.communityId === Number(id));
      
      if (existingCommunity) {
        
        setFormData({
          name: existingCommunity.name || "",
          description: existingCommunity.description || "",
          image: existingCommunity.image || "",
        });
      } else {
        console.log("No matching community found with ID:", id);
      }
    }
  }, [id, hasFetched, communities]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Disease name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      const payload = {
        "name": formData.name,
        "description": formData.description
      };

      try {
          await dispatch(updateCommunity({ communityId: id, updatedData: payload })).unwrap();
          toast({
            title: "Community updated successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        navigate("/dashboard/community");
      } catch (error) {
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to save community. Please try again later.";
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

  // Handle form submission
  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (img != null) {
      setIsSubmitting(true);
      const payload = new FormData();
      payload.append("image", img);
      
      try {
        await dispatch(updateCommunityImage({communityId: id, imageData: payload})).unwrap();
        toast({
          title: "Community Image updated successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/community"); // Redirect on success
      } catch (error) {
        // Check if the error is an object and has a message property
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to updated community Image. Please try again later.";
          
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
        title: "Please choose image.",
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
        <BreadcrumbItem href="/dashboard/community">Community</BreadcrumbItem>
        <BreadcrumbItem isCurrent href={`/dashboard/community/update?id=${id}`}>Edit</BreadcrumbItem>
      </Breadcrumbs>
      
      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>        
      <Card className="w-full max-w-lg p-6 shadow-lg">
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold text-center mb-2">EDIT COMMUNITY INFORMATION</h3>

          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <Image
                src={
                  formData.image 
                    ?formData.image
                    : '../../assets/user1.png'
                }
                size="sm"
                radius="lg"
                width={120}
                height={120}
                className="border rounded-lg shadow-sm"
                referrerPolicy="no-referrer"
                alt="Community Preview"
              />
              <div className="text-xs text-gray-500 mt-2 text-center">Current Community Image</div>
            </div>
            <Input
              type="file"
              fullWidth
              name="image"
              onChange={handleImageChange}
              helperText="You can upload a single image."
              className="mt-2"
            />
            <Button color="secondary" size="sm" className="w-full mt-2" onClick={handleImageSubmit}
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Image"}
            </Button>
          </div>

          <Divider />

          <Input
            label="Community Name"
            placeholder="Enter community name"
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

          <Spacer y={1} />
          <Button 
            color="primary" 
            type="submit" 
            className="w-full"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Updating"}
          </Button>
        </form>
      </Card>

      </div>
    </div>
  );
};

export default CommunityUpdate;
