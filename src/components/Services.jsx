import React from 'react'
import { services } from '../assets/Photo'

export default function Services() {
    console.log(services)
    const [currentPage, setCurrentPage] = React.useState(0);
    const servicesPerPage = 4;
    const totalPages = Math.ceil(services.length / servicesPerPage);
    
    const next = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(c => c + 1)
        }
    }
    
    const previous = () => {
        if (currentPage > 0) {
            setCurrentPage(c => c - 1)
        }
    }
    
    console.log('Current Page:', currentPage, 'Total Pages:', totalPages)
    
    return (
        <section className='max-w-[1650px] bg-[#001721] mx-auto rounded-[37px] py-10 px-4'>
            <div className="flex flex-col gap-3">
                <h1 className="leading-[100%] text-[64px] text-white font-bold text-center pt-4 md:pt-10">
                    Your Journey, Your Path with <span className='text-[#05FBE6]'>Viaggio Abroad</span>
                </h1>
                <p className="text-[#FFFFFF] text-[24px] font-medium leading-[100%] text-center w-3l4 py-4 md:py-6 md:w-[1300px] mx-auto">
                    Step into a world of endless possibilities with Viaggio Abroad. Whether you're planning to study, work, travel, or relocate, we provide the perfect support system, expert guidance, and personalized services to help you achieve your global dreams with clarity and confidence
                </p>
                
                {/* Carousel Container */}
                <div className='relative max-w-[1550px] mx-auto'>
                    {/* Overflow Hidden Container - Only shows 4 cards */}
                    <div className="overflow-hidden">
                        {/* Sliding Track - This moves left/right */}
                        <div 
                            className='flex gap-6 transition-transform duration-500 ease-in-out'
                            style={{
                                transform: `translateX(-${currentPage * 100}%)`
                            }}
                        >
                            {services.map((items, index) => (
                                <div 
                                    key={index}
                                    className="w-[calc((100%-72px)/4)] flex-shrink-0"
                                >
                                    <div className="flex flex-col gap-3 rounded-[34px] bg-[#FFFFFF]  h-full">
                                        <img 
                                            src={items.image} 
                                            className="w-full h-[230px] object-cover rounded-[20px]" 
                                            alt="serviceImage" 
                                        />
                                        <div className="flex flex-col flex-grow h-full p-4">
    {/* Title */}
    <h3 className="text-[#1A1A1A] text-[20px] md:text-[23px] leading-[120%] h-[46px] w-[230px] font-bold mb-3">
        {items.title}
    </h3>
    
    {/* Description - grows to fill space */}
    <p className="text-[#666666] text-[14px] md:text-[16px] leading-[150%] mb-4 text-left h-[83px] flex-grow">
        {items.description}
    </p>
    
    {/* Link - stays at bottom */}
    <div className="flex items-center gap-2 text-[#05FBE6] hover:text-[#04d4c4] transition-colors duration-300 cursor-pointer">
        <span className="text-[14px] md:text-[16px] font-semibold">See more</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
    </div>
</div> 
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <button 
                        onClick={previous}
                        disabled={currentPage === 0}
                        className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all"
                    >
                        ←
                    </button>
                    
                    <button 
                        onClick={next}
                        disabled={currentPage === totalPages - 1}
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all"
                    >
                        →
                    </button>
                </div>
                
                {/* Pagination Dots */}
                <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`h-3 rounded-full transition-all ${
                                currentPage === index 
                                    ? 'w-8 bg-[#05FBE6]' 
                                    : 'w-3 bg-white/30 hover:bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}