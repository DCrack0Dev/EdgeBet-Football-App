/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#D4AF37", // Gold
          dark: "#B8860B",
          light: "#FFD700",
        },
        secondary: {
          DEFAULT: "#00FF41", // Matrix Green
          dark: "#008F11",
          light: "#00FF41",
        },
        card: {
          DEFAULT: "#1A1A1A",
          hover: "#2A2A2A",
        }
      },
    },
  },
  plugins: [],
};
