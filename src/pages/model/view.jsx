// ModelView.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Divider,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Pagination
} from "@nextui-org/react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels } from "../../redux/slices/modelSlice";
import { fetchClients } from "../../redux/slices/clientsSlice";
import { useToast } from "@chakra-ui/react";
import { MdMemory, MdArrowBack, MdStar, MdStarOutline, MdStarHalf } from "react-icons/md";

const ModelView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const modelsState = useSelector((state) => state.models) || {};
  const models = modelsState.models || [];
  const loading = modelsState.loading || false;

  const clientsState = useSelector((state) => state.clients) || {};
  const clients = clientsState.clients || [];
  const clientsLoading = clientsState.loading || false;

  const [modelData, setModelData] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch models data
  useEffect(() => {
    if (models.length === 0) {
      dispatch(fetchModels());
    }
    if (clients.length === 0) {
      dispatch(fetchClients());
    }
  }, [dispatch, models.length, clients.length]);

  // Find the current model once data is loaded
  useEffect(() => {
    if (models.length > 0) {
      const foundModel = models.find(item => item.model.modelId === id);
      if (foundModel) {
        setModelData(foundModel);
      } else {
        toast({
          title: "Error",
          description: "Model not found",
          status: "error",
          duration: 3000,
        });
        navigate("/dashboard/models");
      }
    }
  }, [id, models, navigate, toast]);

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateAverageRating = (ratings) => {
    if (!ratings || ratings.length === 0) return 0;
    const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    return (total / ratings.length).toFixed(1);
  };

  // Get user info for a rating
  const getUserInfo = (userId) => {
    const user = clients.find(client => client.userId === userId);
    return user || { username: 'Unknown User' };
  };

  // Render star rating component
  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <MdStar key={`full-${i}`} className="text-yellow-500" size={20} />
        ))}
        {hasHalfStar && <MdStarHalf className="text-yellow-500" size={20} />}
        {[...Array(emptyStars)].map((_, i) => (
          <MdStarOutline key={`empty-${i}`} className="text-yellow-500" size={20} />
        ))}
      </div>
    );
  };

  // Paginate ratings data
  const paginatedRatings = modelData?.ratings 
    ? modelData.ratings.slice((page - 1) * rowsPerPage, page * rowsPerPage) 
    : [];
  
  const totalPages = modelData?.ratings 
    ? Math.ceil(modelData.ratings.length / rowsPerPage) 
    : 0;

  if (loading || clientsLoading || !modelData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const model = modelData.model;
  const ratings = modelData.ratings || [];
  const avgRating = calculateAverageRating(ratings);

  return (
    <div className="px-4 md:px-8 lg:px-16 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/models">AI Models</BreadcrumbItem>
        <BreadcrumbItem isCurrent>View</BreadcrumbItem>
      </Breadcrumbs>

      <Button 
        color="primary" 
        variant="light" 
        startContent={<MdArrowBack />}
        onPress={() => navigate("/dashboard/models")}
        className="mb-4"
      >
        Back to Models
      </Button>

      <div className="flex flex-col gap-6">
        {/* Model Information Card */}
        <Card className="w-full p-6 shadow-lg">
          <div className="flex items-center mb-4">
            <MdMemory size={28} color="#1a73e8" className="mr-2" />
            <h2 className="text-2xl font-bold">Model v{model.version}</h2>
            <Chip 
              color={model.isActive ? "success" : "danger"} 
              variant="flat"
              className="ml-4"
            >
              {model.isActive ? "Active" : "Inactive"}
            </Chip>
          </div>

          <div className="mb-4 text-gray-500">
            <p>Model ID: {model.modelId}</p>
          </div>

          <Divider className="my-4" />
          
          {/* Model Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Release Date</h3>
                <p className="text-lg">{formatDate(model.releaseDate)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                <p className="text-lg">{formatFileSize(model.fileSize)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Config Size</h3>
                <p className="text-lg">{formatFileSize(model.configSize)}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Accuracy</h3>
                <p className="text-lg">{model.accuracy ? `${model.accuracy}%` : "Not tested"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Hash</h3>
                <p className="text-sm font-mono break-all text-gray-600">{model.fileHash}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Config Hash</h3>
                <p className="text-sm font-mono break-all text-gray-600">{model.configHash}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Ratings Card */}
        <Card className="w-full p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MdStar size={24} color="#FFD700" className="mr-2" />
              <h2 className="text-xl font-bold">User Ratings & Feedback</h2>
            </div>
            
            {ratings.length > 0 && (
              <div className="flex items-center bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center mr-3">
                  <span className="font-bold text-xl mr-1">{avgRating}</span>
                  <MdStar size={20} color="#FFD700" />
                </div>
                <span className="text-gray-500">
                  from {ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'}
                </span>
              </div>
            )}
          </div>

          {ratings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No ratings or feedback yet for this model.
            </div>
          ) : (
            <>
              <Table
                aria-label="Model ratings and feedback"
                bottomContent={
                  totalPages > 1 ? (
                    <div className="flex w-full justify-center">
                      <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="primary"
                        page={page}
                        total={totalPages}
                        onChange={setPage}
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn>USER</TableColumn>
                  <TableColumn>RATING</TableColumn>
                  <TableColumn>FEEDBACK</TableColumn>
                  <TableColumn>DIAGNOSIS</TableColumn>
                  <TableColumn>DATE</TableColumn>
                </TableHeader>
                <TableBody items={paginatedRatings}>
                  {(rating) => {
                    const user = getUserInfo(rating.userId);
                    return (
                      <TableRow key={rating.ratingId}>
                        <TableCell>
                          <User
                            avatarProps={{
                              radius: "full",
                              src: user.profilePicture,
                              fallback: (
                                <p className="bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center">
                                  {user.username?.charAt(0).toUpperCase() || "?"}
                                </p>
                              ),
                            }}
                            name={user.username || "Unknown User"}
                            description={user.email || ""}
                          />
                        </TableCell>
                        <TableCell>
                          <StarRating rating={rating.rating} />
                        </TableCell>
                        <TableCell>
                          <p className="max-w-xs truncate">{rating.feedback || "No feedback provided"}</p>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{rating.diagnosisResult || "N/A"}</p>
                            <Chip 
                              size="sm" 
                              color={rating.diagnosisCorrect ? "success" : "danger"} 
                              variant="flat"
                            >
                              {rating.diagnosisCorrect ? "Correct" : "Incorrect"}
                            </Chip>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-500">{formatDate(rating.createdAt)}</p>
                        </TableCell>
                      </TableRow>
                    );
                  }}
                </TableBody>
              </Table>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ModelView;