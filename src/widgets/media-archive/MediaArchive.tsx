import { filmColumns } from "./film-columns";

export function MediaArchive() {
  return (
    <>
      <section
        id="photos"
        className="photo-story archive-chapter"
        aria-labelledby="photos-title"
      >
        <div className="photo-stage">
          <h2 id="photos-title">
            <span>Millions of</span> <em>photos.</em>
          </h2>
          <div
            className="album-viewport"
            role="region"
            aria-label="Camera roll photos, scroll horizontally to explore"
            tabIndex={0}
          >
            <div className="album-strip">
              <img
                src="/assets/moments/gull.webp"
                width="1122"
                height="1402"
                alt="A seagull stealing a fry from a seaside picnic"
                loading="lazy"
              />
              <img
                src="/assets/train.webp"
                width="1024"
                height="1536"
                alt="A passenger looking out of a sunlit train window"
                loading="lazy"
              />
              <img
                src="/assets/moments/plant.webp"
                width="1024"
                height="1536"
                alt="A friend nearly hidden behind the enormous plant they are carrying home"
                loading="lazy"
              />
              <img
                src="/assets/golden.webp"
                width="1024"
                height="1536"
                alt="An outdoor concert in the last light of the evening"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="videos"
        className="video-story archive-chapter"
        aria-labelledby="videos-title"
      >
        <div className="film-stage">
          <div className="film-heading">
            <h2 id="videos-title">
              <span>Thousands</span>{" "}
              <span>
                of <em>videos.</em>
              </span>
            </h2>
            <p className="film-caption">Relive adventures.</p>
          </div>
          <div
            className="film-viewport"
            role="region"
            aria-label="Video memories, scroll horizontally to explore"
            tabIndex={0}
          >
            <div className="film-strip">
              {filmColumns.map((column) => (
                <div className="film-column" key={column[0].id}>
                  {column.map(({ id, alt }) => (
                    <figure className="film-tile" key={id}>
                      <img
                        src={`/assets/clips/${id}.webp`}
                        width={324}
                        height={576}
                        alt={alt}
                        loading="lazy"
                        decoding="async"
                      />
                      <video
                        data-src={`/assets/clips/${id}.mp4`}
                        width={324}
                        height={576}
                        playsInline
                        muted
                        loop
                        preload="none"
                        disablePictureInPicture
                        disableRemotePlayback
                        aria-hidden="true"
                      />
                    </figure>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="years"
        className="years-story archive-chapter"
        aria-labelledby="years-title"
      >
        <div className="years-flow">
          <div className="years-stage">
            <div className="years-copy">
              <h2 id="years-title">
                Years of <em>memories.</em>
              </h2>
              <div className="year-counter" aria-hidden="true">
                <span>20</span>
                <div className="year-window">
                  <div className="year-digits">
                    <span>21</span>
                    <span>23</span>
                    <span>24</span>
                    <span>26</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="year-photos">
              <div>
                <time dateTime="2021">2021</time>
                <img
                  src="/assets/moments/sofa.webp"
                  width="1024"
                  height="1536"
                  alt="A cat curling up on a friend sleeping on the sofa"
                  loading="lazy"
                />
              </div>
              <div>
                <time dateTime="2023">2023</time>
                <picture>
                  <source
                    media="(prefers-reduced-motion:no-preference)"
                    srcSet="/assets/moments/flight-memory-start.webp"
                  />
                  <img
                    src="/assets/flight.webp"
                    width="941"
                    height="1672"
                    alt="An airplane wing above blue coastal islands"
                    loading="lazy"
                  />
                </picture>
                <video
                  data-src="/assets/moments/flight-memory.mp4"
                  preload="none"
                  muted
                  playsInline
                  loop
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-hidden="true"
                ></video>
              </div>
              <div>
                <time dateTime="2024">2024</time>
                <img
                  src="/assets/court.webp"
                  width="1024"
                  height="1536"
                  alt="Two friends resting beside a basketball court"
                  loading="lazy"
                />
              </div>
              <div>
                <time dateTime="2026">2026</time>
                <picture>
                  <source
                    media="(prefers-reduced-motion:no-preference)"
                    srcSet="/assets/moments/canadian-snowman-start.webp"
                  />
                  <img
                    src="/assets/moments/canadian-snowman.webp"
                    width="1122"
                    height="1402"
                    alt="Friends building a snowman on a snowy Montréal street"
                    loading="lazy"
                  />
                </picture>
                <video
                  data-src="/assets/moments/canadian-snowman.mp4"
                  preload="none"
                  muted
                  playsInline
                  loop
                  disablePictureInPicture
                  disableRemotePlayback
                  aria-hidden="true"
                ></video>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
