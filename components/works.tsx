"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const projects = [
  {
    id: "01",
    title: "Kairos",
    subtitle: "Agentic Trading",
    description: "Orchestrates Claude 3.5 with multiple APIs (PolyMarket, Nevua) for personalized trading.",
    tags: ["Next.js", "Anthropic", "PolyMarket"],
    image: "/images/kairos.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Kairos",
    private: false,
    award: "1st Place - Anthropic x HacksASU"
  },
  {
    id: "02",
    title: "Clozyt.flo",
    subtitle: "Fashion Algo",
    description: "TikTok-style fashion recommender with real-time FastAPI backend & FAISS.",
    tags: ["FastAPI", "React", "FAISS"],
    image: "/images/clozyt.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Clozyt.flo",
    private: false,
    award: "1st Place - DevLabs DevHacks"
  },
  {
    id: "03",
    title: "Aithena",
    subtitle: "Neural Network",
    description: "AI-powered social network for students with Google Gemini reasoning core.",
    tags: ["React", "FastAPI", "Firebase"],
    image: "/images/aithena.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Aithena",
    private: false,
    award: null
  },
  {
    id: "04",
    title: "Four o' Three",
    subtitle: "Data Optimizer",
    description: "Financial data optimizer for loan/retirement profiles.",
    tags: ["Python", "SQL", "AWS"],
    image: "/images/four_o_three.png",
    year: "2024",
    link: "#",
    private: true,
    award: "3rd Place - FinTech Hackathon"
  },
  {
    id: "05",
    title: "Data Den",
    subtitle: "GPU Workspace",
    description: "AI-powered GPU tutoring & benchmarking platform for NVIDIA hardware.",
    tags: ["RAPIDS", "Gradio", "LangGraph"],
    image: "/images/Data_Den.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Data-Den",
    private: false,
    award: "3rd Place - NVIDIA x AI Spark"
  },
]

export function Works() {
  const [activeId, setActiveId] = useState<string>("01")
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <section id="works" className="relative py-32 px-4 md:px-8 max-w-[1600px] mx-auto">

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12 flex flex-col items-center text-center gap-2"
      >
        <p className="font-mono text-[10px] tracking-[0.4em] text-amber-500/60 uppercase">
          05 // SELECTED WORKS
        </p>
        <h2 className="font-sans text-4xl md:text-6xl font-bold tracking-tighter text-white">
          Selected <span className="italic font-serif font-light text-white/50">Works</span>
        </h2>
      </motion.div>

      {/* Accordion Container */}
      <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[500px] gap-2 md:gap-4">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            layout
            onClick={(e) => {
              if (project.private) {
                e.preventDefault()
                setModalOpen(true)
              }
              if (window.innerWidth < 768) {
                setActiveId(project.id)
              }
            }}
            onMouseEnter={() => setActiveId(project.id)}
            className={`
                    relative h-full rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-out border border-white/5
                    ${activeId === project.id
                ? "flex-[4] md:flex-[3] border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                : "flex-[1] opacity-70 grayscale hover:opacity-100 hover:grayscale-0"}
                `}
          >
            <a
              href={project.private ? "#" : project.link}
              target={project.private ? "_self" : activeId === project.id ? "_blank" : "_self"}
              className="block w-full h-full relative"
              onClick={(e) => {
                if (activeId !== project.id) e.preventDefault(); // Prevent click logic if expanding
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={project.image}
                  alt={project.title}
                  className={`
                                w-full h-full object-cover transition-transform duration-1000
                                ${activeId === project.id ? "scale-105" : "scale-125"}
                            `}
                />
                <div className={`
                            absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500
                            ${activeId === project.id ? "opacity-90" : "opacity-60"}
                         `} />
              </div>

              {/* Content Container */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end overflow-hidden">

                {/* ID Marker (Always Visible) */}
                <div className="absolute top-6 left-6 font-mono text-xs text-amber-500/60 tracking-[0.2em] border-l border-amber-500/60 pl-2">
                  {project.id}
                </div>

                {/* Collapsed Vertical Text (Visible when NOT active) */}
                <div className={`
                             absolute inset-0 flex items-center justify-center transition-opacity duration-300
                             ${activeId !== project.id ? "opacity-100 delay-300" : "opacity-0"}
                         `}>
                  <h3 className="font-mono text-2xl text-white/60 tracking-[0.5em] uppercase -rotate-90 whitespace-nowrap">
                    {project.title.substring(0, 6).toUpperCase()}
                  </h3>
                </div>

                {/* Expanded Content (Visible when active) */}
                <div className={`
                            flex flex-col gap-3 transition-all duration-500 transform
                            ${activeId === project.id ? "opacity-100 translate-y-0 delay-100" : "opacity-0 translate-y-10 absolute bottom-6"}
                        `}>

                  <div className="flex justify-between items-end">
                    <div>
                      {project.award && (
                        <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded">
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                            {project.award.includes("1st") ? "🏆 Trophy" : "🏅 Award"}
                          </span>
                          <div className="w-px h-2 bg-amber-500/30" />
                          <span className="text-[9px] font-mono text-amber-200/80">
                            {project.award.split(" - ")[1]}
                          </span>
                        </div>
                      )}
                      <h3 className="text-3xl md:text-5xl font-bold text-white leading-none">
                        {project.title}
                      </h3>
                      <p className="font-mono text-xs text-amber-500/80 uppercase tracking-widest mt-1">
                        {project.subtitle}
                      </p>
                    </div>

                    <div className={`w-12 h-12 rounded-full border border-white/20 flex items-center justify-center ${project.private ? "bg-red-500/10 text-red-500" : "bg-white/10 text-white"}`}>
                      {project.private ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                      ) : (
                        <svg className="w-5 h-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-white/60 font-light leading-relaxed max-w-xl">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-white/50 uppercase tracking-wider hover:bg-white/10 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>
            </a>
          </motion.div>
        ))}
      </div>

      {/* Security Modal for Private Project */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#050505] border border-red-500/20 rounded-xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(220,38,38,0.15)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
              <div className="flex flex-col items-center text-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-red-900/10 flex items-center justify-center border border-red-500/20 mb-2">
                  <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-mono text-xl text-red-500 tracking-widest uppercase">Classified Asset</h3>
                <p className="text-white/60 text-sm">
                  Repository hosted securely on <span className="text-white">AWS CodeCommit</span>.
                </p>
                <p className="text-white/40 text-xs max-w-xs">
                  Restricted access due to TIAA/Fintech IP Protection Protocols.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 px-8 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded text-[10px] font-mono tracking-[0.2em] text-red-400 transition-colors uppercase"
                >
                  Close Protocol
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
