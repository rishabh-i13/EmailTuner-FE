import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { FiLoader } from "react-icons/fi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate("/");
      setError("");
    } catch (err) {
      setError(err.error || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#AFDBF5] px-4">
      <div className="bg-white/30 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20">
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">
          Login
        </h2>
        <hr className="border-black/20 mb-6" />
        {error && (
          <p className="text-red-500 mb-4 text-center text-sm sm:text-base bg-red-100/50 p-2 rounded-md">
            {error ===
            "Email not verified. Please verify your email before logging in." ? (
              <>
                {error}{" "}
                <Link
                  to="/signup"
                  className="underline text-blue-600 hover:text-blue-800"
                >
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
            <label
              className="block text-black font-semibold mb-2 text-sm sm:text-base"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="w-full p-3 bg-white/50 text-black placeholder-gray-500 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              className="block text-black font-semibold text-sm sm:text-base"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="w-full p-3 bg-white/50 text-black placeholder-gray-500 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base backdrop-blur-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black"
                tabIndex={-1}
              >
                {showPassword ? (
                  <IoMdEyeOff size={20} />
                ) : (
                  <IoMdEye size={20} />
                )}
              </button>
            </div>
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-black hover:underline text-sm sm:text-base"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-900 transition-colors text-sm sm:text-base shadow-md flex items-center justify-center"
          >
            {isLoading ? (
              <FiLoader className="animate-spin mr-2" size={20} />
            ) : null}
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-black text-sm sm:text-base">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
