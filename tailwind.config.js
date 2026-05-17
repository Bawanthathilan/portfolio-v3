/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');
const colors = require('tailwindcss/colors');
const {
  default: flattenColorPalette
} = require('tailwindcss/lib/util/flattenColorPalette');
const svgToDataUri = require('mini-svg-data-uri');

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/**/*.{js,ts,jsx,tsx,mdx}',
    './containers/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],

  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Geist'", "'Helvetica Neue'", 'sans-serif'],
        mono: ["'Geist Mono'", 'monospace'],
        serif: ["'Instrument Serif'", 'serif']
      },
      colors: {
        primary: '#1E1E1E',
        secondary: '#fafafa',
        textPrimary: '#747474',
        textSecondary: '#949494',
        darkBg: '#161616'
      },
      backgroundImage: {
        hero: "url('../public/hero.png')"
      },
      animation: {
        'meteor-effect': 'meteor 5s linear infinite',
        'radar-spin': 'radar-spin 10s linear infinite',
        'tl-pulse': 'tlPulse 2s ease-out infinite'
      },
      keyframes: {
        tlPulse: {
          '0%': { transform: 'scale(0.8)', opacity: '0.7' },
          '100%': { transform: 'scale(1.8)', opacity: '0' }
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 },
          '70%': { opacity: 1 },
          '100%': {
            transform: 'rotate(215deg) translateX(-500px)',
            opacity: 0
          }
        },

        'radar-spin': {
          from: {
            transform: 'rotate(20deg)'
          },
          to: {
            transform: 'rotate(380deg)'
          }
        }
      }
    },

    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem'
      }
    }
  },
  plugins: [
    function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'bg-grid': (value) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
            )}")`
          })
        },
        { values: flattenColorPalette(theme('backgroundColor')), type: 'color' }
      );
    }
  ]
});
