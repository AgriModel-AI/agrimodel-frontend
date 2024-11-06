import React, { useEffect } from "react";
import { Button, Card } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/userSlice';

const TokenExpiredPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-8 max-w-md text-center shadow-lg">
        <div className="flex justify-center mb-4">
          <FaExclamationTriangle size={50} color="#E53E3E" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Session Expired
        </h2>
        <p className="text-gray-600 mb-6">
          Your session has expired. Please log in again to continue.
        </p>
        <Button color="primary" onPress={handleLoginRedirect}>
          Go to Login
        </Button>
      </Card>
    </div>
  );
};

export default TokenExpiredPage;
