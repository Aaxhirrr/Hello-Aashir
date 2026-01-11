import { Navbar } from "./navbar"
import { Hero } from "./hero"
import { About } from "./about"
import { Works } from "../components/works"
import { Experience } from "../components/experience"
import { TechMarquee } from "../components/tech-marquee"
import { GithubActivity } from "../components/github-activity"
import { Bio } from "../components/bio"
import { Footer } from "./footer"
import { CustomCursor } from "./custom-cursor"
import { SmoothScroll } from "../components/smooth-scroll"
import { SectionBlend } from "./section-blend"
import { MilkyWay } from "../components/milky-way"

export default function Home() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <SectionBlend />

        {/* About Section with Galaxy Backdrop */}
        <div className="relative w-full">
          <MilkyWay />
          <div className="relative z-10">
            <About />
          </div>
        </div>

        {/* Experience Section with Milky Way Backdrop */}
        <div className="relative w-full">
          <MilkyWay />
          <Experience />
        </div>

        <Works />
        <TechMarquee />
        <GithubActivity />
        <Bio />
        <Footer />
      </main>
    </SmoothScroll>
  )
}
