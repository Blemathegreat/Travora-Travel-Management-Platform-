import React, { useState } from 'react';

export default function AccountSetupModal({ isOpen, onClose, onBack }) {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════
  const [formData, setFormData] = useState({
    paymentMethod: 'Mobile Money',
    network: 'MTN',
    mobileNumber: '',
    bankName: '',
    accountNumber: '',
    paypalEmail: '',
    walletAddress: ''
  });

  const [errors, setErrors] = useState({});

  // Don't render if modal is not open
  if (!isOpen) return null;

  // ═══════════════════════════════════════════════════════════════════════════
  // CONSTANTS
  // ═══════════════════════════════════════════════════════════════════════════
  const paymentMethods = ['Mobile Money', 'Bank Transfer', 'PayPal', 'Crypto'];
  const networks = ['MTN', 'Airtel', 'Glo', '9mobile'];

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  // Handle ALL input changes using name/value pattern
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form based on payment method
  const validateForm = () => {
    const newErrors = {};

    // Mobile Money validation
    if (formData.paymentMethod === 'Mobile Money') {
      if (!formData.network) {
        newErrors.network = 'Please select a network';
      }
      if (!formData.mobileNumber) {
        newErrors.mobileNumber = 'Please enter your mobile wallet number';
      } else if (!/^\d{10,11}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Please enter a valid mobile number (10-11 digits)';
      }
    }

    // Bank Transfer validation
    if (formData.paymentMethod === 'Bank Transfer') {
      if (!formData.bankName) {
        newErrors.bankName = 'Please enter your bank name';
      }
      if (!formData.accountNumber) {
        newErrors.accountNumber = 'Please enter your account number';
      } else if (!/^\d{10}$/.test(formData.accountNumber)) {
        newErrors.accountNumber = 'Account number must be 10 digits';
      }
    }

    // PayPal validation
    if (formData.paymentMethod === 'PayPal') {
      if (!formData.paypalEmail) {
        newErrors.paypalEmail = 'Please enter your PayPal email';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.paypalEmail)) {
        newErrors.paypalEmail = 'Please enter a valid email address';
      }
    }

    // Crypto validation
    if (formData.paymentMethod === 'Crypto') {
      if (!formData.walletAddress) {
        newErrors.walletAddress = 'Please enter your wallet address';
      } else if (formData.walletAddress.length < 26) {
        newErrors.walletAddress = 'Please enter a valid wallet address (min 26 characters)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Form submitted successfully:', formData);
      alert(`Account linked successfully!\n\nPayment Method: ${formData.paymentMethod}`);
      onClose();
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">Account Set-up</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Payment Method Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#456573] focus:border-[#456573] transition-colors"
              >
                {paymentMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>

            {/* ═══════════ MOBILE MONEY FIELDS ═══════════ */}
            {formData.paymentMethod === 'Mobile Money' && (
              <>
                {/* Network Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Network
                  </label>
                  <select
                    name="network"
                    value={formData.network}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#456573] focus:border-[#456573] transition-colors"
                  >
                    {networks.map(network => (
                      <option key={network} value={network}>{network}</option>
                    ))}
                  </select>
                  {errors.network && (
                    <p className="text-xs text-red-500 mt-1">{errors.network}</p>
                  )}
                </div>

                {/* Mobile Number Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile wallet number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="0545165001"
                    maxLength="11"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#456573] focus:border-[#456573] transition-colors"
                  />
                  {errors.mobileNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.mobileNumber}</p>
                  )}
                </div>
              </>
            )}

            {/* ═══════════ BANK TRANSFER FIELDS ═══════════ */}
            {formData.paymentMethod === 'Bank Transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456573]"
                  />
                  {errors.bankName && (
                    <p className="text-xs text-red-500 mt-1">{errors.bankName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    placeholder="Enter account number"
                    maxLength="10"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456573]"
                  />
                  {errors.accountNumber && (
                    <p className="text-xs text-red-500 mt-1">{errors.accountNumber}</p>
                  )}
                </div>
              </>
            )}

            {/* ═══════════ PAYPAL FIELD ═══════════ */}
            {formData.paymentMethod === 'PayPal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PayPal Email
                </label>
                <input
                  type="email"
                  name="paypalEmail"
                  value={formData.paypalEmail}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456573]"
                />
                {errors.paypalEmail && (
                  <p className="text-xs text-red-500 mt-1">{errors.paypalEmail}</p>
                )}
              </div>
            )}

            {/* ═══════════ CRYPTO FIELD ═══════════ */}
            {formData.paymentMethod === 'Crypto' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wallet Address
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formData.walletAddress}
                  onChange={handleChange}
                  placeholder="Enter your crypto wallet address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#456573]"
                />
                {errors.walletAddress && (
                  <p className="text-xs text-red-500 mt-1">{errors.walletAddress}</p>
                )}
              </div>
            )}

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-6 bg-[#456573] hover:bg-[#3a5461] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Link Account
          </button>
        </form>
      </div>
    </div>
  );
}