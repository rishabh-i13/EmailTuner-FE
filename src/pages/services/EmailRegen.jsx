import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { FiLoader, FiArrowLeft, FiCopy } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailRegen = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [originalEmail, setOriginalEmail] = useState("");
  const [tone, setTone] = useState("");
  const [numberOfWords, setNumberOfWords] = useState("");
  const [customTone, setCustomTone] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [tones, setTones] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTones = async () => {
      if (!token) return; // Skip fetch if no token, avoiding potential errors
      try {
        const response = await fetch(
          "https://email-toner-backend.onrender.com/tone/all",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setTones([...data.tones, "Other"]); // Move "Other" to the end
      } catch (error) {
        console.error("Error fetching tones:", error);
        setTones(["Friendly", "Professional", "Casual", "Other"]); // Fallback tones
      }
    };
    fetchTones();
  }, [token]);

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("originalEmail") || "";
    const savedTone = sessionStorage.getItem("tone") || "";
    const savedWords = sessionStorage.getItem("numberOfWords") || "";
    if (savedEmail) setOriginalEmail(savedEmail);
    if (savedTone && tones.includes(savedTone)) setTone(savedTone);
    if (savedWords) setNumberOfWords(savedWords); // Allow empty string as default
  }, [tones]);

  useEffect(() => {
    sessionStorage.setItem("originalEmail", originalEmail);
    sessionStorage.setItem("tone", tone);
    sessionStorage.setItem("numberOfWords", numberOfWords);
  }, [originalEmail, tone, numberOfWords]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!originalEmail || !originalEmail.trim()) {
      toast.error("Please enter an original email.", { autoClose: 3000 });
      return;
    }

    if (!tone || tone === "Select tone") {
      toast.error("Please select a tone.", { autoClose: 3000 });
      return;
    }

    let wordCount = null;
    if (numberOfWords && numberOfWords.trim()) {
      wordCount = parseInt(numberOfWords);
      if (isNaN(wordCount) || wordCount < 50 || wordCount > 400) {
        toast.error("Number of words must be between 50 and 400.", { autoClose: 3000 });
        return;
      }
    }

    if (tone === "Other" && !customTone.trim()) {
      toast.error("Please enter a custom tone.", { autoClose: 3000 });
      return;
    }

    setIsLoading(true);
    const payload = {
      originalEmail,
      tone: tone === "Other" ? customTone : tone,
      ...(wordCount !== null && { numberOfWords: wordCount }),
    };
    try {
      const response = await fetch(
        "https://email-toner-backend.onrender.com/email/rewrite",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      setGeneratedEmail(data);
      setIsFlipped(true);
    } catch (error) {
      console.error("Error generating email:", error);
      toast.error("Failed to generate email. Please try again.", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
      toast.success("Email generated successfully!", { autoClose: 3000 });
    }
  };

  const handleBack = () => {
    setIsFlipped(false);
    setGeneratedEmail(null);
  };

  const handleCopy = () => {
    const emailText = `Subject: ${
      generatedEmail?.subject || ""
    }\n\n${generatedEmail?.body?.trim() || ""}\n\n${generatedEmail?.outro?.trim() || ""}`;
    navigator.clipboard.writeText(emailText).then(() => {
      toast.success("Email copied to clipboard!", { autoClose: 3000 });
    });
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#AFDBF5] to-[#87CEEB] px-4 pt-20 pb-24">
      <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-8 mt-4 text-center drop-shadow-2xl">
        Email Regenerator
      </h1>
      <div className="w-full max-w-7xl">
        <div
          className="relative w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className={`relative w-full transition-transform duration-700 ${
              isFlipped ? "rotate-y-180" : ""
            }`}
          >
            <div
              className={`w-full h-[90%] bg-gradient-to-br from-[#E6F0FA]/50 to-[#B0E0E6]/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col sm:flex-row  ${
                isFlipped ? "hidden" : ""
              }`}
            >
              <div className="w-full sm:w-3/4 sm:pr-6">
                <label
                  className="block text-gray-700 font-semibold mb-2 text-lg"
                  htmlFor="originalEmail"
                >
                  Original Email
                </label>
                <textarea
                  id="originalEmail"
                  value={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.value)}
                  placeholder="Enter your original email..."
                  required
                  className="w-full h-[90%] p-4 bg-white/30 text-gray-800 placeholder-gray-500 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base resize-none"
                  style={{ minHeight: "400px" }}
                />
              </div>
              <div className="w-full sm:w-1/4 sm:pl-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                      htmlFor="tone"
                    >
                      Tone
                    </label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    >
                      <option value="" disabled>
                        Select tone
                      </option>
                      {tones.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    {tone === "Other" && (
                      <input
                        type="text"
                        value={customTone}
                        onChange={(e) => setCustomTone(e.target.value)}
                        placeholder="Enter custom tone..."
                        className="w-full mt-2 p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                      />
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2 text-lg"
                      htmlFor="numberOfWords"
                    >
                      Number of Words (50–400)
                    </label>
                    <input
                      id="numberOfWords"
                      type="number"
                      value={numberOfWords}
                      onChange={(e) => setNumberOfWords(e.target.value)}
                      placeholder="e.g., 100"
                      className="w-full p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full mt-4 px-4 py-3 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 text-lg shadow-md flex items-center justify-center"
                >
                  {isLoading ? (
                    <FiLoader className="animate-spin mr-2" size={20} />
                  ) : null}
                  Regenerate
                </button>
              </div>
            </div>

            <div
              className={`w-full h-[90%] bg-gradient-to-br from-[#E6F0FA]/50 to-[#B0E0E6]/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 rotate-y-180 flex flex-col h-[calc(90vh-64px)] ${
                isFlipped ? "" : "hidden"
              }`}
            >
              {generatedEmail && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">
                      Here is your regenerated email
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-2 text-white rounded-lg flex items-center text-base"
                      >
                        <FiCopy className="mr-1 text-blue-500" size={20} />
                      </button>
                      <button
                        onClick={handleBack}
                        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center text-base"
                      >
                        <FiArrowLeft className="mr-1" size={16} /> Edit Details
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-white/30 rounded-xl text-gray-800 overflow-y-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `Subject: ${
                          generatedEmail.subject
                        }<br /><br />${generatedEmail.body
                          .trim()
                          .replace(
                            /\n/g,
                            "<br />"
                          )}<br /><br />${generatedEmail.outro
                          .trim()
                          .replace(/\n/g, "<br />")}`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default EmailRegen;