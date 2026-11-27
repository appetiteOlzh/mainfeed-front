import { StoreButtons } from "@/shared/ui/store-buttons";
import type { CSSProperties } from "react";

export function HeroExperience() {
  return (
    <div className="experience-cut">
      <section
        className="journey"
        id="experience"
        aria-labelledby="product-title"
      >
        <div
          className="point"
          id="reel"
          style={{ "--at": "0" } as CSSProperties}
        ></div>
        <div
          className="point"
          id="studio"
          tabIndex={-1}
          style={{ "--at": ".50" } as CSSProperties}
        ></div>
        <div
          className="point"
          id="capture"
          style={{ "--at": ".81" } as CSSProperties}
        ></div>
        <div className="stage">
          <canvas className="optical-field" aria-hidden="true"></canvas>
          <canvas className="hero-glass" aria-hidden="true"></canvas>
          <div className="negative-strip" aria-hidden="true"></div>
          <div className="chapter swiping">
            <p className="section-label">
              <i className="lightmark" aria-hidden="true"></i>Open Mainfeed.
              Start swiping.
            </p>
            <h1 id="product-title">
              <span>Swipe</span> <span>your life.</span>
            </h1>
            <p className="body-copy">
              Mainfeed transforms your camera roll into a personalized feed you
              can swipe through like TikTok.
            </p>
            <p className="swipe-caption">
              <span>Rediscover forgotten moments.</span>
              <span aria-hidden="true">Relive adventures.</span>
              <span aria-hidden="true">Find photos you forgot existed.</span>
            </p>
            <StoreButtons />
          </div>
          <div className="chapter choosing">
            <p className="section-label">
              <i className="lightmark" aria-hidden="true"></i>Why people love
              Mainfeed
            </p>
            <h2 id="roll-title">
              <span>Manage your</span> <span>camera roll</span>{" "}
              <span>your way.</span>
            </h2>
            <p className="body-copy" id="choice-copy">
              Discover forgotten memories.
            </p>
            <div
              className="action-choices"
              role="group"
              aria-label="Preview an app action"
            >
              <button type="button" data-mode="order" aria-pressed="false">
                Shuffle
              </button>
              <button type="button" data-mode="share" aria-pressed="false">
                Share
              </button>
              <button type="button" data-mode="delete" aria-pressed="false">
                Delete
              </button>
              <button type="button" data-mode="album" aria-pressed="false">
                Albums
              </button>
            </div>
          </div>
          <div className="chapter ending">
            <p className="section-label">
              <i className="lightmark" aria-hidden="true"></i>100% private
            </p>
            <h2>
              <span>Relive your</span> <span>favorite memories.</span>
            </h2>
            <p className="body-copy">
              No followers. No influencers. No strangers.
            </p>
          </div>
          <div
            className="hardware"
            aria-label="Animated demonstration of Mainfeed"
          >
            <div className="device-content"></div>
          </div>
          <a
            className="scroll-cue"
            href="#studio"
            aria-describedby="roll-title"
          >
            <span className="pointer-label">Scroll</span>
            <span className="touch-label">Swipe</span>
            <span className="cue-arrow" aria-hidden="true">
              ↓
            </span>
          </a>
        </div>
      </section>
      <div
        id="memories"
        className="archive-entry"
        tabIndex={-1}
        role="group"
        aria-labelledby="contact-title"
      ></div>
      <div className="archive-landing">
        <section
          className="archive-intro"
          tabIndex={-1}
          aria-labelledby="contact-title"
        >
          <div className="archive-heading">
            <p className="section-label">The camera roll</p>
            <h2 id="contact-title">
              What if the most interesting content is{" "}
              <em>already on your phone?</em>
            </h2>
          </div>
          <figure className="lake-photo">
            <div className="lake-frame">
              <img
                data-src="/assets/lake.webp"
                width="941"
                height="1672"
                alt="Three friends jumping from a wooden dock into a lake"
                hidden
              />
              <noscript>
                <img
                  src="/assets/lake.webp"
                  width="941"
                  height="1672"
                  alt="Three friends jumping from a wooden dock into a lake"
                  loading="lazy"
                />
              </noscript>
            </div>
          </figure>
        </section>
      </div>
    </div>
  );
}
