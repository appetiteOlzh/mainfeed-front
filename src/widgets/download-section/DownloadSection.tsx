import Link from "next/link";
import { StoreButtons } from "@/shared/ui/store-buttons";

export function DownloadSection() {
  return (
    <section id="join" className="join" aria-labelledby="download-title">
      <div className="finale-stage">
        <h2 className="finale-title" id="download-title">
          Rediscover your
          <br /> best moments
          <br /> with <span>MainFeed.</span>
        </h2>
        <div
          className="finale-art"
          role="img"
          aria-label="The MainFeed app swiping through personal photos in a full-screen feed"
        >
          <div className="finale-stack" aria-hidden="true">
            <div className="finale-glass">
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
            </div>
            <div className="finale-phone">
              <div className="finale-display" inert>
                <img
                  className="finale-still"
                  src="/assets/birthday.webp"
                  srcSet="/assets/phone/birthday-418.webp 418w, /assets/birthday.webp 836w"
                  sizes="(max-height:540px) and (orientation:landscape) min(21vw,max(95px,calc(44svh - 57.64px))), (max-width:820px) and (max-height:700px) and (orientation:portrait) min(48vw,22.2svh,190px), (max-width:820px) and (orientation:portrait) min(51vw,23svh,255px), min(23vw,max(174px,calc(45svh - 99.9px)),386px)"
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="finale-device-content"></div>
              </div>
            </div>
          </div>
        </div>
        <StoreButtons />
      </div>
      <footer>
        <a className="brand" href="#reel">
          <img src="/assets/icon.webp" alt="" />
          MainFeed
        </a>
        <Link className="privacy-link" href="/privacy">
          Privacy Policy
        </Link>
        <a href="#reel">Back to top</a>
      </footer>
    </section>
  );
}
