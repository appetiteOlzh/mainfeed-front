(() => {
  "use strict";

  const assets = new URL("assets/", document.currentScript?.src || document.baseURI);
  const assetURL = window.mainFeedEmbeddedAsset || (path => new URL(path, assets).href);
  const instances = new WeakMap();
  const lakeMemory = { photo: "lake", date: "August 14, 2023", description: "Three friends jumping from a dock into the lake" };
  const memories = [
    { photo: "dog", date: "July 3, 2021", description: "A dog sprawled on a yellow beanbag" },
    { photo: "pigeon", date: "April 9, 2022", description: "A pigeon leaning into the camera" },
    { photo: "friends", date: "August 14, 2023", description: "Three friends laughing at a picnic" },
    { photo: "birthday", date: "October 6, 2024", description: "A friend in a party hat holding a birthday cake" },
    { photo: "train", date: "May 18, 2020", description: "A passenger at a sunlit train window" },
    { photo: "moments/game-night", date: "September 7, 2024", description: "Two friends playing a video game on the sofa" },
    { photo: "elevator", date: "June 22, 2024", description: "Friends taking an elevator selfie" }
  ];

  const photos = {
    pigeon: { width: 700, height: 1050, variants: [448] },
    friends: { width: 941, height: 1672, variants: [448, 640] },
    birthday: { width: 836, height: 1882, variants: [418] },
    train: { width: 1024, height: 1536, variants: [448, 640] },
    "moments/game-night": { width: 1024, height: 1536, variants: [448] },
    elevator: { width: 1024, height: 1536, variants: [448, 640] }
  };

  function progressBetween(value, start, end) {
    const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return t * t * (3 - 2 * t);
  }

  function artwork(path, className = "") {
    return `<img class="${className}" src="${assetURL(path)}" alt="" draggable="false">`;
  }

  function navigation(active) {
    const tabs = [
      ["feed", "My feed", "home", 'data-phone-frame=".45"'],
      ["album", "My collections", "grid", 'data-phone-action="album"']
    ];
    const items = tabs.map(([id, label, icon, action]) => {
      const image = artwork("mf-device/collection-" + icon + ".svg");
      return id === active
        ? `<span aria-current="page" aria-label="${label}">${image}</span>`
        : `<button type="button" aria-label="${label}" ${action}>${image}</button>`;
    });
    return `<nav class="mfd-nav" aria-label="MainFeed tabs">${items.join("")}</nav>`;
  }

  function mount(element, { firstPhoto } = {}) {
    const existing = instances.get(element);
    if (existing && existing.screen.parentNode === element) return existing.api;

    const screen = document.createElement("div");
    screen.className = "mfd-screen";
    screen.setAttribute("role", "group");
    screen.lang = "en";

    screen.innerHTML = `
      <div class="mfd-reel"></div>
      <div class="mfd-chrome">
        <div class="mfd-status" aria-hidden="true">
          <span>9:41</span><i>${artwork("mf-device/camera.svg")}</i>
          <div>${["cellular", "wifi", "battery"].map(name =>
            artwork("controls/status-" + name + ".svg")).join("")}</div>
        </div>
        <div class="mfd-rail" role="group" aria-label="Photo actions">
          <button type="button" data-phone-action="order" aria-label="Feed order" class="mfd-order">${artwork("controls/1-imgIcon.svg")}</button>
          <button type="button" data-phone-action="favorite" aria-label="Favorite" class="mfd-favorite">${artwork("mf-device/heart-white.svg")}${artwork("controls/1-imgIcon1.svg", "mfd-liked")}</button>
          <button type="button" data-phone-action="album" aria-label="My collections" class="mfd-album">${artwork("controls/1-imgGroup.svg")}</button>
          <button type="button" data-phone-action="share" aria-label="Share" class="mfd-share">${artwork("controls/1-imgIcon2.svg")}</button>
          <button type="button" data-phone-action="delete" aria-label="Delete" class="mfd-delete">${artwork("controls/1-imgIcon3.svg")}</button>
        </div>
        ${navigation("feed")}
        <div class="mfd-indicator"></div>
        <div class="mfd-menu" hidden>
          ${["random", "newest", "oldest"].map(name => `
            <div class="mfd-option mfd-${name}">
              ${artwork("mf-device/" + (name === "oldest" ? "newest" : name) + ".svg", "mfd-option-icon")}
              <span>${name}</span>
              ${name === "newest" ? "" : artwork("mf-device/check.svg", "mfd-check")}
            </div>`).join("")}
        </div>
      </div>`;
    element.appendChild(screen);

    const reel = screen.querySelector(".mfd-reel");
    const menu = screen.querySelector(".mfd-menu");
    const liked = screen.querySelector(".mfd-liked");
    const order = screen.querySelector(".mfd-order");
    const actionButtons = {
      order, share: screen.querySelector(".mfd-share"), delete: screen.querySelector(".mfd-delete"),
      album: screen.querySelector(".mfd-nav button")
    };
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const favorite = screen.querySelector(".mfd-favorite");
    const likedPhotos = new Set(["dog"]);
    const pages = new Map([...memories, lakeMemory].map(memory => {
      const page = document.createElement("div");
      page.className = "mfd-page";
      page.dataset.photo = memory.photo;
      page.setAttribute("aria-hidden", "true");
      page.innerHTML = '<img class="mfd-photo" alt="" draggable="false"><span class="mfd-date"></span>';
      page.querySelector(".mfd-date").textContent = memory.date;
      return [memory, page];
    }));
    let frame = memories[0], actionFrame = memories[1], manual = false;
    let sequence = [], lastMode = "", deal = [], lastOffset = null;
    let idleSwipe = null;
    const removed = new Set();
    const display = element.parentElement;
    const posterSizes = firstPhoto && display.parentElement.querySelector(".finale-still")?.sizes;
    let displayWidth = display.clientWidth;
    function imageSizes(memory) {
      if (memory.photo === firstPhoto && posterSizes) return posterSizes;
      const { width, height } = photos[memory.photo];

      const coverScale = Math.max(1, (844 / 390) * (width / height));
      return Math.ceil(displayWidth * coverScale) + "px";
    }
    new ResizeObserver(([entry]) => {
      displayWidth = entry.contentRect.width;
      for (const [memory, page] of pages) {
        const image = page.firstElementChild;
        if (image.hasAttribute("srcset")) image.sizes = imageSizes(memory);
      }
    }).observe(display);
    function loadPhoto(memory) {
      const photo = pages.get(memory).firstElementChild;
      if (!photo.hasAttribute("src")) {
        const path = memory.photo === "dog" ? "phone/dog-feed.webp" : memory.photo + ".webp";
        const full = assetURL(path);
        const spec = photos[memory.photo];
        if (spec) {
          const name = memory.photo.split("/").pop();
          const candidates = spec.variants.map(size => {
            return assetURL("phone/" + name + "-" + size + ".webp") + " " + size + "w";
          });
          photo.sizes = imageSizes(memory);
          photo.srcset = [...candidates, full + " " + spec.width + "w"].join(", ");
        }
        photo.src = full;
      }
      return photo;
    }

    function begin(mode) {

      const transform = new DOMMatrixReadOnly(getComputedStyle(reel).transform);
      const visiblePage = Math.round(-transform.m42 / reel.clientHeight);
      const visible = sequence[visiblePage] || frame;
      if (visible !== lakeMemory) actionFrame = visible;
      if (removed.has(actionFrame)) actionFrame = sequence.find(memory => !removed.has(memory)) || actionFrame;
      frame = actionFrame;
      manual = true;
      const index = memories.indexOf(frame);
      if (removed.size >= memories.length - 1) removed.clear();
      deal = memories.slice(index + 1).concat(memories.slice(0, index)).filter(memory => !removed.has(memory));
      if (mode === "order") {
        for (let i = deal.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deal[i], deal[j]] = [deal[j], deal[i]];
        }

        deal.slice(0, 4).forEach(loadPhoto);
      }
      lastMode = "";
    }
    function resumeScroll() {
      if (!manual) return;
      manual = false;
      removed.clear();
      lastMode = "";
    }
    function prepare(mode) {
      if (mode === lastMode) return;
      idleSwipe?.cancel();
      idleSwipe = null;
      lastMode = mode;
      lastOffset = null;
      const intro = manual ? [actionFrame] : memories.slice(0, 2);
      const next = manual ? deal : memories.slice(2);
      sequence = intro;
      if (mode === "closing") sequence = [intro[intro.length - 1], lakeMemory];
      if (mode === "idle") {
        sequence = intro.concat(next);
        if (firstPhoto && !manual) {
          const first = sequence.findIndex(memory => memory.photo === firstPhoto);
          if (first > 0) sequence = sequence.slice(first).concat(sequence.slice(0, first));
        }
      }
      if (mode === "order") sequence = intro.concat(next.slice(0, 4));
      if (mode === "delete" || mode === "share") sequence = intro.concat(manual ? next[0] : memories[6]);
      reel.replaceChildren(...sequence.map(memory => pages.get(memory)));
    }

    function reflectFrame() {
      favorite.setAttribute("aria-pressed", String(likedPhotos.has(frame.photo)));
      liked.style.opacity = likedPhotos.has(frame.photo) ? "1" : "0";
      const selection = menu.hidden ? "" : " Feed order: " + menu.dataset.selected + ".";
      screen.setAttribute("aria-label", frame.description + ". " + frame.date + "." + selection);
    }

    favorite.addEventListener("click", () => {
      const photo = frame.photo;
      if (likedPhotos.has(photo)) likedPhotos.delete(photo);
      else likedPhotos.add(photo);
      reflectFrame();
    });

    function advance(direction = 1) {
      if (lastMode !== "idle" || sequence.length < 2) return;
      const next = sequence[(lastOffset + direction + sequence.length) % sequence.length];
      const photo = loadPhoto(next);
      if (!photo.complete || !photo.naturalWidth) return;
      let from = lastOffset;
      if (direction > 0 && from === sequence.length - 1) {
        sequence.unshift(sequence.pop());
        reel.prepend(pages.get(sequence[0]));
        from = 0;
      } else if (direction < 0 && from === 0) {
        sequence.push(sequence.shift());
        reel.append(pages.get(sequence[sequence.length - 1]));
        from = sequence.length - 1;
      }
      lastOffset = from + direction;
      const start = `translate3d(0, ${-100 * from}%, 0)`;
      const end = `translate3d(0, ${-100 * lastOffset}%, 0)`;
      reel.style.transform = end;
      idleSwipe?.cancel();
      if (!reducedMotion.matches) {
        idleSwipe = reel.animate([{transform:start}, {transform:end}], {
          duration:460, easing:"cubic-bezier(.35,0,.18,1)"
        });
      }
      frame = sequence[lastOffset];
      loadPhoto(sequence[(lastOffset + direction + sequence.length) % sequence.length]);
      reflectFrame();
    }

    function seek(progress, mode = "order") {
      const p = Math.max(0, Math.min(1, Number(progress) || 0));
      prepare(mode);
      let offset = manual ? 0 : progressBetween(p, 0.08, 0.45);
      if (mode === "closing") offset = Math.round(p);
      if (mode === "delete") offset += progressBetween(p, 0.89, 0.99);
      if (mode === "share") offset += progressBetween(p, 0.955, 1);
      if (mode === "delete" && manual && p >= .89) removed.add(actionFrame);
      if (mode === "order") {
        for (const start of [0.655, 0.745, 0.835, 0.925]) {
          offset += progressBetween(p, start, start + 0.040);
        }
      }

      offset = Math.min(offset, sequence.length - 1);
      if (!manual || reducedMotion.matches) offset = Math.round(offset);
      if (offset !== lastOffset) {
        const current = Math.floor(offset);
        loadPhoto(sequence[current]);
        if (sequence[current + 1]) loadPhoto(sequence[current + 1]);
        const singlePage = lastOffset !== null && Math.abs(offset - lastOffset) === 1;
        reel.style.transition = (!manual || mode === "closing") && singlePage && !reducedMotion.matches
          ? "transform 270ms cubic-bezier(.2,.7,.22,1)" : "none";
        reel.style.transform = `translate3d(0, ${-100 * offset}%, 0)`;
        lastOffset = offset;
      }

      const press = progressBetween(p, 0.46, 0.48) * (1 - progressBetween(p, 0.48, 0.50));
      for (const [action, button] of Object.entries(actionButtons)) {
        button.classList.toggle("mfd-tapping", action === mode && press > .18);
      }
      const visibility = progressBetween(p, 0.48, 0.51) * (1 - progressBetween(p, 0.615, 0.647));
      menu.hidden = mode !== "order" || visibility <= 0;
      if (!menu.hidden) {
        menu.style.opacity = String(visibility);
        menu.style.transform = reducedMotion.matches ? "none" : `scale(${0.93 + 0.07 * visibility})`;
        menu.dataset.selected = p >= 0.58 ? "random" : "oldest";
      }
      const currentPage = Math.round(offset);
      frame = sequence[currentPage];
      reflectFrame();
      return manual ? actionFrame.photo : memories[1].photo;
    }

    const api = { seek, begin, resumeScroll, advance };
    instances.set(element, { screen, api });
    seek(0, firstPhoto ? "idle" : "order");
    return api;
  }

  window.MainFeedDemo = { mount, navigation, assetURL, introDates: memories.slice(0, 2).map(memory => memory.date) };
})();
