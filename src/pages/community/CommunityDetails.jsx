import React, { useState, useEffect } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
  Card,
  Divider,
} from "@nextui-org/react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunities } from "../../redux/slices/communitySlice";
import { Image, Spinner, Center, useToast } from "@chakra-ui/react";
import { FaUserSlash, FaCalendarAlt, FaUsers, FaFileAlt, FaEnvelope } from "react-icons/fa";

const CommunityDetails = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const toast = useToast();

  const { communities, hasFetched } = useSelector((state) => state.communities);

  useEffect(() => {
    if (!hasFetched) {
      dispatch(fetchCommunities()).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, hasFetched]);

  useEffect(() => {
    if (communities.length !== 0) {
      const communityFetched = communities.find(
        (community) => community.communityId === parseInt(id, 10)
      );
      if (communityFetched) {
        setCommunity(communityFetched);
      }
    }
  }, [communities, id]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 py-8 bg-gray-100">
      <Breadcrumbs className="mb-6">
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem href="/dashboard/community">Communities</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/community/view">View</BreadcrumbItem>
      </Breadcrumbs>

      {community ? (
        <>
          <Card className="flex flex-col md:flex-row items-start p-8 max-w-4xl mx-auto shadow-lg rounded-lg mb-6">
            <div className="flex flex-col items-center justify-center w-full md:w-1/3 p-4">
              <Image
                src={
                  community.image
                    ? `${process.env.REACT_APP_BACKEND_URL}/api/v1/communities/image/${community.image}`
                    : '../../assets/community_placeholder.png'
                }
                size="xl"
                radius="lg"
                className="mb-4"
                width={200}
                referrerPolicy="no-referrer" 
                alt="Community"
              />
              <h2 className="text-xl font-bold mt-2">{community.name}</h2>
              <p className="text-sm text-gray-600">{community.description}</p>
            </div>

            <Divider orientation="vertical" className="hidden md:block h-full mx-4" />

            <div className="w-full md:w-2/3 flex flex-col space-y-6">
              <div>
                <h4 className="font-semibold text-gray-800">CREATED BY</h4>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaUsers className="mr-2 text-gray-500" /> Username: {community.createdBy?.username}
                </p>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaEnvelope className="mr-2 text-gray-500" /> Email: {community.createdBy?.email}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">STATS</h4>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaUsers className="mr-2 text-gray-500" /> Number of Users: {community.users}
                </p>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaFileAlt className="mr-2 text-gray-500" /> Number of Posts: {community.posts}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800">CREATED AT</h4>
                <p className="flex items-center text-gray-700 mt-2">
                  <FaCalendarAlt className="mr-2 text-gray-500" /> {new Date(community.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <Card className="flex flex-col items-center p-6 max-w-4xl mx-auto shadow-lg rounded-lg bg-white">
          <p className="flex items-center text-gray-700">
            <FaUserSlash className="mr-2 text-gray-500" /> Community Not Found
          </p>
        </Card>
      )}
    </div>
  );
};

export default CommunityDetails;
