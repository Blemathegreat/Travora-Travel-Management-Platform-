import React, { useState } from 'react'
import { images } from '../../assets/Photo'
import { services } from './ServiceData'

export default function Zervices() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeService, setActiveService] = useState(0); // Track which service content to display
  
  const servicePerPage = 3;
  const visibleServices = services.slice(currentPage, currentPage + servicePerPage);

  const nextSlide = () => {
    if (currentPage + servicePerPage < services.length) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat" 
        >
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#011826DE]/60 to-[#011826DE]/95 pointer-events-none"></div>
      
      {/* Main Content Container */}
      <div className='relative z-10'>
        
        {/* Hero Section */}
        <div className='flex flex-col items-center justify-center pt-16 pb-8 px-4 h-[500px] bg-cover bg-center bg-no-repeat' style={{backgroundImage: `url(${images.backgroundservice})`}}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#011826DE]/60 to-[#011826DE]/95 pointer-events-none"></div>
          <h1 className='text-3xl md:text-[40px] lg:text-5xl text-[#05FBE6] font-bold mb-4'>
            Our Services
          </h1>
          <div className='flex items-center gap-2 text-sm md:text-base'>
            <span className='text-white/70'>Home</span>
            <span className='text-white/70'>/</span>
            <span className='text-[#05FBE6]'>Our Services</span>
          </div>
        </div>

        {/* Service Cards Carousel */}
        <div className=' bg-[#05FBE6] mx-auto px-4 md:px-10 pt-4 mb-8'>
          <div className='flex gap-4 md:gap-6 overflow-hidden'>
            {visibleServices.map((service, index) => {
              const realIndex = currentPage + index; // Calculate the real index in the full services array
              return (
                <div
                  key={index}
                  onClick={() => setActiveService(realIndex)}
                  className={`flex-1 min-w-[250px] bg-cover bg-center bg-no-repeat md:min-w-[600px] p-6 h-[400px] rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                    activeService === realIndex
                      ? 'bg-[#05FBE6] border-[#05FBE6] text-[#011826]'
                      : 'bg-[#011826]/60 border-[#05FBE6]/30 text-white hover:border-[#05FBE6]/60'
                  }`}
               style={{backgroundImage: `url(${service.backgroundImages})`}} >
                  <h3 className='text-lg md:text-xl font-bold'>{service.title}</h3>
                </div>
              )
            })}
          </div>

          {/* Navigation Arrows Below Cards */}
          <div className='flex justify-center gap-3 mt-6'>
            <button
              onClick={prevSlide}
              disabled={currentPage === 0}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                currentPage === 0
                  ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                  : 'border-[#05FBE6] text-[#05FBE6] hover:bg-[#05FBE6] hover:text-[#011826]'
              }`}
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              disabled={currentPage + servicePerPage >= services.length}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                currentPage + servicePerPage >= services.length
                  ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                  : 'border-[#05FBE6] text-[#05FBE6] hover:bg-[#05FBE6] hover:text-[#011826]'
              }`}
            >
              →
            </button>
          </div>
        </div>

        {/* Service Content Section - This changes based on activeService */}
       {/* Service Content Section - This changes based on activeService */}
<div className='bg-[#011826]/80 backdrop-blur-sm'>
  <div className='max-w-[1070px] mx-auto px-4 py-12 md:py-16'>
    
    {/* Heading and Description */}
    <div className='mb-12'>
      <h2 className='text-2xl pl-4 md:pl-10 md:text-[35px] lg:text-4xl text-[#05FBE6] font-bold mb-6'>
        {services[activeService].context.heading}
      </h2>
      <ul className='list-disc list-outside pl-6 space-y-6 pl-4 md:pl-20 text-white/90 text-base md:text-[30px]'>
        {services[activeService].context.paragraph.map((para, index) => (
          <li key={index} className='leading-[133%] text-justify'>
            {para}
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>

{/* Why It Matters Section - OUTSIDE the constrained container */}
<div className='w-full bg-[#ffffff] py-16 md:py-20'>
  <div className=' px-6 md:px-8 lg:px-12'>
    <div className='flex flex-col md:flex-row justify-between gap-8 lg:gap-16 items-start'>
      
      {/* Single Static Image */}
      <div className='w-full md:w-5/12 lg:w-1/2 rounded-lg overflow-hidden flex-shrink-0'>
        <img 
          src={images.why} 
          alt="Why it matters illustration"
          className='w-full h-full object-cover'
        />
      </div>

      {/* Why It Matters Content */}
      <div className='w-full md:w-7/12 lg:w-1/2'>
        <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#011826] mb-4'>
          Why it Matters
        </h3>
        
        {/* Subtitle/Reason */}
        <p className='text-gray-700 text-sm md:text-base mb-8 leading-relaxed'>
          {services[activeService].why.reason}
        </p>

        {/* Matter Points with Icons */}
        <div className='space-y-6'>
          {services[activeService].why.whyItMatter.map((item, index) => (
            <div key={index} className='flex gap-4 items-start'>
              {/* Circular Icon Background */}
              <div className='flex-shrink-0 w-12 h-12 rounded-full bg-[#05FBE6]/10 flex items-center justify-center'>
                <img 
                  src={item.icon} 
                  alt={item.title} 
                  className='w-6 h-6'
                />
              </div>
              
              <div className='flex-1'>
                <h4 className='text-[#011826] font-semibold text-base md:text-lg mb-2'>
                  {item.title}
                </h4>
                <p className='text-gray-600 text-sm md:text-base leading-relaxed'>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className='flex flex-wrap gap-4 mt-8'>
          <button className='px-6 py-3 bg-[#011826] text-white font-semibold rounded-lg hover:bg-[#022d42] transition-colors'>
            Explore Packages
          </button>
          <button className='px-6 py-3 border-2 border-[#05FBE6] text-[#05FBE6] font-semibold rounded-lg hover:bg-[#05FBE6] hover:text-[#011826] transition-colors'>
            Download Brochure
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  )
}