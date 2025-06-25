import { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import Logo from "../../assets/LogoMT.png";
import { RiAccountCircleFill } from "react-icons/ri";
import { FaHistory } from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  if (!isLoggedIn()) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#F0F8FF] p-4 flex justify-between items-center shadow-md z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="MailTuner" className="h-10 w-auto" />
      </Link>

      {/* Services and Account Section */}
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className={`text-gray-800 hover:text-blue-600 text-base sm:text-lg font-medium ${
            location.pathname === "/" ? "underline" : ""
          }`}
        >
          Services
        </Link>
        <div className="relative">
          <button
            className="px-4 py-1"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <RiAccountCircleFill size={32} />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <Link
                  to="/history"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm sm:text-base flex items-center"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <FaHistory className="mr-2" size={16} /> History
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm sm:text-base flex items-center"
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                >
                  <MdLogout className="mr-2" size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;