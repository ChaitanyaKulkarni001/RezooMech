import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Facebook, Twitter, Linkedin } from "lucide-react"; // Icons

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={`w-full py-10 ${
        theme === "dim" ? "bg-white text-black" : "bg-gray-900 text-white"
      } border-t border-gray-700`}
    >
      <div className="container mt-20  mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Column 1 - CareerXpert AI */}
          <div>
            <h2
              className={`text-xl font-semibold ${
                theme === "dim" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              CareerXpert AI
            </h2>
            <p
              className={`text-sm mt-2 ${
                theme === "dim" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Your AI-powered interview preparation platform.
            </p>
          </div>

          {/* Column 2 - Quick Links */}
          <div>
            <h2
              className={`text-xl font-semibold ${
                theme === "dim" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              Quick Links
            </h2>
            <ul className="mt-2 space-y-2">
              <li>
                <a
                  href="/about"
                  className={`hover:underline ${
                    theme === "dim" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/features"
                  className={`hover:underline ${
                    theme === "dim" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className={`hover:underline ${
                    theme === "dim" ? "text-gray-700" : "text-gray-300"
                  }`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 - Follow Us */}
          <div>
            <h2
              className={`text-xl font-semibold ${
                theme === "dim" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              Follow Us
            </h2>
            <div className="flex justify-center md:justify-start space-x-4 mt-2">
              <a href="#" className="hover:opacity-75">
                <Facebook
                  className={`w-6 h-6 ${
                    theme === "dim" ? "text-gray-700" : "text-gray-300"
                  }`}
                />
              </a>
              <a href="#" className="hover:opacity-75">
                <Twitter
                  className={`w-6 h-6 ${
                    theme === "dim" ? "text-gray-700" : "text-gray-300"
                  }`}
                />
              </a>
              <a href="#" className="hover:opacity-75">
                <Linkedin
                  className={`w-6 h-6 ${
                    theme === "dim" ? "text-gray-700" : "text-gray-300"
                  }`}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`border-t mt-8 pt-4 text-center text-sm ${
            theme === "dim" ? "border-gray-300" : "border-gray-700"
          }`}
        >
          <p>Designed And Developed by AI-Interview Developers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
