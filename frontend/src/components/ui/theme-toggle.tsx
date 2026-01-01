"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    // Initialize with system preference or stored value
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const shouldBeDark = stored ? stored === "dark" : systemPrefersDark;
      
      // Apply initial theme
      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      }
      
      return shouldBeDark;
    }
    return false;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-md border border-border bg-background hover:bg-muted transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Sun Icon (Light Mode) */}
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.42 1.42M11.53 11.53l1.42 1.42M3.05 12.95l1.42-1.42M11.53 4.47l1.42-1.42"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* Moon Icon (Dark Mode) */}
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="absolute"
        >
          <path
            d="M3 3.2a6.4 6.4 0 1 1 0 8 4.8 4.8 0 1 0 0-8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </motion.div>
    </motion.button>
  );
}
