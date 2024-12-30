import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#1A1F2C",
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#f7bd00",
          foreground: "#1A1F2C",
        },
        secondary: {
          DEFAULT: "#222222",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#2A2A2A",
          foreground: "#A0A0A0",
        },
        accent: {
          DEFAULT: "#f7bd00",
          foreground: "#1A1F2C",
        },
        card: {
          DEFAULT: "#222222",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
        mono: ["Roboto Mono", "monospace"],
        playfair: ["Playfair Display", "serif"],
        merriweather: ["Merriweather", "serif"],
        lora: ["Lora", "serif"],
        montserrat: ["Montserrat", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        oswald: ["Oswald", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
        fira: ["Fira Code", "monospace"],
        "source-code": ["Source Code Pro", "monospace"],
        crimson: ["Crimson Pro", "serif"],
        libre: ["Libre Baskerville", "serif"],
        nunito: ["Nunito", "sans-serif"],
        space: ["Space Grotesk", "sans-serif"],
        "dm-sans": ["DM Sans", "sans-serif"],
        josefin: ["Josefin Sans", "sans-serif"],
        archivo: ["Archivo", "sans-serif"],
        work: ["Work Sans", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;