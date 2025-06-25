import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/context/AuthContext";
import { FiLoader, FiArrowLeft, FiCopy, FiSave } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailGen = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState("");
  const [recipientOther, setRecipientOther] = useState("");
  const [details, setDetails] = useState("");
  const [detailsOther, setDetailsOther] = useState("");
  const [tone, setTone] = useState("");
  const [toneOther, setToneOther] = useState("");
  const [numberOfWords, setNumberOfWords] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [recipients, setRecipients] = useState([]);
  const [detailsList, setDetailsList] = useState([]);
  const [tonesList, setTonesList] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOptions = async () => {
      if (!token) {
        console.log("No token found, using default options.");
        setRecipients(["Manager", "Team Lead", "HR", "Client", "Colleague"]);
        setDetailsList(["Leave Request", "Appreciation", "Complaint", "Follow Up", "Meeting Scheduling"]);
        setTonesList(["Formal", "Friendly", "Appreciative", "Apologetic", "Assertive", "Persuasive", "Concise", "Encouraging", "Informative", "Sympathetic"]);
        return;
      }
      try {
        const response = await fetch("https://email-toner-backend.onrender.com/tone/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch options");
        const data = await response.json();
        setRecipients([...data.designations, "Other"]);
        setDetailsList([...data.occasions, "Other"]);
        setTonesList([...data.tones, "Other"]);
      } catch (error) {
        console.error("Error fetching options:", error);
        toast.error("Failed to load options. Using defaults.", { autoClose: 3000 });
        setRecipients(["Manager", "Team Lead", "HR", "Client", "Colleague", "Other"]);
        setDetailsList(["Leave Request", "Appreciation", "Complaint", "Follow Up", "Meeting Scheduling", "Other"]);
        setTonesList(["Formal", "Friendly", "Appreciative", "Apologetic", "Assertive", "Persuasive", "Concise", "Encouraging", "Informative", "Sympathetic", "Other"]);
      }
    };
    fetchOptions();
  }, [token]);

  useEffect(() => {
    const isRecipientValid = (recipient && recipient !== "Other") || (recipient === "Other" && recipientOther.trim());
    const isDetailsValid = (details && details !== "Other") || (details === "Other" && detailsOther.trim());
    if (isRecipientValid && isDetailsValid && (recipient !== "" || recipientOther !== "") && (details !== "" || detailsOther !== "")) {
      const handler = setTimeout(() => suggestTone(), 300);
      return () => clearTimeout(handler);
    }
  }, [recipient, recipientOther, details, detailsOther]);

  const suggestTone = async () => {
    try {
      const payload = {
        recipient: recipient === "Other" ? recipientOther.trim() : recipient,
        occasion: details === "Other" ? detailsOther.trim() : details,
      };
      console.log("Suggesting tone with payload:", payload);
      const response = await fetch("https://email-toner-backend.onrender.com/tone/suggest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Failed to suggest tone");
      const data = await response.json();
      console.log("Suggested tone response:", data);
      const newTone = data.tone + " (suggested)";
      console.log("Setting tone to:", newTone);
      setTone(newTone);
    } catch (error) {
      console.error("Error suggesting tone:", error);
      toast.error("Failed to suggest tone. Please select manually.", { autoClose: 3000 });
      setTone("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting with state:", { recipient, details, tone, recipientOther, detailsOther, toneOther, numberOfWords });

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    if (!recipient || recipient === "Select recipient") {
      toast.error("Please select a recipient.", { autoClose: 3000 });
      return;
    }

    if (recipient === "Other" && !recipientOther.trim()) {
      toast.error("Please enter a custom recipient.", { autoClose: 3000 });
      return;
    }

    if (!details || details === "Select details") {
      toast.error("Please select details.", { autoClose: 3000 });
      return;
    }

    if (details === "Other" && !detailsOther.trim()) {
      toast.error("Please enter custom details.", { autoClose: 3000 });
      return;
    }

    if (!tone || tone === "Select tone") {
      toast.error("Please select a tone.", { autoClose: 3000 });
      return;
    }

    if (tone === "Other" && !toneOther.trim()) {
      toast.error("Please enter a custom tone.", { autoClose: 3000 });
      return;
    }

    // Validate numberOfWords if provided
    let numberOfWordsValue = null;
    if (numberOfWords.trim()) {
      const num = parseInt(numberOfWords, 10);
      if (isNaN(num) || num < 50 || num > 400) {
        toast.error("Number of words must be between 50 and 400.", { autoClose: 3000 });
        return;
      }
      numberOfWordsValue = num;
    }

    setIsLoading(true);
    const payload = {
      designation: recipient === "Other" ? recipientOther : recipient,
      tone: tone.includes("(suggested)") ? tone.split(" (suggested)")[0] : (tone === "Other" ? toneOther : tone),
      occasion: details === "Other" ? detailsOther : details,
      ...(numberOfWordsValue && { numberOfWords: numberOfWordsValue }), // Include only if valid
    };
    console.log("Sending payload:", payload);
    try {
      const response = await fetch(
        "https://email-toner-backend.onrender.com/email/generate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGeneratedEmail(data);
      setIsFlipped(true);
      setIsSaved(false); // Reset save state when new email is generated
      toast.success("Email generated successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to generate email. Please try again.", { autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setIsFlipped(false);
    setGeneratedEmail(null);
    setIsSaved(false); // Reset save state when going back
  };

  const handleCopy = () => {
    if (!generatedEmail) return;
    const emailText = `Subject: ${
      generatedEmail.subject || ""
    }\n\n${generatedEmail.body?.trim() || ""}\n\n${generatedEmail.outro?.trim() || ""}`;
    navigator.clipboard.writeText(emailText).then(() => {
      toast.success("Email copied to clipboard!", { autoClose: 3000 });
    }).catch(err => console.error("Copy failed:", err));
  };

  const handleSave = async () => {
    if (!generatedEmail || isSaved) return;
    const savePayload = {
      originalEmail: "",
      rewrittenEmail: {
        subject: generatedEmail.subject || "",
        body: generatedEmail.body || "",
        outro: generatedEmail.outro || "",
      },
      tone: tone.includes("(suggested)") ? tone.split(" (suggested)")[0] : (tone === "Other" ? toneOther : tone),
      recipientType: recipient === "Other" ? "Individual" : (["Team Lead", "HR", "Client"].includes(recipient) ? "Team" : "Individual"),
      occasion: details === "Other" ? detailsOther : details,
      isGenerated: true,
    };
    try {
      const response = await fetch("https://email-toner-backend.onrender.com/email/save", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(savePayload),
      });
      if (!response.ok) throw new Error("Failed to save email to DB");
      setIsSaved(true);
      toast.success("Email saved successfully!", { autoClose: 3000 });
    } catch (error) {
      console.error("Error saving email:", error);
      toast.error("Failed to save email. Please try again.", { autoClose: 3000 });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#AFDBF5] to-[#87CEEB] px-4 pt-20 pb-24">
      <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-8 mt-4 text-center drop-shadow-2xl">
        Email Generator
      </h1>
      <div className="w-full max-w-7xl">
        <div className="relative w-full" style={{ transformStyle: "preserve-3d" }}>
          <div className={`relative w-[full] transition-transform duration-700 ${isFlipped ? "rotate-y-180" : ""}`}>
            <div className={`max-w-md mx-auto w-full bg-gradient-to-br from-[#E6F0FA]/50 to-[#B0E0E6]/50 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 flex flex-col ${isFlipped ? "hidden" : ""}`}>
              <div className="w-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg" htmlFor="recipient">
                      Recipient
                    </label>
                    <select
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    >
                      <option value="" disabled>Select recipient</option>
                      {recipients.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {recipient === "Other" && (
                      <input
                        type="text"
                        value={recipientOther}
                        onChange={(e) => setRecipientOther(e.target.value)}
                        placeholder="Enter custom recipient..."
                        className="w-full mt-2 p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg" htmlFor="details">
                      Details
                    </label>
                    <select
                      id="details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    >
                      <option value="" disabled>Select details</option>
                      {detailsList.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {details === "Other" && (
                      <input
                        type="text"
                        value={detailsOther}
                        onChange={(e) => setDetailsOther(e.target.value)}
                        placeholder="Enter custom details..."
                        className="w-full mt-2 p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg" htmlFor="tone">
                      Tone
                    </label>
                    <select
                      id="tone"
                      value={tone.replace(" (suggested)", "")}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                    >
                      <option value="" disabled>Select tone</option>
                      {tonesList.map((t) => (
                        <option key={t} value={t}>
                          {tone.includes(t + " (suggested)") ? `${t} (suggested)` : t}
                        </option>
                      ))}
                    </select>
                    {tone === "Other" && (
                      <input
                        type="text"
                        value={toneOther}
                        onChange={(e) => setToneOther(e.target.value)}
                        placeholder="Enter custom tone..."
                        className="w-full mt-2 p-3 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg" htmlFor="numberOfWords">
                      Number of Words (50-400)
                    </label>
                    <input
                      id="numberOfWords"
                      type="number"
                      value={numberOfWords}
                      onChange={(e) => setNumberOfWords(e.target.value)}
                      placeholder="Enter number of words..."
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
                  {isLoading ? <FiLoader className="animate-spin mr-2" size={20} /> : null}
                  Generate
                </button>
              </div>
            </div>

            <div className={`w-full bg-gradient-to-br from-[#E6F0FA]/50 to-[#B0E0E6]/50 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 rotate-y-180 flex flex-col ${isFlipped ? "" : "hidden"}`}>
              {generatedEmail && (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">
                      Here is your generated email
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
                      <button
                        onClick={handleSave}
                        disabled={isSaved}
                        className={`px-3 py-2 ${isSaved ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"} text-white rounded-lg flex items-center text-base`}
                        title={isSaved ? "Already saved" : "Save this email"}
                      >
                        <FiSave className="mr-1" size={16} /> {isSaved ? "Saved" : "Save"}
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-white/30 rounded-xl text-gray-800 overflow-y-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `Subject: ${
                          generatedEmail.subject || ""
                        }<br /><br />${(generatedEmail.body || "").trim().replace(
                          /\n/g,
                          "<br />"
                        )}<br /><br />${(generatedEmail.outro || "")
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

export default EmailGen;