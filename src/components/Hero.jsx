import React from 'react'
import { motion } from 'framer-motion'
import { images } from '../assets/Photo'
import Logo from "./Logo.jsx"
import {NavLink} from "react-router-dom"


export default function Hero() {
  return (
    <div className="bg-cover bg-no-repeat bg-center min-h-[720px] md:min-h-screen w-full" style={{ backgroundImage: `url(${images.background})` }}>
      <div className="flex flex-col items-center space-y-4 px-4 py-8 sm:py-10 md:px-10 lg:px-16">
        <div className="bg-[#1FAEAE99] rounded-full py-3 px-6 mt-16 sm:mt-20 sm:px-8">
          <p className="text-[18px] sm:text-[24px] leading-tight text-white font-semibold">We are</p>
        </div>

        <div className="max-w-[700px] w-full py-4 md:py-6 lg:py-10">
          <h1 className="text-[#05FBE6] text-4xl sm:text-[68px] font-bold leading-tight sm:leading-[0.9] text-center">
            Blema<span className="text-white font-bold">Nexus</span>
          </h1>
        </div>

        <p className="text-[#D9D9D9] text-center text-[18px] sm:text-[28px] md:text-[36px] leading-[1.4] max-w-3xl w-full mx-auto">
          Your gateway to the world. <span className="text-[#05FBE6]">We connect you with trusted solutions</span> for travel, education, and migration—making your journey{' '}
          <span className="text-[#05FBE6]">seamless and successful</span>.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 px-4 py-4 md:px-8 md:py-8 lg:py-10"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-[280px] rounded-[5px] border-[2px] border-[#05FBE6] py-[12px] px-[20px] text-[#FFFFFF] text-[14px] sm:text-[20px] leading-[100%] sm:px-[28px]"
        >
          Explore our Service
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-[280px] rounded-[5px] bg-[#05FBE6] py-[12px] px-[20px] text-[#001721] text-[14px] sm:text-[20px] leading-[100%] sm:px-[28px]"
        >
          Our Expert Guided
        </motion.button>
      </motion.div>
    </div>
  )
}
