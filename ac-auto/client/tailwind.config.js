/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ac-red": "#c41230",
        "ac-orange": "#c41230",
        "ac-bright-orange": "#e02020",
        "ac-hero-accent": "#c41230",
        "ac-topbar": "#252525",
        "ac-vykup-cta": "#c41230",
        "ac-vykup-lime": "#E2F26B",
      },
      fontFamily: {
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
