/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        belleza: ['Belleza', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        messiri: ['El Messiri', 'sans-serif'],
        darkmode:"class",
      }
    },
  },
  plugins: [],
  // module.exports = {
  //   darkMode: "class", // Ensure dark mode is enabled via class
  // };
  
}