import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { images } from '../../assets/Photo';
import { showSuccess } from '../../utils/toastConfig';
import VerificationModel from './VerificationModel.jsx';

export default function SignUp() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Phone: "",
    Email: "",
    Password: "",
    ConfirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validate(name, value, formData);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validate = (name, value, data) => {
    let error = "";
    
    if (!value) {
      error = "This field is required";
      return error;
    }

    switch (name) {
      case "FirstName":
      case "LastName":
        if (value.length < 3) {
          error = "Must be at least 3 characters";
        }
        break;
      case "Phone":
        if (!/^\d{11}$/.test(value)) {
          error = "Must be a valid 10-digit phone number";
        }
        break;
      case "Email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Must be a valid email address";
        }
        break;
      case "Password":
        if (value.length < 6) {
          error = "Must be at least 6 characters";
        }
        break;
      case "ConfirmPassword":
        if (value !== data.Password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};

    if (isSignUp) {
      Object.keys(formData).forEach((key) => {
        const error = validate(key, formData[key], formData);
        if (error) {
          newErrors[key] = error;
        }
      });
    } else {
      ['Email', 'Password'].forEach((key) => {
        const error = validate(key, formData[key], formData);
        if (error) {
          newErrors[key] = error;
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isSignUp) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code);
        setShowModal(true);
        console.log('Verification code:', code);

        setFormData({
          FirstName: '',
          LastName: '',
          Phone: '',
          Email: '',
          Password: '',
          ConfirmPassword: '',
        });

        showSuccess('Registration successful! Verify your email to activate your account.');
      } else {
        showSuccess('Welcome back! Redirecting to your dashboard...');
        navigate('/ambassador/dashboard');
      }
    }

    setIsSubmitting(false);
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setFormData({
      FirstName: '',
      LastName: '',
      Phone: '',
      Email: '',
      Password: '',
      ConfirmPassword: '',
    });
  };

  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gray-300 p-4'>
      <div className='w-full max-w-4xl bg-white rounded-[50px] py-16 px-6 md:px-12'>
        <div className='max-w-2xl mx-auto mb-8 text-center'>
          <h1 className='text-gray-900 text-2xl md:text-[32px] font-bold mb-2'>
            {isSignUp ? 'Register as Ambassador' : 'Login'}
          </h1>
          <p className='text-gray-500 text-base md:text-[20px]'>
            {isSignUp ? 'Please, enter your registration information' : 'Please, enter your login credentials'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className='max-w-2xl mx-auto flex flex-col gap-6'>
          {/* First Name and Last Name Row - Only show on signup */}
          {isSignUp && (
            <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='First name'
                  name='FirstName'
                  value={formData.FirstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-[#D3D6DDAD] h-[68px] rounded-[5px] text-gray-700 text-[16px] py-6 px-4 outline-none focus:ring-2 focus:ring-[#345867] transition-all ${
                    errors.FirstName ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.FirstName && (
                  <p className='text-red-500 text-sm mt-1 ml-1'>{errors.FirstName}</p>
                )}
              </div>

              <div className='flex-1'>
                <input
                  type='text'
                  placeholder='Last name'
                  name='LastName'
                  value={formData.LastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-[#D3D6DDAD] h-[68px] rounded-[5px] text-gray-700 text-[16px] py-6 px-4 outline-none focus:ring-2 focus:ring-[#345867] transition-all ${
                    errors.LastName ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.LastName && (
                  <p className='text-red-500 text-sm mt-1 ml-1'>{errors.LastName}</p>
                )}
              </div>
            </div>
          )}

          {/* Phone and Email Row - Only show phone on signup */}
          <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
            {isSignUp && (
              <div className='flex-1'>
                <input
                  type='tel'
                  placeholder='Phone number'
                  name='Phone'
                  value={formData.Phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-[#D3D6DDAD] h-[68px] rounded-[5px] text-gray-700 text-[16px] py-6 px-4 outline-none focus:ring-2 focus:ring-[#345867] transition-all ${
                    errors.Phone ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.Phone && (
                  <p className='text-red-500 text-sm mt-1 ml-1'>{errors.Phone}</p>
                )}
              </div>
            )}

            <div className='flex-1'>
              <input
                type='email'
                placeholder='Email'
                name='Email'
                value={formData.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full bg-[#D3D6DDAD] h-[68px] rounded-[5px] text-gray-700 text-[16px] py-6 px-4 outline-none focus:ring-2 focus:ring-[#345867] transition-all ${
                  errors.Email ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.Email && (
                <p className='text-red-500 text-sm mt-1 ml-1'>{errors.Email}</p>
              )}
            </div>
          </div>

          {/* Password Row */}
          <div className='flex flex-col md:flex-row gap-4 md:gap-6'>
            <div className='flex-1'>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  name='Password'
                  value={formData.Password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full bg-[#D3D6DDAD] h-[68px] rounded-[5px] text-gray-700 text-[16px] py-6 px-4 pr-12 outline-none focus:ring-2 focus:ring-[#345867] transition-all ${
                    errors.Password ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                <img
                  src={images.hide}
                  alt='toggle password'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'
                />
              </div>
              {errors.Password && (
                <p className='text-red-500 text-sm mt-1 ml-1'>{errors.Password}</p>
              )}
            </div>

            {/* Confirm Password - Only show on signup */}
            {isSignUp && (
              <div className='flex-1'>
                <div className='relative'>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder='Confirm Password'
                    name='ConfirmPassword'
                    value={formData.ConfirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full bg-[#D3D6DDAD] h-[68px] rounded-[5px] text-gray-700 text-[16px] py-6 px-4 pr-12 outline-none focus:ring-2 focus:ring-[#345867] transition-all ${
                      errors.ConfirmPassword ? 'ring-2 ring-red-500' : ''
                    }`}
                  />
                  <img
                    src={images.hide}
                    alt='toggle password'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 cursor-pointer opacity-60 hover:opacity-100 transition-opacity'
                  />
                </div>
                {errors.ConfirmPassword && (
                  <p className='text-red-500 text-sm mt-1 ml-1'>{errors.ConfirmPassword}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full h-[56px] bg-[#345867] text-white text-base md:text-[20px] font-bold rounded-[10px] hover:bg-[#2a4653] transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          >
            {isSubmitting ? 'Processing...' : (isSignUp ? 'Register' : 'Login')}
          </button>

          {/* Toggle Auth Mode */}
          <p className='text-center text-gray-600'>
            {isSignUp ? (
              <>
                Already registered?{' '}
                <button
                  type='button'
                  onClick={toggleAuthMode}
                  className='text-[#345867] font-semibold hover:underline'
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  type='button'
                  onClick={toggleAuthMode}
                  className='text-[#345867] font-semibold hover:underline'
                >
                  Register
                </button>
              </>
            )}
          </p>
        </form>
      </div>
        <VerificationModel
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            navigate('/login');
          }}
          correctCode={generatedCode}
        />
    </div>
  );
}