import React, { useState, useEffect } from "react";
import { Button, Image, Link } from "@nextui-org/react";
import { FaGooglePlay, FaApple, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaLeaf, FaCamera, FaUsers, FaGlobe, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// Multi-language support
const languages = {
  en: {
    nav: { home: "Home", about: "About Us", services: "Services", community: "Community", diagnosis: "Diagnosis" },
    hero: {
      title: "AgriModel",
      subtitle: "Safe Products. Good Quality.",
      description: "Make your products better, safer, and more efficient with good quality.",
      cta: "Get App",
    },
    about: {
      title: "About Us",
      card1: {
        title: "Have a sick crop?",
        description: "Take a picture of your sick crop and get a free diagnosis to know what the sickness is.",
        cta: "Get Diagnosis",
      },
      card2: {
        title: "Grow Safe Products",
        description: "By harnessing AI, we provide insights that help farmers address issues early."
      },
      card3: {
        title: "Have a Question?",
        description: "Become a member of our community and get answers to your questions.",
        cta: "Join Community",
      }
    },
    features: {
      title: "Key Features",
      feature1: {
        title: "AI-Powered Diagnosis",
        description: "Upload a photo and get instant disease identification with 95% accuracy."
      },
      feature2: {
        title: "Treatment Recommendations",
        description: "Receive customized treatment plans based on your specific crop conditions."
      },
      feature3: {
        title: "Community Support",
        description: "Connect with experts and fellow farmers to share knowledge and get advice."
      },
      feature4: {
        title: "Prevention Guidance",
        description: "Access preventive measures and best practices to keep your crops healthy."
      }
    },
    howItWorks: {
      title: "How It Works",
      steps: [
        "Take a photo of your crop",
        "Our AI analyzes the image",
        "Get diagnosis and treatment options",
        "Implement solutions and track progress"
      ]
    },
    services: {
      title: "Our Platform is Not Just a Tool, It's a Partner for Farmers.",
      centerTitle: "Our Services",
      items: [
        "Early Disease Detection",
        "Tailored Disease Management Solutions",
        "Sustainable Farming Guidance",
        "Crop Health Monitoring"
      ]
    },
    download: {
      title: "Download AgriModel",
      googlePlay: "Get it on Google Play",
      appStore: "Download on the App Store",
    },
    footer: {
      contactUs: "Contact Us",
      copyright: "© 2024 AgriModel. All rights reserved."
    }
  },
  fr: {
    nav: { home: "Accueil", about: "À Propos", services: "Services", community: "Communauté", diagnosis: "Diagnostic" },
    hero: {
      title: "AgriModel",
      subtitle: "Produits Sûrs. Bonne Qualité.",
      description: "Rendez vos produits meilleurs, plus sûrs et plus efficaces avec une bonne qualité.",
      cta: "Obtenir l'App",
    },
    about: {
      title: "À Propos de Nous",
      card1: {
        title: "Une culture malade?",
        description: "Prenez une photo de votre culture malade et obtenez un diagnostic gratuit pour connaître la maladie.",
        cta: "Obtenir un Diagnostic",
      },
      card2: {
        title: "Cultivez des Produits Sûrs",
        description: "En utilisant l'IA, nous fournissons des informations qui aident les agriculteurs à résoudre les problèmes rapidement."
      },
      card3: {
        title: "Une Question?",
        description: "Devenez membre de notre communauté et obtenez des réponses à vos questions.",
        cta: "Rejoindre la Communauté",
      }
    },
    features: {
      title: "Fonctionnalités Clés",
      feature1: {
        title: "Diagnostic par IA",
        description: "Téléchargez une photo et obtenez une identification instantanée des maladies avec 95% de précision."
      },
      feature2: {
        title: "Recommandations de Traitement",
        description: "Recevez des plans de traitement personnalisés basés sur les conditions spécifiques de votre culture."
      },
      feature3: {
        title: "Soutien Communautaire",
        description: "Connectez-vous avec des experts et d'autres agriculteurs pour partager des connaissances."
      },
      feature4: {
        title: "Guide de Prévention",
        description: "Accédez à des mesures préventives pour maintenir vos cultures en bonne santé."
      }
    },
    howItWorks: {
      title: "Comment Ça Marche",
      steps: [
        "Prenez une photo de votre culture",
        "Notre IA analyse l'image",
        "Obtenez un diagnostic et options de traitement",
        "Appliquez les solutions et suivez les progrès"
      ]
    },
    services: {
      title: "Notre Plateforme n'est pas Seulement un Outil, c'est un Partenaire pour les Agriculteurs.",
      centerTitle: "Nos Services",
      items: [
        "Détection Précoce des Maladies",
        "Solutions de Gestion des Maladies Sur Mesure",
        "Conseils pour une Agriculture Durable",
        "Surveillance de la Santé des Cultures"
      ]
    },
    download: {
      title: "Téléchargez AgriModel",
      googlePlay: "Obtenir sur Google Play",
      appStore: "Télécharger sur l'App Store",
    },
    footer: {
      contactUs: "Contactez-Nous",
      copyright: "© 2024 AgriModel. Tous droits réservés."
    }
  }
};

// Floating leaves animation component
const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-500 opacity-10"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            rotate: Math.random() * 360,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            y: [null, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            x: [null, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            rotate: Math.random() * 360,
            transition: { 
              duration: 20 + Math.random() * 30,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        >
          <FaLeaf size={20 + Math.random() * 30} />
        </motion.div>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const [navbarBackground, setNavbarBackground] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const text = languages[currentLanguage];

  useEffect(() => {
    const handleScroll = () => {
      setNavbarBackground(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);
  
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <FloatingIcons />
      
      <ModernNavbar 
        text={text} 
        currentLanguage={currentLanguage} 
        handleLanguageChange={handleLanguageChange} 
      />
      <ModernHero text={text} />

      {/* About Us Section */}
      <div id="about" className="bg-white py-24 px-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-green-400 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-blue-400 blur-3xl"></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-16 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">About Us</span>
            <motion.h2 
              className="text-4xl font-bold mb-4 text-green-900 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {text.about.title}
            </motion.h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col justify-between relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-green-50 group-hover:bg-green-100 transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="bg-green-100 p-4 rounded-full mb-6 w-24 h-24 flex items-center justify-center mx-auto transform transition-transform group-hover:scale-110 duration-300">
                  <Image src="/../../assets/3.png" alt="Sick Crop" width={80} height={80} className="object-cover" />
                </div>
                <h4 className="font-bold text-2xl mb-4 text-green-800">{text.about.card1.title}</h4>
                <p className="mb-8 text-gray-600 leading-relaxed">{text.about.card1.description}</p>
              </div>
              
              <button 
                id="diagnosis" 
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-green-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {text.about.card1.cta}
              </button>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col justify-between relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-green-50 group-hover:bg-green-100 transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="bg-green-100 p-4 rounded-full mb-6 w-24 h-24 flex items-center justify-center mx-auto transform transition-transform group-hover:scale-110 duration-300">
                  <Image src="/../../assets/2.png" alt="Safe Products" width={80} height={80} className="object-cover" />
                </div>
                <h4 className="font-bold text-2xl mb-4 text-green-800">{text.about.card2.title}</h4>
                <p className="mb-8 text-gray-600 leading-relaxed">{text.about.card2.description}</p>
              </div>
              
              <div className="h-12 flex items-center justify-center">
                <span className="inline-flex items-center text-green-600 font-medium">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-8 text-center flex flex-col justify-between relative overflow-hidden group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="absolute -right-20 -top-20 w-40 h-40 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-all duration-300"></div>
              
              <div className="relative z-10">
                <div className="bg-blue-100 p-4 rounded-full mb-6 w-24 h-24 flex items-center justify-center mx-auto transform transition-transform group-hover:scale-110 duration-300">
                  <Image src="/../../assets/1.png" alt="Community Support" width={80} height={80} className="object-cover" />
                </div>
                <h4 className="font-bold text-2xl mb-4 text-blue-800">{text.about.card3.title}</h4>
                <p className="mb-8 text-gray-600 leading-relaxed">{text.about.card3.description}</p>
              </div>
              
              <button 
                id="community" 
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-medium py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {text.about.card3.cta}
              </button>
            </motion.div>
          </div>
          
          {/* Add testimonial or stats section */}
          <motion.div 
            className="mt-20 bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-4xl font-bold text-green-800 mb-2">5,000+</h3>
                <p className="text-gray-600">Diagnoses Performed</p>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-green-800 mb-2">98%</h3>
                <p className="text-gray-600">Accurate Solutions</p>
              </div>
              <div className="text-center">
                <h3 className="text-4xl font-bold text-green-800 mb-2">24/7</h3>
                <p className="text-gray-600">Community Support</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-green-50 to-white py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-semibold mb-12 text-center text-green-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {text.features.title}
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-green-100 p-3 rounded-full">
                <FaCamera className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-green-800">{text.features.feature1.title}</h3>
                <p className="text-gray-600">{text.features.feature1.description}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-green-100 p-3 rounded-full">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-green-800">{text.features.feature2.title}</h3>
                <p className="text-gray-600">{text.features.feature2.description}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-green-100 p-3 rounded-full">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-green-800">{text.features.feature3.title}</h3>
                <p className="text-gray-600">{text.features.feature3.description}</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-green-100 p-3 rounded-full">
                <FaLeaf className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="font-semibold text-xl mb-2 text-green-800">{text.features.feature4.title}</h3>
                <p className="text-gray-600">{text.features.feature4.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

     {/* Services Section */}
      <div id="services" className="relative py-24 px-8 text-white overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800">
        {/* Modern Abstract Background */}
        <div className="absolute inset-0 opacity-20 z-0">
          <div className="absolute top-0 left-0 w-full h-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <radialGradient id="grad1" cx="20%" cy="20%" r="50%" fx="20%" fy="20%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="grad2" cx="80%" cy="30%" r="50%" fx="80%" fy="30%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
              </defs>
              <path fill="url(#grad1)" d="M0,0 L100,0 L100,100 L0,100 Z" />
              <path fill="url(#grad2)" d="M0,0 L100,0 L100,100 L0,100 Z" />
            </svg>
          </div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Section Heading */}
          <motion.span 
            className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Our Services
          </motion.span>
          <motion.h2 
            className="text-4xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {text.services.title}
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-300 mx-auto mb-12"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          ></motion.div>

          {/* Services Grid */}
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-10">
            {text.services.items.map((service, index) => (
              <motion.div 
                key={index}
                className="relative w-40 sm:w-48 md:w-52 lg:w-56"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="relative group cursor-pointer"
                  whileHover={{ scale: 1.07 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/40 to-green-600/40 rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                  <div className="h-full bg-white/10 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden border border-white/20 shadow-xl flex flex-col items-center justify-center group-hover:border-white/40 transition-all duration-300">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50 group-hover:opacity-80 transition-opacity duration-300"></div>
                      <Image 
                        src={`/../../assets/${20 - index}.png`} 
                        alt={service} 
                        width={120} 
                        height={120} 
                        className="rounded-full border-2 border-yellow-400 shadow-lg relative z-10 group-hover:border-4 transition-all duration-300" 
                      />
                    </div>
                    <p className="mt-4 font-semibold text-center">{service}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Floating Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-8 h-8 rounded bg-white/10 backdrop-blur-sm"
          animate={{ y: [0, -20, 0], rotate: [0, 45, 0] }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div 
          className="absolute bottom-20 right-40 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", delay: 2 }}
        />
        <motion.div 
          className="absolute bottom-40 left-1/4 w-6 h-6 rounded-full bg-yellow-400/20 backdrop-blur-sm"
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", delay: 1 }}
        />
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-white to-green-50 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-3xl font-semibold mb-16 text-center text-green-800"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            What Farmers Say
          </motion.h2>
          
          <div className="relative h-64">
            <AnimatePresence mode="wait">
              {[
                { quote: "AgriModel helped me identify a fungal infection before it spread to my entire field. It saved my harvest!", author: "John D., Wheat Farmer" },
                { quote: "The community advice combined with the AI diagnosis gives me confidence in managing my farm health.", author: "Maria L., Vineyard Owner" },
                { quote: "I've reduced pesticide use by 40% thanks to the early detection and precise treatment recommendations.", author: "Robert K., Organic Farmer" }
              ].map((testimonial, index) => (
                index === activeTestimonial && (
                  <motion.div 
                    key={index}
                    className="absolute inset-0 flex flex-col items-center justify-center px-10 md:px-20"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <p className="text-xl text-gray-600 italic text-center mb-6">"{testimonial.quote}"</p>
                    <p className="font-semibold text-green-700">{testimonial.author}</p>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            {[0, 1, 2].map((i) => (
              <button 
                key={i}
                className={`w-3 h-3 rounded-full ${activeTestimonial === i ? 'bg-green-600' : 'bg-gray-300'}`}
                onClick={() => setActiveTestimonial(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* App Download Section */}
      <div className="bg-white py-20 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-evenly gap-16 md:gap-20">
          <motion.div 
            className="flex flex-col items-center md:items-start md:text-left space-y-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-semibold text-green-800">{text.download.title}</h3>
            <p className="text-gray-600 mb-6 max-w-md">Get instant access to professional crop diagnosis and connect with our community of farmers and experts.</p>
            <Button 
              className="bg-black text-white flex items-center gap-2 px-6 py-4 w-full md:w-auto" 
              shadow
              startContent={<FaGooglePlay size={20} />}
            >
              {text.download.googlePlay}
            </Button>
            <Button 
              className="bg-black text-white flex items-center gap-2 px-6 py-4 w-full md:w-auto" 
              shadow
              startContent={<FaApple size={20} />}
            >
              {text.download.appStore}
            </Button>
          </motion.div>
          
          <motion.div 
            className="relative flex justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute bg-gradient-to-r from-yellow-400 to-green-400 rounded-full w-72 h-72 md:w-96 md:h-96 blur-lg opacity-80" />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <Image 
                src="../../assets/app.png" 
                alt="App Preview" 
                height={500} 
                className="relative z-10 max-h-[400px] sm:max-h-[400px] md:max-h-[400px] lg:max-h-[500px]" 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="bg-gradient-to-b from-green-800 to-green-900 py-16 text-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <Image src="../../assets/logo.png" width={160} className="mb-6" alt="AgriModel Logo" />
              <p className="mb-4">Making agriculture smarter, one plant at a time.</p>
              <div className="flex gap-4">
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="text-white hover:text-green-300 transition-colors">
                  <FaLinkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-300 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-green-300 transition-colors">About Us</a></li>
                <li><a href="#services" className="hover:text-green-300 transition-colors">Services</a></li>
                <li><a href="#community" className="hover:text-green-300 transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-green-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-green-300 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold mb-4">{text.footer.contactUs}</h4>
              <p className="mb-2">support@agrimodel.com</p>
              <p>+250 789 479 289</p>
              
            </div>
          </div>
          
          <div className="border-t border-green-700 mt-12 pt-6 text-center">
            <p>{text.footer.copyright}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;


const ModernNavbar = ({ text, currentLanguage, handleLanguageChange }) => {
  const [navbarBackground, setNavbarBackground] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarBackground(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Close dropdowns when clicking outside
    const handleClickOutside = () => {
      setLanguageDropdownOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (lang) => {
    handleLanguageChange(lang);
    setLanguageDropdownOpen(false);
  };
  
  const toggleLanguageDropdown = (e) => {
    e.stopPropagation(); // Prevent the document click handler from firing
    setLanguageDropdownOpen(!languageDropdownOpen);
  };

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className={`absolute inset-0 backdrop-blur-md ${navbarBackground ? 'bg-white/70 shadow-lg shadow-green-100/20' : 'bg-transparent'} transition-all duration-500`}></div>
        
        <div className="max-w-7xl mx-auto relative z-10 flex items-center justify-between">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            {navbarBackground ? (
              <Image src="../../assets/logoBlack.png" width={150} alt="AgriModel Logo" />
            ) : (
              <Image src="../../assets/logo.png" width={150} alt="AgriModel Logo" />
            )}
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {['home', 'about', 'services', 'community', 'diagnosis'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Link 
                  href={`#${item === 'home' ? '' : item}`}
                  className={`relative px-5 py-2 rounded-full mx-1 text-sm font-medium transition-all duration-300 overflow-hidden group
                    ${navbarBackground 
                      ? 'text-gray-700 hover:text-green-600' 
                      : 'text-white hover:text-green-200'}`}
                >
                  <span className="relative z-10">{text.nav[item]}</span>
                  <motion.span 
                    className={`absolute bottom-0 left-0 w-0 h-full ${navbarBackground ? 'bg-green-100' : 'bg-white/10'} -z-10 group-hover:w-full transition-all duration-300`}
                    layoutId={`nav-highlight-${item}`}
                  />
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Right side elements */}
          <div className="flex items-center gap-3">
            {/* Language selector with functional dropdown */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  navbarBackground 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                } backdrop-blur-sm transition-all duration-300`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={toggleLanguageDropdown}
              >
                <FaGlobe className="text-sm" />
                <span className="text-sm font-medium">
                  {currentLanguage === "en" ? "EN" : "FR"}
                </span>
                <FaChevronDown className="h-3 w-3" />
              </motion.button>
              
              <AnimatePresence>
                {languageDropdownOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-36 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50"
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                  >
                    <div className="py-1">
                      <button
                        onClick={() => handleLanguageSelect("en")}
                        className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50"
                      >
                        <span className={`mr-2 h-2 w-2 rounded-full ${currentLanguage === "en" ? "bg-green-500" : "bg-transparent"}`}></span>
                        English
                      </button>
                      <button
                        onClick={() => handleLanguageSelect("fr")}
                        className="flex items-center w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-green-50"
                      >
                        <span className={`mr-2 h-2 w-2 rounded-full ${currentLanguage === "fr" ? "bg-green-500" : "bg-transparent"}`}></span>
                        Français
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Get App Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button 
                auto 
                className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-6 rounded-full shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 font-medium text-sm h-10`}
                endContent={<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
              >
                {text.hero.cta}
              </Button>
            </motion.div>
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg ${navbarBackground ? 'text-gray-700' : 'text-white'}`}
              >
                <div className="w-6 flex flex-col items-end gap-1.5">
                  <motion.span 
                    animate={{ 
                      width: mobileMenuOpen ? "24px" : "16px",
                      rotate: mobileMenuOpen ? 45 : 0,
                      y: mobileMenuOpen ? 8 : 0
                    }} 
                    className={`h-0.5 ${navbarBackground ? 'bg-gray-700' : 'bg-white'} rounded-full block transition-all`}
                  />
                  <motion.span 
                    animate={{ 
                      width: "24px",
                      opacity: mobileMenuOpen ? 0 : 1
                    }} 
                    className={`h-0.5 ${navbarBackground ? 'bg-gray-700' : 'bg-white'} rounded-full block transition-all`}
                  />
                  <motion.span 
                    animate={{ 
                      width: mobileMenuOpen ? "24px" : "20px",
                      rotate: mobileMenuOpen ? -45 : 0,
                      y: mobileMenuOpen ? -8 : 0
                    }} 
                    className={`h-0.5 ${navbarBackground ? 'bg-gray-700' : 'bg-white'} rounded-full block transition-all`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            
            {/* Menu panel */}
            <motion.div 
              className="absolute top-0 right-0 h-screen w-full max-w-xs bg-white shadow-xl flex flex-col overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex items-center justify-between p-5 border-b">
                <div className="flex-1">
                  <Image src="../../assets/logoBlack.png" width={120} alt="AgriModel Logo" />
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-5 flex flex-col space-y-2">
                {['home', 'about', 'services', 'community', 'diagnosis'].map((item) => (
                  <Link 
                    key={item}
                    href={`#${item === 'home' ? '' : item}`}
                    className="block py-3 px-4 text-gray-700 hover:bg-green-50 rounded-lg transition-colors duration-200"
                    onClick={handleNavLinkClick}
                  >
                    {text.nav[item]}
                  </Link>
                ))}
              </div>
              
              <div className="mt-auto p-5 border-t">
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => handleLanguageSelect("en")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      currentLanguage === "en" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageSelect("fr")}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium ${
                      currentLanguage === "fr" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Français
                  </button>
                </div>
                
                <Button 
                  auto 
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 font-medium"
                  endContent={<svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                >
                  {text.hero.cta}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ModernHero = ({ text }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const y3 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-950 flex items-center pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-green-400/20 to-teal-300/20 blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-yellow-400/20 to-green-300/20 blur-3xl"></div>
        
        {/* Animated circles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIyOSAwIDIuMjMuODQ2IDIuNTExIDEuOTg0bC4wMDUuMDJjLjA3OC4zMDYuMTIuNjI3LjEyLjk1NnYuMDhjMCAxLjE3MS0uNDg0IDIuMjMzLTEuMjYzIDIuOTk3bC4wMDEuMDAyYy0uNzkuNzg4LTEuODggMS4yNzgtMy4wODQgMS4yNzhoLS4wOGMtMi4zMzggMC00LjI0LTEuOTAyLTQuMjQtNC4yNHYtLjA4YzAtMi4zMzggMS45MDItNC4yNCA0LjI0LTQuMjR6TTAgMHYyNGg2MFYwSDB6IiBmaWxsPSIjZmZmIiBvcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')] opacity-5"></div>
      </div>
      
      {/* Content container with parallax effects */}
      <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center">
        {/* Text content */}
        <motion.div 
          className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ y: y1 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.span 
              className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-green-300 text-sm font-medium mb-6"
              whileHover={{ scale: 1.05 }}
            >
              AI-Powered Crop Disease Detection
            </motion.span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl lg:text-7xl font-bold mb-6 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <span className="block">{text.hero.title}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-yellow-200">
              {text.hero.subtitle}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-200 mb-8 max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {text.hero.description} Helping farmers grow healthier crops with cutting-edge technology.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-8 py-7 rounded-full shadow-lg shadow-green-500/30 text-lg font-medium transition-all duration-300 transform hover:scale-105"
              endContent={<svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
            >
              {text.hero.cta}
            </Button>
            
            <Button 
              size="lg"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-7 rounded-full transition-all duration-300 text-lg font-medium transform hover:scale-105"
              startContent={<FaCamera className="mr-1" />}
            >
              {text.nav.diagnosis}
            </Button>
          </motion.div>
          
          {/* Stat counters */}
          <motion.div 
            className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {[
              { count: "1.2M+", label: "App Users" },
              { count: "98%", label: "Accuracy" },
              { count: "150+", label: "Crop Varieties" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <motion.p 
                  className="text-2xl lg:text-3xl font-bold text-green-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                >
                  {stat.count}
                </motion.p>
                <motion.p 
                  className="text-sm text-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                >
                  {stat.label}
                </motion.p>
              </div>
            ))}
          </motion.div>
        </motion.div>
        
        {/* Hero image with effects */}
        <motion.div 
          className="lg:w-1/2 relative"
          style={{ y: y2 }}
        >
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
          >
            {/* Circles with glow effects */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-r from-green-400/30 to-green-600/30 blur-xl"
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute w-[60%] h-[60%] rounded-full bg-gradient-to-r from-yellow-400/30 to-green-300/30 blur-xl"
                animate={{ 
                  scale: [1.1, 1, 1.1],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 5, delay: 1, repeat: Infinity }}
              />
            </div>
            
            {/* App mockup */}
            <div className="relative z-20 transform rotate-6 hover:rotate-0 transition-all duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-600/20 rounded-[40px] backdrop-blur-xl p-1.5">
                <div className="w-full h-full bg-black/80 rounded-[34px]"></div>
              </div>
              <Image
                src="/../../assets/5.png" 
                alt="AgriModel App" 
                width={650} 
                height={650} 
                className="relative z-10 rounded-[30px] p-1"
              />
            </div>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-10 -right-10 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ y: y3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Instant Diagnosis</h4>
                  <p className="text-gray-300 text-sm">Results in seconds</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{ y: y3 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-medium">Smart Treatment</h4>
                  <p className="text-gray-300 text-sm">AI-powered solutions</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <a href="#about" className="text-white flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
          <span className="mb-2 text-sm font-light">Discover More</span>
          <motion.svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </a>
      </motion.div>
      
      {/* Curved divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none transform rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block h-20 w-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
        </svg>
      </div>
    </div>
  );
};