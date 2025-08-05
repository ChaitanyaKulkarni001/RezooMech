// ThemeToggle.jsx
import React from "react";
import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="fixed top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow"
      onClick={toggleTheme}
    >
      Switch to {theme === "light" ? "dark" : "light"} Mode
    </button>
  );
};

export default ThemeToggle;