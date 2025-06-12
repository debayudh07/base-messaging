import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 107, 157, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 107, 157, 0.8), 0 0 30px rgba(255, 107, 157, 0.6)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'neon-pulse': {
          '0%, 100%': { 
            textShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
            filter: 'brightness(1)'
          },
          '50%': { 
            textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
            filter: 'brightness(1.2)'
          },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        'anime': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        'poppins': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
