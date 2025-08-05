import React from "react";

const Login = ({ onLogin, onRegister }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-white to-blue-50">
      {/* Header */}
      <div className="flex justify-between items-center px-8 pt-8 pb-2">
        <h1 className="text-3xl font-bold ml-2">
          Rezumech<span className="text-green-600 mx-1">|</span>
        </h1>
        <button
          onClick={onRegister}
          className="px-5 py-2 bg-black text-white rounded font-medium"
        >
          Create an account
        </button>
      </div>

      {/* Main Section */}
      <div className="mt-10 flex justify-center px-4">
        <div className="flex flex-col md:flex-row items-start md:items-stretch bg-white shadow-md rounded-lg overflow-hidden">
          {/* Companies */}
          <div className="w-full md:w-[400px] p-8 flex flex-col justify-center">
            <div className="text-center">
              
              <h2 className="text-2xl mt-4 font-bold">
                For <span className="italic font-semibold">Companies</span>
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Thousands of companies have embraced the new way to hire and
                upskill developers.
              </p>
              <button
                onClick={() => onLogin("company")}
                className="mt-6 bg-black text-white px-6 py-2 rounded"
              >
                Login
              </button>
              <p className="mt-4 text-sm text-gray-700">
                Don’t have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer"
                  onClick={onRegister}
                >
                  Create account
                </span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-300"></div>

          {/* Developers */}
          <div className="w-full md:w-[400px] p-8 flex flex-col justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold">
                For <span className="italic font-semibold">Developers</span>
              </h2>
              <p className="text-gray-600 mt-2 text-sm">
                Join over 26 million developers, practice coding, and get hired.
              </p>
              <button
                onClick={() => onLogin("developer")}
                className="mt-6 border border-black px-6 py-2 rounded hover:bg-gray-100"
              >
                Login
              </button>
              <p className="mt-4 text-sm text-gray-700">
                Don’t have an account?{" "}
                <span
                  className="text-green-600 cursor-pointer"
                  onClick={onRegister}
                >
                  Create account
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

