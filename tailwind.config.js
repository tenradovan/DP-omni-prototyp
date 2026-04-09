/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Direct brand palette from direct.cz
        direct: {
          900: '#00201a',   // overlay / deepest
          800: '#004033',   // primary text, dark cards, primary buttons
          700: '#006b55',   // hover states
          600: '#008066',   // accent links
          500: '#21937a',   // lighter accent
          400: '#43a68e',
          300: '#64b8a3',
          200: '#86cbb7',
          100: '#a7decb',
          50: '#c4e9dc',
          25: '#d1f3e7',
        },
        lime: {
          950: '#2d3a00',
          900: '#415b00',
          800: '#628f1b',
          700: '#83a913',
          600: '#a3c40b',
          500: '#c4de00',   // THE brand lime
          400: '#d3e642',
          300: '#e1ed80',
          200: '#eaf3a3',
          100: '#f3f9c5',
          50: '#f9fce2',
        },
        gray: {
          950: '#002d24',
          900: '#004033',
          800: '#1a5347',
          700: '#33665c',
          600: '#4d7970',
          500: '#668c85',
          400: '#809f99',
          300: '#99b3ad',
          200: '#b2c6c2',
          100: '#ccd9d6',
          50: '#e5eceb',
          25: '#f2f5f5',
        },
        err: {
          DEFAULT: '#d32f2f',
          light: '#ff6659',
          container: '#ffeaea',
        },
        warn: {
          DEFAULT: '#f57c00',
          container: '#fff3e0',
        },
        // shadcn compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        '2xl': "1.25rem",
        '3xl': "1.5rem",
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 64, 51, 0.06)',
        'card-hover': '0 4px 16px rgba(0, 64, 51, 0.1)',
        'float': '0 8px 32px rgba(0, 64, 51, 0.08)',
        'ambient': '0 24px 48px rgba(0, 64, 51, 0.06)',
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
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.25s ease-out",
        "slide-in": "slide-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
