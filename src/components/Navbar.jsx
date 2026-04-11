import React, { useState } from 'react'
import { images,navbar } from '../assets/Photo'
import Logo from "./Logo.jsx"
import {NavLink} from "react-router-dom"


export default function  () {
  const [visible,setVisible] = useState(false)
  
  return (
    <div className="w-full  ">
      <div className=" bg-cover bg-no-repeat bg-center  " style={{backgroundImage : `url(${images.background})`}} >
            <div className="h-full items-center ">
          <div className="w-full backdrop-blur-sm bg-[#0017219E]/10  px-4 md:px-10 lg:px-16">
          <div className="flex justify-between gap-2 items-center">
          <div>
            <Logo/>
          </div>
          <div className="hidden md:flex space-x-4 items-center ">
            {
              navbar.map((item,index)=>{
               return(
                 <div className="" key={index}>
                  <NavLink to={item.href} className="text-[#FFFFFF] text-[24px] font-medium tracking-[0%] leading-[100%] cursor-pointer hover:text-gray-700 gap-4">{item.label}</NavLink>
                </div>
               )
              })
            }
          </div>
          <div className='py-4'><button className="border-2 border-[#05FBE6] text-[#05FBE6] rounded-[68px] px-6 md:px-12 py-3 hidden sm:block">Contact</button></div>
             {/* Mobile Hamburger Button */}
             <img onClick={()=>setVisible(true)} src={images.menu} alt="menuimage" className='w-10 md:hidden cursor-pointer text-white'/>
          </div>
       

          </div>
        </div>

   <div className={`absolute top-0 right-0 bottom-0 bg-red-500 bg-center bg-cover bg-no-repeat transition-all overflow-hidden ${visible? "w-full" : "w-0"}`}
         style={{backgroundImage : `url(${images.background})`}}
   >
            <div className="flex flex-col  p-3">
            <div onClick={()=>setVisible(false)} className="flex gap-3 items-center">
            <img  alt="dropdown" src={images.dropdown} className="w-3 rotate-180"/>
            <p  className="text-white text-[18px] font-medium">Back</p>
            </div>
            <div className="flex flex-col items-center gap-4 mt-10">
              {
                navbar.map((item, index)=>{
                  return(
                    
                        <NavLink onClick={()=>setVisible(false)} to={item.href} key={index} className="text-[#FFFFFF] text-[24px] font-medium tracking-[0%] leading-[100%] cursor-pointer hover:text-gray-700 gap-4">{item.label}</NavLink>
                    
                  
                  )
                })
              }
            </div>
            </div>
          </div>
       
      </div>

    </div>
  )
}
