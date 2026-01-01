"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 w-full"
    >
      <motion.nav
        animate={{
          backgroundColor: scrolled ? "hsl(var(--background))" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid hsl(var(--border))" : "none",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full transition-all duration-300"
      >
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 max-w-7xl mx-auto">
            {/* Logo */}
            <Link 
              href="/" 
              className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
            >
              Algonauts Arena
            </Link>

            {/* Navigation Actions */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>
    </motion.header>
  );
}
