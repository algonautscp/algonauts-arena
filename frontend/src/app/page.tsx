"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 min-h-screen flex items-center">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Text + CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
              >
                Master Algorithms.
                <span className="block text-primary">Dominate Competition.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0"
              >
                Where elite programmers sharpen their competitive edge.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button size="lg" className="text-base px-8 py-3" asChild>
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-3" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Column: Animated Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative h-96 lg:h-full min-h-[400px] flex items-center justify-center"
            >
              {/* Floating Abstract Cards */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 w-24 h-32 bg-primary/10 border border-primary/20 rounded-lg backdrop-blur-sm"
              />
              
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-20 left-10 w-20 h-20 bg-secondary/50 border border-border rounded-lg backdrop-blur-sm"
              />
              
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="absolute bottom-20 right-20 w-28 h-16 bg-muted/50 border border-border rounded-lg backdrop-blur-sm"
              />
              
              <motion.div
                animate={{
                  y: [0, 12, 0],
                  rotate: [0, -2, 0],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-10 left-20 w-16 h-24 bg-accent/20 border border-accent/30 rounded-lg backdrop-blur-sm"
              />
              
              {/* Central Element */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-32 h-32 bg-primary/15 border border-primary/30 rounded-2xl backdrop-blur-sm flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-16 h-16 bg-primary/30 rounded-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Compete. Grow. Win.
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to climb the ranks and dominate the leaderboard.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: (
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-sm" />
                    </div>
                  ),
                  title: "Real Contests",
                  description: "Compete in timed challenges against top programmers worldwide."
                },
                {
                  icon: (
                    <div className="w-8 h-8 bg-secondary/50 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-secondary-foreground rounded-sm" />
                    </div>
                  ),
                  title: "Skill Tracking",
                  description: "Monitor your progress with detailed analytics and performance metrics."
                },
                {
                  icon: (
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-accent-foreground rounded-sm" />
                    </div>
                  ),
                  title: "Practice Arena",
                  description: "Sharpen your skills with unlimited problems and instant feedback."
                },
                {
                  icon: (
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-sm" />
                    </div>
                  ),
                  title: "Global Rankings",
                  description: "Climb leaderboards and prove you're among the elite."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1, 
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.2)",
                  }}
                  className="group"
                >
                  <Card className="h-full p-6 bg-background border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 sm:py-32">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                How It Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
              {[
                {
                  number: "01",
                  title: "Join",
                  description: "Create your account and join the competitive programming community."
                },
                {
                  number: "02", 
                  title: "Practice",
                  description: "Sharpen your skills with unlimited problems and instant feedback."
                },
                {
                  number: "03",
                  title: "Compete",
                  description: "Enter contests and climb the global leaderboards."
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: 30 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.2, 
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-muted-foreground/20 mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 sm:py-32 bg-muted/30">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Building Momentum
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                Join a growing community of competitive programmers pushing their limits.
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {[
                { number: "25+", label: "Members" },
                { number: "10+", label: "Contests" },
                { number: "1,000+", label: "Problems Solved" },
                { number: "50+", label: "Daily Active" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1, 
                    ease: "easeOut" 
                  }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Terminal-Style Footer with CTA */}
      <footer className="bg-slate-950 text-slate-100 border-t border-slate-800">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-6xl mx-auto py-16">
            {/* Embedded CTA */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-green-400">
                Ready to Compete?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                Join thousands of programmers pushing their limits every day.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button size="lg" className="text-base px-8 py-3 bg-green-600 hover:bg-green-500 text-white" asChild>
                  <Link href="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Divider */}
            <div className="border-t border-slate-800 mb-12"></div>

            {/* Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Brand Info */}
              <div className="space-y-2">
                <p className="text-green-400 font-medium">
                  Built by LoneLight · Algonauts Club
                </p>
                <p className="text-slate-400">NST Pune</p>
                <p className="text-slate-500 text-sm">
                  © 2024 Algonauts Arena
                </p>
                <p className="text-slate-600 text-xs">
                  MIT License
                </p>
              </div>

              {/* Navigation */}
              <div className="flex flex-col items-center md:items-start space-y-2">
                <Link 
                  href="/about" 
                  className="text-slate-400 hover:text-green-400 transition-colors"
                >
                  About
                </Link>
                <Link 
                  href="/privacy" 
                  className="text-slate-400 hover:text-green-400 transition-colors"
                >
                  Privacy
                </Link>
                <Link 
                  href="/terms" 
                  className="text-slate-400 hover:text-green-400 transition-colors"
                >
                  Terms
                </Link>
              </div>

              {/* Social Icons */}
              <div className="flex items-center justify-center md:justify-end space-x-4">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.75-2.53-.75-.82-1.63-2.02-2.02-3.63-.2-.39-.42-.67-.63-1.06.02-.37.4-.65.88-.65 1.63.02 2.01.75 2.53 1.5.82 2.02 3.63.2.39.42.67.63 1.06-.01.19-.01.82-.01 1.49 2.01-.37 2.53-.75 2.53-.75.82-1.63 2.02-2.02 3.63-.2.39-.42-.67-.63-1.06.02-.37.4-.65.88-.65 1.63-.02 2.01-.75 2.53-1.5.82-2.02 3.63-.2.39-.42.67-.63 1.06z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.545 2.907a13.227 13.227 0 00-3.257-1.011.052-.964-.076-2.151.076-2.151 1.496.076 2.151.076 1.496.076 2.151 1.496 1.496 2.151 1.496 2.151zm-3.257 1.011a13.227 13.227 0 00-3.257 1.011c-.052.964.076 2.151-.076 2.151-1.496-.076-2.151-.076-2.151-1.496-.076-2.151-.076-1.496-.076-2.151 1.496-.076 2.151.076 1.496.076 2.151z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 0C5.829 0 4 1.829 4 4v1c0 1.105.895 2 2 2h4c1.105 0 2-.895 2-2V4c0-2.171-1.829-4-4-4zm4 5v1c0 1.105-.895 2-2 2H6c-1.105 0-2-.895-2-2V5c0-1.105.895-2 2-2h4c1.105 0 2 .895 2 2z"/>
                  </svg>
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
