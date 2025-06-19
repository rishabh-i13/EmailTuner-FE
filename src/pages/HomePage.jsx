import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../components/context/AuthContext';
// import EmailForm from '../components/EmailForm';

const HomePage = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleCardClick = (path) => {
    if (isLoggedIn()) {
      navigate(path);
    } else {
      setShowPopup(true);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-8rem)] bg-gray-100 px-4 py-8">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-8 text-center">
        Welcome to EmailTuner
      </h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Generate New Email Card */}
        <div
          onClick={() => handleCardClick('/email-gen')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
            Generate New Email
          </h2>
          <p className="text-gray-600 text-center text-sm sm:text-base">
            Create a new email from scratch with your desired tone.
          </p>
        </div>

        {/* Regenerate Email Card */}
        <div
          onClick={() => handleCardClick('/email-regen')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 text-center">
            Regenerate Email
          </h2>
          <p className="text-gray-600 text-center text-sm sm:text-base">
            Modify an existing email to adjust its tone or style.
          </p>
        </div>
      </div>

      {/* Popup for Not Logged In */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-sm w-full text-center">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
              You are not logged in
            </h3>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Please log in to access email generation features.
            </p>
            <Link to="/login">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
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