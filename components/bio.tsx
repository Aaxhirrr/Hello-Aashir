"use client"

import { motion } from "framer-motion"

export function Bio() {
    return (
        <section id="about" className="relative py-16 px-8 md:px-12 md:py-24 max-w-7xl mx-auto overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10" />

            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <p className="font-mono text-xs tracking-[0.3em] text-white/60 mb-6">07 // ABOUT</p>
                    <h2 className="font-sans text-4xl md:text-6xl font-light leading-none mb-8">
                        Beyond the <br />
                        <span className="italic text-muted-foreground">Codebase</span>
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative"
                >
                    <div className="absolute -left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden md:block" />

                    <div className="space-y-6 text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
                        <p>
                            I am a senior compsci major at <span className="text-white">ASU</span>. I treat models like powerful but unreliable components. They can move fast, and they can also hallucinate, drift, or fail silently. So I build the surrounding machinery: <span className="text-white">evaluation</span>, <span className="text-white">guardrails</span>, <span className="text-white">structured outputs</span>, and <span className="text-white">monitoring</span> that catches “confident wrong” before users do.
                        </p>
                        <p>
                            I build software like it’s going to crash one day, because it will. So I design it with a black box: <span className="italic text-white">structured logs</span>, <span className="italic text-white">tight schemas</span>, <span className="italic text-white">sanity checks</span>, and <span className="italic text-white">traces</span> that tell the story without guesswork.
                        </p>
                        <p>
                            I’m obsessed with the gap between “cool output” and “correct output.” Closing that gap is mostly engineering discipline: contracts, validation, and hard failure modes.
                        </p>
                        <p>
                            I don’t want systems that just impress. I want systems that hold. If a system can’t explain itself under pressure, it doesn’t belong in production.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
