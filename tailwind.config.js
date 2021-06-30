const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        gray: colors.blueGray,
      },
      fontFamily: {
        belleza: ["Belleza", defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
};
