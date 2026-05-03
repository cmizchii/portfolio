/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0C0C0C',
        canvas: '#FFFFFF',
        mist: '#D7E2EA',
        steel: '#646973',
        chrome: '#BBCCD7',
        magenta: '#B600A8',
        violet: '#7621B0',
        ember: '#BE4C00',
        soft: '#F5F5F5',
        muted: 'rgba(215, 226, 234, 0.6)',
      },
      fontFamily: {
        display: ['Kanit', 'sans-serif'],
        body: ['Kanit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
