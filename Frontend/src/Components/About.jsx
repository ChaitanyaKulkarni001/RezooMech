import React from 'react';
import Header from './Layout/Header';

const About = () => {
  const content = (
    <div>
      <head>
        {/* Favicon, meta tags, and stylesheet links */}
        <link rel="shortcut icon" href="../public/images/favicon.png" />
        <meta name="theme-name" content="Pinwheel" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
        <meta name="generator" content="gulp" />
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <title>Pinwheel-tailwind</title>
        <meta name="robots" content="" />
        <meta name="description" content="meta description" />
        <meta name="author" content="{config.metadata.meta_author}" />
        <meta property="og:title" content="" />
        <meta property="og:description" content="" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="/" />
        <meta name="twitter:title" content="" />
        <meta name="twitter:description" content="" />
        <meta property="og:image" content="" />
        <meta name="twitter:image" content="" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=<%= fontPrimary %>&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=<%= fontSecondary %>&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="plugins/swiper/swiper-bundle.css" />
        <link rel="stylesheet" href="plugins/font-awesome/v6/brands.css" />
        <link rel="stylesheet" href="plugins/font-awesome/v6/solid.css" />
        <link rel="stylesheet" href="plugins/font-awesome/v6/fontawesome.css" />
        <link href="theme/styles/main.css" rel="stylesheet" />
      </head>

      {/* Header */}
      <Header />

      {/* Floating assets */}
      <img
        className="floating-bubble-1 absolute right-0 top-0 -z-[1]"
        src="theme/images/floating-bubble-1.svg"
        alt="Floating bubble"
      />
      <img
        className="floating-bubble-2 absolute left-0 top-[387px] -z-[1]"
        src="theme/images/floating-bubble-2.svg"
        alt=""
      />
      <img
        className="floating-bubble-3 absolute right-0 top-[605px] -z-[1]"
        src="theme/images/floating-bubble-3.svg"
        alt=""
      />

      {/* Button style override */}
      <style jsx>{`
        .btn-aws {
          display: inline-block;
          background-color: black;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 9999px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .btn-aws:hover {
          background-color: white;
          color: black; 
          transform: scale(1.05);
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>

      {/* Animated Hero Section */}
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
      `}</style>
      <section
        className="page-hero py-16"
        style={{
          background: 'linear-gradient(270deg, #0000FF, #FFB6C1, #8A2BE2)',
          backgroundSize: '200% 200%',
          animation: 'smoothGradient 8s ease infinite'
        }}
      >
        <div className="container mx-auto">
          <div className="text-left">
           
          </div>
          <div className="page-hero-content mx-auto max-w-[768px] text-left">
            <h1 className="mb-5 mt-8 text-white">About CareerXpert AI</h1>
            <p className="text-white">
              We harness the power of AI to transform your interview preparation.
              Our innovative tools simulate real interview scenarios, provide personalized feedback,
              and help you build the confidence you need to succeed.
            </p>
            <div className="mt-11 flex space-x-4">
              <a className="btn-aws" href="#">
                Sign in Now!
              </a>
              <a className="btn-aws" href="#">
                Learn more
              </a>
            </div>
          </div>
          <div className="counter mt-16">
            <div className="row mx-0 rounded-[20px] bg-white px-10 shadow-lg lg:py-10">
              <div className="border-border px-10 py-10 text-center sm:col-6 lg:col-3 lg:border-r lg:py-0">
                <h2>
                  <span className="count">25M</span>{' '}
                  <span className="text-[#A3A1FB]">+</span>
                </h2>
                <p>Customers</p>
              </div>
              <div className="border-border px-10 py-10 text-center sm:col-6 lg:col-3 lg:border-r lg:py-0">
                <h2>
                  <span className="count">440M</span>
                  <span className="text-[#5EE2A0]">+</span>
                </h2>
                <p>Products sold</p>
              </div>
              <div className="border-border px-10 py-10 text-center sm:col-6 lg:col-3 lg:border-r lg:py-0">
                <h2>
                  <span className="count">50K</span>{' '}
                  <span className="text-primary">+</span>
                </h2>
                <p>Online stores</p>
              </div>
              <div className="px-10 py-10 text-center sm:col-6 lg:col-3 lg:py-0">
                <h2>
                  <span className="count">20K</span>{' '}
                  <span className="text-[#FEC163]">+</span>
                </h2>
                <p>Transactions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with Animated Background */}
      <section className="section py-16 relative overflow-hidden">
        {/* Animated Background */}
        <style jsx>{`
          @keyframes gradientBg {
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
          .animate-gradientBg {
            background: linear-gradient(
              270deg,
              rgba(0, 0, 255, 0.15),
              rgba(255, 182, 193, 0.15),
              rgba(138, 43, 226, 0.15)
            );
            background-size: 200% 200%;
            animation: gradientBg 10s ease infinite;
          }
        `}</style>
        <div className="absolute inset-0 z-[-1] animate-gradientBg" />
        <div className="container mx-auto px-6 relative">
          {/* Row 1: Image Left, Text Right */}
          <div className="flex flex-row md:flex-row items-center gap-9 mb-12">
            {/* Left Image */}
            <div className="relative md:w-1/2">
              <img
                className="w-full object-cover rounded-lg shadow-lg"
                width="550"
                height="300"
                src="theme/images/about/gallery-img-1.png"
                alt="AI Interview Demo"
              />
              {/* Optional shape image */}
              <img
                className="absolute -bottom-5 -left-5 -z-[1]"
                src="theme/images/shape-2.svg"
                alt=""
              />
            </div>
            {/* Right Text */}
            <div className="md:w-1/2 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Realistic Interview Simulations
              </h2>
              <p className="text-lg text-gray-700">
                Experience true-to-life AI-generated interviews that prepare you for real-world
                challenges. Practice your responses under realistic conditions and build
                confidence.
              </p>
            </div>
          </div>

          {/* Row 2: Image Right, Text Left */}
          <div className="flex flex-row md:flex-row-reverse items-center gap-9 mb-12">
            {/* Right Image */}
            <div className="relative md:w-1/2">
              <img
                className="w-full object-cover rounded-lg shadow-lg"
                width="550"
                height="400"
                src="theme/images/about/gallery-img-2.png"
                alt="Adaptive AI Feedback"
              />
              {/* Optional shape image */}
              <img
                className="absolute -bottom-5 -right-5 -z-[1]"
                src="theme/images/shape.svg"
                alt=""
              />
            </div>
            {/* Left Text */}
            <div className="md:w-1/2 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Adaptive AI Feedback
              </h2>
              <p className="text-lg text-gray-700">
                Our system analyzes your performance, highlights strengths and weaknesses, and offers
                targeted advice for improvement—personalized just for you.
              </p>
            </div>
          </div>

          {/* Row 3: Image Left, Text Right */}
          <div className="flex flex-row md:flex-row items-center gap-9">
            {/* Left Image */}
            <div className="relative md:w-1/2">
              <img
                className="w-full object-cover rounded-lg shadow-lg"
                width="550"
                height="300"
                src="theme/images/about/gallery-img-3.png"
                alt="Progress Analytics"
              />
              {/* Optional shape image */}
              <img
                className="absolute -bottom-4 -left-5 -z-[1] h-16 w-16"
                src="theme/images/shape.svg"
                alt=""
              />
            </div>
            {/* Right Text */}
            <div className="md:w-1/2 text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Track Your Progress
              </h2>
              <p className="text-lg text-gray-700">
                Monitor your growth with in-depth analytics. Identify key areas for improvement and
                watch your interview skills soar to new heights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Works Section */}
      <section className="section">
        <div className="container">
          <div className="row items-center justify-between">
            <div className="md:col-5">
              <h2 className="text-center md:text-left">Our AI Interview Core Solutions</h2>
            </div>
            <div className="mt-6 text-center md:col-3 md:mt-0 md:text-right">
              <a className="btn-aws" href="#">
                Sign In Now!
              </a>
            </div>
          </div>
          <div className="row mt-14">
            {/* Card 1 */}
            <div className="mb-8 sm:col-6 lg:col-4">
              <div className="relative group transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl bg-white p-6 shadow-lg lg:p-8">
                  <div className="gradient-number relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 text-white px-2 py-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      01
                    </span>
                    <img src="theme/images/gradient-number-bg.svg" alt="" />
                  </div>
                  <h4 className="my-6">Realistic Simulations</h4>
                  <p>
                    Experience interviews that mirror real-world scenarios using cutting-edge AI
                    simulations to prepare you for any challenge.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="mb-8 sm:col-6 lg:col-4">
              <div className="relative group transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl bg-white p-6 shadow-lg lg:p-8">
                  <div className="gradient-number relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 text-white px-2 py-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      02
                    </span>
                    <img src="theme/images/gradient-number-bg.svg" alt="" />
                  </div>
                  <h4 className="my-6">Personalized Feedback</h4>
                  <p>
                    Receive tailored insights and detailed feedback that help you refine your responses
                    and build confidence.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="mb-8 sm:col-6 lg:col-4">
              <div className="relative group transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl bg-white p-6 shadow-lg lg:p-8">
                  <div className="gradient-number relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 text-white px-2 py-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      03
                    </span>
                    <img src="theme/images/gradient-number-bg.svg" alt="" />
                  </div>
                  <h4 className="my-6">Adaptive Training</h4>
                  <p>
                    Our platform adapts to your strengths and weaknesses, offering customized practice
                    sessions for optimal improvement.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 4 */}
            <div className="mb-8 sm:col-6 lg:col-4">
              <div className="relative group transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl bg-white p-6 shadow-lg lg:p-8">
                  <div className="gradient-number relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 text-white px-2 py-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      04
                    </span>
                    <img src="theme/images/gradient-number-bg.svg" alt="" />
                  </div>
                  <h4 className="my-6">Confidence Boost</h4>
                  <p>
                    Build the confidence you need through realistic practice and constructive critiques that
                    prepare you for high-pressure situations.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 5 */}
            <div className="mb-8 sm:col-6 lg:col-4">
              <div className="relative group transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl bg-white p-6 shadow-lg lg:p-8">
                  <div className="gradient-number relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 text-white px-2 py-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      05
                    </span>
                    <img src="theme/images/gradient-number-bg.svg" alt="" />
                  </div>
                  <h4 className="my-6">Skill Enhancement</h4>
                  <p>
                    Improve your communication and critical thinking skills with targeted, AI-driven practice
                    exercises.
                  </p>
                </div>
              </div>
            </div>
            {/* Card 6 */}
            <div className="mb-8 sm:col-6 lg:col-4">
              <div className="relative group transition-all duration-300 transform hover:scale-110">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl bg-white p-6 shadow-lg lg:p-8">
                  <div className="gradient-number relative inline-block">
                    <span className="bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 text-white px-2 py-1 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      06
                    </span>
                    <img src="theme/images/gradient-number-bg.svg" alt="" />
                  </div>
                  <h4 className="my-6">Data-Driven Insights</h4>
                  <p>
                    Leverage actionable analytics and performance metrics to refine your interview techniques and
                    continuously improve your skills.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Members Section */}
<section className="section relative py-16 overflow-hidden">
  {/* Animated Background */}
  <style jsx>{`
    @keyframes memberBgAnimation {
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
      background: linear-gradient(270deg, #f0f4f8, #d9e2ec, #bcccdc);
      background-size: 200% 200%;
      animation: memberBgAnimation 15s ease infinite;
    }
  `}</style>
  <div className="absolute inset-0 z-[-1] animated-bg"></div>
  <div className="container">
    <div className="row">
      <div className="mx-auto text-center lg:col-6">
        <h2>This is who we are</h2>
        <p className="mt-4">
          Donec sollicitudin molestie malesda. Donec sollitudin mol estie ultricies ligula sed magna dictum
        </p>
      </div>
    </div>
    <div className="row mt-12 justify-center">
      <div className="lg:col-10">
        <div className="row">
          {/* Member 1 */}
          <div className="mb-6 flex flex-col px-6 text-center sm:col-6 lg:col-4 sm:items-center">
            <div className="member-avatar inline-flex justify-center">
              <img
                className="rounded-full h-28 w-28"
                src="theme/images/users/user-1.png"
                alt="Chaitanya Kulkarni"
              />
            </div>
            <div className="relative group transition-all duration-300 transform hover:scale-110 mt-6 w-full flex-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-xl bg-white py-8 px-4 shadow-lg">
                <h5 className="font-primary">Chaitanya Kulkarni</h5>
                <p className="mt-1.5">Co-founder & COO</p>
              </div>
            </div>
          </div>
          {/* Member 2 */}
          <div className="mb-6 flex flex-col px-6 text-center sm:col-6 lg:col-4 sm:items-center">
            <div className="member-avatar inline-flex justify-center">
              <img
                className="rounded-full h-28 w-28"
                src="theme/images/users/user-2.png"
                alt="Chaitanya Kulkarni"
              />
            </div>
            <div className="relative group transition-all duration-300 transform hover:scale-110 mt-6 w-full flex-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-xl bg-white py-8 px-4 shadow-lg">
                <h5 className="font-primary">Chaitanya Kulkarni</h5>
                <p className="mt-1.5">Head of Infrastructure</p>
              </div>
            </div>
          </div>
          {/* Member 3 */}
          <div className="mb-6 flex flex-col px-6 text-center sm:col-6 lg:col-4 sm:items-center">
            <div className="member-avatar inline-flex justify-center">
              <img
                className="rounded-full h-28 w-28"
                src="theme/images/users/w3.png"
                alt="Anuja Korake"
              />
            </div>
            <div className="relative group transition-all duration-300 transform hover:scale-110 mt-6 w-full flex-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-xl bg-white py-8 px-4 shadow-lg">
                <h5 className="font-primary">Anuja Korake</h5>
                <p className="mt-1.5">Head of Brand Marketing</p>
              </div>
            </div>
          </div>
          {/* Member 4 */}
          <div className="mb-6 flex flex-col px-6 text-center sm:col-6 lg:col-4 sm:items-center">
            <div className="member-avatar inline-flex justify-center">
              <img
                className="rounded-full h-28 w-28"
                src="theme/images/users/w2.png"
                alt="Rutuja Kodag"
              />
            </div>
            <div className="relative group transition-all duration-300 transform hover:scale-110 mt-6 w-full flex-1">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-blueviolet to-pink-500 blur-2xl opacity-0 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-xl bg-white py-8 px-4 shadow-lg">
                <h5 className="font-primary">Rutuja Kodag</h5>
                <p className="mt-1.5">Head of Infrastructure</p>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  </div>
</section>
    </div>
  );
  return content;
};

export default About;
