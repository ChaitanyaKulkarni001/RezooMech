import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../theme/plugins/swiper/swiper-bundle.css';
import '../../../theme/plugins/swiper/swiper-bundle.js';
import '../../../theme/styles/main.css'; // CSS import
import Form from './Form.jsx';
const Login = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/signUp');
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <h1 className="mb-3 text-3xl font-bold text-gray-800">Sign In</h1>
          <p className="text-md text-gray-600">Welcome back! Please sign in to continue.</p>
        </div>

        <div className="signin-options mt-6">
          <a
            className="border border-[#141647] text-[#141647] block w-full py-3 rounded-lg font-semibold hover:bg-[#141647] hover:text-white transition-all text-center"
            href="#"
          >
            Sign In With Google
          </a>
        </div>

        <div className="relative my-6 text-center">
          <span className="bg-white px-3 text-gray-500 relative z-10">Or Sign In With Email</span>
          <div className="absolute inset-0 border-t border-gray-300 top-1/2 transform -translate-y-1/2"></div>
        </div>


        <Form />

        <p className="mt-5 text-center text-gray-600">
          Can't <span className="text-blue-500 font-medium">log in</span>?{' '}
          <button className="text-blue-500 font-semibold hover:underline" onClick={handleNavigation}>
            Sign Up
          </button>{' '}
          to create an account.
        </p>
      </div>
    </section>
  );
};

export default Login;
