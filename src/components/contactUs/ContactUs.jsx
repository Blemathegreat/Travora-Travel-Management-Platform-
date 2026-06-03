import { images } from "../../assets/Photo";
import React, { useState } from "react";
import { toast } from 'react-toastify'

const INITIAL_STATE = {
  fullname: "",
  email: "",
  phone: "",
  message: "",
};

const validate = (name, value) => {
  let error = "";

  if (!value.trim()) {
    return "This field is required";
  }

  switch (name) {
    case "fullname":
      if (value.trim().length < 6) {
        error = "Full name must be at least 6 characters";
      }
      break;
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email address";
      }
      break;
    case "phone":
      if (!/^[0-9+()-]+$/.test(value)) {
        error = "Please enter a valid phone number";
      }
      break;
    case "message":
      if (value.trim().length < 10) {
        error = "Message must be at least 10 characters";
      }
      break;
    default:
      break;
  }

  return error;
};

export default function ViaggioForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ validate all fields on submit
    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const error = validate(name, value);
      if (error) newErrors[name] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form submitted:", formData);
      setFormData(INITIAL_STATE);
      toast.success('Message received — we will get back to you shortly')
    }
  };

  return (
    <div
      className="flex items-start justify-center p-4 md:p-8"
      style={{
        backgroundImage: `url(${images.contact})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-7xl rounded-xl overflow-hidden shadow-2xl">

        {/* LEFT: Form */}
        {/* ✅ onSubmit on the form tag, not the button */}
        <form onSubmit={handleSubmit} className="bg-white flex-1 px-6 py-8 md:px-8 md:py-10">
          <h2 className="text-sm font-semibold text-gray-900 mb-6 tracking-wide">
            Contact Us
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Full name</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-gray-200 focus:border-green-500 outline-none text-sm sm:text-base text-gray-800 py-3 px-3 bg-transparent transition-colors"
              />
              {errors.fullname && <p className="text-red-500 text-[10px] mt-1">{errors.fullname}</p>}
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-gray-200 focus:border-green-500 outline-none text-sm sm:text-base text-gray-800 py-3 px-3 bg-transparent transition-colors"
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Phone number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-gray-200 focus:border-green-500 outline-none text-sm sm:text-base text-gray-800 py-3 px-3 bg-transparent transition-colors"
              />
              {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-[11px] text-gray-400 mb-1">Message</label>
              <textarea
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full border border-gray-200 focus:border-green-500 outline-none text-sm sm:text-base text-gray-800 py-3 px-3 bg-transparent resize-none transition-colors"
              />
              {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 w-full md:w-auto bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-10 py-2.5 rounded transition-colors"
          >
            Submit
          </button>
        </form>

        {/* RIGHT: Branding */}
        <div className="relative flex-1 bg-[#0d2144] flex flex-col justify-between px-6 py-8 md:px-7 md:py-10 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-green-500 opacity-10 blur-2xl" />

          <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="text-2xl font-bold text-white leading-snug">
              Your{" "}
              <span className="text-green-400 underline decoration-green-400/40 underline-offset-2">
                Gateway
              </span>{" "}
              to<br />Travelling Abroad
            </h1>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-2 text-xs text-white/70">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.23 1.02L7.91 9.24a16 16 0 006.85 6.85l1.24-1.24a1 1 0 011.02-.23l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2C9.16 21 3 14.84 3 7V5z" />
                </svg>
                +234 (987) 654321
              </div>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@viaggiabroad.com
              </div>
            </div>
          </div>

          <div className="flex justify-center items-end pt-4">
            <img
              src={images.contact1}
              alt="Contact Us Illustration"
              className="w-full max-w-[320px] h-auto object-contain opacity-80"
            />
          </div>
        </div>

      </div>
    </div>
  );
}