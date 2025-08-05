// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams
} from "react-router-dom";

import Login from "./components/Login";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";

function HomeWrapper() {
  const navigate = useNavigate();

  const handleLogin = (role) => {
    navigate(`/login/${role}`);
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return <Login onLogin={handleLogin} onRegister={handleRegister} />;
}

function LoginFormWrapper() {
  const { role } = useParams();
  const navigate = useNavigate();
  return (
    <LoginForm
      role={role}
      onBack={() => navigate("/")}
    />
  );
}

function RegisterFormWrapper() {
  const navigate = useNavigate();
  return <RegisterForm onBack={() => navigate("/")} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home screen with “Companies” / “Developers” choices */}
        <Route path="/" element={<HomeWrapper />} />

        {/* Actual login form, role comes from URL param */}
        <Route path="/login/:role" element={<LoginFormWrapper />} />

        {/* Registration form */}
        <Route path="/register" element={<RegisterFormWrapper />} />
      </Routes>
    </Router>
  );
}
