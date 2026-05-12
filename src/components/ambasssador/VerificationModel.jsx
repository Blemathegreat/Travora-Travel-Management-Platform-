import React, { useState } from "react";

export default function VerificationModel({ isOpen, onClose, onSuccess, correctCode }) {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");

  // If modal is not open, show nothing
  if (!isOpen) return null;

  const handleVerify = () => {
    if (userCode === correctCode) {
      alert("Verification successful ✅");
      setUserCode("");
      setError("");
      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } else {
      setError("Invalid code ❌");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[320px] text-center">
        <h2 className="text-lg font-bold mb-4">
          Enter Verification Code
        </h2>

        <input
          type="text"
          value={userCode}
          onChange={(e) => {
            setUserCode(e.target.value);
            setError("");
          }}
          placeholder="Enter code"
          className="border w-full p-2 mb-3 rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleVerify}
          className="bg-[#345867] text-white px-4 py-2 rounded mt-2 w-full"
        >
          Verify
        </button>

        <button
          onClick={onClose}
          className="block mt-3 text-sm text-gray-500 mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}