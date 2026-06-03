import React, { useState } from "react";
import { images } from "../../assets/Photo";


const INITIAL_STATE = {
  identity: "",
  email: "",
  phone: "",
  service: "",
  time: "",
  date: "",
  description: "",
  agreeToEmail: false,
  confirmation: false,
  marketingConsent: false,
};


const validateField = (name, value) => {
  let error = ""  // ✅ declare once

  if (!value) {
    error = "This field is required"  // ✅ assign to error
  }

  switch (name) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email address"  // ✅ assign to error
      }
      break;
    case "phone":
      if (!/^[0-9]{11}$/.test(value)) {
        error = "Please enter a valid phone number"
      }
      break;
    case "age":
      if (value < 18 || value > 100) {
        error = "Please enter a valid age between 18 and 100"
      }
      break;
    case "description":
      if (value.length < 10) {
        error = "Please provide a more detailed description (at least 10 characters)"
      }
      break;
    default:
      break;
  }

  return error  // ✅ ONE return, OUTSIDE the switch — this is the only fix needed
}

export default function ConsultationForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({}); // ✅ plural — it's always an object
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
      if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // ✅ Validate a single field when user leaves it
  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    const errorMessage = validateField(name, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // ✅ 

    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const errorMessage = validateField(name, value);
      if (errorMessage) {
        newErrors[name] = errorMessage;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // If the selected service requires payment, open confirmation modal first
      if (formData.service === "paid_consultation") {
        setShowConfirmModal(true);
        return;
      }

      console.log("Form submitted:", formData);
      setFormData(INITIAL_STATE); // ✅ reuse the same initial shape — no mismatched keys
      setShowSuccessModal(true);
    }
  };

  const handleConfirmCancel = () => {
    setShowConfirmModal(false);
  }

  const handleConfirmYes = () => {
    // Simulate payment processing here (integrate real gateway when ready)
    setShowConfirmModal(false);
    setShowSuccessModal(true);
    // Reset the form after successful payment
    setFormData(INITIAL_STATE);
  }

  return (
    <div className="min-h-screen  flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-4xl bg-white px-8 md:px-14 py-10">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={images.viaggio} alt="Viaggio Abroad" className="h-12 object-contain" />
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">Welcome to Viaggio Abroad</h1>
          <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
            Please complete the consultation form below to enable us to provide you with the most
            suitable experience. Ensure that all information provided is accurate.
          </p>
        </div>

        {/* ✅ onSubmit goes on the form tag, not a button */}
        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Who are you <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="identity"
                value={formData.identity}
                onChange={handleChange}   
                onBlur={handleBlur}       
                className="w-full h-11 border border-gray-300 px-3 outline-none focus:border-gray-500"
              />
              {/* ✅ Always show error message below each field */}
              {errors.identity && <p className="text-red-500 text-xs mt-1">{errors.identity}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-11 border border-gray-300 px-3 outline-none focus:border-gray-500"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-11 border border-gray-300 px-3 outline-none focus:border-gray-500"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-11 border border-gray-300 px-3 outline-none focus:border-gray-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Service Selection <span className="text-red-500">*</span>
              </label>
              <select
                name="service"   // ✅ added name
                value={formData.service}
                onChange={handleChange}  // ✅ added
                onBlur={handleBlur}
                className="w-full h-11 border border-gray-300 px-3 bg-white outline-none focus:border-gray-500"
              >
                <option value="">Select a service</option>
                <option value="visa">Visa and Visa Application</option>
                <option value="scholarship">Scholarship Search and Application Assistance</option>
                <option value="travel">Travel Bookings and Airport Transfers</option>
                <option value="housing">Housing (Local and Abroad)</option>
                <option value="paid_consultation">Paid Consultation (NGN 200)</option>
              </select>
              {errors.service && <p className="text-red-500 text-xs mt-1">{errors.service}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Choose Appointment Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-11 border border-gray-300 px-3 outline-none focus:border-gray-500"
              />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Service request brief description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="5"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-gray-300 p-3 resize-none outline-none focus:border-gray-500"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Select Appointment Time <span className="text-red-500">*</span>
              </label>
              <select
                name="time"   // ✅ added name
                value={formData.time}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full h-11 border border-gray-300 px-3 bg-white outline-none focus:border-gray-500"
              >
                <option value="">Select a time</option>
                <option value="09:00">09:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="13:00">01:00 PM</option>
                <option value="15:00">03:00 PM</option>
              </select>
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="pt-6 space-y-5">
            <label className="flex items-start gap-3 text-sm text-gray-700">
              {/* ✅ Controlled checkbox needs both checked + onChange */}
              <input
                type="checkbox"
                name="agreeToEmail"
                checked={formData.agreeToEmail}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1"
              />
              <span>
                I agree to my email being stored and used to receive communications about my bookings.
                <span className="text-red-500"> *</span>
              </span>
            </label>
            {errors.agreeToEmail && <p className="text-red-500 text-xs">{errors.agreeToEmail}</p>}

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="confirmation"
                checked={formData.confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                className="mt-1"
              />
              <span>
                I confirm that the information provided is accurate
                <span className="text-red-500"> *</span>
              </span>
            </label>
            {errors.confirmation && <p className="text-red-500 text-xs">{errors.confirmation}</p>}

            <label className="flex items-start gap-3 text-sm text-gray-700">
              <input
                type="checkbox"
                name="marketingConsent"
                checked={formData.marketingConsent}
                onChange={handleChange}
                className="mt-1"
              />
              <span>
                I understand that I may receive marketing information from Viaggio Abroad...
              </span>
            </label>
          </div>

          {/* Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="w-52 h-11 bg-[#001F3F] text-white font-medium hover:opacity-90 transition"
            >
              Continue
            </button>
          </div>
        </form>

        {/* Confirmation Modal: About to Make a Payment */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={handleConfirmCancel} />
            <div className="bg-white rounded-lg shadow-lg z-10 max-w-md w-[90%] p-6 text-center">
              <h3 className="text-lg font-semibold mb-3">You're About to Make a Payment</h3>
              <p className="text-sm text-gray-700 mb-6">You're about to pay <strong>NGN 200</strong> to confirm your appointment booking. Are you sure you want to proceed?</p>
              <div className="flex justify-center gap-4">
                <button onClick={handleConfirmCancel} className="px-4 py-2 border rounded">Cancel</button>
                <button onClick={handleConfirmYes} className="px-4 py-2 bg-[#0b4da0] text-white rounded">Yes</button>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal: Payment successful */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setShowSuccessModal(false)} />
            <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-[90%] p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Payment successful</h2>
              <div className="my-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-yellow-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <button onClick={() => setShowSuccessModal(false)} className="px-6 py-2 bg-[#0b4da0] text-white rounded">Okay</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}