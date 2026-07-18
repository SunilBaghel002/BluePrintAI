import type { Config } from "tailwindcss";

const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "8px",
        xl: "12px",
      },
      colors: {
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        sidebar: "var(--bg-sidebar)",
        canvas: "var(--bg-canvas)",
        hover: "var(--bg-hover)",
        accent: "var(--accent-primary)",
        "accent-hover": "var(--accent-hover)",
        "accent-dim": "var(--accent-dim)",
        ai: "var(--ai-primary)",
        "ai-dim": "var(--ai-dim)",
        base: "var(--bg-base)",
        default: "var(--border-default)",
        active: "var(--border-active)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-disabled": "var(--text-disabled)",
      },
    },
  },
} satisfies Config;

export default config;
