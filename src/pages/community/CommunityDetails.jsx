import React, { useState, useEffect } from "react";
import {
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommunities } from "../../redux/slices/communitySlice";
import { Spinner, Center } from "@chakra-ui/react";
import { FaUserSlash, FaCalendarAlt, FaUsers, FaFileAlt, FaEnvelope } from "react-icons/fa";

const CommunityDetails = () => {
  // const [isModalOpen, setModalOpen] = useState(false);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  // const toast = useToast();

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {community ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Community Header */}
            <div className="px-4 py-5 sm:px-6 border-b border-slate-200 bg-slate-50">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-24 w-24 rounded-full object-cover border-4 border-white shadow"
                    src={community.image || '../../assets/community_placeholder.png'}
                    alt={community.name}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-slate-900">{community.name}</h1>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">{community.description}</p>
                </div>
              </div>
            </div>

            {/* Community Details */}
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Created By Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                  <h2 className="text-lg font-medium text-slate-900 mb-4">Creator</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FaUsers className="h-5 w-5 text-slate-400" />
                      <span className="ml-3 text-slate-700">{community.createdBy?.username}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="h-5 w-5 text-slate-400" />
                      <span className="ml-3 text-slate-700">{community.createdBy?.email}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                  <h2 className="text-lg font-medium text-slate-900 mb-4">Statistics</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                      <FaUsers className="h-8 w-8 text-blue-500 mb-2" />
                      <span className="text-2xl font-bold text-slate-700">{community.users}</span>
                      <span className="text-xs text-slate-500">Members</span>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                      <FaFileAlt className="h-8 w-8 text-green-500 mb-2" />
                      <span className="text-2xl font-bold text-slate-700">{community.posts}</span>
                      <span className="text-xs text-slate-500">Posts</span>
                    </div>
                  </div>
                </div>

                {/* Created At Section */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
                  <h2 className="text-lg font-medium text-slate-900 mb-4">Create At</h2>
                  <div className="flex flex-col items-center text-center p-3 bg-purple-50 rounded-lg">
                    <FaCalendarAlt className="h-8 w-8 text-purple-500 mb-2" />
                    <div>
                      <div className="text-lg font-medium text-slate-700">
                        {new Date(community.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(community.createdAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow sm:rounded-lg p-10 text-center">
            <FaUserSlash className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-medium text-slate-900">Community Not Found</h3>
            <p className="mt-2 text-sm text-slate-500">The community you are looking for doesn't exist or may have been removed.</p>
            <div className="mt-6">
              <a href="/dashboard/community" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Go to Communities
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetails;
