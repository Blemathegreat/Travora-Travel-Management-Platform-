 import { images, question } from '../assets/Photo'

export default function Questions(){
   console.log(question)
    return(
            <div className="max-w-7xl mx-auto py-6 mb-10"> 
                <div className="flex flex-col gap-4 items-center ">
                    <h1 className="text-[#000000] text-[64px] font-bold leading-[72%] py-6">Have <span className="text-[#05FBE6]">Question</span></h1>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-[55px]'>
  {question.map((item, index) => (
    <div 
      key={index}
      className="group border-[1.6px] border-[#001721]/20 rounded-[12px] drop-shadow-[0_5px_20px_rgba(41,121,255,0.1)] hover:drop-shadow-[0_8px_30px_rgba(41,121,255,0.2)] transition-all duration-300 bg-white"
    >
      <div className="flex flex-col items-center p-6 gap-4">
        {/* Icon Container */}
        <div className="relative rounded-[18px] size-[80px] flex items-center justify-center bg-[#EBF9FF] group-hover:bg-[#05FBE6] transition-colors duration-300">
          <img 
            src={item.image} 
            alt={item.title}
            className='size-[40px] object-contain border-[3px] border-[#05FBE6] rounded-full p-1'
          />
        </div>

        {/* Title */}
        <h3 className="text-[#1A1A1A]  leading-[120%] font-bold text-[20px] md:text-[23px] text-center">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-[#666666] text-[14px] md:text-[16px] leading-[150%] w-[238px] text-center">
          {item.description}
        </p>

        {/* Button */}
      
      </div>
     
    </div>
  ))}

</div>
  <div className=' h-[76px] py-4 md:py-6'>
      <button className="mt-2 w-full py-3 px-6 md:px-[88px] md:py-6 bg-[#001721]   hover:bg-[#04d4c4] text-white text-[24px] font-semibold rounded-[8px] transition-colors duration-300 text-[14px] md:text-[16px]">
        Learn More
      </button>
  </div>
                </div>
            </div>
    )
}