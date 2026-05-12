import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ Email: '', Password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (name, value) => {
    if (!value) return 'This field is required';
    if (name === 'Email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Enter a valid email address';
    }
    if (name === 'Password' && value.length < 6) {
      return 'Password must be at least 6 characters';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = {
      Email: validate('Email', formData.Email),
      Password: validate('Password', formData.Password),
    };

    const hasErrors = Object.values(validationErrors).some(Boolean);
    setErrors(validationErrors);

    if (!hasErrors) {
      alert('Welcome back! Redirecting to your dashboard...');
      navigate('/ambassador/dashboard');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white rounded-[40px] p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#012E41] mb-2">Ambassador Login</h1>
          <p className="text-gray-600">Sign in to access your dashboard and campaign analytics.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Enter your password"
            />
            {errors.Password && <p className="mt-2 text-sm text-red-500">{errors.Password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-[#345867] py-4 text-white font-semibold transition hover:bg-[#2a4755] disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New here?{' '}
          <Link to="/ambassador" className="font-semibold text-[#345867] hover:underline">
            Register as Ambassador
          </Link>
        </p>
      </div>
    </div>
  );
}
