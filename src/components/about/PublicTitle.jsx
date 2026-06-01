import React from 'react'
import { images } from '../../assets/Photo'

export default function PublicTitle({title}) {
  return (
    <div className='relative flex flex-col items-center justify-center pt-16 pb-8 px-4 h-[500px] bg-cover bg-center bg-no-repeat' 
                   style={{backgroundImage: `url(${images.backgroundservice})`}}>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#011826DE]/60 to-[#011826DE]/95"></div>
                    <div className="relative z-10 text-center">
                         <h1 className='text-3xl md:text-[40px] lg:text-5xl text-[#05FBE6] font-bold mb-4'>
                          {title}
          </h1>
          <nav className='flex items-center justify-center gap-2 text-sm md:text-base' aria-label="Breadcrumb">
            <span className='text-white/70'>Home</span>
            <span className='text-white/70'>/</span>
            <span className='text-[#05FBE6]'>{title}</span>
          </nav>
                        </div>        
                   </div>
  )
}
