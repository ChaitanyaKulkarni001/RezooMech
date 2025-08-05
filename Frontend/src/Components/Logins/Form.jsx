import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../../constants";

function Form() {
  const route = "/api/token/"; // Endpoint for authentication
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(route, { username, password });
      // Save access and refresh tokens
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.detail || "Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = () => {
    navigate("/register");
  };

  return (
    <form onSubmit={handleSubmit} className="form-container max-w-md mx-auto p-4 border border-gray-200 rounded-lg shadow-lg">
      <div className="form-group mb-4">
        <label htmlFor="username" className="form-label text-gray-700">
          Username
        </label>
        <input
          type="text"
          id="username"
          className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group mb-6">
        <label htmlFor="password" className="form-label text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="form-control w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="btn  w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign In"}
      </button>
      {/* <p className="mt-6 text-center">
        Can't <span className="text-blue-500 cursor-pointer">log in</span>?{" "}
        <button
          className="text-blue-500 underline"
          type="button"
          onClick={handleNavigation}
        >
          Sign Up
        </button>{" "}
        to create an account.
      </p> */}
    </form>
  );
}

export default Form;
