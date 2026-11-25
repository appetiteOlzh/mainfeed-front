import { MainFeedDemo } from "@/shared/ui/phone-demo";

export const CameraRoll = (() => {
  const assetURL = MainFeedDemo.assetURL;

  const albums = [
    ["Favorites", "favorites", 128],
    ["Travel", "travel", 342],
    ["Family", "family", 216],
    ["For stories", "stories", 79],
  ];
  const draftName = "+1000 aura 💀";
  const newAlbumCount = 5;
  const draftLetters = Array.from(draftName);
  const apps = ["WhatsApp", "Threads", "Telegram", "Instagram"];
  const shareActions = ["Copy", "Print", "Save Image", "Assign to Contact"];

  function ease(a, b, p) {
    const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }
  function icon(name) {
    return (
      '<img alt="" draggable="false" src="' +
      assetURL("mf-device/" + name + ".svg") +
      '">'
    );
  }
  function collection(name, cover, count) {
    const tile = document.createElement("div");
    tile.className = "rv-collection";
    tile.innerHTML =
      '<div class="rv-album-cover"><img alt=""></div><b></b><span></span>';
    tile.querySelector("img").src = assetURL(
      "mf-device/collection-" + cover + ".webp",
    );
    tile.querySelector("b").textContent = name;
    tile.querySelector("span").textContent = count + " memories";
    if (cover === "favorites") {
      tile.firstElementChild.insertAdjacentHTML(
        "beforeend",
        "<i>" + icon("collection-heart") + "</i>",
      );
    }
    return tile;
  }
  function mount(root, scope) {
    const canvas = document.createElement("div");
    canvas.className = "rv-canvas";
    root.append(canvas);
    scope.onDispose(() => canvas.remove());
    const resize = scope.resize(([entry]) => {
      canvas.style.transform = "scale(" + entry.contentRect.width / 390 + ")";
    });
    resize.observe(root);
    canvas.style.transform = "scale(" + root.clientWidth / 390 + ")";
    const feed = MainFeedDemo.mount(canvas, scope);
    const q = (selector) => canvas.querySelector(selector);
    canvas.insertAdjacentHTML(
      "beforeend",
      `
      <div class="rv-scrim"></div>
      <button class="rv-dismiss-share" type="button" aria-label="Dismiss share sheet" data-phone-frame=".45"></button>
      <section class="rv-share" aria-label="Share photo">
        <div class="rv-share-head"><img alt=""><span>HEIC · 1,3 MB</span></div>
        <div class="rv-share-row">${apps.map((name) => `<div><img src="${assetURL("controls/" + name.toLowerCase() + ".webp")}" alt=""><span>${name}</span></div>`).join("")}</div>
        <div class="rv-share-row rv-share-actions"><button type="button" class="rv-copy" aria-label="Copy photo link"><i style="--i:0"></i><span>Copy</span></button>${shareActions
          .slice(1)
          .map(
            (action, i) =>
              `<div><i style="--i:${i + 1}"></i><span>${action}</span></div>`,
          )
          .join("")}</div>
      </section>
      <section class="rv-delete" role="group" aria-labelledby="delete-photo-title">
        <div class="rv-delete-copy"><h3 id="delete-photo-title">Allow “MainFeed” to delete this photo?</h3>
          <p>This photo will be deleted from iCloud Photos on all your devices. It will be in Recently Deleted for 30 days.</p></div>
        <img class="rv-delete-preview" alt="Photo selected for deletion">
        <div class="rv-delete-actions"><button type="button" data-phone-frame=".45">Don’t Allow</button>
          <button type="button" data-phone-continue=".81">Delete</button></div>
      </section>
      <section class="rv-albums" aria-label="My collections">
        <div class="rv-collection-screen">
          <span class="rv-corner rv-settings">${icon("settings")}</span>
          <button class="rv-corner rv-add" type="button" aria-label="New album" data-new-draft data-phone-frame=".78">${icon("add")}</button>
          <h3>My collections</h3>
          <div class="rv-grid"></div>
          ${MainFeedDemo.navigation("album")}
        </div>
        <div class="rv-album-dim"></div>
        <div class="rv-album-sheet" role="group" aria-labelledby="new-album-title">
          <div class="rv-grabber"></div>
          <header><h4 id="new-album-title">New album</h4><button type="button" data-phone-frame=".56" aria-label="Close new album">${icon("close")}</button></header>
          <label class="rv-name-field"><input class="rv-name" aria-label="Album name" placeholder="Name, e.g. Mom" autocomplete="off" maxlength="40"><span class="rv-demo-caret" aria-hidden="true"></span></label>
          <div class="rv-cover"><img class="rv-draft-cover" alt="">
            <div><b>Cover</b><span>Choose from gallery</span></div><i>${icon("chevron")}</i></div>
          <button class="rv-save" type="button">Save</button>
        </div>
      </section>`,
    );

    canvas.append(q(".mfd-status"), q(".mfd-indicator"));
    const feedScreen = q(".mfd-screen"),
      share = q(".rv-share"),
      alert = q(".rv-delete");
    const scrim = q(".rv-scrim"),
      dismiss = q(".rv-dismiss-share");
    const collections = q(".rv-albums"),
      grid = q(".rv-grid"),
      collectionScreen = q(".rv-collection-screen");
    const albumSheet = q(".rv-album-sheet"),
      albumDim = q(".rv-album-dim"),
      name = q(".rv-name");
    const save = q(".rv-save"),
      shareImage = q(".rv-share-head img"),
      deleteImage = q(".rv-delete-preview");
    const savedNames = new Set();
    const demoCaret = q(".rv-demo-caret");
    const copy = q(".rv-copy"),
      add = q(".rv-add");
    const confirmDelete = q("[data-phone-continue]"),
      home = q(".rv-collection-screen .mfd-nav button");
    const contact = document.createElement("span");
    contact.className = "rv-contact";
    contact.setAttribute("aria-hidden", "true");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const touches = {
      order: [
        [0.45, q(".mfd-order")],
        [0.563, q(".mfd-random")],
      ],
      share: [
        [0.45, q(".mfd-share")],
        [0.747, copy.querySelector("i")],
      ],
      delete: [
        [0.45, q(".mfd-delete")],
        [0.785, confirmDelete],
      ],
      album: [
        [0.45, q(".mfd-screen .mfd-nav button")],
        [0.584, add],
        [0.656, name],
        [0.799, save],
        [1.001, home],
      ],
    };
    let pulse,
      pressedControl = null,
      nextTouch = 0;
    function showTouch(target, pointer) {
      const host = target === name ? name.parentElement : target;
      const manual = pointer?.target === target;
      if (manual) {
        const zoom = target.currentCSSZoom || 1;
        const x = Math.max(
          0,
          Math.min(target.clientWidth, pointer.offsetX / zoom),
        );
        const y = Math.max(
          0,
          Math.min(target.clientHeight, pointer.offsetY / zoom),
        );
        contact.style.left =
          (host === target ? x : target.offsetLeft + x) + "px";
        contact.style.top = (host === target ? y : target.offsetTop + y) + "px";
      } else {
        contact.style.left = "50%";
        contact.style.top = "50%";
      }
      pulse?.cancel();
      host.append(contact);
      pulse = contact.animate(
        [
          { opacity: manual ? 1 : 0, transform: "scale(1)" },
          { opacity: 1, transform: "scale(1)", offset: 0.26 },
          {
            opacity: 1,
            transform: reducedMotion.matches ? "none" : "scale(.80)",
            offset: 0.6,
          },
          {
            opacity: 0,
            transform: reducedMotion.matches ? "none" : "scale(.92)",
          },
        ],
        { duration: 480, easing: "ease-in-out" },
      );
    }
    scope.listen(
      canvas,
      "pointerdown",
      (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        pressedControl = event.target.closest("button, input");
        if (pressedControl && !pressedControl.disabled)
          showTouch(pressedControl, event);
      },
      { passive: true },
    );
    scope.listen(canvas, "pointercancel", () => {
      if (pressedControl) pulse?.cancel();
      pressedControl = null;
    });
    scope.listen(
      canvas,
      "click",
      (event) => {
        const target = event.target.closest("button, input");
        if (!target) return;
        nextTouch = Infinity;
        if (!event.detail || pressedControl !== target)
          showTouch(target, event.detail ? event : undefined);
        pressedControl = null;
      },
      true,
    );
    let example;
    function prepareAlbums() {
      grid.append(...albums.map((album) => collection(...album)));
      example = collection(draftName, "new", newAlbumCount);
      example.hidden = true;
      grid.children[0].after(example);
      q(".rv-draft-cover").src = assetURL("mf-device/collection-new.webp");
    }
    let edited = false,
      manual = false,
      guided = false,
      exampleSaved = false,
      actionId = 0;
    function jump(progress) {
      root.dispatchEvent(
        new CustomEvent("phone-control", {
          bubbles: true,
          detail: { phoneFrame: String(progress) },
        }),
      );
    }
    scope.listen(name, "focus", () => {
      edited = true;
      jump(0.78);
    });
    scope.listen(name, "input", () => {
      edited = true;
      demoCaret.hidden = true;
      save.disabled = !name.value.trim();
    });
    scope.listen(copy, "click", async () => {
      jump(0.72);
      const id = actionId;
      try {
        await navigator.clipboard.writeText(shareImage.src);
        if (id === actionId && !share.inert) {
          root.dispatchEvent(
            new CustomEvent("phone-control", {
              bubbles: true,
              detail: { phoneContinue: ".77" },
            }),
          );
        }
      } catch {
        if (id === actionId)
          copy.querySelector("span").textContent = "Try again";
      }
    });
    scope.listen(save, "click", () => {
      if (!name.value.trim()) return;
      const title = name.value.trim();
      if (!savedNames.has(title)) {
        grid.children[0].after(collection(title, "new", newAlbumCount));
        savedNames.add(title);
      }
      grid.scrollTop = 0;
      jump(0.98);
    });
    scope.listen(root, "click", (event) => {
      const control = event.target.closest(
        "[data-phone-action],[data-phone-frame],[data-phone-continue]",
      );
      if (!control || control.dataset.phoneAction === "favorite") return;
      if (control.hasAttribute("data-new-draft")) {
        edited = true;
        name.value = "";
      }
      root.dispatchEvent(
        new CustomEvent("phone-control", {
          detail: control.dataset,
          bubbles: true,
        }),
      );
    });

    function layer(element, amount, transform = "") {
      element.hidden = amount === 0;
      element.inert = amount < 0.98;
      element.style.opacity = amount;
      element.style.transform = transform;
    }
    function seek(p, mode = "order") {
      const photo = feed.seek(p, mode);
      if (mode === "album" && !example) prepareAlbums();
      const opening = ease(0.48, 0.6, p);
      const shareOpen =
        mode === "share" ? opening * (1 - ease(0.79, 0.845, p)) : 0;
      const alertOpen =
        mode === "delete" ? opening * (1 - ease(0.83, 0.89, p)) : 0;
      const albumsOpen =
        mode === "album"
          ? ease(0.46, 0.535, p) * (1 - ease(1.035, 1.075, p))
          : 0;
      const formOpen =
        albumsOpen * ease(0.61, 0.655, p) * (1 - ease(0.835, 0.885, p));

      const preview = shareOpen ? shareImage : alertOpen ? deleteImage : null;
      if (preview && preview.dataset.photo !== photo) {
        const source = q('.mfd-page[data-photo="' + photo + '"] .mfd-photo');
        preview.sizes = source.sizes;
        preview.srcset = source.srcset;

        preview.src = photo === "dog" ? assetURL("dog.webp") : source.src;
        preview.style.objectPosition =
          photo === "birthday" ? (shareOpen ? "50% 25%" : "50% 14%") : "center";
        preview.dataset.photo = photo;
      }
      layer(share, shareOpen, "translateY(" + (1 - shareOpen) * 104 + "%)");
      copy.classList.toggle(
        "rv-pressed",
        mode === "share" && p >= 0.755 && p < 0.805,
      );
      confirmDelete.classList.toggle(
        "rv-pressed",
        mode === "delete" && p >= 0.795 && p < 0.85,
      );
      add.classList.toggle(
        "rv-pressed",
        mode === "album" && p >= 0.592 && p < 0.625,
      );
      save.classList.toggle(
        "rv-pressed",
        mode === "album" && p >= 0.807 && p < 0.85,
      );
      home.classList.toggle(
        "rv-pressed",
        mode === "album" && p >= 1.01 && p < 1.05,
      );
      layer(
        alert,
        alertOpen,
        "translate(-50%,-50%) scale(" + (0.95 + 0.05 * alertOpen) + ")",
      );
      scrim.style.opacity = Math.max(shareOpen * 0.14, alertOpen * 0.43);
      dismiss.hidden = shareOpen < 0.98;
      feedScreen.inert = Boolean(shareOpen || alertOpen || albumsOpen);
      feedScreen.classList.toggle("mfd-sharing", shareOpen > 0.01);
      layer(collections, albumsOpen);
      if (guided && !edited && albumsOpen && p >= 0.85 && !exampleSaved) {
        exampleSaved = true;
        grid.children[0].after(example);
        grid.scrollTop = 0;
      }
      if (example)
        example.hidden =
          savedNames.has(draftName) ||
          !(exampleSaved || (!manual && albumsOpen && p >= 0.85));
      layer(albumSheet, formOpen, "translateY(" + (1 - formOpen) * 105 + "%)");
      albumDim.style.opacity = formOpen * 0.42;
      collectionScreen.inert = formOpen > 0;
      if (formOpen && !edited) {
        const length = Math.round(draftLetters.length * ease(0.665, 0.77, p));
        name.value = draftLetters.slice(0, length).join("");
        demoCaret.textContent = name.value;
      }
      demoCaret.hidden = edited || !name.value;
      save.disabled = !name.value.trim();
      if (guided) {
        const cues = touches[mode];
        let cue;
        while (cues?.[nextTouch] && p >= cues[nextTouch][0])
          cue = cues[nextTouch++];
        if (cue && p - cue[0] < 0.05) showTouch(cue[1]);
      }
    }
    function begin(mode, autoplay = false, touched = false) {
      actionId++;
      manual = true;
      guided = autoplay;
      nextTouch = touched ? 1 : 0;
      if (!touched) pulse?.cancel();
      if (guided && mode === "album") exampleSaved = false;
      copy.querySelector("span").textContent = "Copy";
      feed.begin(mode);
      edited = false;
      name.value = "";
    }
    function resumeScroll() {
      actionId++;
      pulse?.cancel();
      guided = false;
      manual = false;
      feed.resumeScroll();
      edited = false;
    }
    scope.onDispose(() => pulse?.cancel());
    seek(0);
    return { seek, begin, resumeScroll, advance: feed.advance };
  }
  return { mount };
})();
