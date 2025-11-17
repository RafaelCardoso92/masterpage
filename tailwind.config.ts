import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0a0a0a",
          100: "#0f0f0f",
          200: "#1a1a1a",
          300: "#242424",
        },
        light: {
          DEFAULT: "#ffffff",
          100: "#f5f5f7",
          200: "#e8e8ed",
        },
        accent: {
          DEFAULT: "#8b5cf6", // Purple
          dark: "#7c3aed",
          warm: "#c084fc", // Lighter purple
        },
        sensual: {
          DEFAULT: "#9f1239", // Deep burgundy
          light: "#be185d",
          glow: "#fb7185",
          wine: "#881337", // Deep wine
          rose: "#f43f5e",
        },
        gold: {
          DEFAULT: "#d4a574",
          light: "#fbbf24",
          dark: "#b45309",
          warm: "#f59e0b",
        },
        passion: {
          DEFAULT: "#7c2d12", // Deep ember
          glow: "#ea580c",
          flame: "#fb923c",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-large": ["clamp(3rem, 8vw, 6rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "display": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.1", fontWeight: "700" }],
        "headline": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.2", fontWeight: "600" }],
        "title": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.3", fontWeight: "600" }],
        "body": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
      },
      spacing: {
        "section": "clamp(4rem, 10vh, 8rem)",
      },
      transitionTimingFunction: {
        "apple": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
