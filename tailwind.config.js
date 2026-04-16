export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 20px 80px rgba(96, 165, 250, 0.15)"
      },
      colors: {
        brand: {
          950: "#020617",
          900: "#0f172a"
        }
      }
    }
  },
  plugins: []
}
