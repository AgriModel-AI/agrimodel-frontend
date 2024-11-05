import React from "react";
import { Card, Button, Divider } from "@nextui-org/react";
import { FaBan } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AccountBlocked = () => {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    navigate("/login"); // Adjust the path to your login route
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="max-w-md p-8 text-center shadow-lg">
        <div className="flex justify-center items-center mb-5">
            <FaBan size={28} className="text-red-500 mr-4" />
            <h2 className="text-2xl font-bold text-red-600">Account Blocked</h2>
        </div>
        <Divider className="my-4" />
        <p className="text-gray-700 mb-6">
          Unfortunately, your account is blocked. Please contact support if you believe this is a mistake.
        </p>
        <Button color="error" flat onClick={handleReturnToLogin} className="mt-4">
          Return to Login
        </Button>
      </Card>
    </div>
  );
};

export default AccountBlocked;
