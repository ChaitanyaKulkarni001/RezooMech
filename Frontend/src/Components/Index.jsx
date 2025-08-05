import React, { useContext } from 'react';
import Testimonial from './Pages/Testimonial';
import Features from './Pages/Features';
import CallToAction from './Pages/CallToAction';
import { FaAmazon, FaMicrosoft, FaFacebookF, FaApple, FaGoogle, FaTwitter } from 'react-icons/fa';
import '../../theme/styles/main.css'; // Import CSS directly
import { ThemeContext } from './ThemeContext';

const Index = () => {
    const { theme } = useContext(ThemeContext);
    
  
  // Define 6 company icons with background colors
  const companyIcons = [
    { icon: <FaAmazon className="text-4xl text-white" />, bg: "bg-purple-400" },
    { icon: <FaMicrosoft className="text-4xl text-white" />, bg: "bg-pink-400" },
    { icon: <FaFacebookF className="text-4xl text-white" />, bg: "bg-indigo-400" },
    { icon: <FaApple className="text-4xl text-white" />, bg: "bg-blue-400" },
    { icon: <FaGoogle className="text-4xl text-white" />, bg: "bg-teal-400" },
    { icon: <FaTwitter className="text-4xl text-white" />, bg: "bg-orange-400" },
  ];

  return (
    <div    >
      {/* Animated Background with Smooth Gradient Transition */}
      <style jsx>{`
        @keyframes smoothGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animated-bg {
          background: linear-gradient(300deg, #a3c0ff 10%, #8A2BE2, #00FFFF, #FFC0CB);
          background-size: 200% 200%;
          animation: smoothGradient 10s ease infinite;
        }
      `}</style>

      {/* Banner Section */}
      <section className="relative w-full -mt-6 py-24 text-white overflow-hidden animated-bg">
        <div className="relative container mx-auto px-6">
          <div className="flex items-start justify-between  ">
            {/* Left Column: Heading, Description, and Button */}
            <div className="w-1/2">
              <h1 className={` ${theme=='dim'?'text-white':'text-black'} text-4xl lg:text-6xl font-bold leading-tight text-left`}>
                Ace Your Interview with AI-Powered Preparation!
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-left">
                AI-powered mock interviews crafted for you to boost your confidence and success in the job market
              </p>
              <div className="mt-8 text-left">
                {/* Button with glowing hover effect */}
                <div className="relative inline-block group">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 blur-xl opacity-0 group-hover:opacity-80 transition duration-300"></div>
                  <a
                    
                    className={`relative inline-block rounded-full px-6 py-3 text-lg font-semibold shadow transition-colors duration-300 hover:bg-gray-200  ${
                      theme === 'dim'
                        ? ' bg-white text-[#011638]'
                        : 'bg-black text-white'
                    } `}
                    href="/dashboard"
                  >
                    Get Started
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Icon Grid (2 rows of 3 icons) */}
            <div className="w-1/2 flex justify-end">
              <div className="grid grid-cols-3 gap-6">
                {companyIcons.map((item, index) => (
                  <div
                    key={index}
                    className={`w-24 h-24 flex items-center justify-center ${item.bg} p-3 rounded shadow`}
                  >
                    {item.icon}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Sections */}
      <Features />
      <Testimonial />
      <CallToAction />
    </div>
  );
};

export default Index;
