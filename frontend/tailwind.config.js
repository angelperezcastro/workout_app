/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4f46e5", // morado tipo indigo
          dark: "#3730a3",
          light: "#6366f1",
        },
      },
    },
  },
  plugins: [],
}
