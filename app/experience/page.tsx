"use client"

import { Experience } from "../../components/experience"
import { MilkyWay } from "../../components/milky-way"

export default function ExperiencePage() {
    return (
        <main className="relative min-h-screen pt-24">
            <div className="fixed inset-0 w-full h-full -z-10">
                <MilkyWay />
            </div>
            <Experience />
        </main>
    )
}
