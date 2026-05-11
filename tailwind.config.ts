import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        body: ["var(--font-body)", "system-ui"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        border: "var(--border)",
        accent: "var(--accent)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(20px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        glowPulse: { "0%,100%": { boxShadow: "0 0 20px var(--accent-30)" }, "50%": { boxShadow: "0 0 40px var(--accent-50), 0 0 80px var(--accent-20)" } },
        scanLine: { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(100vh)" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
