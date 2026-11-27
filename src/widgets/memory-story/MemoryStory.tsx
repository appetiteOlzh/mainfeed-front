export function MemoryStory() {
  return (
    <>
      <div id="unseen" className="memory-turn">
        <div className="memory-stage">
          <section
            className="memory-page unseen-page"
            aria-labelledby="unseen-title"
          >
            <div className="memory-paper">
              <h2 id="unseen-title">
                But most of them are <em>never seen again.</em>
              </h2>
            </div>
            <figure className="memory-image">
              <img
                src="/assets/moments/pancakes.webp"
                width="1122"
                height="1402"
                alt="A friend presenting a stack of pancakes with a burnt one on top"
                loading="lazy"
              />
            </figure>
          </section>
          <section
            className="memory-page attention-page"
            aria-labelledby="attention-title"
          >
            <span
              id="attention"
              className="attention-arrival"
              aria-hidden="true"
            ></span>
            <div className="memory-paper">
              <div className="attention-lead">
                <h2 id="attention-title">
                  Stop watching <em>everyone else.</em>
                </h2>
                <p>
                  Every day we spend hours scrolling other people’s highlights.
                </p>
              </div>
              <div className="attention-outro">
                <p>
                  Meanwhile, our own memories sit forgotten inside our phones.
                </p>
                <p>Mainfeed brings them back to life.</p>
              </div>
            </div>
            <div className="memory-window">
              <div className="highlight-words">
                <span>Vacations.</span>
                <span>Parties.</span>
                <span>Achievements.</span>
                <span>Perfect moments.</span>
              </div>
              <figure className="memory-image">
                <img
                  src="/assets/moments/umbrella.webp"
                  width="1122"
                  height="1402"
                  alt="A woman laughing on the seafront as the wind turns her red umbrella inside out"
                  loading="lazy"
                />
              </figure>
            </div>
          </section>
        </div>
      </div>
      <section className="ownership" id="cover" aria-labelledby="cover-title">
        <div
          id="ownership"
          className="poster-arrival"
          tabIndex={-1}
          aria-labelledby="ownership-title"
          role="group"
        ></div>
        <div className="ownership-stage">
          <div className="poster-cover-slot">
            <section className="front-cover" aria-labelledby="cover-title">
              <div className="cover-print">
                <figure className="cover-photo">
                  <picture>
                    <source
                      media="(prefers-reduced-motion:no-preference)"
                      srcSet="/assets/moments/picnic-selfie-start.webp"
                    />
                    <img
                      src="/assets/moments/picnic-selfie.webp"
                      width="941"
                      height="1672"
                      alt="A friend leaning into the camera, laughing on a picnic blanket by the lake"
                      loading="lazy"
                      decoding="async"
                    />
                  </picture>
                  <video
                    data-src="/assets/moments/picnic-selfie.mp4"
                    muted
                    playsInline
                    preload="none"
                    disablePictureInPicture
                    aria-hidden="true"
                  ></video>
                  <i className="focus-corners" aria-hidden="true"></i>
                </figure>
                <div className="cover-type">
                  <h2 id="cover-title">
                    <span>Your life</span>{" "}
                    <span className="negative-word">is the</span>{" "}
                    <span>main feed.</span>
                  </h2>
                  <p className="body-copy">
                    You’ve spent years scrolling everyone else’s life.
                    <br />
                    <strong>It’s time to scroll your own.</strong>
                  </p>
                </div>
              </div>
              <a
                className="scroll-cue"
                href="#ownership"
                aria-describedby="ownership-title"
              >
                <span className="pointer-label">Scroll</span>
                <span className="touch-label">Swipe</span>
                <span className="cue-arrow" aria-hidden="true">
                  ↓
                </span>
              </a>
            </section>
          </div>
          <article
            className="memory-spread spread-life"
            aria-labelledby="spread-life-title"
          >
            <div className="spread-panel">
              <div className="spread-paper">
                <i className="spread-fold" aria-hidden="true"></i>
                <h2 id="ownership-title" className="spread-preface">
                  The most important feed is yours.
                </h2>
                <div className="spread-lettering">
                  <p className="spread-no">
                    <span>Not Instagram.</span>
                  </p>
                  <h3 id="spread-life-title">
                    <span className="spread-your">Your</span>{" "}
                    <span className="spread-noun">life.</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="spread-window">
              <div className="spread-shot">
                <img
                  src="/assets/moments/picnic-selfie.webp"
                  width="941"
                  height="1672"
                  alt="A lakeside picnic selfie, caught mid-laugh"
                  loading="lazy"
                />
                <canvas
                  className="selfie-snapshot"
                  aria-hidden="true"
                  hidden
                ></canvas>
              </div>
            </div>
          </article>
          <article
            className="memory-spread spread-memories"
            aria-labelledby="spread-memories-title"
          >
            <div className="spread-panel">
              <div className="spread-paper">
                <i className="spread-fold" aria-hidden="true"></i>

                <div className="spread-lettering">
                  <p className="spread-no">
                    <span>Not TikTok.</span>
                  </p>
                  <h3 id="spread-memories-title">
                    <span className="spread-your">Your</span>{" "}
                    <span className="spread-noun">memories.</span>
                  </h3>
                </div>
              </div>
            </div>
            <div className="spread-window">
              <div className="spread-shot">
                <img
                  src="/assets/moments/camp-chair.webp"
                  width="1122"
                  height="1402"
                  alt="A retriever asleep in the camp chair while its owner drinks coffee on the picnic blanket"
                  loading="lazy"
                />
              </div>
            </div>
          </article>
          <article
            className="memory-spread spread-story"
            aria-labelledby="spread-story-title"
          >
            <div className="spread-panel">
              <div className="spread-paper">
                <i className="spread-fold" aria-hidden="true"></i>

                <div className="spread-lettering">
                  <p className="spread-no">
                    <span>Not YouTube.</span>
                  </p>
                  <h3 id="spread-story-title">
                    <span className="spread-your">Your</span>{" "}
                    <span className="spread-noun">story.</span>
                  </h3>
                </div>
                <p className="spread-tail">
                  Remember how much you’ve already lived.
                </p>
              </div>
            </div>
            <div className="spread-window">
              <div className="spread-shot">
                <img
                  src="/assets/moments/flamingo.webp"
                  width="1122"
                  height="1402"
                  alt="A man squeezed into an elevator with an enormous pink pool flamingo"
                  loading="lazy"
                />
              </div>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
