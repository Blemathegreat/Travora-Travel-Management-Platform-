import React from 'react'
 import { images } from '../../assets/Photo'


const WhatWeDo = () => {
  const services = [
    "Visa and immigration support",
    "Scholarship search and application assistance",
    "Travel bookings and airport transfers",
    "Housing (local and abroad)",
    "Student mentorship and study planning",
    "Tourism, leisure, and cultural exploration",
    "Legal translation, appointment booking, and more",
  ]

  return (
    <section className="flex max-w-[1650px] mx-auto  overflow-hidden border border-white/5">
<div className="bg-[#0d1b2a]  flex flex-col md:flex-row items-center rounded-2xl">
     {/* LEFT — content */}
      <div className="flex flex-col space-y-4 px-10 py-4 ">
        <h2 className="text-2xl  font-serif text-[#2eaa68] py-4">What we do</h2>

        <p className="text-sm  md:text-[32px] leading-[100%] tracking-[0%] md:w-[812px] text-[#000000] mb-4 font-bold">
          We believe in the power of global connection and the transformational value 
          of travel. That's why Viaggio Abroad exists—to support every step of your journey.
        </p>

        <p className="text-sm  md:text-[32px] leading-[100%] tracking-[0%] md:w-[812px] text-[#000000] mb-4 font-bold">
          Whether you're applying for a visa, preparing for international studies, booking 
          a flight, or planning your next adventure, our team ensures the experience is 
          stress-free and successful. Our services include:
        </p>

        <ul className="flex flex-col gap-2 mb-5">
          {services.map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-sm md:text-[32px] w-[812px] text-[#000000]  font-bold leading-[100%]">
              <span className="mt-0.5 flex-shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="flex gap-3 items-start text-sm md:text-[32px] w-[812px] text-[#000000]  font-bold leading-[100%]">
          Viaggio Abroad is here for students, professionals, travelers, and delegations 
          anyone who dreams of crossing borders and making it count. With local expertise 
          and a global outlook, we help you navigate the world, one dream at a time.
        </p>
      </div>

      {/* RIGHT — image */}
      <div className="w-[720px]  py-4 relative">
        <img
          src={images.about1}
          alt="What we do"
          className="w-full h-full object-cover object-center"
        />
        {/* fade edge into bg */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1b2a] via-transparent to-transparent pointer-events-none" />
      </div> 
</div>
    

    </section>
  )
}

export default WhatWeDo