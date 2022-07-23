import Navbar from "../components/Navbar"
import { css } from "@emotion/css"
import HeroSection from "../components/HeroSection"
import Competence from "../components/Competence"
import About from "../components/About"
import Tabs from "../components/Tabs/index"
import Technologies from "../components/Technologies/index"

export default function Home() {
  return (
    <div className={css`
        margin: 0;
        width: 100%;
    `}>
      <Navbar />
      <HeroSection />
      <Competence />
      <About />
      <Tabs />
      <Technologies />
    </div>
  )
}
