import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D5016", // 산림 초록
        secondary: "#87CEEB", // 맑은 하늘색
        accent: "#FF8C42", // 따뜻한 주황
      },
    },
  },
  plugins: [],
};
export default config;
