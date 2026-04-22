// LogoWithIcon.jsx
import React from 'react'

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Network Icon */}
      <div className="relative w-8 h-8 flex-shrink-0">
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          className="w-full h-full"
        >
          {/* Connection nodes */}
          <circle cx="6" cy="6" r="2.5" className="fill-[#05FBE6]" />
          <circle cx="26" cy="6" r="2.5" className="fill-[#05FBE6]" />
          <circle cx="16" cy="26" r="2.5" className="fill-white" />
          
          {/* Connection lines */}
          <line 
            x1="6" y1="6" x2="26" y2="6" 
            className="stroke-[#05FBE6]" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          <line 
            x1="6" y1="6" x2="16" y2="26" 
            className="stroke-[#05FBE6]" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            opacity="0.6"
          />
          <line 
            x1="26" y1="6" x2="16" y2="26" 
            className="stroke-[#05FBE6]" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            opacity="0.6"
          />
          
          {/* Glow effect */}
          <circle 
            cx="16" 
            cy="26" 
            r="4" 
            className="fill-[#05FBE6]" 
            opacity="0.2"
          />
        </svg>
      </div>
      
      {/* Text */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-none">
        <span className="text-white font-extrabold">Blema</span>
        <span className="text-[#05FBE6] font-light">Nexus</span>
      </h1>
    </div>
  )
}