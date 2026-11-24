import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // SF Pro where the buyer is on Apple hardware; Geist (a close, neutral grotesk) everywhere else
        sans: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Text"', "var(--font-geist)", ...defaultTheme.fontFamily.sans],
        display: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', "var(--font-geist)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "brand-dark": "#0A0A0A",
        "brand-gray": "#E8E8E8",
        "silver": "#F5F5F5",
        "accent": "#C9A84C",
        "accent-light": "#E8C96A",
        "accent-muted": "#8B6914",
        "accent-ink": "#7A5C0B",
        "success": "#34C759",
        "warning": "#FF9500",
        "error": "#FF3B30",
      },
      backgroundImage: {
        "gradient-subtle": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
        "gradient-dark": "linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 100%)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in": "slideIn 0.6s ease-out",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      spacing: {
        "safe-top": "max(1rem, env(safe-area-inset-top))",
        "safe-bottom": "max(1rem, env(safe-area-inset-bottom))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

export default config;
