/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "5-5-xl": "3.5rem",
      },
      textColor: {
        "black-pearl": "#1c1d1e",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      backgroundColor: {
        "yellow-button": "#f7bd01",
      },
      width: {
        88: "22rem",
        92: "23rem",
      },
      spacing: {
        "7.5r": "7.5rem",
      },
      boxShadow: {
        solid:
          "0 4px 6px -1px rgba(0, 0, 0, 1), 0 2px 4px -1px rgba(0, 0, 0, 1)",
      },
    },
    backgroundColor: (theme) => ({
      "main-page": "#f5f3ea",
    }),
  },
  plugins: [],
};
