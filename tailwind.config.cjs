/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0c",
        foreground: "#f3f4f6",
        card: "#121216",
        border: "#1e1e24",
        primary: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5"
        },
        secondary: "#10b981",
        accent: "#f59e0b"
      },
      fontFamily: {
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
}
