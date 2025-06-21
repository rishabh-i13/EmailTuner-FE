import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';
import { FiLoader } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState({ gen: false, regen: false });

  const handleCardClick = (path, card) => {
    if (isLoggedIn()) {
      setIsLoading((prev) => ({ ...prev, [card]: true }));
      setTimeout(() => {
        navigate(path);
        setIsLoading((prev) => ({ ...prev, [card]: false }));
      }, 500);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#AFDBF5] px-4 py-24">
      <h1 className="text-4xl sm:text-5xl font-bold text-black mb-16 text-center drop-shadow-md">
        Welcome to MailTuner
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Generate Email Card */}
        <div className="bg-[#e6f4ff] rounded-2xl shadow-md flex flex-col justify-between h-full">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-black mb-3">Generate Email</h2>
            <p className="text-gray-700 mb-6 text-base sm:text-lg">
              Craft professional, impactful emails entirely from scratch—customized to fit your specific needs, tone, and purpose. Whether you're writing for business, networking, or follow-ups, we ensure your message is clear, polished, and effective.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-[#d0ebff] text-base px-4 py-2 rounded-full text-gray-800">New Mail</span>
              <span className="bg-[#d0ebff] text-base px-4 py-2 rounded-full text-gray-800">Tone Setup</span>
              <span className="bg-[#d0ebff] text-base px-4 py-2 rounded-full text-gray-800">Content First</span>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('/email-gen', 'gen')}
            disabled={isLoading.gen}
            className="flex items-center justify-between w-full px-8 py-5 border-t border-gray-200 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-[#dbeeff] transition rounded-b-2xl text-base sm:text-lg"
          >
            <span className="font-medium">
              {isLoading.gen ? <FiLoader className="animate-spin inline mr-2" size={20} /> : 'Explore'}
            </span>
            <IoIosArrowForward size={24} />
          </button>
        </div>

        {/* Regenerate Email Card */}
        <div className="bg-[#e6f4ff] rounded-2xl shadow-md flex flex-col justify-between h-full">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-black mb-3">Regenerate Email</h2>
            <p className="text-gray-700 mb-6 text-base sm:text-lg">
              Refine and enhance your emails to better align with your intended tone, style, and communication goals. Whether you need it more professional, friendly, persuasive, or concise, we’ll help shape it to leave the right impression.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="bg-[#d0ebff] text-base px-4 py-2 rounded-full text-gray-800">Fix Tone</span>
              <span className="bg-[#d0ebff] text-base px-4 py-2 rounded-full text-gray-800">Style Refresh</span>
              <span className="bg-[#d0ebff] text-base px-4 py-2 rounded-full text-gray-800">Quick Revise</span>
            </div>
          </div>
          <button
            onClick={() => handleCardClick('/email-regen', 'regen')}
            disabled={isLoading.regen}
            className="flex items-center justify-between w-full px-8 py-5 border-t border-gray-200 text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:bg-[#dbeeff] transition rounded-b-2xl text-base sm:text-lg"
          >
            <span className="font-medium">
              {isLoading.regen ? <FiLoader className="animate-spin inline mr-2" size={20} /> : 'Explore'}
            </span>
            <IoIosArrowForward size={24} />
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center px-4 z-50">
          <div className="relative bg-[#E1EBEE] backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl max-w-sm w-full text-center border border-white/20">
            {/* Close (X) Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-black hover:text-gray-600 transition"
            >
              <IoMdClose size={22} />
            </button>

            <h3 className="text-lg sm:text-xl font-bold text-black mb-4">
              You are not logged in
            </h3>
            <p className="text-black mb-6 text-sm sm:text-base">
              Please log in to access email generation features.
            </p>
            <Link to="/login">
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-900 transition-colors text-sm sm:text-base shadow-md"
                onClick={() => setShowPopup(false)}
              >
                Login
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
