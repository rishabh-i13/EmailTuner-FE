import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../components/context/AuthContext';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/');
      setError('');
    } catch (err) {
      setError(err.error || 'Login failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] bg-gray-100 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6 text-center">Login</h2>
        {error && (
          <p className="text-red-500 mb-4 text-center text-sm sm:text-base">
            {error === 'Email not verified. Please verify your email before logging in.' ? (
              <>
                {error}{' '}
                <Link to="/signup" className="underline text-blue-600 hover:text-blue-800">
                  Resend OTP
                </Link>
              </>
            ) : (
              error
            )}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
          <div className="text-right">
            <Link to="/forgot-password" className="text-blue-600 hover:underline text-sm sm:text-base">
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-700 to-[#228BE6] text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;