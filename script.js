// @ts-nocheck
/* ============================================================
   CREATIVEVERSE — script.js
   EDIT THE CONFIG BELOW FIRST. Everything else can stay as is.
   ============================================================ */
const CONFIG = {
  // Your email. Replace before publishing.
  email: "farhanm3829c@gmail.com", // <-- REPLACE

  // Social links. Replace each URL (keep the quotes). Delete a line to remove it.
  socials: [
    { label: "Instagram", url: "https://instagram.com/edit4obito" }, // <-- REPLACE
  ],

  // NOVA promo video. Leave "" to show the animated placeholder.
  // Example: "assets/video/nova-promo.mp4"
  novaVideo: "",
  novaPoster: "" // Optional, e.g. "assets/images/nova-poster.jpg"
};

/* ============================================================ */
(function () {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isPlaceholder = (v) => /YOUR_|example\.com/i.test(v);

  /* ---------- Toast ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }

  /* ---------- Loader ---------- */
  const loader = $("#loader");
  let loaderGone = false;
  function hideLoader() {
    if (loaderGone) return;
    loaderGone = true;
    loader.classList.add("done");
    startReveals();
  }
  window.addEventListener("load", () => setTimeout(hideLoader, 250));
  setTimeout(hideLoader, 3000); // safety net if a font or image is slow

  /* ---------- Nav ---------- */
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  function setMenu(open) {
    menuBtn.setAttribute("aria-expanded", String(open));
    navLinks.classList.toggle("open", open);
  }
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  $$("a", navLinks).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav")) setMenu(false);
  });

  /* ---------- Contact + socials from CONFIG ---------- */
  const emailCta = $("#emailCta");
  emailCta.href = "mailto:" + CONFIG.email + "?subject=Project%20enquiry";
  emailCta.addEventListener("click", (e) => {
    if (isPlaceholder(CONFIG.email)) {
      e.preventDefault();
      toast("Placeholder email. Edit CONFIG.email in script.js");
    }
  });

  const socialList = $("#socialList");
  CONFIG.socials.forEach((s) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.textContent = s.label;
    a.href = s.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.addEventListener("click", (e) => {
      if (isPlaceholder(s.url)) {
        e.preventDefault();
        toast(s.label + " link is a placeholder. Edit CONFIG in script.js");
      }
    });
    li.appendChild(a);
    socialList.appendChild(li);
  });

  $("#year").textContent = new Date().getFullYear();

  /* ---------- Scroll reveals ---------- */
  const heroTitle = $(".hero-title");
  function startReveals() {
    heroTitle.classList.add("in");
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- Parallax (only visible elements, rAF-throttled) ---------- */
  if (!reduceMotion) {
    // FIX: blobs hata diye, kyunki unpe CSS animation (drift) transform override karti hai
    const pEls = [
      { el: $(".hero-stage"), speed: 0.06 }
    ].filter((p) => p.el);
    let ticking = false;
    function parallax() {
      ticking = false;
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return; // hero is far away
      pEls.forEach((p) => { p.el.style.transform = "translate3d(0," + (y * p.speed).toFixed(1) + "px,0)"; });
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(parallax); }
    }, { passive: true });
  }

  /* ---------- Cursor glow (desktop only) ---------- */
  if (finePointer && !reduceMotion) {
    const glow = $("#glow");
    let tx = 0, ty = 0, cx = 0, cy = 0, glowRunning = false;
    function glowLoop() {
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      glow.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) requestAnimationFrame(glowLoop);
      else glowRunning = false; // stop looping once settled
    }
    window.addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      glow.classList.add("on");
      if (!glowRunning) { glowRunning = true; requestAnimationFrame(glowLoop); }
    }, { passive: true });
    document.addEventListener("mouseleave", () => glow.classList.remove("on"));

    /* Card tilt + spotlight */
    $$(".card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", px * 100 + "%");
        card.style.setProperty("--my", py * 100 + "%");
        card.style.setProperty("--ry", ((px - 0.5) * 8).toFixed(2) + "deg");
        card.style.setProperty("--rx", ((0.5 - py) * 8).toFixed(2) + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }

  /* ---------- NOVA video (loaded only when you press play) ---------- */
  (function setupVideo() {
    const box = $("#videoBox");
    const video = $("#novaVideo");
    const reel = $("#reelPlaceholder");
    const playBtn = $("#playBtn");
    const note = $("#videoNote");

    if (!CONFIG.novaVideo) {
      playBtn.addEventListener("click", () => toast("Add your video path in CONFIG.novaVideo (script.js)"));
      return;
    }
    note.textContent = "Tap play";
    if (CONFIG.novaPoster) video.poster = CONFIG.novaPoster;

    playBtn.addEventListener("click", () => {
      video.src = CONFIG.novaVideo; // lazy: nothing downloads until now
      video.hidden = false;
      reel.hidden = true;
      box.classList.add("playing");
      video.play().catch(() => {});
    });
    video.addEventListener("error", () => {
      video.hidden = true;
      reel.hidden = false;
      box.classList.remove("playing");
      toast("Video not found. Check the path in CONFIG.novaVideo");
    });
  })();

  /* ============================================================
     3D HERO (Three.js, lazy-loaded, procedural character)
     ============================================================ */
  const stage = $("#stage");
  const canvas = $("#heroCanvas");
  const THREE_URL = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

  function hasWebGL() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) { return false; }
  }
  function useFallback() { stage.classList.add("fallback"); }

  async function init3D() {
    if (!hasWebGL()) {
      toast("WebGL not supported, fallback orb");
      return useFallback();
    }

    let THREE;
    try {
      THREE = await Promise.race([
        import(THREE_URL),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 9000))
      ]);
    } catch (err) {
      console.warn("Three.js failed to load:", err);
      toast("3D load error: " + err.message); // FIX: error ab screen pe dikhega
      return useFallback();
    }

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: window.devicePixelRatio < 2, powerPreference: "high-performance" });
    } catch (err) {
      toast("Renderer error: " + err.message);
      return useFallback();
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.set(0, 0.2, 7.2);

    /* Lights: three coloured points that drift for animated gradient lighting */
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const lPurple = new THREE.PointLight(0x8b2bff, 70, 20);
    const lOrange = new THREE.PointLight(0xff5a1f, 60, 20);
    const lLime = new THREE.PointLight(0xc6ff3d, 40, 20);
    scene.add(lPurple, lOrange, lLime);

    /* Materials */
    const mHead = new THREE.MeshStandardMaterial({ color: 0xf1ecff, roughness: 0.28, metalness: 0.1 });
    const mBody = new THREE.MeshStandardMaterial({ color: 0x8b2bff, roughness: 0.3, metalness: 0.25 });
    const mVisor = new THREE.MeshStandardMaterial({ color: 0x07070c, roughness: 0.08, metalness: 0.9 });
    const mEye = new THREE.MeshBasicMaterial({ color: 0xc6ff3d });
    const mOrange = new THREE.MeshStandardMaterial({ color: 0xff5a1f, roughness: 0.3, emissive: 0xff3a00, emissiveIntensity: 0.35 });
    const mLime = new THREE.MeshStandardMaterial({ color: 0xc6ff3d, roughness: 0.3, emissive: 0x88cc00, emissiveIntensity: 0.3 });

    /* Character */
    const root = new THREE.Group();
    scene.add(root);
    const character = new THREE.Group();
    root.add(character);

    const head = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), mHead);
    head.scale.set(1.15, 0.95, 1.0);
    head.position.y = 1.05;
    character.add(head);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 20), mVisor);
    visor.scale.set(1.12, 0.62, 0.5);
    visor.position.set(0, 1.08, 0.7);
    character.add(visor);

    const eyes = new THREE.Group();
    eyes.position.set(0, 1.1, 1.02);
    [-0.32, 0.32].forEach((x) => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), mEye);
      eye.scale.set(1, 1.7, 0.4);
      eye.position.x = x;
      eyes.add(eye);
    });
    character.add(eyes);

    [-1, 1].forEach((s) => {
      const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.28, 24), mOrange);
      ear.rotation.z = Math.PI / 2;
      ear.position.set(s * 1.2, 1.05, 0);
      character.add(ear);
    });

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), mLime);
    stem.position.y = 2.2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), mOrange);
    bulb.position.y = 2.52;
    character.add(stem, bulb);

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 0.7, 8, 24), mBody);
    body.position.y = -0.35;
    character.add(body);

    const chest = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.06, 10, 24), mLime);
    chest.position.set(0, -0.2, 0.62);
    character.add(chest);

    const arms = [];
    [-1, 1].forEach((s) => {
      const arm = new THREE.Group();
      const limb = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.5, 6, 14), mHead);
      limb.position.y = -0.3;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), mOrange);
      hand.position.y = -0.7;
      arm.add(limb, hand);
      arm.position.set(s * 0.9, 0.1, 0);
      arm.rotation.z = s * 0.35;
      arm.userData.side = s;
      character.add(arm);
      arms.push(arm);
    });

    /* Rings and orbiting shapes (depth cues) */
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.5, 0.018, 8, 120), mLime);
    ringA.rotation.x = 1.25;
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.014, 8, 120), mOrange);
    ringB.rotation.set(1.0, 0.5, 0);
    root.add(ringA, ringB);

    const orbiters = [
      { mesh: new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), mOrange), r: 2.5, sp: 0.8, ph: 0, y: 0.8 },
      { mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), mLime), r: 2.8, sp: -0.6, ph: 2, y: -0.4 },
      { mesh: new THREE.Mesh(new THREE.TorusKnotGeometry(0.14, 0.05, 48, 8), mBody), r: 2.2, sp: 1.0, ph: 4, y: 1.6 }
    ];
    orbiters.forEach((o) => root.add(o.mesh));

    /* Sizing (keeps the character fully visible on tall and wide screens) */
    function resize() {
      const w = stage.clientWidth || 300;
      const h = stage.clientHeight || 300;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = camera.aspect < 0.9 ? 9.4 : camera.aspect < 1.3 ? 8.2 : 7.2;
      camera.updateProjectionMatrix();
    }
    resize();
    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(stage);
    else window.addEventListener("resize", resize);

    /* Pointer tracking (works with mouse and touch drag) */
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    window.addEventListener("pointermove", (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    /* Render loop: runs only while hero is visible AND tab is active */
    let running = false, heroVisible = true, last = performance.now(), t = 0;

    function frame(now) {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;

      smooth.x += (pointer.x - smooth.x) * 0.06;
      smooth.y += (pointer.y - smooth.y) * 0.06;

      root.position.y = Math.sin(t * 1.3) * 0.14;
      character.rotation.y = smooth.x * 0.55;
      character.rotation.x = smooth.y * 0.25;
      head.rotation.y = smooth.x * 0.25;
      eyes.position.x = smooth.x * 0.12;
      visor.position.x = smooth.x * 0.05;
      arms.forEach((a) => { a.rotation.z = a.userData.side * (0.35 + Math.sin(t * 1.6 + a.userData.side) * 0.08); });

      ringA.rotation.z = t * 0.25;
      ringB.rotation.z = -t * 0.18;
      orbiters.forEach((o) => {
        const a = t * o.sp + o.ph;
        o.mesh.position.set(Math.cos(a) * o.r, o.y + Math.sin(t + o.ph) * 0.2, Math.sin(a) * o.r * 0.6);
        o.mesh.rotation.x += dt; o.mesh.rotation.y += dt * 1.3;
      });

      lPurple.position.set(Math.cos(t * 0.7) * 4, 2.5, 3 + Math.sin(t * 0.5) * 2);
      lOrange.position.set(Math.cos(t * 0.6 + 2) * 4, -1, 3 + Math.sin(t * 0.4) * 2);
      lLime.position.set(Math.cos(t * 0.5 + 4) * 3, 3, -2);

      renderer.render(scene, camera);
      requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduceMotion) return;
      running = true; last = performance.now();
      requestAnimationFrame(frame);
    }
    function stop() { running = false; }
    function sync() { (heroVisible && !document.hidden) ? start() : stop(); }

    document.addEventListener("visibilitychange", sync);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((en) => { heroVisible = en[0].isIntersecting; sync(); }, { threshold: 0.01 }).observe(stage);
    }

    /* If the GPU context is lost, switch to the fallback gracefully */
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); stop(); stage.classList.remove("ready"); useFallback(); });

    // First frame is always drawn (also covers reduced-motion: static pose)
    renderer.render(scene, camera);
    stage.classList.add("ready");
    sync();
  }

  /* Load 3D when the browser is idle so text and layout appear first */
  const kick = () => init3D().catch((err) => { toast("3D error: " + err.message); useFallback(); });
  if ("requestIdleCallback" in window) requestIdleCallback(kick, { timeout: 1500 });
  else setTimeout(kick, 400);
})();
