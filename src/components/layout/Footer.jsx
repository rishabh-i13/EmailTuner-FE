import { Link } from 'react-router-dom';
import { FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-[#228BE6] text-white p-4 sm:p-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        {/* Copyright Notice */}
        <div className="text-center sm:text-left text-sm sm:text-base">
          <p>© 2025 EmailTuner. All rights reserved.</p>
        </div>
        {/* Contributors */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm sm:text-base">
          <span className="font-semibold">Contributors:</span>
          <span className="flex items-center gap-1 hover:underline">
            <FaLinkedin size={16} />
            <Link to="https://www.linkedin.com/in/rishabh-shukla-13i/" target="_blank" rel="noopener noreferrer">
              Rishabh Shukla
            </Link>
          </span>
          <span className="flex items-center gap-1 hover:underline">
            <FaLinkedin size={16} />
            <Link to="https://www.linkedin.com/in/ravikant--tiwari/" target="_blank" rel="noopener noreferrer">
              Ravikant Tiwari
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;