// SubscriptionPlanForm.jsx
import React, { useState } from "react";
import {
  Card,
  Input,
  Button,
  Textarea,
  Spacer,
  Breadcrumbs,
  BreadcrumbItem,
  Checkbox,
  Tooltip
} from "@nextui-org/react";
import { useMediaQuery } from "react-responsive";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { addSubscriptionPlan } from "../../redux/slices/subscriptionPlanSlice";
import { useNavigate } from "react-router-dom";
import { MdInfo } from "react-icons/md";

const SubscriptionPlanForm = () => {
  const isSmallScreen = useMediaQuery({ maxWidth: 640 });
  const toast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dailyAttempts: 2,
    monthlyPrice: 0,
    yearlyDiscountPercentage: 10,
    isPlanFree: false
  });

  // Calculated yearly price
  const yearlyPrice = (formData.monthlyPrice * 12 * (1 - formData.yearlyDiscountPercentage / 100)).toFixed(2);

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields properly
    if (name === 'dailyAttempts' || name === 'monthlyPrice' || name === 'yearlyDiscountPercentage') {
      const numValue = parseFloat(value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (isSelected) => {
    setFormData((prevData) => ({
      ...prevData,
      isPlanFree: isSelected,
    }));
  };

  // Validate required fields
  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "Plan name is required.";
    if (!formData.description.trim()) tempErrors.description = "Description is required.";
    if (formData.dailyAttempts < 1) tempErrors.dailyAttempts = "Daily attempts must be at least 1.";
    if (!formData.isPlanFree && formData.monthlyPrice <= 0) {
      tempErrors.monthlyPrice = "Monthly price must be greater than 0 for paid plans.";
    }
    if (formData.yearlyDiscountPercentage < 0 || formData.yearlyDiscountPercentage > 100) {
      tempErrors.yearlyDiscountPercentage = "Discount must be between 0 and 100.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        await dispatch(addSubscriptionPlan(formData)).unwrap();
        toast({
          title: "Subscription plan added successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        navigate("/dashboard/subscriptions/plans"); // Redirect on success
      } catch (error) {
        const errorMessage = typeof error === 'object' && error.message
          ? error.message
          : "Failed to add subscription plan. Please try again later.";
          
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
        <BreadcrumbItem href="/dashboard/subscriptions/plans">Subscription Plans</BreadcrumbItem>
        <BreadcrumbItem isCurrent href="/dashboard/subscriptions/plans/add">Add</BreadcrumbItem>
      </Breadcrumbs>

      {/* Form Card */}
      <div className={`flex ${isSmallScreen ? "flex-col" : "flex-row"} justify-center items-center`}>
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <h3 className="text-lg font-semibold text-center mb-2">ADD SUBSCRIPTION PLAN</h3>

            {/* Plan Name */}
            <Input
              label="Plan Name"
              placeholder="Enter plan name"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              helperText={errors.name}
              helperColor="error"
              clearable
              isRequired
              isDisabled={isSubmitting}
            />

            {/* Plan Description */}
            <Textarea
              label="Description"
              placeholder="Enter a brief description"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              helperText={errors.description}
              helperColor="error"
              minRows={2}
              isRequired
              isDisabled={isSubmitting}
            />

            {/* Daily Attempts */}
            <Input
              type="number"
              label="Daily Attempts"
              placeholder="Enter daily attempts limit"
              fullWidth
              name="dailyAttempts"
              value={formData.dailyAttempts}
              onChange={handleChange}
              helperText={errors.dailyAttempts}
              helperColor="error"
              min={1}
              isRequired
              isDisabled={isSubmitting}
              endContent={
                <Tooltip content="Number of scans/attempts a user can make per day">
                  <MdInfo className="text-default-400" />
                </Tooltip>
              }
            />

            {/* Free Plan Toggle */}
            <Checkbox
              isSelected={formData.isPlanFree}
              onValueChange={handleCheckboxChange}
              isDisabled={isSubmitting}
            >
              Free Plan
            </Checkbox>

            {/* Monthly Price */}
            <Input
              type="number"
              label="Monthly Price (RWF)"
              placeholder="Enter monthly price"
              fullWidth
              name="monthlyPrice"
              value={formData.monthlyPrice}
              onChange={handleChange}
              helperText={errors.monthlyPrice}
              helperColor="error"
              min={0}
              isDisabled={formData.isPlanFree || isSubmitting}
              isRequired={!formData.isPlanFree}
            />

            {/* Yearly Discount */}
            <Input
              type="number"
              label="Yearly Discount Percentage"
              placeholder="Enter yearly discount"
              fullWidth
              name="yearlyDiscountPercentage"
              value={formData.yearlyDiscountPercentage}
              onChange={handleChange}
              helperText={errors.yearlyDiscountPercentage}
              helperColor="error"
              min={0}
              max={100}
              isDisabled={formData.isPlanFree || isSubmitting}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">%</span>
                </div>
              }
            />

            {/* Calculated Yearly Price (Display only) */}
            {!formData.isPlanFree && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Yearly Price (calculated):</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('en-RW', {
                    style: 'currency',
                    currency: 'RWF',
                    minimumFractionDigits: 0,
                  }).format(yearlyPrice)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (Monthly price × 12 months) - {formData.yearlyDiscountPercentage}% discount
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Spacer y={1} />
            <Button 
              color="primary" 
              type="submit" 
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Create Plan"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlanForm;