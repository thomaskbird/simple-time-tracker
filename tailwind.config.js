/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{tsx,ts,js}',
    './src/components/**/*.{tsx,ts,js}'
  ],
  theme: {
    extend: {
      container: {
        center: true
      },
      dropShadow: {
        '3xl': '0 10px 15px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
