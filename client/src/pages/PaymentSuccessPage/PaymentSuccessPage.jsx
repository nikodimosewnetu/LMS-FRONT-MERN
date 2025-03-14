import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [txRef, setTxRef] = useState(null);

  useEffect(() => {
    console.log("Location search:", location.search); // Debugging log

    const params = new URLSearchParams(location.search);
    const tx_ref = params.get("tx_ref");

    if (tx_ref) {
      setTxRef(tx_ref);
      console.log("Transaction Reference:", tx_ref);
    } else {
      console.warn("Transaction Reference is missing!");
    }
  }, [location]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
        <div className="text-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-16 w-16 mx-auto text-green-500"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-11.707a1 1 0 00-1.414 0L9 9.586 8.707 9.293a1 1 0 00-1.414 1.414l1 1a1 1 0 001.414 0l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="text-3xl font-semibold text-gray-900">Payment Successful</h2>
        </div>

        <p className="text-lg text-gray-700 mb-4 text-center">
          Your payment has been successfully processed. Thank you for your purchase!
        </p>

        <p className="text-gray-600 mb-6 text-center">
          Transaction Reference:{" "}
          <span className="font-semibold text-gray-800">{txRef || "N/A"}</span>
        </p>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/student-courses")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
