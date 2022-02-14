const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.yellow[500],
        secondary: colors.cyan[500],
        "text-color": colors.slate[200],
      },
    },
  },
  plugins: [],
};
