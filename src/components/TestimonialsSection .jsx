import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { images, testimonials } from '../assets/Photo';

const TestimonialsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // 12 testimonials total
 

  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentPage(newPage);
    setTimeout(() => setIsAnimating(false), 600);
  };

   const nextSlide = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(c => c + 1)
        }
    }

   const prevSlide = () => {
        if (currentPage > 0) {
            setCurrentPage(c => c - 1)
        }
    }

  const goToPage = (pageIndex) => {
    handlePageChange(pageIndex);
  };

  const getCurrentTestimonials = () => {
    const startIndex = currentPage * itemsPerPage;
    return testimonials.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${images.testimonial})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {/* Header with Navigation */}
        <div className="w-full max-w-7xl mb-12 flex items-center justify-between">
          <h2 className="text-white text-4xl md:text-5xl font-bold tracking-tight">
            Testimonials
          </h2>
          
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              disabled={isAnimating}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonials"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isAnimating}
              className="w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded border border-white/30 transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonials"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Testimonials Cards Container */}
        <div className=" relative w-full max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {getCurrentTestimonials().map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-white rounded-lg p-6 shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
                >
                {/* Profile Image */}
                <div className=" absolute top-[-20px] flex justify-center mb-4">
                  <div className="">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="  w-16 h-16 rounded-full object-cover ring-4 ring-gray-100 transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Name and Role */}
                <div className="flex items-center justify-between gap-3">
                   <div className="text-start mb-3 py-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {testimonial.role}
                  </p>
                </div>
                 <div className="flex  gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400 transition-transform duration-200 hover:scale-125"
                      style={{
                        animationDelay: `${(index * 150) + (i * 50)}ms`,
                      }}
                    />
                  ))}
                </div>
                </div>
               

                {/* Star Rating */}
               

                {/* Testimonial Text */}
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {testimonial.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          </div>
        </div>

        {/* Dot Indicators - 4 dots for 4 pages (12 testimonials ÷ 3 per page) */}
        <div className="flex gap-2 mt-10">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              disabled={isAnimating}
              className={`rounded-full transition-all duration-500 ease-out disabled:cursor-not-allowed ${
                currentPage === index
                  ? 'bg-white w-8 h-2'
                  : 'bg-white/40 hover:bg-white/60 w-2 h-2'
              }`}
              aria-label={`Go to page ${index + 1}`}
              aria-current={currentPage === index ? 'true' : 'false'}
            />
          ))}
        </div>
      </motion.div>

    </div>
  );
};

export default TestimonialsSection;