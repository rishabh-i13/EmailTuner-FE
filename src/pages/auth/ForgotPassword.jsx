import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const passwordChecks = {
  length: (pwd) => pwd.length >= 8,
  lowercase: (pwd) => /[a-z]/.test(pwd),
  uppercase: (pwd) => /[A-Z]/.test(pwd),
  number: (pwd) => /[0-9]/.test(pwd),
  symbol: (pwd) => /[^A-Za-z0-9]/.test(pwd),
};

const ForgotPassword = () => {
  const { requestPasswordReset, verifyResetOtp, resetPassword } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validations = {
    length: passwordChecks.length(newPassword),
    lowercase: passwordChecks.lowercase(newPassword),
    uppercase: passwordChecks.uppercase(newPassword),
    number: passwordChecks.number(newPassword),
    symbol: passwordChecks.symbol(newPassword),
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await requestPasswordReset(email);
      setShowModal(true);
      setStep("verify");
      setError("");
    } catch (err) {
      setError(err.error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await verifyResetOtp(email, otp);
      setStep("reset");
      setError("");
    } catch (err) {
      setError(err.error || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e) => {
    e.preventDefault();
    const allValid = Object.values(validations).every(Boolean);
    if (!allValid) {
      setError("Please meet all password requirements.");
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email, newPassword);
      setShowModal(false);
      navigate("/login");
      setError("");
    } catch (err) {
      setError(err.error || "Password reset failed");
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
          Forgot Password
        </h2>
        <hr className="border-black/20 mb-6" />
        {error && (
          <p className="text-red-500 mb-4 text-center text-sm sm:text-base bg-red-100/50 p-2 rounded-md">
            {error}
          </p>
        )}
        <form onSubmit={handleRequestSubmit} className="space-y-4 sm:space-y-6">
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            Send OTP
          </button>
        </form>
        <p className="mt-4 text-center text-black text-sm sm:text-base">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-[#E0FFFF] backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-md border border-white/20 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-black hover:text-gray-600"
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2 text-center">
              {step === "verify" ? "Verify OTP" : "Reset Password"}
            </h2>
            <hr className="border-black/20 mb-6" />
            {error && (
              <p className="text-red-500 mb-4 text-center text-sm sm:text-base bg-red-100/50 p-2 rounded-md">
                {error}
              </p>
            )}
            {step === "verify" ? (
              <form
                onSubmit={handleOtpSubmit}
                className="space-y-4 sm:space-y-6"
              >
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
                      await requestPasswordReset(email);
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
            ) : (
              <form
                onSubmit={handlePasswordResetSubmit}
                className="space-y-4 sm:space-y-6"
              >
                <div className="space-y-2">
                  <label
                    className="block text-black font-semibold text-sm sm:text-base"
                    htmlFor="newPassword"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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
                {newPassword && (
                  <div className="flex flex-wrap gap-3 text-sm">
                    <ConditionCheck
                      label="8 Chars"
                      valid={validations.length}
                    />
                    <ConditionCheck
                      label="1 Lowercase"
                      valid={validations.lowercase}
                    />
                    <ConditionCheck
                      label="1 Uppercase"
                      valid={validations.uppercase}
                    />
                    <ConditionCheck
                      label="1 Symbol"
                      valid={validations.symbol}
                    />
                    <ConditionCheck
                      label="1 Number"
                      valid={validations.number}
                    />
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
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
