"use client"

import { About } from "../../components/about"
import { Bio } from "../../components/bio"
import { TechMarquee } from "../../components/tech-marquee"

export default function AboutPage() {
    return (
        <main className="pt-24">
            <About />
            <Bio />
            <TechMarquee />
        </main>
    )
}
