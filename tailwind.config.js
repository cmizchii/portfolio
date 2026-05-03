/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2B2B2B',
        canvas: '#FFFFFF',
        coral: '#C9735B',
        ash: '#D9D9D9',
        muted: '#999999',
        soft: '#F5F5F5',
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        serif: ['"DM Serif Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
