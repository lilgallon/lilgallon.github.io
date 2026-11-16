// Animated background: soft gradient glows + isolines of a slowly evolving wave field.
(() => {
  // Only the first block of the page (home hero or CV header) gets the effect.
  const host = document.querySelector(".hero, .cv-hero");
  if (!host) return;

  const canvas = document.createElement("canvas");
  canvas.className = "bg-canvas";
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const finePointer = window.matchMedia("(pointer: fine)");

  const CELL = 14; // marching-squares cell size, CSS px
  const LEVELS = [];
  for (let v = -1.65; v <= 1.65; v += 0.22) LEVELS.push(v);

  let w = 0, h = 0, cols = 0, rows = 0, field = new Float32Array(0);
  let t = Math.random() * 100;
  let last = 0, rafId = 0, running = false, visible = true;
  const pointer = { x: 0.7, y: 0.3, tx: 0.7, ty: 0.3, strength: 0, target: 0 };

  const palettes = {
    light: {
      glows: ["rgba(36,72,214,0.07)", "rgba(124,58,237,0.05)", "rgba(14,165,164,0.05)"],
      lines: ["rgba(36,72,214,0.14)", "rgba(124,58,237,0.12)", "rgba(14,165,164,0.13)"],
    },
    dark: {
      glows: ["rgba(60,80,200,0.10)", "rgba(110,60,200,0.08)", "rgba(15,130,120,0.07)"],
      lines: ["rgba(110,130,220,0.15)", "rgba(140,110,220,0.13)", "rgba(60,170,155,0.13)"],
    },
  };
  const palette = () => (darkScheme.matches ? palettes.dark : palettes.light);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = host.clientWidth;
    h = host.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(w / CELL) + 1;
    rows = Math.ceil(h / CELL) + 1;
    field = new Float32Array(cols * rows);
  }

  // Sum of travelling waves, a radial ripple and a pointer "bump".
  function sample(x, y) {
    const s = 1 / 260;
    const u = x * s, v = y * s;
    const px = pointer.x * w, py = pointer.y * h;
    const dx = x - px, dy = y - py;
    const d2 = (dx * dx + dy * dy) / (180 * 180);
    const cx = u - 2.2 - Math.sin(t * 0.13), cy = v - 1.2 - Math.cos(t * 0.11);
    return (
      Math.sin(u * 1.7 + t * 0.35) * Math.cos(v * 1.3 - t * 0.27) +
      0.65 * Math.sin((u + v) * 1.1 - t * 0.22) +
      0.35 * Math.cos(Math.sqrt(cx * cx + cy * cy) * 2.4 - t * 0.5) +
      pointer.strength * 1.1 * Math.exp(-d2)
    );
  }

  function drawGlows(p) {
    const r = Math.max(w, h) * 0.55;
    const spots = [
      [0.18 + 0.08 * Math.sin(t * 0.21), 0.12 + 0.06 * Math.cos(t * 0.17)],
      [0.82 + 0.07 * Math.cos(t * 0.19), 0.22 + 0.08 * Math.sin(t * 0.23)],
      [0.55 + 0.1 * Math.sin(t * 0.15 + 1), 0.85 + 0.06 * Math.cos(t * 0.2)],
    ];
    spots.forEach(([sx, sy], i) => {
      const g = ctx.createRadialGradient(sx * w, sy * h, 0, sx * w, sy * h, r);
      g.addColorStop(0, p.glows[i]);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });
  }

  function drawIsolines(p) {
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) field[j * cols + i] = sample(i * CELL, j * CELL);
    }

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, p.lines[0]);
    grad.addColorStop(0.5, p.lines[1]);
    grad.addColorStop(1, p.lines[2]);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1;
    ctx.beginPath();

    const lerp = (a, b, lvl) => (lvl - a) / (b - a || 1e-6);

    for (let j = 0; j < rows - 1; j++) {
      const y0 = j * CELL, y1 = y0 + CELL;
      for (let i = 0; i < cols - 1; i++) {
        const x0 = i * CELL, x1 = x0 + CELL;
        const a = field[j * cols + i];
        const b = field[j * cols + i + 1];
        const c = field[(j + 1) * cols + i + 1];
        const d = field[(j + 1) * cols + i];
        const lo = Math.min(a, b, c, d), hi = Math.max(a, b, c, d);

        for (let k = 0; k < LEVELS.length; k++) {
          const lvl = LEVELS[k];
          if (lvl < lo || lvl > hi) continue;
          const pts = [];
          if ((a < lvl) !== (b < lvl)) pts.push(x0 + lerp(a, b, lvl) * CELL, y0);
          if ((b < lvl) !== (c < lvl)) pts.push(x1, y0 + lerp(b, c, lvl) * CELL);
          if ((d < lvl) !== (c < lvl)) pts.push(x0 + lerp(d, c, lvl) * CELL, y1);
          if ((a < lvl) !== (d < lvl)) pts.push(x0, y0 + lerp(a, d, lvl) * CELL);
          for (let q = 0; q + 3 < pts.length; q += 4) {
            ctx.moveTo(pts[q], pts[q + 1]);
            ctx.lineTo(pts[q + 2], pts[q + 3]);
          }
        }
      }
    }
    ctx.stroke();
  }

  function draw() {
    const p = palette();
    ctx.clearRect(0, 0, w, h);
    drawGlows(p);
    drawIsolines(p);
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (now - last < 1000 / 30) return; // ~30 fps is plenty
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    t += dt * 0.3;
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;
    pointer.strength += (pointer.target - pointer.strength) * 0.05;
    draw();
  }

  function start() {
    if (running || reduceMotion.matches || document.hidden || !visible) return;
    running = true;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  let resizeTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); draw(); }, 120);
  }).observe(host);

  // Stop animating once the block has scrolled out of view.
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }).observe(host);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  reduceMotion.addEventListener("change", () => (reduceMotion.matches ? stop() : start()));
  darkScheme.addEventListener("change", draw);

  if (finePointer.matches) {
    host.addEventListener("pointermove", (e) => {
      const r = host.getBoundingClientRect();
      pointer.tx = (e.clientX - r.left) / w;
      pointer.ty = (e.clientY - r.top) / h;
      pointer.target = 1;
    }, { passive: true });
    host.addEventListener("pointerleave", () => (pointer.target = 0));
  }

  resize();
  draw();
  start();
})();
