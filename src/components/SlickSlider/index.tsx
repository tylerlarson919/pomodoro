import React, { useState, useRef, TouchEvent, MouseEvent } from 'react';

// Define our images
const sliderImages = [
  './images/slide1.jpg',
  './images/slide2.jpg',
  './images/slide3.jpg',
  './images/slide4.jpg',
] as const;



const SlickSlider = ({ images = sliderImages }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);


  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setDragPosition(0);
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const currentPosition = e.clientX;
    const diff = currentPosition - touchStart;
    
    setDragPosition(diff);
    setTouchEnd(currentPosition);
  };
  
  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
    setDragPosition(0);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const currentTouch = e.touches[0].clientX;
    const diff = currentTouch - touchStart;
    
    setDragPosition(diff);
    setTouchEnd(currentTouch);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    const minSwipeDistance = 50;
    const swipeDistance = touchStart - touchEnd;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && currentIndex < images.length - 1) {
        handleNext();
      } else if (swipeDistance < 0 && currentIndex > 0) {
        handlePrev();
      }
    }
    
    setDragPosition(0);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-64 touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{
            transform: `translateX(calc(-${currentIndex * 100}% + ${dragPosition}px))`
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full h-full"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
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