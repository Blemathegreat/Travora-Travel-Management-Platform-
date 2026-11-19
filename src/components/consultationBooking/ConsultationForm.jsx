import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { images } from "../../assets/Photo";
import { api } from "../../utils/apiClient";
import { showError } from "../../utils/toastConfig";
import { useAuth } from "../../context/AuthContext";

const INITIAL_STATE = {
  identity: "",
  age: "",
  email: "",
  phone: "",
  serviceId: "",
  date: "",
  time: "",
  mode: "video",
  description: "",
  agreeToEmail: false,
  confirmation: false,
  marketingConsent: false,
};

// Same rules as the backend. The backend is the real security; this is only a courtesy.
const validateField = (name, value) => {
  // marketingConsent is optional, and `mode` always has a value
  if (name === "marketingConsent" || name === "mode") return "";

  if (!value) return "This field is required";

  switch (name) {
    case "email":
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email address";
      break;
    case "phone":
      if (!/^(\+234|0)\d{10}$/.test(value)) return "Use a Nigerian number like 08012345678 or +2348012345678";
      break;
    case "age":
      if (Number(value) < 18 || Number(value) > 100) return "Please enter a valid age between 18 and 100";
      break;
    case "identity":
      if (value.trim().length < 2) return "Please enter your full name";
      break;
    case "description":
      if (value.trim().length < 10) return "Please provide a more detailed description (at least 10 characters)";
      break;
    default:
      break;
  }
  return "";
};

// Our apiClient returns the parsed JSON itself. Backends often wrap it as
// { data: ... } or { data: { services: [...] } }, so we unwrap in one place.
const pick = (res, key) => {
  const body = res?.data ?? res;
  if (Array.isArray(body)) return body;
  return body?.[key] ?? res?.[key] ?? [];
};

// "10:00" -> "10:00 AM"
const formatTime = (time) => {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${suffix}`;
};

// "2026-11-02" -> "Mon, 2 Nov 2026"
const formatDate = (date) =>
  new Intl.DateTimeFormat("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));

export default function ConsultationForm() {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [booked, setBooked] = useState(null); // holds the confirmed booking for the success popup

  // Load the real services and free times from the backend
  async function loadOptions() {
    try {
      const [servicesRes, slotsRes] = await Promise.all([
        api.get("/api/consultations/services"),
        api.get("/api/consultations/slots"),
      ]);
      setServices(pick(servicesRes, "services"));
      setSlots(pick(slotsRes, "slots"));
    } catch (err) {
      showError(err.message);
    } finally {
      setOptionsLoading(false);
    }
  }

  useEffect(() => {
    loadOptions();
  }, []);

  // Pre-fill the email of the logged-in user (they can still change it)
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => (prev.email ? prev : { ...prev, email: user.email }));
    }
  }, [user]);

  // Dates that have at least one free time, and the times for the chosen date
  const availableDates = useMemo(() => [...new Set(slots.map((s) => s.date))], [slots]);
  const timesForDate = useMemo(() => slots.filter((s) => s.date === formData.date), [slots, formData.date]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setFormData((prev) => {
      const next = { ...prev, [name]: fieldValue };
      if (name === "date") next.time = ""; // a new date means the old time may not exist
      return next;
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, fieldValue) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(formData).forEach(([name, value]) => {
      const message = validateField(name, value);
      if (message) newErrors[name] = message;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const chosenSlot = slots.find((s) => s.date === formData.date && s.time === formData.time);
    if (!chosenSlot) {
      setErrors((prev) => ({ ...prev, time: "Please choose an available time" }));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/consultations", {
        serviceId: Number(formData.serviceId),
        slotId: chosenSlot.id,
        contactName: formData.identity.trim(),
        contactEmail: formData.email.trim(),
        contactPhone: formData.phone.trim(),
        age: Number(formData.age),
        notes: formData.description.trim(),
        mode: formData.mode,
        agreeToEmail: formData.agreeToEmail,
        confirmation: formData.confirmation,
        marketingConsent: formData.marketingConsent,
      });

      setBooked({
        reference: (res?.data ?? res)?.consultation?.reference ?? (res?.data ?? res)?.reference,
        date: chosenSlot.date,
        time: chosenSlot.time,
      });
      setFormData({ ...INITIAL_STATE, email: user?.email || "" });
      setErrors({});
      loadOptions(); // the time we just took must disappear from the list
    } catch (err) {
      showError(err.message);
      loadOptions(); // if someone else took the time first, show the fresh list
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass = "w-full h-11 border border-gray-300 px-3 outline-none focus:border-gray-500";
  const selectClass = "w-full h-11 border border-gray-300 px-3 bg-white outline-none focus:border-gray-500";

  return (
    <div className="min-h-screen flex items-center justify-center py-10 px-4">
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

        {/* Gate: booking needs an account, because the booking belongs to a user */}
        {authLoading ? (
          <p className="text-center text-gray-500">Checking your session...</p>
        ) : !user ? (
          <div className="text-center py-10">
            <p className="text-gray-700 mb-6">Please log in or create an account to book a consultation.</p>
            <div className="flex justify-center gap-4">
              <Link
                to="/login"
                state={{ from: location }}
                className="px-8 h-11 inline-flex items-center bg-[#001F3F] text-white font-medium hover:opacity-90 transition"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-8 h-11 inline-flex items-center border border-[#001F3F] text-[#001F3F] font-medium hover:bg-gray-50 transition"
              >
                Create account
              </Link>
            </div>
          </div>
        ) : (
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
                  placeholder="Your full name"
                  className={fieldClass}
                />
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
                  className={fieldClass}
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
                  className={fieldClass}
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
                  className={fieldClass}
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
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectClass}
                >
                  <option value="">{optionsLoading ? "Loading services..." : "Select a service"}</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.serviceId && <p className="text-red-500 text-xs mt-1">{errors.serviceId}</p>}
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Choose Appointment Date <span className="text-red-500">*</span>
                </label>
                <select
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={selectClass}
                >
                  <option value="">
                    {optionsLoading
                      ? "Loading dates..."
                      : availableDates.length === 0
                      ? "No dates available right now"
                      : "Select a date"}
                  </option>
                  {availableDates.map((date) => (
                    <option key={date} value={date}>
                      {formatDate(date)}
                    </option>
                  ))}
                </select>
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Select Appointment Time <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={!formData.date}
                    className={`${selectClass} disabled:bg-gray-100`}
                  >
                    <option value="">{formData.date ? "Select a time" : "Choose a date first"}</option>
                    {timesForDate.map((slot) => (
                      <option key={slot.id} value={slot.time}>
                        {formatTime(slot.time)}
                      </option>
                    ))}
                  </select>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    How should we meet? <span className="text-red-500">*</span>
                  </label>
                  <select name="mode" value={formData.mode} onChange={handleChange} className={selectClass}>
                    <option value="video">Video call</option>
                    <option value="phone">Phone call</option>
                    <option value="in_person">In person</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="pt-6 space-y-5">
              <label className="flex items-start gap-3 text-sm text-gray-700">
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
                <span>I understand that I may receive marketing information from Viaggio Abroad...</span>
              </label>
            </div>

            {/* Button */}
            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={isSubmitting || optionsLoading}
                className="w-52 h-11 bg-[#001F3F] text-white font-medium hover:opacity-90 transition disabled:opacity-60"
              >
                {isSubmitting ? "Booking..." : "Continue"}
              </button>
            </div>
          </form>
        )}

        {/* Success popup: the booking is saved in the database */}
        {booked && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-40" onClick={() => setBooked(null)} />
            <div className="bg-white rounded-lg shadow-lg z-10 max-w-lg w-[90%] p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4">Booking confirmed</h2>
              <div className="my-6 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-yellow-300 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-700 mb-1">
                {formatDate(booked.date)} at {formatTime(booked.time)}
              </p>
              {booked.reference && (
                <p className="text-sm text-gray-500 mb-6">
                  Your reference: <strong>{booked.reference}</strong>
                </p>
              )}
              <button onClick={() => setBooked(null)} className="px-6 py-2 bg-[#0b4da0] text-white rounded">
                Okay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}