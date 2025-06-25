import { useState, useEffect } from "react";
import { FiLoader, FiMail, FiCopy } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const History = () => {
  const [emails, setEmails] = useState([]);
  const [tones, setTones] = useState([]);
  const [selectedTone, setSelectedTone] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("generated");
  const [modalEmail, setModalEmail] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTones = async () => {
      try {
        const response = await fetch("https://email-toner-backend.onrender.com/tone/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTones(["all", ...data.tones, "Other"]);
      } catch (error) {
        console.error("Error fetching tones:", error);
        setTones(["all", "Friendly", "Professional", "Casual", "Other"]);
      }
    };
    fetchTones();
  }, [token]);

  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const toneParam = selectedTone === "Other" ? "other" : selectedTone;
        const response = await fetch(
          `https://email-toner-backend.onrender.com/email/history?tone=${toneParam}&page=${currentPage}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setEmails(data.emails);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching emails:", error);
        toast.error("Failed to fetch email history. Please try again.", { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmails();
  }, [selectedTone, currentPage, token]);

  const filteredEmails = emails.filter((email) =>
    activeTab === "generated" ? email.isGenerated : !email.isGenerated
  );

  const handleToneChange = (e) => {
    setSelectedTone(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const openModal = (email) => {
    setModalEmail(email.rewrittenEmail || { subject: "", body: "", outro: "" });
  };

  const closeModal = () => {
    setModalEmail(null);
  };

  const handleCopy = () => {
    if (modalEmail) {
      const emailText = `${modalEmail.subject}\n\n${modalEmail.body.trim()}\n\n${modalEmail.outro.trim()}`;
      navigator.clipboard.writeText(emailText).then(() => {
        toast.success("Email copied to clipboard!", { autoClose: 3000 });
      }).catch((err) => console.error("Copy failed:", err));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-[#AFDBF5] to-[#87CEEB] px-4 pt-20 pb-24">
      <h1 className="text-3xl md:text-5xl font-extrabold text-black mb-8 mt-4 text-center drop-shadow-2xl">
        Email History
      </h1>
      <div className="w-full max-w-7xl">
        <div className="mb-4 flex justify-between items-center">
          <select
            value={selectedTone}
            onChange={handleToneChange}
            className="p-2 bg-white/30 text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab("generated")}
              className={`px-4 py-2 rounded-lg ${activeTab === "generated" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Generated
            </button>
            <button
              onClick={() => setActiveTab("regenerated")}
              className={`px-4 py-2 rounded-lg ${activeTab === "regenerated" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              Regenerated
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <FiLoader className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full bg-white/30 rounded-xl shadow-lg">
                <thead>
                  <tr className="bg-blue-100 text-gray-700">
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Occasion</th>
                    <th className="p-2 text-left">Recipient</th>
                    <th className="p-2 text-left">Tone</th>
                    <th className="p-2 text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmails.map((email) => (
                    <tr key={email.id} className="border-t">
                      <td className="p-2">{email.isGenerated ? "Generated" : "Regenerated"}</td>
                      <td className="p-2">{email.occasion}</td>
                      <td className="p-2">{email.recipientType}</td>
                      <td className="p-2">{email.tone}</td>
                      <td className="p-2">
                        <button
                          onClick={() => openModal(email)}
                          className="text-blue-500 hover:underline flex items-center"
                        >
                          <FiMail className="mr-1" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmails.length === 0 && (
                <p className="text-center text-gray-600 mt-4">No emails found.</p>
              )}
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                >
                  {page}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {modalEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md md:max-w-lg lg:max-w-2xl w-full max-h-[90vh]">
            <h2 className="text-xl font-semibold mb-4">{modalEmail.subject}</h2>
            <div className="max-h-96 overflow-y-auto mb-4">
              <p className="mb-2 whitespace-pre-wrap">{modalEmail.body}</p>
              <p className="whitespace-pre-wrap">{modalEmail.outro}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <FiCopy className="mr-1" /> Copy
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

export default History;