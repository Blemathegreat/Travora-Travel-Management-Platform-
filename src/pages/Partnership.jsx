import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { images } from '../assets/Photo';

const initialForm = {
  companyName: '',
  businessType: '',
  country: '',
  location: '',
  phoneNumber: '',
  emailAddress: '',
  partnershipInterest: '',
  collaborationDetails: '',
};

const validateField = (name, value) => {
  if (!value.trim()) return 'This field is required';
  if (name === 'emailAddress' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return 'Enter a valid email address';
  }
  if (name === 'phoneNumber' && !/^\+?[0-9\s-]{7,20}$/.test(value)) {
    return 'Enter a valid phone number';
  }
  if (name === 'companyName' && value.length < 3) {
    return 'Use at least 3 characters';
  }
  if (name === 'collaborationDetails' && value.length < 20) {
    return 'Please describe your collaboration in 20+ characters';
  }
  return '';
};

export default function Partnership() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = Object.keys(initialForm).reduce((acc, field) => {
      const error = validateField(field, formData[field]);
      if (error) acc[field] = error;
      return acc;
    }, {});

    setErrors(nextErrors);
    setSubmitted(true);

    if (Object.keys(nextErrors).length === 0) {
      setShowModal(true);
      setFormData(initialForm);
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-12">

      {/* ✅ Centered with normal document flow — no absolute positioning */}
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">
          
          <div className="flex justify-center mb-4">
            <img src={images.viaggio} alt="Viaggio Abroad" className="h-12 object-contain" />
          </div>

          <h2 className="text-3xl font-bold text-[#0F0C3D]">Partnership submission</h2>
          <p className="mt-2 text-sm text-slate-500">Complete the details below and click Submit.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                  Business Name
                </label>
                <input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.companyName ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                  placeholder="Enter your business name"
                />
                {errors.companyName && <p className="mt-2 text-sm text-red-500">{errors.companyName}</p>}
              </div>

              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-slate-700">
                  Business Type
                </label>
                <input
                  id="businessType"
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.businessType ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                  placeholder="E.g. Travel agency, School, Corporate"
                />
                {errors.businessType && <p className="mt-2 text-sm text-red-500">{errors.businessType}</p>}
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-slate-700">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.country ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                  placeholder="Country"
                />
                {errors.country && <p className="mt-2 text-sm text-red-500">{errors.country}</p>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.location ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                  placeholder="City, State or Region"
                />
                {errors.location && <p className="mt-2 text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.phoneNumber ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                  placeholder="+123 456 7890"
                />
                {errors.phoneNumber && <p className="mt-2 text-sm text-red-500">{errors.phoneNumber}</p>}
              </div>

              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.emailAddress ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                  placeholder="you@company.com"
                />
                {errors.emailAddress && <p className="mt-2 text-sm text-red-500">{errors.emailAddress}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="partnershipInterest" className="block text-sm font-medium text-slate-700">
                Partnership Interest
              </label>
              <input
                id="partnershipInterest"
                name="partnershipInterest"
                value={formData.partnershipInterest}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.partnershipInterest ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                placeholder="What type of partnership are you interested in?"
              />
              {errors.partnershipInterest && <p className="mt-2 text-sm text-red-500">{errors.partnershipInterest}</p>}
            </div>

            <div>
              <label htmlFor="collaborationDetails" className="block text-sm font-medium text-slate-700">
                Briefly describe your collaboration
              </label>
              <textarea
                id="collaborationDetails"
                name="collaborationDetails"
                rows="5"
                value={formData.collaborationDetails}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`mt-2 w-full rounded-3xl border px-4 py-4 text-sm outline-none transition ${errors.collaborationDetails ? 'border-red-500 ring-red-100' : 'border-slate-300 focus:border-[#05FBE6] ring-slate-200/50'}`}
                placeholder="Tell us about your collaboration objectives, audience, and expected outcomes."
              />
              {errors.collaborationDetails && <p className="mt-2 text-sm text-red-500">{errors.collaborationDetails}</p>}
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#001721] px-6 py-4 text-base font-semibold text-white transition hover:bg-[#0a1b25]"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg rounded-[32px] bg-white p-8 text-center shadow-2xl shadow-slate-900/20"
          >
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#E9FAF8] text-[#0F766E]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-[#0F0C3D]">Partnership submission successful</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Thank you for reaching out. Our partnerships team will review your request and contact you shortly.
            </p>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="mt-8 inline-flex rounded-full bg-[#001721] px-8 py-3 text-sm font-semibold text-white transition hover:bg-[#0a1b25]"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}