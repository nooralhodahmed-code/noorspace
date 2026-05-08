import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: '#F8F9F4',
        pistachio: '#93C572',
        mustard: '#E1AD01',
        'blue-slate': '#2F4F7D',
        'slate-text': '#111318',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(17, 17, 24, 0.08)',
        glow: '0 18px 50px rgba(147, 197, 114, 0.16)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;