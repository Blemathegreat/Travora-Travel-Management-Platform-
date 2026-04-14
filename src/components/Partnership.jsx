import React from 'react'
import { images} from '../assets/Photo'

export default function Partnership() {
    console.log(images.partnership)
  return (
    <div className='max-w-[1650px]  mx-auto '>
        <div className='px-6 py-4 '>
            <h1 className='text-[60px] max-w-[800px] mx-auto mb-4 md:text-[64px] text-[#0F0C3D] h-[77px] font-bold leading-[100%] pt-4 md:pt-10'>Corporate Partnership </h1>
        
        <p className='text-[#1A202C] leading-[33px] tracking-[0%]  text-[24px] py-10  font-semibold max-w-[1200px] mx-auto h-[100px]'>Blema Nexus partners with institutions,
             businesses, and organizations of all sizes to provide world-class travel,
              visa, and relocation support services for their employees, students, and members.</p>
              <div className='flex py-10 '>
                    <img src={images.partnership} alt='partnership' className='w-[595px] h-[460px] object-cover'  />
                    <div className='flex flex-col gap-4 items-center px-6 py-[80px] w-[915px] rounded-tr-[37px] rounded-br-[30px] bg-[#001721] text-white'>
                    <h1 className='text-[32px] text-[#05FBE6] leading-[28px] font-semibold justify-center'>A Pathway to Global Opportunities</h1>
                    <p className='leading-[32px] text-[24px] h-[105px] tracking-[0%] font-medium w-[750px]'>At Blema Nexus, we make it easier for you to find the right travel, study, or relocation option  whether
                         you come to us with a destination in mind or need help exploring your best options.</p>
                         <button className="bg-[#05FBE6] px-[88px] py-[22px] text-[24px] text-[#001721] rounded-[5px] h-[86px]">Partner Us</button>
                    </div>
              </div>
              </div>
    </div>
  )
}
