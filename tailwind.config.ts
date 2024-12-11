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
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark1: "#0a0a0a",
        darkaccent: "#1d1d1d",
        darkaccent2: "#343434",
        textcolor: "#f7f7f7",
        textaccent: "#949494",
        secondary: "#7828C8",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
