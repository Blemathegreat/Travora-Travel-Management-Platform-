import React from 'react'
 import { images } from '../../assets/Photo'

const WhoWeAre = () => {
    const commited =  [
            "Simplifying global mobility for students, professionals, and explorers through expert guidance in visas, scholarships, legal documentation, and travel logistics.",
            "Humanizing the travel experience by offering ethical, honest, and personalized services that empower individuals to pursue opportunities abroad and within Ghana.",
            "Creating access to the world for people from all walks of life through responsive support, trusted mentorship, and real solutions that make travel easier and more meaningful."
          ]
  return (
    <section className="flex  mx-auto bg-white rounded-2xl overflow-hidden  py-4 md:py-6 lg:py-10 px-4 md:px-10 max-w-[1650px]">

      {/* LEFT — image */}
      <div className="w-[720px]  ">
        <img
          src={images.about}
          alt="Who we are"
          className="w-full h-full object-cover object-top"
        />
      </div>

      {/* RIGHT — content */}
      <div className="flex flex-col space-y-4 px-10 ">
        <h2 className="text-2xl  font-serif text-[#2eaa68] mb-4">Who we are</h2>

        <p className="text-sm  md:text-[32px] leading-[100%] tracking-[0%] md:w-[812px] text-[#000000] mb-4 font-bold">


Viaggio Abroad is a dynamic travel and migration consultancy 
born from real student experience and reimagined into a full-spectrum
 support hub for global travelers. What started as a student initiative 
 at the University of Ghana has grown into a bold movement that bridges borders with care.
We are committed to:
        </p>

        <p className="text-[[#000000]] text-sm md:text-[32px] relax-[0%] leading-[100%] font-bold mb-3">We are committed to:</p>

        <ul className="flex flex-col space-y-4 gap-3">
         {commited.map((item, i) => (
            <li key={i} className="flex gap-3 items-start text-sm md:text-[32px] w-[812px] text-[#000000]  font-bold leading-[100%]">
              <span className="mt-1.5 w-2 h-2 rounded-full bg-[#000000] flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

    </section>
  )
}

export default WhoWeAre