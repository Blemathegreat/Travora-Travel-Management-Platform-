import React, { useState } from 'react'
import { images } from '../../assets/Photo'
import { services } from './ServiceData'
import Partnership from "../Partnership.jsx"
import PublicTitle from "../about/PublicTitle.jsx"

export default function Zervices() {
  const [currentPage, setCurrentPage] = useState(0);
  const [activeService, setActiveService] = useState(0);
  
  const servicePerPage = 3;
  const visibleServices = services.slice(currentPage, currentPage + servicePerPage);

  const handleNextSlide = () => {
    if (currentPage + servicePerPage < services.length) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevSlide = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const handleServiceClick = (realIndex) => {
    setActiveService(realIndex)
  }

  return (
    <div className="w-full min-h-screen bg-white">
      
      {/* Hero Section */}
      <PublicTitle title ="Our Services"/>

      {/* Service Cards Carousel */}
      <section className='w-full bg-[#05FBE6] py-8 px-4 md:px-10'>
        <div className=' mx-auto'>
          <div className='flex gap-4 md:gap-6 overflow-hidden'>
            {visibleServices.map((service, index) => {
              const realIndex = currentPage + index;
              const isActive = activeService === realIndex;
              
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(realIndex)}
                  className={`
                    flex-1 min-w-[250px] md:min-w-[600px] 
                    p-6 h-[400px] rounded-lg 
                    bg-cover bg-center bg-no-repeat
                    cursor-pointer transition-all duration-300 
                    border-2 
                    ${isActive
                      ? 'border-[#05FBE6] scale-105 shadow-2xl' 
                      : 'bg-[#011826]/60 border-[#05FBE6]/30 hover:border-[#05FBE6]/60 hover:scale-[1.02]'
                    }
                  `}
                  style={{backgroundImage: `url(${service.backgroundImages})`}}
                  aria-pressed={isActive}
                >
                  <h3 className='text-lg md:text-xl font-bold text-white text-left'>
                    {service.title}
                  </h3>
                </button>
              )
            })}
          </div>

          {/* Navigation Arrows */}
          <div className='flex justify-center gap-3 mt-6'>
            <button
              onClick={handlePrevSlide}
              disabled={currentPage === 0}
              className={`
                w-10 h-10 rounded-full border-2 
                flex items-center justify-center 
                transition-all
                ${currentPage === 0
                  ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-50'
                  : 'border-[#011826] text-[#011826] hover:bg-[#011826] hover:text-white'
                }
              `}
              aria-label="Previous services"
            >
              ←
            </button>
            <button
              onClick={handleNextSlide}
              disabled={currentPage + servicePerPage >= services.length}
              className={`
                w-10 h-10 rounded-full border-2 
                flex items-center justify-center 
                transition-all
                ${currentPage + servicePerPage >= services.length
                  ? 'border-gray-500 text-gray-500 cursor-not-allowed opacity-50'
                  : 'border-[#011826] text-[#011826] hover:bg-[#011826] hover:text-white'
                }
              `}
              aria-label="Next services"
            >
              →
            </button>
          </div>
        </div>
      </section>

      {/* Service Details Section */}
      <section className='w-full bg-[#011826] py-12 md:py-16'>
        <div className='max-w-[1070px]  px-4 '>
          <header className='mb-12'>
            <h2 className='text-2xl md:text-[35px] lg:text-4xl text-[#05FBE6] font-bold mb-6 pl-4 md:pl-10'>
              {services[activeService].context.heading}
            </h2>
            <ul className='list-disc list-outside space-y-6  pl-10 md:pl-20 text-white/90 text-base md:text-lg lg:text-xl'>
              {services[activeService].context.paragraph.map((para, index) => (
                <li key={index} className='leading-[133%] text-justify'>
                  {para}
                </li>
              ))}
            </ul>
          </header>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className='w-full bg-white py-16 md:py-20'>
        <div className=' px-6 md:px-8 lg:px-12'>
          <div className='flex flex-col md:flex-row justify-between gap-8 lg:gap-16 items-start'>
            
            {/* Feature Image */}
            <div className='w-full md:w-5/12 lg:w-1/2 rounded-lg overflow-hidden flex-shrink-0'>
              <img 
                src={images.why} 
                alt="Why our services matter"
                className='w-full h-full object-cover'
              />
            </div>

            {/* Content */}
            <div className='w-full md:w-7/12 lg:w-1/2'>
              <h3 className='text-2xl md:text-3xl lg:text-4xl font-bold text-[#011826] mb-4'>
                Why it Matters
              </h3>
              
              <p className='text-gray-700 text-sm md:text-base mb-8 leading-relaxed'>
                {services[activeService].why.reason}
              </p>

              {/* Benefits List */}
              <ul className='space-y-6'>
                {services[activeService].why.whyItMatter.map((item, index) => (
                  <li key={index} className='flex gap-4 items-start'>
                    <div className='flex-shrink-0 w-12 h-12 rounded-full bg-[#05FBE6]/10 flex items-center justify-center'>
                      <img 
                        src={item.icon} 
                        alt=""
                        className='w-6 h-6'
                        aria-hidden="true"
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
                  </li>
                ))}
              </ul>

              {/* Call to Action Buttons */}
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
      </section>

      {/* Partnership Section */}
      <Partnership />
    </div>
  )
}