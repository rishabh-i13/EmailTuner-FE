import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../components/context/AuthContext';

const SignUpPage = () => {
  const { signup, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Signup form, Step 2: OTP verification
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData.email, formData.password, formData.name);
      setStep(2); // Move to OTP verification step
      setError('');
    } catch (err) {
      setError(err.error || 'Signup failed');
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(formData.email, otp);
      navigate('/'); // Redirect to home after successful verification
      setError('');
    } catch (err) {
      setError(err.error || 'OTP verification failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 text-center">
          {step === 1 ? 'Signup' : 'Verify Email'}
        </h2>
        {error && (
          <p className="text-red-500 mb-4 text-center text-sm sm:text-base">
            {error === 'User already exists but is not verified. Please verify your email.' ? (
              <>
                {error}{' '}
                <button
                  onClick={async () => {
                    try {
                      await signup(formData.email, formData.password, formData.name);
                      setStep(2);
                      setError('');
                    } catch (err) {
                      setError(err.error || 'Failed to resend OTP');
                    }
                  }}
                  className="underline text-blue-600 hover:text-blue-800 text-sm sm:text-base"
                >
                  Resend OTP
                </button>
              </>
            ) : (
              error
            )}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleSignupSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-700 to-[#228BE6] text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Signup
            </button>
            <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-sm sm:text-base" htmlFor="otp">
                OTP
              </label>
              <input
                id="otp"
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Verify OTP
            </button>
            <button
              onClick={async () => {
                try {
                  await signup(formData.email, formData.password, formData.name);
                  setError('');
                } catch (err) {
                  setError(err.error || 'Failed to resend OTP');
                }
              }}
              className="w-full mt-2 text-blue-600 hover:underline text-sm sm:text-base"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;