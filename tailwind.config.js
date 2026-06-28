/** @type {import('tailwindcss').Config} */
// Tokens sourced from the "Heritage" DESIGN.md
// (Architectural Minimalism meets Journalistic Gravitas).
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A1C1E", // primary — deep ink for headlines and core text
        slate: "#6C7278", // secondary — borders, captions, metadata
        clay: {
          DEFAULT: "#B8422E", // tertiary — "Boston Clay", the sole accent
          hover: "#9E3826",
          soft: "#F0E0DB", // tinted container of clay
        },
        limestone: {
          DEFAULT: "#F7F5F2", // neutral — warm limestone foundation
          deep: "#EEEAE4", // slightly recessed surface
          line: "#E2DDD5", // hairline borders on the warm ground
        },
      },
      fontFamily: {
        sans: ['"Public Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
        grotesk: ['"Space Grotesk"', "ui-monospace", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
      },
      spacing: {
        // Heritage scale: sm 8px, md 16px
        sm: "8px",
        md: "16px",
      },
      letterSpacing: {
        caps: "0.12em",
      },
    },
  },
  plugins: [],
};
