import { HeroExperience } from "@/widgets/hero-experience";
import { MediaArchive } from "@/widgets/media-archive";
import { MemoryStory } from "@/widgets/memory-story";
import { DownloadSection } from "@/widgets/download-section";
import { LandingMotion } from "./landing/LandingMotion";

export default function Home() {
  return (
    <>
      <a className="skip" href="#main-content">
        Skip to content
      </a>
      <header className="mast">
        <a className="brand" href="#reel" aria-label="MainFeed home">
          <img src="/assets/icon.webp" alt="" />
          MainFeed
        </a>
        <nav aria-label="Main navigation">
          <a href="#studio">Inside the app</a>
        </nav>
      </header>
      <main id="main-content" tabIndex={-1}>
        <HeroExperience />
        <MediaArchive />
        <MemoryStory />
        <DownloadSection />
      </main>
      <div className="shutter-wash" aria-hidden="true"></div>
      <LandingMotion />
    </>
  );
}
