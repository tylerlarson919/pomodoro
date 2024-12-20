import React from 'react';

interface SortIconProps extends React.SVGProps<SVGSVGElement> {
  color?: string;
}

const SortIcon: React.FC<SortIconProps> = ({ color = '#939393', className, ...props }) => (
  <svg
    id="Layer_2"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 465.91 358.96"
    className={className}
    {...props}
  >
    <g id="Layer_1-2" data-name="Layer 1">
      <path
        d="M238.74,131.96c4.52-4.49,4.53-11.79.03-16.3L131.95,8.84c-4.48-4.46-11.73-4.46-16.21,0L8.86,115.72c-4.48,4.48-4.48,11.74,0,16.21h0c4.48,4.48,11.74,4.48,16.21,0L112.29,44.72v280.84c0,6.35,5.15,11.5,11.5,11.5h0c6.35,0,11.5-5.15,11.5-11.5V44.72l87.22,87.22c4.48,4.48,11.74,4.49,16.24.03h0Z"
        fill={color}
        stroke={color}
        strokeMiterlimit={10}
        strokeWidth={11}
      />
      <path
        d="M227.17,226.99c-4.52,4.49-4.53,11.79-.03,16.3l106.82,106.82c4.48,4.46,11.73,4.46,16.21,0l106.88-106.88c4.48-4.48,4.48-11.74,0-16.21h0c-4.48-4.48-11.74-4.48-16.21,0l-87.22,87.22V33.4c0-6.35-5.15-11.5-11.5-11.5h0c-6.35,0-11.5,5.15-11.5,11.5v280.84l-87.22-87.22c-4.48-4.48-11.74-4.49-16.24-.03h0Z"
        fill={color}
        stroke={color}
        strokeMiterlimit={10}
        strokeWidth={11}
      />
    </g>
  </svg>
);

export default SortIcon;
