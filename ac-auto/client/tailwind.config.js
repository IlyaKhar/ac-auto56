/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "ac-red": "#c41230",
        "ac-orange": "#E29E31",
        "ac-bright-orange": "#f58200",
        "ac-hero-accent": "#FF8000",
        "ac-topbar": "#252525",
        "ac-vykup-cta": "#FF3B30",
        "ac-vykup-lime": "#E2F26B",
      },
      fontFamily: {
        montserrat: ["Montserrat", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
