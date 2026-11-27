import { MainfeedDemo } from "@/shared/ui/phone-demo";

export function mountFinale(scope) {
  const display = document.querySelector("#join .finale-device-content");
  if (!display) return;

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let feed;
  let ready = false;
  let visible = false;
  let timer;
  scope.onDispose(() => clearInterval(timer));

  function updatePlayback() {
    clearInterval(timer);
    if (ready && visible && !document.hidden && !reducedMotion.matches) {
      timer = setInterval(feed.advance, 2000);
    }
  }

  const warm = scope.intersection(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      warm.disconnect();

      const artboard = document.createElement("div");
      artboard.className = "rv-canvas";
      artboard.style.visibility = "hidden";
      artboard.inert = true;
      display.append(artboard);
      scope.onDispose(() => {
        artboard.remove();
        display.classList.remove("is-ready");
        const poster = display.parentElement?.querySelector(".finale-still");
        if (poster) poster.hidden = false;
      });
      const canvasWidth = artboard.offsetWidth;
      const canvasHeight = artboard.offsetHeight;
      function fitScreen(width, height) {
        const scale = Math.max(width / canvasWidth, height / canvasHeight);
        const left = (width - canvasWidth * scale) / 2;
        const top = (height - canvasHeight * scale) / 2;
        artboard.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
      }
      const resize = scope.resize(([{ contentRect }]) => {
        fitScreen(contentRect.width, contentRect.height);
      });
      resize.observe(display);
      fitScreen(display.clientWidth, display.clientHeight);

      feed = MainfeedDemo.mount(artboard, scope, { firstPhoto: "birthday" });
      const opening = artboard.querySelector(".mfd-photo");
      opening
        .decode()
        .then(() => {
          if (scope.signal.aborted) return;
          artboard.style.removeProperty("visibility");
          display.classList.add("is-ready");
          const poster = display.parentElement.querySelector(".finale-still");
          if (poster) poster.hidden = true;
          ready = true;
          updatePlayback();
        })
        .catch(() => {
          resize.disconnect();
          artboard.remove();
        });
    },
    { rootMargin: "250px 0px" },
  );
  warm.observe(display);

  const visibility = scope.intersection(
    ([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.35;
      updatePlayback();
    },
    { threshold: 0.35 },
  );
  visibility.observe(display);
  scope.listen(reducedMotion, "change", updatePlayback);
  scope.listen(document, "visibilitychange", updatePlayback);
}
