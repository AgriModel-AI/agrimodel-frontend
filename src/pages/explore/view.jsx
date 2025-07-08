// ExploreView.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Divider,
  Link
} from "@nextui-org/react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchExplore } from "../../redux/slices/exploreSlice";
import { useToast } from "@chakra-ui/react";
import { MdExplore, MdArrowBack, MdLink, MdCalendarToday } from "react-icons/md";
import { format } from 'date-fns';

const ExploreView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { exploreItems, hasFetched, loading } = useSelector((state) => state.explore);
  const [exploreItem, setExploreItem] = useState(null);

  // Fetch explore data if not already fetched
  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchExplore());
    }
  }, [hasFetched, dispatch]);

  // Find the specific item once data is fetched
  useEffect(() => {
    if (hasFetched && exploreItems.length > 0) {
      const item = exploreItems.find((item) => item.id === Number(id));
      
      if (item) {
        setExploreItem(item);
      } else {
        toast({
          title: "Error",
          description: "Explore item not found",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/explore");
      }
    }
  }, [id, hasFetched, exploreItems, navigate, toast]);

  const getTypeColor = (type) => {
    switch(type) {
      case 'UPDATES':
        return 'primary';
      case 'ONLINE_SERVICES':
        return 'success';
      case 'DISEASE_LIBRARY':
        return 'warning';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Process otherImages - split the string if it's a string
  const getOtherImages = (otherImages) => {
    if (!otherImages) return [];
    if (typeof otherImages === 'string') {
      return otherImages.split(',').filter(img => img.trim() !== '');
    }
    return Array.isArray(otherImages) ? otherImages : [];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/explore">Explore</BreadcrumbItem>
        <BreadcrumbItem isCurrent>View</BreadcrumbItem>
      </Breadcrumbs>

      <Button 
        color="primary" 
        variant="light" 
        startContent={<MdArrowBack />}
        onPress={() => navigate("/dashboard/explore")}
        className="mb-4"
      >
        Back to List
      </Button>

      {exploreItem ? (
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <MdExplore size={28} color="#1a73e8" className="mr-2" />
              <h2 className="text-2xl font-bold">{exploreItem.title}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Chip color={getTypeColor(exploreItem.type)}>
                {exploreItem.type}
              </Chip>
              
              <div className="flex items-center text-gray-500">
                <MdCalendarToday className="mr-1" />
                <span>{formatDate(exploreItem.date)}</span>
              </div>
            </div>

            <Divider className="my-4" />
            
            {/* Main Image */}
            {exploreItem.image && (
              <div className="mb-6">
                <img 
                  src={exploreItem.image} 
                  alt={exploreItem.title}
                  className="rounded-lg w-full h-[280px] object-contain bg-gray-50" 
                />
              </div>
            )}
            
            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Content</h3>
              <p className="whitespace-pre-line text-gray-700">{exploreItem.content}</p>
            </div>
            
            {/* Link if available */}
            {exploreItem.link && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Link</h3>
                <Link 
                  href={exploreItem.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:underline"
                >
                  <MdLink className="mr-1" />
                  {exploreItem.link}
                </Link>
              </div>
            )}
            
            {/* Other Images if available */}
            {exploreItem.otherImages && getOtherImages(exploreItem.otherImages).length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Additional Images</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getOtherImages(exploreItem.otherImages).map((img, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-2">
                      <img 
                        src={img.trim()} 
                        alt={`Additional ${index + 1}`}
                        className="w-full h-[180px] object-contain rounded-lg" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Spacer y={2} />
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end mt-6">
              <Button 
                color="primary" 
                variant="flat"
                onPress={() => navigate(`/dashboard/explore/update/${exploreItem.id}`)}
              >
                Edit
              </Button>
              <Button 
                color="primary"
                onPress={() => navigate("/dashboard/explore")}
              >
                Back to List
              </Button>
            </div>
          </Card>
        </div>
      ) : !loading && (
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl p-6 shadow-lg">
            <div className="text-center py-8">
              <h3 className="text-xl text-gray-600">Item not found</h3>
              <p className="text-gray-500 mt-2">
                The explore item you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                color="primary" 
                className="mt-4"
                onPress={() => navigate("/dashboard/explore")}
              >
                Return to Explore List
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExploreView;