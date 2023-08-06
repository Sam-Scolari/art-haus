/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    colors: {
      transparent: "transparent",
      white: "#FAFAFA",
      black: "#0A0A0A",
      gray: "#7A7A7A",
      lightgray: "#D0D0D0",
    },
    fontFamily: {
      belanosima: ["Belanosima"],
      nunito: ["Nunito"],
      alata: ["Alata"],
    },
  },
  plugins: [],
};
