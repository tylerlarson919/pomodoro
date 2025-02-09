import type { Config } from "tailwindcss";
const {nextui} = require("@nextui-org/react");


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			dark1: '#0a0a0a',
  			darkaccent: '#0c0c0c',
  			darkaccent2: '#343434',
  			darkaccent3: '#141414',
  			textcolor: '#939393',
  			textaccent: '#949494',
  			secondary: '#7828C8'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		translate: {
  			'full-screen-minus-8': 'calc(100vw - 70px)'
  		},
  		animation: {
  			ripple: 'ripple var(--duration,2s) ease calc(var(--i, 0)*.2s) infinite',
  			gradient: 'gradient 8s linear infinite',
  			'shiny-text': 'shiny-text 8s infinite',
  			meteor: 'meteor 5s linear infinite',
			pulse: 'pulse-animation 2s ease-in-out infinite',
			pulsesm: 'pulse-animationsm 2s ease-in-out infinite',
  		},
  		keyframes: {
			'pulse-animation': {
				'0%, 100%': { transform: 'scale(1)' },
				'50%': { transform: 'scale(1.3)' },
        	},
			'pulse-animationsm': {
				'0%, 100%': { transform: 'scale(1)' },
				'50%': { transform: 'scale(1.1)' },
        	},
  			ripple: {
  				'0%, 100%': {
  					transform: 'translate(-50%, -50%) scale(1)'
  				},
  				'50%': {
  					transform: 'translate(-50%, -50%) scale(0.9)'
  				}
  			},
  			gradient: {
  				to: {
  					backgroundPosition: 'var(--bg-size) 0'
  				}
  			},
  			'shiny-text': {
  				'0%, 90%, 100%': {
  					'background-position': 'calc(-100% - var(--shiny-width)) 0'
  				},
  				'30%, 60%': {
  					'background-position': 'calc(100% + var(--shiny-width)) 0'
  				}
  			},
  			meteor: {
  				'0%': {
  					transform: 'rotate(215deg) translateX(0)',
  					opacity: '1'
  				},
  				'70%': {
  					opacity: '1'
  				},
  				'100%': {
  					transform: 'rotate(215deg) translateX(-500px)',
  					opacity: '0'
  				}
  			},
  		}
  	}
  },
  darkMode: ["class", "class"],
  plugins: [nextui(), require("tailwindcss-animate")],
} satisfies Config;
