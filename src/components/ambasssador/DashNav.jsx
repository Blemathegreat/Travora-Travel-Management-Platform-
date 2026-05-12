import React from 'react'
import { images } from '../../assets/Photo';

export default function DashNav() {
  return (
    <div className="w-full bg-[#012E41]">
      <div className="flex items-center justify-between py-4 px-6 md:px-10 lg:px-20 cursor-pointer">
        
          <img src={images.logo} alt="ambassador" className="w-10 h-10 rounded-full object-cover" />
          <div className='flex items-center gap-3 md:gap-6'>
           <img src={images.notification} alt="notification" className="w-6 h-6" />
           <img src={images.ambassador} alt="dropdown" className="w-6 h-6" />
          </div>
      
      </div>
    </div>
  )
}
