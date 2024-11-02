import React from "react";
import { Button, Card, Image } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleHomeRedirect = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-100 p-4">
      <Card className="p-8 text-center flex-col items-center justify-center flex shadow-lg max-w-lg">
        <Image
          src="../../assets/404.jpg" // Replace with an appropriate image URL
          alt="404 Illustration"
          width={250}
          height={250}
          className="mx-auto"
        />
        <h2 className="text-3xl font-bold mt-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Button auto onPress={handleHomeRedirect} className="mt-6 w-full" color="primary">
          Go to Home
        </Button>
      </Card>
    </div>
  );
};

export default NotFoundPage;
