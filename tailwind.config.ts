// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Tailwind blue-500
        "primary-foreground": "#ffffff",
      },
    },
  },
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  darkMode: "class", // Optional, ShadCN often uses class-based dark mode
}

export default config
