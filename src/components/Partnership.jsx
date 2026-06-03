import React from 'react'
import { images } from '../assets/Photo'

export default function Partnership() {
  return (
    <div className='max-w-[1650px] mx-auto'>
      <div className='px-4 sm:px-6 py-4'>

        <h1 className='text-[36px] sm:text-[48px] md:text-[64px] max-w-[800px] mx-auto mb-4 text-[#0F0C3D] font-bold leading-[110%] pt-4 md:pt-10 text-center md:text-left'>
          Corporate Partnership
        </h1>

        <p className='text-[#1A202C] leading-[160%] text-[15px] sm:text-[18px] md:text-[24px] py-6 md:py-10 font-semibold max-w-[1200px] mx-auto text-center md:text-left'>
          Blema Nexus partners with institutions, businesses, and organizations of all sizes to provide
          world-class travel, visa, and relocation support services for their employees, students, and members.
        </p>

        <div className='flex flex-col sm:flex-row py-6 md:py-10 rounded-[37px] overflow-hidden'>

          {/* Image */}
          <img
            src={images.partnership}
            alt='partnership'
            className='w-full sm:w-[40%] lg:w-[595px] h-[260px] sm:h-[400px] lg:h-[460px] object-cover'
          />

          {/* Dark panel */}
          <div className='flex flex-col gap-4 items-center px-4 sm:px-6 md:px-10 py-8 md:py-[80px] flex-1 rounded-b-[37px] sm:rounded-b-none sm:rounded-tr-[37px] sm:rounded-br-[30px] bg-[#001721] text-white'>

            <h1 className='text-[22px] sm:text-[26px] md:text-[32px] text-[#05FBE6] leading-[130%] font-semibold text-center'>
              A Pathway to Global Opportunities
            </h1>

            <p className='leading-[160%] text-[14px] sm:text-[18px] md:text-[24px] font-medium w-full text-center'>
              At Blema Nexus, we make it easier for you to find the right travel, study, or relocation option —
              whether you come to us with a destination in mind or need help exploring your best options.
            </p>

            <button className="bg-[#05FBE6] px-8 sm:px-12 md:px-[88px] py-3 sm:py-4 md:py-[22px] text-[16px] sm:text-[20px] md:text-[24px] text-[#001721] rounded-[5px] font-semibold mt-2">
              Partner Us
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}