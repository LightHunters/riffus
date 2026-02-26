/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#0b0a12",
          card: "#111021",
          accent: "#6b5cff",
          soft: "#1a1830",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        glow: "0 10px 40px rgba(107,92,255,0.35)",
      },
    },
  },
  plugins: [],
};
