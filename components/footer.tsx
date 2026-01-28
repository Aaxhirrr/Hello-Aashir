"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Footer() {
  const [time, setTime] = useState("")

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
      setTime(timeString)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer id="contact" className="relative w-full bg-black text-white pt-10 pb-8 overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-center gap-8 mb-10">

          {/* Combined Contact Section */}
          <div className="flex flex-col items-center gap-8 z-10 w-full max-w-2xl text-center">

            {/* Restored Motto */}
            <p className="font-mono text-xs tracking-[0.3em] text-white/40 mb-4">08 // CONTACT</p>
            <h2 className="text-4xl md:text-6xl font-sans font-bold tracking-tighter text-center">
              Let's build the <span className="italic font-serif text-white/50">unimagined.</span>
            </h2>
            <div className="mt-4 px-4 py-1 border border-amber-500/30 rounded-full bg-amber-500/10 backdrop-blur-sm">
              <p className="font-mono text-[10px] tracking-widest text-amber-500 uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Under Progress
              </p>
            </div>

            {/* Clean Email Copy Row */}
            <div className="group flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full p-2 pr-4 transition-all duration-300">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 text-white/50">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-mono text-sm text-white/80 tracking-wide">
                anola133@asu.edu
              </span>
              <div className="w-px h-4 bg-white/10 mx-2" />
              <button
                onClick={() => {
                  navigator.clipboard.writeText("anola133@asu.edu")
                  const btn = document.getElementById("copy-btn-minimal")
                  if (btn) {
                    const original = btn.innerText
                    btn.innerText = "COPIED"
                    btn.classList.add("text-green-400")
                    setTimeout(() => {
                      btn.innerText = original
                      btn.classList.remove("text-green-400")
                    }, 2000)
                  }
                }}
                id="copy-btn-minimal"
                className="font-mono text-[10px] font-bold tracking-widest text-white/40 hover:text-white uppercase transition-colors"
              >
                COPY
              </button>
            </div>

          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">

          {/* Local Time */}
          <div className="font-mono text-xs tracking-widest text-white/40">
            <span className="mr-2 text-amber-500">LOCAL_TIME</span>
            <span className="text-white/60 tabular-nums">{time}</span>
          </div>

          {/* Social Links Removed */}
          <div />

          {/* Copyright */}
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            © 2026 Aashir Javed
          </div>

        </div>
      </div>
    </footer>
  )
}
