import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { FiLoader } from "react-icons/fi";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const passwordChecks = {
  length: (pwd) => pwd.length >= 8,
  lowercase: (pwd) => /[a-z]/.test(pwd),
  uppercase: (pwd) => /[A-Z]/.test(pwd),
  number: (pwd) => /[0-9]/.test(pwd),
  symbol: (pwd) => /[^A-Za-z0-9]/.test(pwd),
};

const SignUpPage = () => {
  const { signup, verifyOtp } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validations = {
    length: passwordChecks.length(formData.password),
    lowercase: passwordChecks.lowercase(formData.password),
    uppercase: passwordChecks.uppercase(formData.password),
    number: passwordChecks.number(formData.password),
    symbol: passwordChecks.symbol(formData.password),
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setError("Please meet all password requirements.");
      return;
    }
    setIsLoading(true);
    try {
      await signup(formData.email, formData.password, formData.name);
      setShowModal(true);
      setError("");
    } catch (err) {
      setError(err.error || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyOtp(formData.email, otp);
      setShowModal(false);
      navigate("/");
      setError("");
    } catch (err) {
      setError(err.error || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const ConditionCheck = ({ label, valid }) => (
    <div className="flex items-center gap-1">
      <span
        className={`h-2 w-2 rounded-full ${
          valid ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <span
        className={`${
          valid ? "text-green-600" : "text-red-500"
        } text-xs sm:text-sm`}
      >
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#AFDBF5] px-4 relative">
      <div
        className={`bg-white/30 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20 transition-all duration-300 ${
          showModal ? "blur-sm" : ""
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">
          Signup
        </h2>
        <hr className="border-black/20 mb-6" />
        {error && (
          <p className="text-red-500 mb-4 text-center text-sm sm:text-base bg-red-100/50 p-2 rounded-md">
            {error ===
            "User already exists but is not verified. Please verify your email." ? (
              <>
                {error}{" "}
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await signup(
                        formData.email,
                        formData.password,
                        formData.name
                      );
                      setShowModal(true);
                      setError("");
                    } catch (err) {
                      setError(err.error || "Failed to resend OTP");
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                  className="underline text-blue-600 hover:text-blue-800 text-sm sm:text-base flex items-center justify-center"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin mr-2" size={20} />
                  ) : null}
                  Resend OTP
                </button>
              </>
            ) : (
              error
            )}
          </p>
        )}
        <form onSubmit={handleSignupSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label
              className="block text-black font-semibold mb-2 text-sm sm:text-base"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full p-3 bg-white/50 text-black placeholder-gray-500 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base backdrop-blur-sm"
            />
          </div>
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
          {formData.password && (
            <div className="flex flex-wrap gap-3 text-sm">
              <ConditionCheck label="8 Chars" valid={validations.length} />
              <ConditionCheck
                label="1 Lowercase"
                valid={validations.lowercase}
              />
              <ConditionCheck
                label="1 Uppercase"
                valid={validations.uppercase}
              />
              <ConditionCheck label="1 Symbol" valid={validations.symbol} />
              <ConditionCheck label="1 Number" valid={validations.number} />
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-900 transition-colors text-sm sm:text-base shadow-md flex items-center justify-center"
          >
            {isLoading ? (
              <FiLoader className="animate-spin mr-2" size={20} />
            ) : null}
            Signup
          </button>
          <p className="mt-4 text-center text-black text-sm sm:text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-[#E1EBEE] backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">
              Verify Email
            </h2>
            <hr className="border-black/20 mb-6" />
            {error && (
              <p className="text-red-500 mb-4 text-center text-sm sm:text-base bg-red-100/50 p-2 rounded-md">
                {error}
              </p>
            )}
            <form onSubmit={handleOtpSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label
                  className="block text-black font-semibold mb-2 text-sm sm:text-base"
                  htmlFor="otp"
                >
                  OTP
                </label>
                <input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP sent to your email"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full p-3 bg-white/50 text-black placeholder-gray-500 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base backdrop-blur-sm"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:from-blue-700 hover:to-blue-900 transition-colors text-sm sm:text-base shadow-md flex items-center justify-center"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin mr-2" size={20} />
                ) : null}
                Verify OTP
              </button>
              <button
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await signup(
                      formData.email,
                      formData.password,
                      formData.name
                    );
                    setError("");
                  } catch (err) {
                    setError(err.error || "Failed to resend OTP");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full mt-2 text-blue-600 hover:underline text-sm sm:text-base flex items-center justify-center"
              >
                {isLoading ? (
                  <FiLoader className="animate-spin mr-2" size={20} />
                ) : null}
                Resend OTP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
