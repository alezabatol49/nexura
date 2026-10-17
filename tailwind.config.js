/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  screens: {
    xs: "400px",
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: "#080808",
          50: "#1a1a1a",
          100: "#141414",
          200: "#0f0f0f",
          300: "#0b0b0b",
          400: "#080808",
        },
        frost: {
          DEFAULT: "#f7f7f5",
          50: "#ffffff",
          100: "#f7f7f5",
          200: "#ededea",
          300: "#e0e0dc",
        },
        slate: {
          accent: "#6b7280",
          deep: "#2a2f3a",
          muted: "#9ca3af",
        },
        gold: {
          DEFAULT: "#c5a572",
          light: "#d9c098",
          deep: "#a88a5a",
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ['"Inter"', "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.3em",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.9s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
        shimmer: "shimmer 2s linear infinite",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
