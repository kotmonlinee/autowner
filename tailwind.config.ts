import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#ed1c24", dark: "#b8141b", glow: "#ff3b42" },
        amber: { DEFAULT: "#f59e0b", dark: "#d97706" },
        surface: {
          0: "#0a0b0f",
          1: "#111318",
          2: "#181b21",
          3: "#1f2229",
          4: "#282c34",
          border: "#2a2d35",
        },
        text: {
          primary: "#f0f1f3",
          secondary: "#9ca3af",
          muted: "#6b7280",
        },
      },
      fontFamily: {
        display: ["Russo One", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
