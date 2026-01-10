"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { BlackHole } from "../components/black-hole"
import { ShootingStars } from "../components/shooting-stars"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background Visual: Black Hole Shader */}
      <div className="absolute inset-0 z-0">
        <BlackHole />
        <ShootingStars />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full h-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-between py-12 pointer-events-none">

        {/* Top Left: Name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col gap-1"
        >
          <h2 className="font-mono text-xs tracking-[0.4em] text-white/40 ml-1">PORTFOLIO_V4</h2>
          <h1 className="font-sans text-5xl md:text-8xl font-bold tracking-tighter text-white mix-blend-difference uppercase leading-[0.8]">
            AASHIR
            <span className="block font-serif italic font-light text-white/60 ml-2">JAVED</span>
          </h1>
        </motion.div>

        {/* Center Bottom: Actions (Resume + Initialize) */}
        {/* Center Bottom: Actions (Resume + Initialize) */}
        <div className="absolute left-1/2 bottom-20 -translate-x-1/2 flex flex-col items-center gap-8 z-50 pointer-events-auto w-full max-w-lg">

          <div className="flex items-center gap-6">
            {/* LinkedIn Logo */}
            <motion.a
              href="https://www.linkedin.com/in/aashir-javed-aj28"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-all group"
            >
              <svg className="w-5 h-5 text-white/80 group-hover:text-white fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </motion.a>

            {/* Resume Download - BIGGER & VISIBLE */}
            <motion.a
              href="/resume.docx"
              download
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full w-full max-w-[280px] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-all duration-300"
            >
              <span className="font-mono text-sm font-bold tracking-widest uppercase group-hover:text-orange-600 transition-colors">
                Download Resume
              </span>
              <svg className="w-5 h-5 group-hover:translate-y-1 group-hover:text-orange-600 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </motion.a>

            {/* GitHub Logo */}
            <motion.a
              href="https://github.com/Aaxhirrr"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2.2, duration: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-all group"
            >
              <svg className="w-5 h-5 text-white/80 group-hover:text-white fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </motion.a>
          </div>

          {/* Initialize Text Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            className="text-[10px] font-mono tracking-[0.3em] text-white/40 hover:text-white transition-colors uppercase border-b border-transparent hover:border-white/40 pb-1"
          >
            INITIALIZE_SYSTEM
          </motion.button>
        </div>

        {/* Bottom Bar Container */}
        <div className="flex justify-between items-end w-full mix-blend-difference pointer-events-none">

          {/* Bottom Left: AI ENGINEER */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-left"
          >
            <p className="font-mono text-[9px] tracking-[0.3em] text-white/40 mb-2">01 // DISCIPLINE</p>
            <h2 className="font-sans text-4xl md:text-7xl font-bold tracking-tighter text-white leading-[0.8]">
              AI
            </h2>
            <span className="block text-2xl md:text-5xl font-light italic font-serif text-white/50 -mt-1 md:-mt-2 ml-1">
              ENGINEER
            </span>
          </motion.div>

          {/* Bottom Right: SOFTWARE DEVELOPER */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-right"
          >
            <p className="font-mono text-[9px] tracking-[0.3em] text-white/40 mb-2">02 // CRAFT</p>
            <h2 className="font-sans text-4xl md:text-7xl font-bold tracking-tighter text-white leading-[0.8]">
              SOFTWARE
            </h2>
            <span className="block text-2xl md:text-5xl font-light italic font-serif text-white/50 -mt-1 md:-mt-2 mr-1">
              DEVELOPER
            </span>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
