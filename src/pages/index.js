import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import Competence from "../components/Competence"
import About from "../components/About"
import Tabs from "../components/Tabs/index"
import Technologies from "../components/Technologies/index"

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Competence />
      <About />
      <Tabs />
      <Technologies />
    </div>
  )
}
