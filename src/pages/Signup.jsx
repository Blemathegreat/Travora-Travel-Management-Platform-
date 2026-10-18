import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toastConfig';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
 const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');

  const [formData, setFormData] = useState({ FirstName: '', LastName: '', Email: '', Password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (name, value) => {
    if (!value) return 'This field is required';
    if ((name === 'FirstName' || name === 'LastName') && value.trim().length < 2) {
      return 'Must be at least 2 characters';
    }
    if (name === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Enter a valid email address';
    }
    if (name === 'Password') {
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/\d/.test(value)) return 'Password must contain at least one number';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = {
      FirstName: validate('FirstName', formData.FirstName),
      LastName: validate('LastName', formData.LastName),
      Email: validate('Email', formData.Email),
      Password: validate('Password', formData.Password),
    };

    const hasErrors = Object.values(validationErrors).some(Boolean);
    setErrors(validationErrors);

    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
     await register({
  firstName: formData.FirstName,
  lastName: formData.LastName,
  email: formData.Email,
  password: formData.Password,
  referralCode,
});

      showSuccess('Account created! Welcome to Travora.');
      navigate('/');
    } catch (err) {
      showError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-[40px] p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#012E41] mb-2">Create an Account</h1>
          <p className="text-gray-600">Sign up to book consultations and manage your trips.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                className={`w-full rounded-3xl border px-4 py-4 text-base outline-none transition ${errors.FirstName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ada"
              />
              {errors.FirstName && <p className="mt-2 text-sm text-red-500">{errors.FirstName}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                className={`w-full rounded-3xl border px-4 py-4 text-base outline-none transition ${errors.LastName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Lovelace"
              />
              {errors.LastName && <p className="mt-2 text-sm text-red-500">{errors.LastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              className={`w-full rounded-3xl border px-4 py-4 text-base outline-none transition ${errors.Email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="you@example.com"
            />
            {errors.Email && <p className="mt-2 text-sm text-red-500">{errors.Email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              className={`w-full rounded-3xl border px-4 py-4 text-base outline-none transition ${errors.Password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="At least 8 characters, with a number"
            />
            {errors.Password && <p className="mt-2 text-sm text-red-500">{errors.Password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-[#345867] py-4 text-white font-semibold transition hover:bg-[#2a4755] disabled:opacity-60"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#345867] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}