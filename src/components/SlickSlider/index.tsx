import React, { useState, useRef, MouseEvent } from 'react';
// Type-only import for TouchEvent
import type { TouchEvent } from 'react';

// Define our images
const sliderImages = [
  './images/stats-slider1.png',
  './images/stats-slider2.png',
] as const;

const SlickSlider = ({ images = sliderImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length); // Loop to the first image
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length); // Loop to the last image
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, currentTarget } = e;
    const { width } = currentTarget.getBoundingClientRect();
    const center = width / 2;

    // Move to the next image if the right half is clicked, otherwise move to the previous image
    if (clientX > center) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden h-[250px] sm:h-[350px]"> {/* Set fixed height */}
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-pointer" // Keep the height of the container full
        onClick={handleClick} // Handle click to navigate images
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full w-fit"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full flex justify-center items-center"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-auto h-full object-contain rounded-lg" // Use w-auto to maintain aspect ratio
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all 
              ${currentIndex === index ? 'bg-white w-4' : 'bg-white/60'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SlickSlider;
