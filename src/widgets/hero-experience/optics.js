export const MemoryOptics = (() => {
  const TAU = Math.PI * 2;
  const mix = (a, b, t) => a + (b - a) * t;
  const stops = [
    [0.0, [247, 63, 43]],
    [0.1, [255, 135, 36]],
    [0.19, [255, 213, 51]],
    [0.29, [201, 234, 64]],
    [0.39, [38, 191, 135]],
    [0.49, [45, 194, 204]],
    [0.61, [36, 98, 222]],
    [0.71, [106, 71, 219]],
    [0.82, [191, 63, 173]],
    [0.91, [248, 94, 141]],
    [1, [247, 63, 43]],
  ];
  const sectorAngle = Math.PI / 6;
  const ease = (start, end, value) => {
    const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
    return t * t * (3 - 2 * t);
  };
  const polar = (r, a) => [r * Math.cos(a), r * Math.sin(a)];
  const profiles = [
    [
      [0.065, 0.07, 0.07],
      [0.19, 0.145, 0.2],
      [0.27, 0.245, 0.29],
      [0.34, 0.44, 0.33],
      [0.68, 0.52, 0.47],
      [0.79, 0.68, 0.61],
      [0.99, 0.85, 0.89],
      [1.09, 1.0, 0.96],
    ],
    [
      [0.075, 0.078, 0.07],
      [0.24, 0.14, 0.18],
      [0.38, 0.26, 0.31],
      [0.46, 0.49, 0.365],
      [0.71, 0.535, 0.62],
      [0.78, 0.72, 0.8],
      [1.015, 0.86, 0.87],
      [1.105, 1.005, 0.91],
    ],
    [
      [0.085, 0.066, 0.055],
      [0.14, 0.19, 0.1],
      [0.255, 0.35, 0.205],
      [0.47, 0.39, 0.29],
      [0.63, 0.51, 0.35],
      [0.75, 0.66, 0.47],
      [0.985, 0.75, 0.6],
      [1.115, 0.855, 0.755],
    ],
  ];
  const jewel = [
    ["#22234e", "#41418b", "#898ed5"],
    ["#47286e", "#9866ba", "#e5b5e8"],
    ["#8c2757", "#d34271", "#ff97af"],
    ["#bd443b", "#fa795d", "#ffc29c"],
    ["#cb7837", "#f5bd63", "#fff2b8"],
    ["#104e68", "#259d9e", "#8ee8ce"],
    ["#438da8", "#9eddd4", "#f2f7d8"],
    ["#253a82", "#456ab5", "#a9bdeb"],
  ];
  const star = [
    "#423dc5",
    "#ab53dd",
    "#fb4f83",
    "#ff904a",
    "#ffcf51",
    "#3dd0ab",
    "#e6ed78",
    "#3684e9",
  ];
  const jewelCuts = [
    [4, 3, 6, 4],
    [2, 1, 3, 2],
    [7, 0, 1, 6],
    [5, 6, 7, 5],
    [3, 4, 2, 3],
    [1, 0, 7, 1],
    [5, 6, 7, 0],
  ];
  const starCuts = [
    [6, 4, 4, 2],
    [2, 3, 0, 1],
    [5, 6, 7, 6],
    [0, 7, 1, 0],
    [4, 3, 2, 4],
    [5, 6, 0, 7],
    [1, 0, 5, 5],
  ];

  function toHsl(rgb) {
    const [r, g, b] = rgb.map((n) => n / 255),
      hi = Math.max(r, g, b),
      lo = Math.min(r, g, b),
      chroma = hi - lo;
    const light = (hi + lo) / 2;
    if (!chroma) return [0, 0, light * 100];
    const hue =
      hi === r
        ? (g - b) / chroma
        : hi === g
          ? (b - r) / chroma + 2
          : (r - g) / chroma + 4;
    return [
      (hue * 60 + 360) % 360,
      (100 * chroma) / (1 - Math.abs(2 * light - 1)),
      100 * light,
    ];
  }
  const hexHsl = (s) =>
    toHsl([1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)));
  function paperInk(pair, ring, face) {
    const phase =
      (pair / 6 +
        0.02 +
        [0.38, 0.25, 0.16, 0.04, 0.055, 0.0, 0.015, 0.23][ring] +
        [0, 0.043, -0.025, 0.015][face] +
        1) %
      1;
    const j = stops.findIndex(([at]) => at > phase);
    const [a, from] = stops[j - 1],
      [b, to] = stops[j];
    return toHsl(from.map((v, i) => mix(v, to[i], (phase - a) / (b - a))));
  }
  const lit = (light, exposure) =>
    exposure < 1 ? light * exposure : mix(light, 100, exposure - 1);
  const tonalRamp = ([h, s, l], face) =>
    [0.65 + 0.09 * (face % 2), 1, 1.25].map((k) => [h, s, lit(l, k)]);
  const inks = Array.from({ length: 6 }, (_, pair) =>
    Array.from({ length: 30 }, (_, n) => {
      const ring = Math.floor(n / 4),
        face = n % 4;
      const colors =
        ring === 7
          ? Array(3).fill(face === 0 ? "#ffdca3" : "#a47fa9")
          : jewel[jewelCuts[ring][face]];
      const third = ring === 7 ? [6, 0][face] : starCuts[ring][face];
      return [
        tonalRamp(paperInk(pair, ring, face), face),
        colors.map(hexHsl),
        tonalRamp(hexHsl(star[third]), face),
      ];
    }),
  );
  function facetInk(from, to, blend, glint) {
    const h = from[0] + (((to[0] - from[0] + 540) % 360) - 180) * blend;
    const s = mix(from[1], to[1], blend),
      light = lit(mix(from[2], to[2], blend), 1 + glint);
    return (
      "hsl(" +
      h.toFixed(1) +
      " " +
      s.toFixed(1) +
      "% " +
      light.toFixed(1) +
      "%)"
    );
  }
  function pathFor(points) {
    const p = new Path2D();
    p.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) p.lineTo(...points[i]);
    p.closePath();
    return p;
  }
  const glassPieces = [
    [0.3, 0.15, 0.053, 0.075, "#ffe5a1"],
    [0.56, 0.82, 0.094, 0.072, "#ffc4ce"],
    [0.87, 0.41, 0.066, 0.11, "#b8f6df"],
  ];
  function glassGeometry({ radius, turn, materialPhase, pattern }) {
    const step = Math.floor(pattern),
      state = ((step % 3) + 3) % 3,
      next = (state + 1) % 3;
    const blend = ease(0.57, 1, pattern - step);
    const jewelWeight =
      (state === 1 ? 1 - blend : 0) + (next === 1 ? blend : 0);
    const phase = materialPhase;
    const rows = profiles[state].map((row, ring) => {
      const middle =
        mix(0.5, 0.48, jewelWeight) +
        mix(0.215, 0.15, jewelWeight) *
          Math.sin(phase * 0.87 + ring * mix(0.91, 0.85, jewelWeight));
      return row.map((a, i) => {
        const pulse = mix(
          0.012 + (0.013 * ring) / 7,
          ring === 0 ? 0.012 : 0.029,
          jewelWeight,
        );
        const length =
          mix(a, profiles[next][ring][i], blend) +
          pulse *
            Math.sin(
              phase +
                ring * mix(0.84, 0.79, jewelWeight) +
                i * mix(1.38, 1.48, jewelWeight),
            );
        return polar(radius * length, sectorAngle * [0, middle, 1][i]);
      });
    });
    const axis = turn - 0.33 + jewelWeight * 0.065 * Math.sin(phase * 0.61);
    return { rows, axis, state, next, blend, jewelWeight, phase };
  }
  function mirroredGlass(ctx, material, geometry = glassGeometry(material)) {
    const { radius } = material;
    const { rows, axis, state, next, blend, jewelWeight, phase } = geometry;
    const hub = [0, 0],
      wedge = pathFor([hub, ...rows[7]]),
      faces = [];
    function fold(a, b, c, ring, face) {
      faces.push({
        path: pathFor([a, b, c]),
        source: [c, b, b, c][face],
        endPoint: [b, a, c, b][face],
        index: ring * 4 + face,
      });
    }
    for (let ring = 0; ring < 7; ring++) {
      const low = rows[ring],
        high = rows[ring + 1];
      const triangles = [
        [high[0], high[1], low[0]],
        [low[1], low[0], high[1]],
        [low[1], low[2], high[1]],
        [high[1], high[2], low[2]],
      ];
      triangles.forEach(([a, b, c], face) => fold(a, b, c, ring, face));
    }
    fold(rows[0][0], rows[0][1], hub, 7, 0);
    fold(rows[0][1], rows[0][2], hub, 7, 1);
    ctx.rotate(axis);
    const pieceAlpha = 0.77;
    const pieces = pieceAlpha
      ? glassPieces.map(([r, offset, length, width, ink], i) => {
          const d =
            radius *
            (r + mix(0.072, 0.046, jewelWeight) * Math.sin(phase + i * 2.3));
          const at =
              sectorAngle *
              (offset +
                mix(0.48, 0.34, jewelWeight) *
                  Math.sin(phase * 0.82 + i * 1.73)),
            half = (radius * width) / d;
          const shard = radius * length * mix(1.5, 1, jewelWeight);
          return [
            pathFor([
              polar(d - shard, at),
              polar(d, at - half * 0.54),
              polar(d + shard, at + half * 0.14),
              polar(d + shard * 0.15, at + half * 0.4),
            ]),
            ink,
          ];
        })
      : [];

    const sharedInks = state !== 0 && (blend === 0 || next !== 0);
    let sharedPaints;
    for (let pair = 0; pair < 6; pair++) {
      const paints =
        sharedPaints ??
        faces.map(({ source, endPoint, index }) => {
          const colors = inks[pair][index];
          const g = ctx.createLinearGradient(...source, ...endPoint);
          g.addColorStop(
            0,
            facetInk(colors[state][0], colors[next][0], blend, 0),
          );
          g.addColorStop(
            0.64,
            facetInk(colors[state][1], colors[next][1], blend, 0),
          );
          g.addColorStop(
            1,
            facetInk(colors[state][2], colors[next][2], blend, 0),
          );
          return g;
        });
      if (sharedInks) sharedPaints = paints;
      for (const sign of [1, -1]) {
        ctx.save();
        ctx.rotate(pair * sectorAngle * 2);
        ctx.scale(1, sign);
        ctx.fillStyle = "#535072";
        ctx.fill(wedge);
        faces.forEach(({ path }, i) => {
          ctx.fillStyle = paints[i];
          ctx.fill(path);
        });
        if (pieceAlpha) {
          ctx.clip(wedge);
          ctx.globalAlpha = pieceAlpha;
          for (const [path, ink] of pieces) {
            ctx.fillStyle = ink;
            ctx.fill(path);
          }
        }
        ctx.restore();
      }
    }
  }
  const panels = 12;
  const lengths = [0, 0.32, 0.66, 1];

  const cuts = [];
  for (let half = 0; half < 2; half++) {
    cuts.push([0, 3 + half, 4 + half]);
    for (let ring = 1; ring < 3; ring++) {
      const low = ring * 3 + half,
        high = low + 3;
      cuts.push([low, high, high + 1], [low, high + 1, low + 1]);
    }
  }
  const broadCuts = [
    [0, 6, 7],
    [6, 9, 10],
    [6, 10, 7],
    [0, 7, 8],
    [7, 10, 11],
    [7, 11, 8],
  ];
  const lerpPoint = (a, b, t) => [mix(a[0], b[0], t), mix(a[1], b[1], t)];
  function place(x, y, angle, cx, cy) {
    return [
      cx + x * Math.cos(angle) - y * Math.sin(angle),
      cy + x * Math.sin(angle) + y * Math.cos(angle),
    ];
  }
  function fanPanel(i, { cx, cy, radius, turn, phase, curl, spin }) {
    const a = -Math.PI - 0.14 + (i / panels) * (Math.PI + 0.28),
      b = a + (Math.PI + 0.28) / panels;
    function tip(angle, index) {
      const ridge = index % 2 === 0 ? 1 : 0.86 + 0.025 * Math.sin(phase * 0.65);
      return [Math.cos(angle) * ridge * 1.12, Math.sin(angle) * ridge * 1.52];
    }
    const flatA = polar(1, a),
      flatB = polar(1, b),
      endA = tip(a, i),
      endB = tip(b, i + 1);
    const points = [],
      uv = [];
    for (const t of lengths) {
      for (const u of [0, 0.5, 1]) {
        const flat = lerpPoint(flatA, flatB, u),
          outer = lerpPoint(endA, endB, u);
        uv.push([(t * flat[0] + 1.02) / 2.04, (t * flat[1] + 1.38) / 2.04]);
        const fan = [t * outer[0] - 0.025, t * outer[1] + 0.51];
        const theta = -Math.PI * 1.5 + ((i + u) * TAU) / panels;
        const ridge =
          0.9 + 0.095 * Math.cos(theta * 6) + 0.085 * Math.cos(theta * 12);
        const flower = polar(
          t * ridge,
          theta + spin + 0.92 * (1 - t) + 0.055 * Math.sin(theta * 6) * t,
        );
        const [x, y] = lerpPoint(fan, flower, curl);
        points.push(place(x * radius, y * radius, turn * 0.63, cx, cy));
      }
    }
    return { points, uv };
  }

  function drawTriangle(ctx, texture, uv, points) {
    const [a, b, c] = uv,
      [p, q, r] = points;
    const ux = b[0] - a[0],
      uy = b[1] - a[1],
      vx = c[0] - a[0],
      vy = c[1] - a[1];
    const det = ux * vy - uy * vx;
    if (Math.abs(det) < 1e-9) return;
    const xx = ((q[0] - p[0]) * vy - (r[0] - p[0]) * uy) / det;
    const xy = ((q[1] - p[1]) * vy - (r[1] - p[1]) * uy) / det;
    const yx = ((r[0] - p[0]) * ux - (q[0] - p[0]) * vx) / det;
    const yy = ((r[1] - p[1]) * ux - (q[1] - p[1]) * vx) / det;
    ctx.save();
    ctx.clip(pathFor(points));
    ctx.transform(
      xx,
      xy,
      yx,
      yy,
      p[0] - xx * a[0] - yx * a[1],
      p[1] - xy * a[0] - yy * a[1],
    );
    const width = texture.width,
      height = texture.height;
    const left = Math.max(
      0,
      Math.floor(width * Math.min(a[0], b[0], c[0])) - 1,
    );
    const right = Math.min(
      width,
      Math.ceil(width * Math.max(a[0], b[0], c[0])) + 1,
    );
    const top = Math.max(
      0,
      Math.floor(height * Math.min(a[1], b[1], c[1])) - 1,
    );
    const bottom = Math.min(
      height,
      Math.ceil(height * Math.max(a[1], b[1], c[1])) + 1,
    );
    if (right > left && bottom > top) {
      ctx.drawImage(
        texture,
        left,
        top,
        right - left,
        bottom - top,
        left / width,
        top / height,
        (right - left) / width,
        (bottom - top) / height,
      );
    }
    ctx.restore();
  }
  const center = (points) => [
    (points[0][0] + points[1][0] + points[2][0]) / 3,
    (points[0][1] + points[1][1] + points[2][1]) / 3,
  ];
  let print, printCtx, printPhase, printCurl;
  function fanPrint(phase, pixels, curl) {
    if (!print) {
      print = document.createElement("canvas");
      printCtx = print.getContext("2d");
    }
    if (
      print.width === 2 * pixels &&
      phase === printPhase &&
      curl === printCurl
    )
      return print;
    printPhase = phase;
    printCurl = curl;
    if (print.width !== 2 * pixels) print.width = print.height = 2 * pixels;
    printCtx.setTransform(1, 0, 0, 1, 0, 0);
    printCtx.fillStyle = "#4a497c";
    printCtx.fillRect(0, 0, print.width, print.height);
    printCtx.save();
    printCtx.translate(pixels * 0.38, pixels * 0.88);

    const pattern = mix(1.43 + 0.37 * Math.sin(phase * 0.39), 0.17, curl);
    mirroredGlass(printCtx, {
      radius: pixels * 1.08,
      turn: 0.33 + 0.11 * Math.sin(phase * 0.23),
      materialPhase: phase,
      pattern,
    });
    printCtx.restore();
    printCtx.save();
    printCtx.translate(print.width, 0);
    printCtx.scale(-1, 1);
    printCtx.drawImage(
      print,
      0,
      0,
      pixels,
      print.height,
      0,
      0,
      pixels,
      print.height,
    );
    printCtx.restore();
    return print;
  }
  function create(canvas, { transparent = false } = {}) {
    const ctx = canvas.getContext("2d", { alpha: transparent });
    let w = 0,
      h = 0,
      dpr = 1,
      compact = false;
    function resize(width, height) {
      const small = width <= 900 || matchMedia("(pointer:coarse)").matches;
      const density = Math.min(
        window.devicePixelRatio || 1,
        small ? 1.4 : 1.75,
      );
      if (w === width && h === height && dpr === density && compact === small)
        return;
      w = width;
      h = height;
      dpr = density;
      compact = small;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    let glassPrint, glassCtx, glassGeometryAt, glassPatternAt;
    function resolution(radius) {
      return Math.min(640, Math.max(64, Math.ceil((radius * dpr) / 32) * 32));
    }
    function glassTexture(material, phaseStep, patternStep) {
      const pixels = resolution(material.radius),
        size = 2 * pixels;
      if (!glassPrint) {
        glassPrint = document.createElement("canvas");
        glassCtx = glassPrint.getContext("2d");
      }
      if (
        !glassGeometryAt ||
        glassPrint.width !== size ||
        Math.abs(material.materialPhase - glassGeometryAt.phase) > phaseStep ||
        Math.abs(material.pattern - glassPatternAt) > patternStep
      ) {
        if (glassPrint.width !== size)
          glassPrint.width = glassPrint.height = size;

        const local = { ...material, radius: 1, turn: 0 };
        glassGeometryAt = glassGeometry(local);
        glassPatternAt = material.pattern;
        glassCtx.setTransform(1, 0, 0, 1, 0, 0);
        glassCtx.clearRect(0, 0, size, size);
        glassCtx.save();
        glassCtx.translate(pixels, pixels);
        glassCtx.scale(pixels / 1.18, pixels / 1.18);
        mirroredGlass(glassCtx, local, glassGeometryAt);
        glassCtx.restore();
      }
      return glassGeometryAt;
    }
    function flyToFan(scene, material) {
      const { cx, cy, radius, cover, fan } = scene,
        t = cover.travel,
        extent = radius * 1.18;
      const geometry = glassTexture(
        material,
        compact ? 0.28 : 0,
        compact ? 0.1 : 0,
      );
      const paper = t > 0.3 ? printedFan(fan) : null;

      const push = ease(0, 0.39, t);
      const focalX = mix(cx, w * 0.5, push),
        focalY = mix(cy, h * 0.5, push);
      const zoom = mix(1, (Math.hypot(w * 0.5, h * 0.5) * 1.16) / radius, push);
      for (let i = 0; i < panels; i++) {
        const target = fanPanel(i, fan),
          source = [],
          sourceUV = [];
        const sign = i % 2 ? -1 : 1;
        const angle = geometry.axis + (i + (i % 2)) * sectorAngle;
        for (const ring of [-1, 2, 4, 7]) {
          for (let u = 0; u <= 2; u++) {
            const [x, y] =
              ring < 0 ? [0, 0] : geometry.rows[ring][sign === 1 ? u : 2 - u];
            const local = place(x * radius, sign * y * radius, angle, 0, 0);
            sourceUV.push([
              0.5 + local[0] / (2 * extent),
              0.5 + local[1] / (2 * extent),
            ]);
            source.push(place(local[0], local[1], material.turn, cx, cy));
          }
        }
        (compact ? broadCuts : cuts).forEach((indices, k) => {
          const home = indices.map((n) => source[n]),
            end = indices.map((n) => target.points[n]);
          const from = center(home),
            to = center(end);
          const seed = ((i * 37 + k * 17) % 29) / 29;
          const start = seed * 0.075,
            finish = 0.93 + seed * 0.07;
          const progress = Math.max(
            0,
            Math.min(1, (t - start) / (finish - start)),
          );
          const gather = ease(0.46, 1, progress);
          const lift =
            ease(0.02, 0.39, progress) * (1 - ease(0.57, 0.98, progress));
          const axis = Math.atan2(from[1] - cy, from[0] - cx);
          const reach = radius * (0.13 + 0.39 * seed) * lift;
          const x =
            mix(focalX + (from[0] - cx) * zoom, to[0], gather) +
            Math.cos(axis) * reach;
          const y =
            mix(focalY + (from[1] - cy) * zoom, to[1], gather) +
            Math.sin(axis) * reach;
          const spin = sign * (0.28 + 0.76 * seed) * lift;
          const points = home.map((point, n) => {
            const dx = mix(
              (point[0] - from[0]) * zoom,
              end[n][0] - to[0],
              gather,
            );
            const dy = mix(
              (point[1] - from[1]) * zoom,
              end[n][1] - to[1],
              gather,
            );
            return place(
              dx * (1 - (0.32 + 0.36 * seed) * lift),
              dy,
              spin,
              x,
              y,
            );
          });
          const recolor = ease(0.59, 0.96, progress);
          if (recolor < 1) {
            drawTriangle(
              ctx,
              glassPrint,
              indices.map((n) => sourceUV[n]),
              points,
            );
            if (lift > 0) {
              ctx.fillStyle =
                "rgba(255,246,215," + 0.16 * lift * (1 - recolor) + ")";
              ctx.fill(pathFor(points));
            }
          }
          if (recolor > 0 && paper) {
            ctx.globalAlpha = recolor;
            drawTriangle(
              ctx,
              paper,
              indices.map((n) => target.uv[n]),
              points,
            );
            ctx.fillStyle =
              i % 2 ? "rgba(33,25,84,.23)" : "rgba(255,225,186,.075)";
            ctx.fill(pathFor(points));
            ctx.globalAlpha = 1;
          }
        });
      }
    }
    function printedFan({ phase, radius, curl }) {
      const inkPhase = compact ? Math.round(phase * 8) / 8 : phase;
      const inkCurl = compact ? Math.round(curl * 24) / 24 : curl;
      return fanPrint(inkPhase, resolution(radius), inkCurl);
    }
    function renderCover(scene) {
      const { cx, cy, radius, turn, cover } = scene;
      const { travel, materialPhase, pattern } = cover;
      ctx.clearRect(0, 0, w, h);
      const wash = ctx.createLinearGradient(
        w * (-0.08 + travel * 0.09),
        h * 0.16,
        w * (1.08 + travel * 0.08),
        h * 0.57,
      );
      wash.addColorStop(0, "#ffbb67");
      wash.addColorStop(0.24, "#ffa382");
      wash.addColorStop(0.47, "#f49faf");
      wash.addColorStop(0.67, "#ba9ad9");
      wash.addColorStop(0.84, "#877ed5");
      wash.addColorStop(1, "#4d63c4");
      ctx.save();
      ctx.globalAlpha = 1 - ease(0.22, 0.62, travel);
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
      const material = { radius, turn, materialPhase, pattern };
      if (travel > 0) {
        flyToFan(scene, material);
        return;
      }
      ctx.save();
      ctx.translate(cx, cy);
      if (compact) {
        glassTexture(material, 0.045, 0.04);
        const extent = radius * 1.18;
        ctx.rotate(turn);
        ctx.drawImage(glassPrint, -extent, -extent, 2 * extent, 2 * extent);
      } else mirroredGlass(ctx, material);
      ctx.restore();
    }
    function render(scene) {
      if (scene.cover) {
        renderCover(scene);
        return;
      }
      const { bg, radius, opacity, curl } = scene;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      if (opacity <= 0 || radius <= 0) return;
      const paper = printedFan(scene);
      ctx.save();
      ctx.globalAlpha = opacity;
      for (let i = 0; i < panels; i++) {
        const panel = fanPanel(i, scene);

        const faces = curl > 0 ? (compact ? broadCuts : cuts) : [[0, 9, 11]];
        for (const [k, indices] of faces.entries()) {
          const points = indices.map((n) => panel.points[n]);
          drawTriangle(
            ctx,
            paper,
            indices.map((n) => panel.uv[n]),
            points,
          );
          const face = pathFor(points);
          ctx.fillStyle =
            i % 2
              ? "rgba(33,25,84," + 0.23 * (1 - curl) + ")"
              : "rgba(255,225,186," + 0.075 * (1 - curl) + ")";
          ctx.fill(face);
          if (curl > 0) {
            const lightSide = k < faces.length / 2;
            const relief = ctx.createLinearGradient(...points[0], ...points[2]);
            const light = lightSide ? "255,255,255" : "0,0,0";
            relief.addColorStop(0, "rgba(" + light + "," + 0.08 * curl + ")");
            relief.addColorStop(1, "rgba(" + light + "," + 0.42 * curl + ")");
            ctx.save();
            ctx.globalCompositeOperation = "soft-light";
            ctx.fillStyle = relief;
            ctx.fill(face);
            ctx.restore();
          }
        }
      }
      ctx.restore();
    }
    return { resize, render };
  }
  function mountHero(canvas, scope) {
    const glass = create(canvas, { transparent: true });
    let frame = 0,
      previous = null,
      elapsed = 0,
      scene = null,
      angle = 0,
      drag = null;
    function draw(time, force = false) {
      if (!scene || document.hidden) return;
      if (force || previous === null || time - previous >= 32) {
        const { travel, still, cx, cy, radius } = scene;
        if (!still && previous !== null)
          elapsed += Math.min(64, time - previous) * 0.001;
        previous = time;
        const clock = still ? 0 : elapsed;
        glass.render({
          cx,
          cy,
          radius,
          fan: scene.fan,
          turn: 0.16 + angle + clock * 0.105 + travel * 1.85,
          cover: {
            travel,
            materialPhase: clock * 0.62 + 6.4 * travel + angle * 2.4,
            pattern: clock / 2 + 2.25 * travel + angle * 0.66,
          },
        });
      }
    }
    function animate(time) {
      frame = 0;
      draw(time);
      if (scene && !scene.still && scene.travel < 0.09 && !document.hidden)
        frame = requestAnimationFrame(animate);
      else previous = null;
    }
    function hide() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
      scene = null;
      drag = null;
      canvas.hidden = true;
    }
    scope.listen(canvas, "pointerdown", (event) => {
      if (event.isPrimary && event.button === 0)
        drag = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          angle,
        };
    });
    scope.listen(canvas, "pointermove", (event) => {
      if (!drag || drag.id !== event.pointerId || !scene) return;
      const dx = event.clientX - drag.x,
        dy = event.clientY - drag.y;
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
        drag = null;
        return;
      }
      if (Math.abs(dx) < 5) return;
      canvas.setPointerCapture(drag.id);
      angle = drag.angle + dx / scene.radius;
      draw(performance.now(), true);
    });
    for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
      scope.listen(canvas, event, () => {
        drag = null;
      });
    scope.onDispose(hide);
    return {
      resize: glass.resize,
      hide,
      show(next) {
        scene = next;
        canvas.hidden = false;
        draw(performance.now(), true);
        if (!next.still && next.travel < 0.09 && !frame && !document.hidden)
          frame = requestAnimationFrame(animate);
      },
    };
  }
  return { create, mountHero };
})();
