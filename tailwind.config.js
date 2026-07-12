/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './*.js', './src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        institucional: {
          azul: '#0b1838',
          naranja: '#f68121',
        },
      },
    },
  },
  plugins: [],
}
