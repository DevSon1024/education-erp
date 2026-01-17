import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex, items.length]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden group h-[250px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div key={index} className="w-full flex-shrink-0 h-full flex items-center justify-center bg-gray-50">
             <img 
               src={item.image} 
               alt={`Slide ${index + 1}`} 
               className="w-full h-full object-cover sm:object-fill lg:object-cover" 
             />
          </div>
        ))}
      </div>

      {/* Navigation Controls (Arrows) */}
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/80 text-white hover:text-gray-900 p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 shadow-lg"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={28} />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/80 text-white hover:text-gray-900 p-3 rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 shadow-lg"
        aria-label="Next Slide"
      >
        <ChevronRight size={28} />
      </button>

      {/* Indicators (Dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
        {items.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => setCurrentIndex(idx)} 
            className={`transition-all duration-300 rounded-full shadow-md ${
              idx === currentIndex 
                ? 'w-8 h-2.5 bg-accent' 
                : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
      
      {/* Optional Gradient Overlay for better integration with bottom content */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default HeroCarousel;
