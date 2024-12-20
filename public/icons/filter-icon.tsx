import React from 'react';

const FilterIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ color, ...props }) => (
  <svg 
    width="800px" 
    height="800px" 
    viewBox="0 0 15 15" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props} // This allows passing any additional props like className or style
  >
    <path d="M1 3H14M3 7.5H12M5 12H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default FilterIcon;
