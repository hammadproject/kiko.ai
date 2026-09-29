import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        muted: "var(--muted)",
        border: "var(--border)",
        signal: "var(--signal)",
        "signal-strong": "var(--signal-strong)",
        "dark-panel": "var(--dark-panel)",
      },
      fontFamily: {
        sans: ["Inter Variable", "Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
