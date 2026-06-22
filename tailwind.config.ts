import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0057FF",
          dark: "#0a2342",
          light: "#e8f0fe",
        },
        "primary-dark": "#0a2342",
        "accent-red": "#e63946",
        ftn: {
          bg: "#F5F6F8",
          border: "#DDE1EA",
          muted: "#9AA4B2",
          surface: "#f1f3f4",
        },
        accent: "#E10600",
        gold: "#D4AF37",
        ink: "#0a0000",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Fraunces", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 4px 24px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.10)",
        "card-lift": "0 12px 40px rgba(0,0,0,0.12)",
        btn: "0 4px 14px rgba(0,87,255,0.35)",
        nav: "0 1px 3px rgba(0,0,0,.12)",
      },
      borderRadius: {
        pill: "50px",
      },
      animation: {
        "fade-up": "fadeSlideUp 0.55s cubic-bezier(.22,.68,0,1.2) forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
      },
      keyframes: {
        fadeSlideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
