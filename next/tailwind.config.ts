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
          DEFAULT: "#000000",
          100: "#0a0a0a",
          200: "#141414",
          300: "#1a1a1a",
        },
        light: {
          DEFAULT: "#ffffff",
          100: "#f5f5f7",
          200: "#e8e8ed",
        },
        accent: {
          DEFAULT: "#0071e3",
          dark: "#0077ed",
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
