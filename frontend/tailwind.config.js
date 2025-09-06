/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      translate: {
        101: "101%",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0%)" },
          to: { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 15s linear infinite",
        fadeUp: "fadeUp 0.5s ease-out forwards",
      },
      colors: {
        sky: {
          400: "#38bdf8",
        },
        lime: {
          400: "#a3e635",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        custom: ["var(--font-custom)", "sans-serif"], // ✅ added custom font
      },
    },
  },
};
