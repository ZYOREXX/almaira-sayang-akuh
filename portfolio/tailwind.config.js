/** Nordic Academic & Sport-Tech palette (light mode). */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F8FAFC', // cool off-white page background
        ink: '#0F172A', // Deep Oxford Navy: headings & UI
        muted: '#475569', // Muted Slate: body & metadata
        line: '#E2E8F0', // hairline borders
        cerulean: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7', // Kinetic Cerulean: primary accent
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        prestige: {
          DEFAULT: '#B45309', // Warm Academic Amber
          soft: '#FEF3C7',
          line: '#FDE68A',
          deep: '#78350F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        label: ['Montserrat', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 10px 30px -18px rgba(15,23,42,0.18)',
        lift: '0 2px 6px rgba(15,23,42,0.05), 0 28px 56px -28px rgba(2,132,199,0.38)',
        glass: '0 30px 60px -32px rgba(15,23,42,0.45)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
