import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customback: "#F5DDDD",
        beige:"#F9F9F9",
        customwhite:"#EAEAEA",
        customgray:"#EAEAEA",
        cooking:"#FFBA08",
        customblue:"#2B4674",
        customred:"#D00000"
      },
    },
  },
  plugins: [],
} satisfies Config;
