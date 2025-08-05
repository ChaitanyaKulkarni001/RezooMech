// import React from 'react'
// import Footer from '../Layout/Footer'
// import Header from '../Layout/Header'
// import RegisterForm from './RegisterForm'

// const SignUp = () => {

  

//   return (
//     <div>
//       <Header />
//       {/* {signup} */}
//       <>
//       {/* Favicon and Meta Tags */}
//       <link rel="shortcut icon" href="theme/images/favicon.png" />
//       <meta name="theme-name" content="Pinwheel" />
//       <meta name="msapplication-TileColor" content="#000000" />
//       <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
//       <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
//       <meta name="generator" content="gulp" />
//       <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
//       <title>Pinwheel-tailwind</title>
//       <meta name="robots" content="" />
//       <meta name="description" content="meta description" />
//       <meta name="author" content="{config.metadata.meta_author}" />
//       <meta property="og:title" content="" />
//       <meta property="og:description" content="" />
//       <meta property="og:type" content="website" />
//       <meta property="og:url" content="/" />
//       <meta name="twitter:title" content="" />
//       <meta name="twitter:description" content="" />
//       <meta property="og:image" content="" />
//       <meta name="twitter:image" content="" />
//       <meta name="twitter:card" content="summary_large_image" />
//       <link rel="preconnect" href="https://fonts.googleapis.com" />
//       <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
//       <link
//         href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
//         rel="stylesheet"
//       />
//       <link
//         href="https://fonts.googleapis.com/css2?family=Merriweather:wght@700;900&display=swap"
//         rel="stylesheet"
//       />

//       {/* Stylesheets */}
//       <link rel="stylesheet" href="theme/plugins/swiper/swiper-bundle.css" />
//       <link rel="stylesheet" href="theme/plugins/font-awesome/v6/brands.css" />
//       <link rel="stylesheet" href="theme/plugins/font-awesome/v6/solid.css" />
//       <link rel="stylesheet" href="theme/plugins/font-awesome/v6/fontawesome.css" />
//       <link href="theme/styles/main.css" rel="stylesheet" />

//       {/* Main Section */}
//       <section>
//         <div className="container max-w-full">
//           <div className="row">
//             <div className="min-h-[980px] bg-white py-10 lg:col-6 lg:py-[114px]">
//               <div className="mx-auto w-full max-w-[480px]">
//                 <img className="mb-8" src="theme/images/flower.svg" alt="Flower" />
//                 <h1 className="mb-4">Sign Up</h1>
//                 <p>Donec sollicitudin molestie malesda sollitudin</p>
//                 <div className="signin-options mt-10">
//                   <a
//                     className="btn btn-outline-white block w-full text-dark"
//                     href="#"
//                   >
//                     Sign Up With Google
//                   </a>
//                 </div>
//                 <div className="relative my-8 text-center after:absolute after:left-0 after:top-1/2 after:z-[0] after:w-full after:border-b after:border-border after:content-['']">
//                   <span className="relative z-[1] inline-block bg-white px-2">
//                     Or Sign Up With Email
//                   </span>
//                 </div>

//                 <RegisterForm/>
//               </div>
//             </div>

//             <div className="auth-banner bg-gradient flex flex-col items-center justify-center py-16 lg:col-6">
//               <img
//                 className="absolute top-0 left-0 h-full w-full"
//                 src="theme/images/login-banner-bg.svg"
//                 alt="Background"
//               />
//               <div className="w-full text-center">
//                 <h2 className="h3 text-white">
//                   A suite product accelerate <br /> your career design
//                 </h2>
//                 <div className="swiper auth-banner-carousel">
//                   <div className="swiper-wrapper">
//                     <div className="swiper-slide">
//                       <img
//                         width="667"
//                         height="557"
//                         className="mx-auto"
//                         src="theme/images/signup-carousel-img-1.png"
//                         alt="Carousel 1"
//                       />
//                     </div>
//                     <div className="swiper-slide">
//                       <img
//                         width="667"
//                         height="557"
//                         className="mx-auto"
//                         src="theme/images/signup-carousel-img-1.png"
//                         alt="Carousel 2"
//                       />
//                     </div>
//                     <div className="swiper-slide">
//                       <img
//                         width="667"
//                         height="557"
//                         className="mx-auto"
//                         src="theme/images/signup-carousel-img-1.png"
//                         alt="Carousel 3"
//                       />
//                     </div>
//                   </div>
//                   <div className="pagination"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Responsive Debugging Helper */}
//       <div className="fixed left-0 top-0 z-50 flex w-[30px] items-center justify-center bg-gray-200 py-[2.5px] text-[12px] uppercase text-black sm:bg-red-200 md:bg-yellow-200 lg:bg-green-200 xl:bg-blue-200 2xl:bg-pink-200">
//         <span className="block sm:hidden">all</span>
//         <span className="hidden sm:block md:hidden">sm</span>
//         <span className="hidden md:block lg:hidden">md</span>
//         <span className="hidden lg:block xl:hidden">lg</span>
//         <span className="hidden xl:block 2xl:hidden">xl</span>
//         <span className="hidden 2xl:block">2xl</span>
//       </div>

//       {/* Scripts */}
//       <script src="theme/plugins/swiper/swiper-bundle.js"></script>
//       <script src="theme/plugins/shufflejs/shuffle.js"></script>
//       <script src="theme/scripts/main.js"></script>
//     </>
//       <Footer />
//     </div>
//   )
// }

// export default SignUp
import React from 'react';
import RegisterForm from './RegisterForm';

const SignUp = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Favicon and Meta Tags */}
      <link rel="shortcut icon" href="theme/images/favicon.png" />
      <meta name="theme-name" content="Pinwheel" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#141647" />
      <meta name="generator" content="gulp" />
      <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <title>Pinwheel-tailwind</title>

      {/* Stylesheets */}
      <link rel="stylesheet" href="theme/plugins/swiper/swiper-bundle.css" />
      <link rel="stylesheet" href="theme/plugins/font-awesome/v6/brands.css" />
      <link rel="stylesheet" href="theme/plugins/font-awesome/v6/solid.css" />
      <link rel="stylesheet" href="theme/plugins/font-awesome/v6/fontawesome.css" />
      <link href="theme/styles/main.css" rel="stylesheet" />

      {/* Main Section */}
      <section>
        <div className="container mx-auto px-4 py-10 lg:py-24">
          <div className="flex justify-center items-center">
            <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-8">
              {/* <img className="mb-6 mx-auto" src="theme/images/flower.svg" alt="Flower" /> */}
              <h1 className="text-3xl font-bold text-center text-[#141647] mb-4">Sign Up</h1>
              <p className="text-center text-gray-600 mb-6">
                Join us and get started with your career journey.
              </p>

              <div className="signin-options mt-6">
                <a
                  className="btn btn-outline-[#141647] bg-white text-[#141647]  block w-full py-3 rounded-lg font-semibold hover:border-2 border-[#141647] transition-all"
                  href="#"
                >
                  Sign Up With Google
                </a>
              </div>

              <div className="relative my-8 text-center after:absolute after:left-0 after:top-1/2 after:z-[0] after:w-full after:border-b after:border-[#141647] after:content-['']">
                <span className="relative z-[1] inline-block bg-white px-2 text-[#141647] font-semibold">
                  Or Sign Up With Email
                </span>
              </div>

              <RegisterForm />
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Debugging Helper */}
      

      {/* Scripts */}
      <script src="theme/plugins/swiper/swiper-bundle.js"></script>
      <script src="theme/plugins/shufflejs/shuffle.js"></script>
      <script src="theme/scripts/main.js"></script>
    </div>
  );
};

export default SignUp;