import React, { useState, useEffect } from "react";
import { Button, Image, Link } from "@nextui-org/react";
import { FaGooglePlay, FaApple, FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const LandingPage = () => {
  const [navbarBackground, setNavbarBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarBackground(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-light-green min-h-screen">
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 w-full p-4 transition-all duration-300 z-30 ${
          navbarBackground ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center max-w-6xl mx-auto">
        {/* <h2 className="text-xl font-bold text-slate-900">AGRIMODEL</h2> */}
          {
            navbarBackground ?
            <Image src="../../assets/logo_black.png" width={160} className="mx-w-[100px]"/>
              :
            <Image src="../../assets/logo.png" width={160} className="mx-w-[100px]"/>

          }
          <div className="hidden md:flex gap-6">
            {
              navbarBackground ? 
              <>
                <Link href="#" className="hover:text-green-600 text-green-900">Home</Link>
                <Link href="#" className="hover:text-green-600 text-green-900">About Us</Link>
                <Link href="#" className="hover:text-green-600 text-green-900">Services</Link>
              </>
              :
              <>
                <Link href="#" className="hover:text-white text-white">Home</Link>
                <Link href="#" className="hover:text-white text-white">About Us</Link>
                <Link href="#" className="hover:text-white text-white">Services</Link>
              </>
            }
            
          </div>
          <div className="flex items-center gap-4">
            <select className="border rounded px-2 py-1">
              <option>Language</option>
              <option>English</option>
              <option>French</option>
            </select>
            <Button auto color="success">Get App</Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center h-screen bg-cover bg-center text-white pt-16 relative" style={{ backgroundImage: "url('../../assets/back.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
        
        <div className="relative flex w-full h-full items-center px-8 max-w-6xl mx-auto z-20">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AgriModel</h1>
            <p className="text-xl mb-2">Safe Products. Good Quality.</p>
            <p className="mb-6">Make your products better, safer, and more efficient with good quality.</p>
            <Button size="lg" color="primary">Get App</Button>
          </div>
          <div className="flex-1 hidden md:flex justify-center">
            <Image
              src="/../../assets/5.png" 
              alt="Agricultural Field" 
              width={400} 
              height={400} 
              className="rounded-full"
            />
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-white py-20 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">About Us</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="max-w-xs text-center flex flex-col justify-center items-center">
            <Image src="/../../assets/3.png" alt="Sick Crop" width={150} height={150} />
            <h4 className="font-semibold mt-4">Have a sick crop?</h4>
            <p>Take a picture of your sick crop and get a free diagnosis to know what the sickness is.</p>
            <Button color="success" auto className="mt-2">Get Diagnosis</Button>
          </div>
          <div className="max-w-xs text-center flex flex-col justify-center items-center">
            <Image src="/../../assets/2.png" alt="Safe Products" width={150} height={150} />
            <h4 className="font-semibold mt-4">Grow Safe Products</h4>
            <p>By harnessing AI, we provide insights that help farmers address issues early.</p>
          </div>
          <div className="max-w-xs text-center flex flex-col justify-center items-center">
            <Image src="/../../assets/1.png" alt="Community Support" width={150} height={150} />
            <h4 className="font-semibold mt-4">Have a Question?</h4>
            <p>Become a member of our community and get answers to your questions.</p>
            <Button color="primary" auto className="mt-2">Join Community</Button>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-green-600 py-12 px-8 text-center text-white relative">
        <h2 className="text-2xl font-semibold mb-8">Our Platform is Not Just a Tool, It's a Partner for Farmers.</h2>
        
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[500px]">

          {/* Service Items */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-10 w-full">
            <div className="flex flex-col items-center">
              <Image src="/../../assets/14.png" alt="Early Disease Detection" width={200} height={200} className="rounded-full border-4 border-yellow-500" />
              <p className="mt-2 font-semibold text-center">Early Disease Detection</p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/../../assets/13.png" alt="Tailored Disease Management" width={200} height={200} className="rounded-full border-4 border-yellow-500" />
              <p className="mt-2 font-semibold text-center">Tailored Disease Management Solutions</p>
            </div>
            <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center text-green-600 font-bold shadow-lg z-10 hidden md:flex lg:flex">
              <p className="text-center">Our Services</p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/../../assets/12.png" alt="Sustainable Farming Guidance" width={200} height={200} className="rounded-full border-4 border-yellow-500" />
              <p className="mt-2 font-semibold text-center">Sustainable Farming Guidance</p>
            </div>
            <div className="flex flex-col items-center">
              <Image src="/../../assets/11.png" alt="Crop Health Monitoring" width={200} height={200} className="rounded-full border-4 border-yellow-500" />
              <p className="mt-2 font-semibold text-center">Crop Health Monitoring</p>
            </div>
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="bg-white py-16 px-20 flex flex-col md:flex-row items-center justify-evenly gap-20 text-center">
        <div className="flex flex-col items-center md:items-start md:text-left space-y-4">
          <h3 className="text-2xl font-semibold text-green-700">Download AgriModel</h3>
          <Button className="bg-black text-white flex items-center px-6 py-3" icon={<FaGooglePlay />} shadow>
            Get it on Google Play
          </Button>
          <Button className="bg-black text-white flex items-center px-6 py-3" icon={<FaApple />} shadow>
            Download on the App Store
          </Button>
        </div>
        <div className="relative flex justify-center items-center">
          <div className="absolute bg-gradient-to-r from-yellow-400 to-green-400 rounded-full w-72 h-72 md:w-96 md:h-96 blur-lg opacity-80" />
          <Image src="../../assets/4.png" alt="App Preview" height={500} className="relative z-10 max-h-[400px] sm:max-h-[400px] md:max-h-[400px] lg:max-h-[500px]" />
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-green-800 py-6 text-white text-center">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="#" className="text-white hover:underline">Home</Link>
          <Link href="#" className="text-white hover:underline">About Us</Link>
          <Link href="#" className="text-white hover:underline">Services</Link>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          <FaFacebook className="text-white" />
          <FaInstagram className="text-white" />
          <FaTwitter className="text-white" />
          <FaLinkedin className="text-white" />
        </div>
        <p>&copy; 2024 AgriModel. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage;
