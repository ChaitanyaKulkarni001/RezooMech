import React from "react";

const RegisterForm = ({ onBack }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 shadow-lg rounded bg-gray-50">
        <h2 className="text-2xl font-bold text-center mb-4">Create your account</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full border px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Register
          </button>
        </form>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:underline text-sm block mx-auto"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
