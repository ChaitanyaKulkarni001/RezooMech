import { React, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../src/assets/logo.png';
import { ACCESS_TOKEN } from '../../constants';
import userProfilepic from '../../assets/profile.png';
import { LogOut, User } from "lucide-react"; // Icons
import api from '../../api';
import ThemeToggleButton from './ThemeToggleButton';
import { ThemeContext } from '../ThemeContext';
// import { useNavigate } from "react-router-dom";

const Header = () => {
  const { theme } = useContext(ThemeContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Store user profile pic
  // const [is_staff,setIsStaff] = useState(false);
  // const navigate = useNavigate();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null); // Start as `null` to indicate loading state
  const color = `${theme == 'dim' ? 'text-black ' : 'text-white'}`;
  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem(ACCESS_TOKEN);
    setIsAuthenticated(!!token);

    if (token) {
      // Fetch user profile details (Replace this with actual API call)
      const user = JSON.parse(localStorage.getItem("user")) || {}; // Example
      setUserProfile(userProfilepic); // Default avatar
    }


  }, []);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const res = await api.get("api/is_staff/");
        console.log("I am admin:", res.data.is_staff);
        setIsAdmin(res.data.is_staff);

        // if (!res.data.is_staff) {
        //   alert("You are not an admin. If this is a mistake, please contact the admin.");
        //   navigate("/dashboard");

      } catch (error) {
        console.error("Error fetching admin status:", error);
        // alert("Failed to verify admin status.");
        // navigate("/dashboard");
      }
    };

    fetchAdminStatus();
  }, [navigate]); // Dependency array includes `navigate`


  const handleNavigation = () => {
    navigate('/login');
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const goToDashboard = () => {
    navigate("/dashboard");
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login");
  };
  return (
    <header className={`fixed top-0 left-0 h-20 w-full  ${theme == 'dim' ? 'bg-white text-black':'bg-[#011638] text-white'  } shadow-md z-50`}>
      <nav className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center">
            <img src={logo} width="200" height="100" alt="logo" className="transition-transform duration-300 hover:scale-105" />
          </a>
          {/* <span className=" text-xl font-semibold">AI Interview</span> */}
        </div>

        {/* Navbar menu */}
        <ul className="hidden lg:flex space-x-6 font-play">
          <li>
            <button onClick={() => { navigate("/") }} className={` ${color} nav-link text-lg  hover:text-gray-200 transition-colors duration-300 !important`}>
              Home
            </button>
          </li>
          <li>
            <button onClick={() => { navigate("/about") }} className={`  ${color} nav-link text-lg  hover:text-gray-200 transition-colors duration-300 !important`}>
              About
            </button>
          </li>
          {

            (isAdmin &&
              <li>
                <button onClick={() => { navigate("/admin") }} className={` ${color} nav-link text-lg  hover:text-gray-200 transition-colors duration-300 !important"`}>
                  MyDashboard
                </button>
              </li>
            )
          }
          <li>
            <button onClick={() => { navigate("/features") }} className={` ${color} nav-link text-lg  hover:text-gray-200 transition-colors duration-300 !important`}>
              Features
            </button>
          </li>
          {/* <li>
            <a href="/how-it-works" className="nav-link text-lg text-white hover:text-gray-200 transition-colors duration-300 !important">
              How It Works
            </a>
          </li> */}
          <li>
            <button onClick={() => { navigate("/contact") }} className={` ${color} nav-link text-lg  hover:text-gray-200 transition-colors duration-300 !important`}>
              Contact
            </button>
          </li>
        </ul>

        {/* Sign In Button */}
        <div className="order-1 ml-auto hidden items-center md:order-2 md:ml-0 lg:flex">
          {!isAuthenticated ? (
            // Sign In Button (Visible when not logged in)
            <button
              className="text-base border px-4 py-2 bg-[#011638] text-white font-semibold rounded-lg shadow-lg w-40 transition-all duration-300 hover:scale-105"
              onClick={handleNavigation}
            >
              Sign In Now
            </button>

          ) : (
            <>
              {/* Profile Button */}
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-1 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300"
                  onClick={toggleDropdown}
                >
                  {userProfilepic ? (
                    <img
                      src={userProfilepic}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />


                  ) : (
                    <User className="w-10 h-10 text-gray-500" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={goToDashboard}
                          className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <User className="w-5 h-5 mr-2" />
                          Profile
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                        >
                          <LogOut className="w-5 h-5 mr-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

            </>
          )}

          <div className='flex items-center ml-4 space-x-2'>

            <ThemeToggleButton />

          </div>
        </div>

      </nav>

    </header>
  );
};

export default Header;
