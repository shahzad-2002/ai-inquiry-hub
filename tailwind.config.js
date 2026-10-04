/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#15172B", light: "#1E2140", dashed: "#2A2D50" },
        paper: "#F7F7FB",
        panel: "#FFFFFF",
        border: "#E4E3F0",
        violet: { DEFAULT: "#6D5BD0", dark: "#584AAD", light: "#EDE9FB" },
        emerald: { DEFAULT: "#10B981", light: "#DCFCE9" },
        amber: { DEFAULT: "#F59E0B", light: "#FEF3DB" },
        danger: { DEFAULT: "#EF4444", light: "#FDE4E4" },
        ink2: "#1F2140",
        muted: "#6B7094",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
