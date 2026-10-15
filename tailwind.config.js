/** @type {import('tailwindcss').Config} */
// withMT supplies the colour palette the site's classes use (deep-purple,
// light-blue and friends).
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}'
  ],

  darkMode: 'class',
  // Only apply hover: styles on devices that can really hover, so taps on
  // touch screens don't leave elements stuck in their hover state.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      // Stronger curves than the CSS built-ins; `ease-out` and `ease-in-out`
      // classes now use these.
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out': 'cubic-bezier(0.77, 0, 0.175, 1)'
      },
      fontFamily: {
        sans: ["'Geist'", "'Helvetica Neue'", 'sans-serif'],
        mono: ["'Geist Mono'", 'monospace']
      }
    }
  }
});
