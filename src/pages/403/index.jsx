import React from "react";
import { Button, Card, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const ForbiddenPage = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1); // Takes the user to the previous page
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 p-4">
      <Card className="p-8 text-center flex-col items-center justify-center flex shadow-lg max-w-lg">
        <Image
          src="../../assets/403.jpg"
          alt="403 Illustration"
          width={250}
          height={250}
          className="mx-auto"
        />
        <h2 h2 className="text-3xl font-bold mt-6">
          Access Denied
        </h2>
        <p className="text-gray-600 mt-2">
          You don't have permission to view this page.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <Button auto onPress={handleBack} color="default">
            Go Back
          </Button>
          <Button auto onPress={handleHomeRedirect} color="primary">
            Go to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ForbiddenPage;
