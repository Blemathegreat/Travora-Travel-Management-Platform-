import React from 'react'
import { images } from '../assets/Photo'
import Logo from "./Logo.jsx"
import {NavLink} from "react-router-dom"


export default function Hero() {
  return (
    <div  className="bg-cover  bg-no-repeat bg-center min-h-screen w-full"
    style={{backgroundImage : `url(${images.background})`}}
    >
        <div className="flex flex-col items-center  space-y-4 px-4 md:px-10 lg:px-16">
      <div className='bg-[#1FAEAE99] h-[47px] mt-[76px] p-[30px] rounded-[50px] flex items-center sm:w-[201px] '>
        <p className='p-[30px] leading-[72%] text-[24px] text-[#ffffff] font-semibold'>We are</p>
      </div>
          <div className="max-w-[600px]  py-4 md:py-6 lg:py-10">
            <h1 className='text-[#05FBE6] text-2xl sm:text-[68px] font-bold leading-[72%] '>Blema<span className='text-[#ffffff] font-bold'>Nexus</span></h1>
          </div>
          
            <p className='text-[#D9D9D9] sm:h-[150px] font-medium w-[90%] lg:max-w-5xl sm:mx-auto font-medium text-center text-[36px] leading-[100%] '>Your gateway to the world.<span className='text-[#05FBE6]'>We connect you with trusted solutions </span>  for travel, education, and migration—making your journey 
 <span className='text-[#05FBE6]'>seamless and successful</span>.</p>
    </div>
    <div className='flex gap-3 items-center justify-center py-4 px-4 md:py-8 lg:py-10'>
      <button className='border-[2px] rounded-[5px] border-[#05FBE6] py-[12px] px-[24px] sm:py-[22px] text-[#FFFFFF] text-[14px] sm:text-[24px] leading-[100%] sm:px-[88px] rounded-5px'>Explore our Service</button>
      <button className=" rounded-[5px] py-[12px] px-[14px] sm:py-[22px] sm:px-[88px] bg-[#05FBE6] text-[#001721] text-[14px] sm:text-[24px] leading-[100%]"> Our Expert Guided</button>
    </div>
    </div>
  )
}
