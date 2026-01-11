"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

// Order: Future -> Newest -> Oldest
const experiences = [
    {
        id: "LOG-01",
        role: "Research Intern",
        company: "Fulton Undergraduate Research Initiative",
        period: "Jan 2026 — Present",
        desc: "Building a benchmark testbed to simulate memory in AI systems using large real-world Alzheimer’s datasets, combining software engineering and machine learning.",
        tech: ["Python", "PyTorch", "Medical AI"]
    },
    {
        id: "LOG-02",
        role: "Beta Contributor",
        company: "CreateAI Lab",
        period: "Aug 2025 — Present",
        desc: "Evaluated and stress-tested 30+ LLMs. Collaborated with faculty to turn needs into clear requirements for custom assistants with responsible-AI guardrails.",
        tech: ["LLMs", "Eval", "Prompt Eng"]
    },
    {
        id: "LOG-03",
        role: "Software Engineering Intern",
        company: "Sedai Inc.",
        period: "May 2025 — Oct 2025",
        desc: "Built log analysis pipelines on Amazon Bedrock. Unified schemas to improve consistency by 40% and documented pipeline architecture in Git.",
        tech: ["AWS Bedrock", "Python", "Distributed Systems"]
    },
    {
        id: "LOG-04",
        role: "Undergraduate Researcher",
        company: "Ira A. Fulton Schools",
        period: "Jan 2025 — Aug 2025",
        desc: "Engineered OntoKGen-Bio: an end-to-end ETL pipeline constructing a biomedical knowledge graph from PubMed abstracts, modeling 364 semantic relations.",
        tech: ["Neo4j", "NLP", "ETL"]
    },
    {
        id: "LOG-05",
        role: "Mathematics Assistant",
        company: "Arizona State University",
        period: "Aug 2024 — Present",
        desc: "Facilitated instruction for linear algebra, statistics, calculus, and discrete math. Delivered academic support through tutoring.",
        tech: ["Mathematics", "Pedagogy"]
    },
    {
        id: "LOG-06",
        role: "Project Lead",
        company: "EPICS at ASU",
        period: "Aug 2024 — May 2025",
        desc: "Leading development of an autonomous safety escort system.",
        tech: ["C++", "ROS", "LiDAR", "SLAM"],
        subExperiences: [
            {
                role: "Software Lead",
                period: "Nov 2024 — May 2025",
                desc: "Led team using LiDAR-based SLAM for autonomous navigation. Implemented A* and Dijkstra path-planning, reducing latency by 30%."
            },
            {
                role: "Research Lead",
                period: "Aug 2024 — Nov 2024",
                desc: "Oversaw system design studies and feasibility analysis. Conducted early LiDAR SLAM experimentation."
            }
        ]
    },
    {
        id: "LOG-07",
        role: "Open Source Project",
        company: "Pyramid Computer Solutions",
        period: "Dec 2024 — Jan 2025",
        desc: "Developed a lightweight Python CLI tool for automated data-integrity checks in ETL workflows, achieving >99% validation accuracy and reducing manual debugging by 60%. Migrated legacy Python 2 codebase to Python 3 with full PyTest coverage.",
        tech: ["Python", "ETL", "CLI", "PyTest"]
    }
]

export function Experience() {
    return (
        <section id="experience" className="relative py-32 px-4 md:px-0 max-w-6xl mx-auto min-h-screen bg-black/20 backdrop-blur-sm rounded-3xl my-24 border border-white/5">
            {/* Header - Cinematic Title */}
            <div className="mb-32 flex items-baseline justify-between border-b border-white/10 pb-4 pl-4 md:pl-0">
                <div className="relative">
                    <span className="absolute -top-6 left-0 font-mono text-[9px] tracking-[0.3em] text-amber-500/60 uppercase">
                        04 // EXPERIENCE
                    </span>
                    <h2 className="font-serif italic text-5xl md:text-7xl text-white mix-blend-difference">
                        Traj<span className="text-white/40 font-sans not-italic font-light">ectory</span>
                    </h2>
                </div>
                <div className="hidden md:flex gap-8 font-mono text-[10px] text-white/30 tracking-widest uppercase">
                    <span>Sys.Status: Nominal</span>
                    <span>T-Minus: 00:00:00</span>
                </div>
            </div>

            <div className="relative border-l border-white/5 md:ml-4 pl-8 md:pl-16 space-y-20">
                {experiences.map((exp, i) => (
                    <ExperienceItem key={i} data={exp} />
                ))}
            </div>
        </section>
    )
}

function ExperienceItem({ data }: { data: typeof experiences[0] }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="group relative"
        >
            {/* Horizontal Guide Line */}
            <div className="absolute -left-8 md:-left-16 top-6 w-8 md:w-12 h-[1px] bg-white/10 group-hover:bg-amber-500/50 transition-colors duration-500" />

            {/* Node Element */}
            <div className="absolute -left-[35px] md:-left-[67px] top-[21px] w-[7px] h-[7px] bg-black border border-white/30 rotate-45 group-hover:bg-amber-500 group-hover:border-amber-500 transition-colors duration-500 z-10" />

            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-16 items-start">

                {/* Left: Metadata HUD */}
                <div className="flex flex-col gap-1 md:text-right md:items-end font-mono">
                    <span className="text-xs text-amber-500/60 tracking-[0.2em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {data.id}
                    </span>
                    <span className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
                        {data.period}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/60 mt-1">
                        {data.company}
                    </span>
                </div>

                {/* Right: Content - Cinematic */}
                <div className="relative pt-1">
                    <h3 className="font-serif italic text-3xl md:text-4xl text-amber-50 mb-4 group-hover:text-amber-400 transition-colors duration-500">
                        {data.role}
                    </h3>

                    <p className="text-white/60 font-light leading-relaxed mb-6 text-sm md:text-base max-w-2xl border-l-[1px] border-white/10 pl-4">
                        {data.desc}
                    </p>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2 pl-4">
                        {data.tech.map((t, j) => (
                            <span key={j} className="text-[10px] font-mono text-white/30 uppercase tracking-[0.15em] hover:text-amber-500 transition-colors cursor-crosshair">
                                [{t}]
                            </span>
                        ))}
                    </div>

                    {/* Sub-Experiences: Docked Modules style */}
                    {data.subExperiences && (
                        <div className="mt-8 pl-4 space-y-6">
                            {data.subExperiences.map((sub, k) => (
                                <div key={k} className="relative group/sub">
                                    <div className="absolute -left-[17px] top-2 w-[1px] h-full bg-white/5" />
                                    <div className="absolute -left-[19px] top-3 w-[5px] h-[1px] bg-white/20" />

                                    <h4 className="font-sans text-lg text-white/80 tracking-wide mb-1 group-hover/sub:text-amber-200/80 transition-colors">
                                        {sub.role} <span className="text-xs text-white/30 font-mono ml-2 tracking-normal">{sub.period}</span>
                                    </h4>
                                    <p className="text-white/40 text-xs leading-relaxed max-w-xl">
                                        {sub.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}
