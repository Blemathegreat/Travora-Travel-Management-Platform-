import React, { useState } from 'react';
import { showInfo } from '../../utils/toastConfig';

export default function PayoutModal({ isOpen, onClose, onContinue }) {
  const [agreed, setAgreed] = useState(false);

  // Don't render if modal is not open
  if (!isOpen) return null;

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (agreed) {
      onContinue(); // Move to next modal
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 flex flex-col items-center gap-5 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 text-center">
          Payout Account Set-up
        </h3>

        {/* Illustration */}
        <div className="w-28 h-28 rounded-full bg-teal-50 flex items-center justify-center">
          <svg viewBox="0 0 80 80" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* bag */}
            <ellipse cx="40" cy="52" rx="22" ry="18" fill="#F59E0B" />
            <path d="M25 52 Q27 34 40 30 Q53 34 55 52" fill="#FBBF24" />
            <text x="34" y="57" fontSize="16" fill="white" fontWeight="bold">$</text>
            {/* coin */}
            <circle cx="58" cy="36" r="10" fill="#34D399" />
            <text x="53" y="41" fontSize="12" fill="white" fontWeight="bold">$</text>
            {/* arrow up */}
            <circle cx="26" cy="30" r="9" fill="#456573" />
            <path d="M26 35 L26 25 M22 29 L26 25 L30 29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Body text */}
        <p className="text-sm text-gray-500 text-center leading-relaxed">
          To receive your earnings from your referrals, please set up your preferred
          payout account. This ensures timely and secure transfer of funds to your
          linked payment method.
        </p>

        {/* T&C Checkbox */}
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[#456573] cursor-pointer"
          />
          <span className="text-xs text-gray-600">
            I have read and accept the{' '}
            <button
              type="button"
              className="text-[#456573] hover:underline font-medium"
              onClick={() => showInfo('Terms & Conditions page would open here')}
            >
              Terms &amp; Conditions
            </button>
          </span>
        </label>

        {/* Get Started Button */}
        <button
          disabled={!agreed}
          onClick={handleGetStarted}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            agreed
              ? 'bg-[#456573] hover:bg-[#3a5461] text-white shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Get Started
        </button>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}