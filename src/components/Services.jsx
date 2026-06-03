import React from 'react'
import { motion } from 'framer-motion'
import { services } from '../assets/Photo'

export default function Services() {
    const [currentPage, setCurrentPage] = React.useState(0);

    const getCardsPerPage = () => {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 4;
    };

    const [cardsPerPage, setCardsPerPage] = React.useState(getCardsPerPage);

    React.useEffect(() => {
        const handleResize = () => {
            setCardsPerPage(getCardsPerPage());
            setCurrentPage(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(services.length / cardsPerPage);

    // ✅ slice only the cards for the current page — no broken transform math
    const currentCards = services.slice(
        currentPage * cardsPerPage,
        currentPage * cardsPerPage + cardsPerPage
    );

    const next = () => {
        if (currentPage < totalPages - 1) setCurrentPage(c => c + 1);
    };

    const previous = () => {
        if (currentPage > 0) setCurrentPage(c => c - 1);
    };

    return (
        <section className='max-w-[1650px] bg-[#001721] mx-auto overflow-hidden rounded-[37px] py-10 px-4'>
            <div className="flex flex-col gap-3">

                <h1 className="leading-[110%] text-[32px] sm:text-[44px] md:text-[64px] text-white font-bold text-center pt-4 md:pt-10">
                    Your Journey, Your Path with <span className='text-[#05FBE6]'>Viaggio Abroad</span>
                </h1>

                <p className="text-[#FFFFFF] text-[15px] sm:text-[18px] md:text-[24px] font-medium leading-[150%] text-center max-w-[1300px] mx-auto py-4 md:py-6 px-2">
                    Step into a world of endless possibilities with Viaggio Abroad. Whether you're planning to study, work, travel, or relocate, we provide the perfect support system, expert guidance, and personalized services to help you achieve your global dreams with clarity and confidence
                </p>

                {/* Carousel Container */}
                {/* Carousel Container — less px on mobile */}
<div className='relative max-w-[1550px] mx-auto w-full px-2 sm:px-8'>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentCards.map((items, index) => (
            <motion.div
                key={`${currentPage}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="w-full" // ✅ ensure full width on mobile
            >
                <div className="flex flex-col gap-3 rounded-[34px] bg-[#FFFFFF] h-full">
                    <img
                        src={items.image}
                        className="w-full h-[230px] object-cover rounded-t-[34px]"
                        alt="serviceImage"
                    />
                    <div className="flex flex-col flex-grow p-4">
                        <h3 className="text-[#1A1A1A] text-[20px] md:text-[23px] leading-[120%] font-bold mb-3">
                            {items.title}
                        </h3>
                        <p className="text-[#666666] text-[14px] md:text-[16px] leading-[150%] mb-4 flex-grow">
                            {items.description}
                        </p>
                        <div className="flex items-center gap-2 text-[#05FBE6] hover:text-[#04d4c4] transition-colors duration-300 cursor-pointer">
                            <span className="text-[14px] md:text-[16px] font-semibold">See more</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </motion.div>
        ))}
    </div>

    {/* Arrows — hide on mobile since single card has no need for side arrows */}
    <button
        onClick={previous}
        disabled={currentPage === 0}
        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all"
    >
        ←
    </button>
    <button
        onClick={next}
        disabled={currentPage === totalPages - 1}
        className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full p-3 transition-all"
    >
        →
    </button>

    {/* ✅ Mobile-only prev/next buttons below the card */}
    <div className="flex sm:hidden justify-between mt-4 px-1">
        <button
            onClick={previous}
            disabled={currentPage === 0}
            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full px-5 py-2 text-sm transition-all"
        >
            ← Prev
        </button>
        <button
            onClick={next}
            disabled={currentPage === totalPages - 1}
            className="bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-full px-5 py-2 text-sm transition-all"
        >
            Next →
        </button>
    </div>
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