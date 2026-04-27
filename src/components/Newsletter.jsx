import React, { useState } from 'react';
import { images, testimonials } from '../assets/Photo';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Subscribed with email:', email); 
    alert('Thank you for subscribing!');
    setEmail('');
    // Add your subscription logic here
  };

  return (
    <div className="w-full   p-4 md:p-10 lg:p-16">
      <div className="bg-white rounded-[20px] shadow-lg max-w-7xl mx-auto overflow-hidden">
        <div className="flex flex-col md:flex-row ">
          {/* Left Side - Image */}
          <div className="md:w-[45%] relative overflow-hidden">
            <img
              src={images.rectangle33}
              alt="Luxury villa with pool"
              className="w-full h-full object-cover min-h-[250px] md:min-h-full transform transition-transform duration-700 hover:scale-110"
            />
            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
          </div>

          {/* Right Side - Form */}
          <div className="md:w-[55%] bg-[#F3F3F3] p-8 md:p-10 flex flex-col justify-center">
            {/* Heading */}
            <h2 className="text-[#000000] text-2xl md:text-[40px] font-bold leading-tight mb-2 text-center">
              Get special offers,
            </h2>
            <h2 className="text-[#000000] text-2xl md:text-[40px] font-bold leading-tight mb-8 text-center">
              and more from Viaggio Abroad
            </h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className=" relative flex flex-col sm:flex-row items-center">
              {/* Email Input */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 w-full sm:w-auto px-5 py-3 rounded-full border border-gray-300 bg-white text-gray-700 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A1A] focus:border-transparent transition-all duration-300"
                required
              />

              {/* Subscribe Button */}
              <button
                type="submit"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className=" absolute right-[2px] px-8 py-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-xl whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;