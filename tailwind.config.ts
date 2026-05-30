import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "var(--color-primary)", dark: "var(--color-primary-dark)", glow: "var(--color-primary-glow)" },
        amber: { DEFAULT: "var(--color-amber)", dark: "var(--color-amber-dark)" },
        surface: {
          0: "var(--bg-primary)",
          1: "var(--bg-secondary)",
          2: "var(--bg-elevated)",
          3: "var(--bg-tertiary)",
          4: "var(--bg-border)",
          border: "var(--bg-border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
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
