// SubscriptionPlanView.jsx
import React, { useEffect } from "react";
import {
  Card,
  Button,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  Chip,
  Divider
} from "@nextui-org/react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubscriptionPlanById } from "../../redux/slices/subscriptionPlanSlice";
import { useToast } from "@chakra-ui/react";
import { RiVipCrownLine, RiArrowLeftLine, RiMoneyDollarCircleLine, RiCalendarCheckLine } from "react-icons/ri";

const SubscriptionPlanView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  
  const { currentPlan, loading } = useSelector((state) => state.subscriptionPlans);

  // Fetch subscription plan
  useEffect(() => {
    dispatch(getSubscriptionPlanById(id));
  }, [dispatch, id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && !currentPlan) {
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
        <BreadcrumbItem href="/dashboard/subscriptions/plans">Subscription Plans</BreadcrumbItem>
        <BreadcrumbItem isCurrent>View</BreadcrumbItem>
      </Breadcrumbs>

      <Button 
        color="primary" 
        variant="light" 
        startContent={<RiArrowLeftLine />}
        onPress={() => navigate("/dashboard/subscriptions/plans")}
        className="mb-4"
      >
        Back to Plans
      </Button>

      {currentPlan ? (
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl p-6 shadow-lg">
            <div className="flex items-center mb-4">
              <RiVipCrownLine size={28} color="#1a73e8" className="mr-2" />
              <h2 className="text-2xl font-bold">{currentPlan.name}</h2>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Chip 
                color={currentPlan.isPlanFree ? "success" : "primary"}
                variant="flat"
              >
                {currentPlan.isPlanFree ? "Free Plan" : "Paid Plan"}
              </Chip>
              
              <Chip 
                color={currentPlan.isActive ? "success" : "danger"}
                variant="flat"
              >
                {currentPlan.isActive ? "Active" : "Inactive"}
              </Chip>
            </div>

            <Divider className="my-4" />
            
            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{currentPlan.description}</p>
            </div>
            
            {/* Plan Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <RiCalendarCheckLine className="text-primary mr-2" size={20} />
                  <h3 className="font-semibold">Usage Limits</h3>
                </div>
                <p className="text-gray-700">
                  <span className="font-medium">{currentPlan.dailyAttempts}</span> scans/attempts per day
                </p>
              </div>

              {!currentPlan.isPlanFree && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <RiMoneyDollarCircleLine className="text-primary mr-2" size={20} />
                    <h3 className="font-semibold">Pricing</h3>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-700">
                      <span className="text-gray-600">Monthly:</span> {formatPrice(currentPlan.monthlyPrice)}
                    </p>
                    <p className="text-gray-700">
                      <span className="text-gray-600">Yearly:</span> {formatPrice(currentPlan.yearlyPrice)}
                    </p>
                    <p className="text-gray-700">
                      <span className="text-gray-600">Yearly Discount:</span> {currentPlan.yearlyDiscountPercentage}%
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Timestamps */}
            {currentPlan.createdAt && (
              <div className="text-gray-500 text-sm mb-6">
                <p><span className="font-medium">Created:</span> {formatDate(currentPlan.createdAt)}</p>
                {currentPlan.updatedAt && (
                  <p><span className="font-medium">Last Updated:</span> {formatDate(currentPlan.updatedAt)}</p>
                )}
              </div>
            )}
            
            <Spacer y={2} />
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end mt-4">
              <Button 
                color="primary" 
                variant="flat"
                onPress={() => navigate(`/dashboard/subscriptions/plans/update/${currentPlan.planId}`)}
              >
                Edit
              </Button>
              <Button 
                color="primary"
                onPress={() => navigate("/dashboard/subscriptions/plans")}
              >
                Back to Plans
              </Button>
            </div>
          </Card>
        </div>
      ) : !loading && (
        <div className="flex justify-center">
          <Card className="w-full max-w-3xl p-6 shadow-lg">
            <div className="text-center py-8">
              <h3 className="text-xl text-gray-600">Plan not found</h3>
              <p className="text-gray-500 mt-2">
                The subscription plan you're looking for doesn't exist or has been removed.
              </p>
              <Button 
                color="primary" 
                className="mt-4"
                onPress={() => navigate("/dashboard/subscriptions/plans")}
              >
                Return to Plans
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlanView;