"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import  {Card}  from "@/components/ui/Card";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import image from "../../assets/image.png";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 min-h-[76vh] flex items-center rounded-b-[15vh] z-20" style={{ backgroundColor: 'hsl(var(--hero-bg))' }}>
        {/* Circle Element - Top Center (Half Visible) */}
        <div className="absolute -top-[36vh] left-1/2 transform -translate-x-1/2 z-0">
          <div className="relative w-[72vh] h-[72vh] rounded-full bg-gradient-to-br from-orange-500 via-red-500 via-fuchsia-500 to-blue-500 opacity-100 saturate-[2] brightness-125 z-0 blur-[80px]">
          </div>
        </div>
        <div className="w-full px-6 sm:px-8 lg:px-12 z-10">
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
                <span className="whitespace-nowrap">
                  <span>Master</span> Algorithms.
                </span>
                <span className="whitespace-nowrap block text-primary">
                  Dominate <span>Competitions.</span>
                </span>
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
                  <Link href="/auth">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 py-3" asChild>
                  <Link href="/auth">Login</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="absolute top-0 left-1/2 h-96 lg:h-full min-h-[500px] lg:min-h-[700px] w-full z-0"
          >
            <div className="absolute inset-0 z-0"> 
              <div className="relative w-full h-full">
                <div className="absolute inset-0 overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
                    style={{
                      backgroundImage: `url(${image.src || image})`,
                      WebkitClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 10% 100%)',
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 10% 100%)'
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-black/20"
                    style={{
                      WebkitClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 10% 100%)',
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 10% 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-34 py-20 min-h-[60vh] flex items-end justify-center rounded-b-[15vh] z-10 shadow-sm" style={{ backgroundColor: 'hsl(var(--stats-bg))' }}>
        <div className="w-full px-6 sm:px-8 lg:px-2">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                Building Momentum
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
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

      {/* Features Section */}
      <section className="py-30 sm:py-32 bg-muted h-[105vh] flex items-center -mt-34 z-0" style={{ backgroundImage: 'var(--features-gradient)' }}>
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
      <section className="relative h-[70vh] flex items-center rounded-t-[15vh] -mt-32 z-10 py-24 sm:py-32 shadow-[0_-15px_30px_-5px_rgba(0,0,0,0.1)]" style={{ backgroundColor: 'hsl(var(--how-it-works-bg))' }}>
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
                Step-by-Step
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
                  <Link href="/auth">
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
                    <path className="fill-[#FFFFFF]" d="M8 0.667A7.26 7.26 0 0 0 0.667 7.847 7.193 7.193 0 0 0 5.68 14.667c0.367 0.067 0.5 -0.153 0.5 -0.347v-1.22c-2.04 0.433 -2.473 -0.96 -2.473 -0.96a1.907 1.907 0 0 0 -0.813 -1.053c-0.667 -0.44 0.053 -0.433 0.053 -0.433a1.54 1.54 0 0 1 1.12 0.74 1.58 1.58 0 0 0 2.133 0.593 1.553 1.553 0 0 1 0.467 -0.96c-1.627 -0.18 -3.333 -0.793 -3.333 -3.547a2.767 2.767 0 0 1 0.74 -1.94 2.52 2.52 0 0 1 0.073 -1.893s0.62 -0.193 2 0.733a7.133 7.133 0 0 1 3.667 0c1.4 -0.927 2 -0.733 2 -0.733a2.52 2.52 0 0 1 0.073 1.893A2.767 2.767 0 0 1 12.667 7.467c0 2.76 -1.72 3.367 -3.333 3.547a1.667 1.667 0 0 1 0.5 1.333v1.967c0 0.233 0.133 0.42 0.5 0.347A7.2 7.2 0 0 0 15.333 7.847 7.26 7.26 0 0 0 8 0.667"/>
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
                    <path className = "fill-[#5865F2]" d="M13.553 1.037A13.031 13.031 0 0 0 10.253 0c-0.142 0.257 -0.308 0.603 -0.423 0.878q-1.846 -0.278 -3.658 0c-0.115 -0.275 -0.284 -0.621 -0.428 -0.878a12.988 12.988 0 0 0 -3.303 1.04C0.351 4.197 -0.215 7.275 0.068 10.31c1.386 1.035 2.728 1.663 4.048 2.075A10.063 10.063 0 0 0 4.983 10.956a8.525 8.525 0 0 1 -1.365 -0.664 6.813 6.813 0 0 0 0.335 -0.265c2.633 1.231 5.493 1.231 8.094 0a8.25 8.25 0 0 0 0.335 0.265 8.5 8.5 0 0 1 -1.368 0.666c0.25 0.501 0.54 0.979 0.867 1.428 1.321 -0.411 2.665 -1.04 4.051 -2.076 0.332 -3.518 -0.568 -6.568 -2.378 -9.273M5.342 8.443c-0.79 0 -1.438 -0.738 -1.438 -1.636s0.634 -1.637 1.438 -1.637 1.452 0.738 1.438 1.637c0.001 0.898 -0.634 1.636 -1.438 1.636m5.316 0c-0.79 0 -1.438 -0.738 -1.438 -1.636s0.634 -1.637 1.438 -1.637c0.804 0 1.452 0.738 1.438 1.637 0 0.898 -0.634 1.636 -1.438 1.636"/>
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
                    <path className = "fill-[#E1306C]" d= "M8 0C5.827 0 5.555 0.01 4.702 0.048 3.85 0.088 3.27 0.222 2.76 0.42c-0.526 0.204 -0.973 0.478 -1.417 0.923S0.623 2.233 0.42 2.76C0.222 3.27 0.087 3.85 0.048 4.702 0.008 5.555 0 5.827 0 8s0.01 2.445 0.048 3.298c0.04 0.851 0.174 1.432 0.372 1.942a3.933 3.933 0 0 0 0.923 1.417A3.933 3.933 0 0 0 2.76 15.58c0.511 0.197 1.091 0.333 1.942 0.372C5.555 15.992 5.827 16 8 16s2.445 -0.01 3.298 -0.048c0.851 -0.04 1.432 -0.175 1.942 -0.372a3.933 3.933 0 0 0 1.417 -0.923 3.933 3.933 0 0 0 0.923 -1.417c0.197 -0.51 0.333 -1.091 0.372 -1.942 0.04 -0.853 0.048 -1.125 0.048 -3.298s-0.01 -2.445 -0.048 -3.298c-0.04 -0.851 -0.175 -1.433 -0.372 -1.942a3.933 3.933 0 0 0 -0.923 -1.417A3.9 3.9 0 0 0 13.24 0.42c-0.51 -0.198 -1.091 -0.333 -1.942 -0.372C10.445 0.008 10.173 0 8 0m0 1.44c2.135 0 2.39 0.011 3.233 0.047 0.78 0.037 1.203 0.166 1.485 0.277 0.375 0.145 0.64 0.318 0.921 0.597 0.279 0.28 0.453 0.546 0.597 0.921 0.109 0.281 0.24 0.705 0.275 1.485 0.038 0.844 0.047 1.097 0.047 3.233s-0.01 2.39 -0.049 3.233c-0.041 0.78 -0.171 1.203 -0.281 1.485a2.533 2.533 0 0 1 -0.599 0.921 2.493 2.493 0 0 1 -0.92 0.597c-0.28 0.109 -0.71 0.24 -1.49 0.275 -0.849 0.038 -1.099 0.047 -3.239 0.047s-2.391 -0.01 -3.239 -0.049c-0.781 -0.041 -1.211 -0.171 -1.491 -0.281a2.467 2.467 0 0 1 -0.919 -0.599 2.427 2.427 0 0 1 -0.6 -0.92c-0.11 -0.28 -0.239 -0.71 -0.28 -1.49 -0.03 -0.84 -0.041 -1.099 -0.041 -3.229s0.011 -2.391 0.041 -3.241c0.041 -0.78 0.17 -1.209 0.28 -1.489 0.14 -0.38 0.319 -0.64 0.6 -0.921 0.279 -0.279 0.54 -0.459 0.919 -0.599 0.28 -0.111 0.701 -0.241 1.481 -0.281 0.85 -0.03 1.1 -0.04 3.239 -0.04zm0 2.452a4.108 4.108 0 1 0 0 8.216 4.108 4.108 0 1 0 0 -8.216M8 10.667c-1.473 0 -2.667 -1.193 -2.667 -2.667s1.193 -2.667 2.667 -2.667 2.667 1.193 2.667 2.667 -1.193 2.667 -2.667 2.667m5.231 -6.937a0.961 0.961 0 0 1 -1.92 0 0.96 0.96 0 0 1 1.92 0"/>
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
