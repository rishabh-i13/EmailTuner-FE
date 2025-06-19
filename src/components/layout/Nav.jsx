import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import Logo from "../../assets/LogoMT.png";

const Nav = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn()) return null;

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#f8fafc] p-4 flex justify-between items-center shadow-md z-50">

      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={Logo} alt="MailTuner" className="h-10 w-auto" />
      </Link>
      {/* Login/Signup Buttons */}
      <div className="space-x-4">
        <Link to="/login">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-700 to-[#228BE6] text-white rounded-md hover:bg-gray-100 text-sm sm:text-base">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 bg-gradient-to-r from-blue-700 to-[#228BE6] text-white rounded-md hover:bg-gray-100 text-sm sm:text-base">
            Signup
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
