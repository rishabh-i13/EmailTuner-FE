import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Copyright Notice */}
        <div className="text-center sm:text-left text-sm sm:text-base">
          <p>© 2025 EmailTuner. All rights reserved.</p>
        </div>
        {/* Footer Links */}
        <div className="flex space-x-4 text-sm sm:text-base">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;