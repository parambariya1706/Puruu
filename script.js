(() => {
  "use strict";
  /* ===== EDIT ME ===== */
  const CONFIG = {
    name: "Princess Puruuu",                         // shown on page 2
    songTitle: "audio · paruu",       // shown on the music page (file: assets/our-song.mp3)
    photos: [                                   // add or remove lines freely
      { src: "assets/Photo1.jpeg", cap: "MY Love Birthday Moment" },
      { src: "assets/Photo2.jpeg", cap: "My Strength is your Smile" },
      { src: "assets/Photo3.jpeg", cap: "I like Your Style YRRRRR..." },
      { src: "assets/Photo4.jpeg", cap: "This Picture Make me more Happy.." },
      { src: "assets/Photo5.jpeg", cap: "your Hidden Beauty make me Romantic more 😘." },
      { src: "assets/Photo6.jpeg", cap: "My Princess Birthday Cake." },
      { src: "assets/Photo7.jpeg", cap: "Our Relationship makes strong when this Heart Always Happy.."},
      { src: "assets/Photo8.jpeg", cap: "This nice Pic tells our Romantic Couple.."},
      { src: "assets/Photo9.jpeg", cap: "Our Cutes Memoriess.. "},
      { src: "assets/Photo10.jpeg", cap: "I think this Pic tells we both Made each other..."},
    ],
    notes: [                                    // sticky notes on the secret page: write your own
      "Your Birthday Gift Coming soon....",
    ]
  };
  /* =================== */
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const screens = $$(".screen"), fx = $("#fx"), back = $("#back");
  let cur = 0, cakeDone = false;

  $$(".name").forEach(e => (e.textContent = CONFIG.name));
  $("#songTitle").textContent = CONFIG.songTitle;

  // ---- Particles (hard cap keeps it light) ----
  function spawn(em, cls, css) {
    if (reduced || fx.children.length >= 70) return;
    const e = document.createElement("span");
    e.textContent = em; e.className = cls; e.style.cssText = css;
    e.addEventListener("animationend", () => e.remove());
    fx.appendChild(e);
  }
  setInterval(() => {
    if (document.hidden || fx.children.length > 20) return;
    const list = screens[cur].dataset.emoji.split(" "), em = list[Math.floor(Math.random() * list.length)];
    const big = em === "🎈";
    spawn(em, cur === 6 ? "p fall" : "p", `left:${rnd(2, 95)}%;font-size:${big ? rnd(34, 56) : rnd(14, 32)}px;--sx:${rnd(-40, 40)}px;animation-duration:${big ? rnd(10, 16) : rnd(6, 11)}s`);
  }, 600);
  function burst(n, list, x = "50%", y = "60%") {
    for (let i = 0; i < n; i++) {
      const a = rnd(0, 6.28), d = rnd(120, Math.max(innerWidth, innerHeight) * 0.6);
      spawn(list[Math.floor(Math.random() * list.length)], "k", `left:${x};top:${y};font-size:${rnd(16, 44)}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 80}px;--r:${rnd(-90, 90)}deg;animation-duration:${rnd(1.2, 2.6)}s`);
    }
  }

  // ---- Confetti (canvas) ----
  const cv = $("#cf"), ctx = cv.getContext("2d"), cols = ["#ff6f91", "#f6d5da", "#d9a38f", "#b3274f", "#cdb7f0", "#fff"];
  let bits = [], raf = 0;
  const fit = () => { cv.width = innerWidth; cv.height = innerHeight; };
  fit(); addEventListener("resize", fit);
  function confetti() {
    if (reduced) return;
    for (let i = 0; i < 120; i++) bits.push({ x: innerWidth / 2, y: innerHeight * 0.6, s: rnd(4, 9), vx: rnd(-8, 8), vy: rnd(-20, -4), c: cols[i % cols.length], a: 1, r: rnd(0, 6) });
    if (!raf) raf = requestAnimationFrame(tick);
  }
  function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    bits = bits.filter(b => b.a > 0.02);
    bits.forEach(b => {
      b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.vx *= 0.99; b.a -= 0.008; b.r += 0.15;
      ctx.save(); ctx.globalAlpha = b.a; ctx.fillStyle = b.c; ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillRect(-b.s, -b.s / 2, b.s * 2, b.s); ctx.restore();
    });
    raf = bits.length ? requestAnimationFrame(tick) : 0;
  }

  // ---- Surprise sounds (made in code, no audio file needed) ----
  let actx, cdTimer = 0;
  function tone(f, t, d, type = "sine", v = 0.2) {
    const o = actx.createOscillator(), g = actx.createGain(), s = actx.currentTime + t;
    o.type = type; o.frequency.value = f;
    g.gain.setValueAtTime(v, s); g.gain.exponentialRampToValueAtTime(0.001, s + d);
    o.connect(g).connect(actx.destination); o.start(s); o.stop(s + d);
  }
  function sound(fn) {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); actx.resume(); fn(); } catch (e) { /* sound is optional */ }
  }
  const chime = () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.12, 0.9, "triangle")); tone(200, 0, 0.3, "square", 0.12); };
  function wishAloud() {
    if (!("speechSynthesis" in window)) return;
    const who = CONFIG.name.includes("[") ? "" : ", " + CONFIG.name;
    const u = new SpeechSynthesisUtterance("Happy birthday" + who + "!");
    u.rate = 0.9; u.pitch = 1.2; speechSynthesis.speak(u);
  }

  // ---- Page 2: countdown 3, 2, 1 then the reveal ----
  function stopCountdown() { clearTimeout(cdTimer); if ("speechSynthesis" in window) speechSynthesis.cancel(); }
  function startCountdown() {
    stopCountdown();
    const box = $("#count"), num = $("#num"), rv = $("#reveal");
    rv.hidden = true; box.hidden = false;
    let n = 3;
    (function step() {
      if (n > 0) {
        num.textContent = n; num.classList.remove("tick"); void num.offsetWidth; num.classList.add("tick");
        sound(() => tone(440 + (3 - n) * 140, 0, 0.2, "triangle"));
        n--; cdTimer = setTimeout(step, 1000);
      } else {
        box.hidden = true; rv.hidden = false;
        sound(chime); wishAloud();
        burst(40, ["❤️", "✨", "💖"]); confetti();
      }
    })();
  }

  // ---- Navigation (listeners added once; only the active screen is displayed) ----
  function go(n, push = true) {
    if (n < 0 || n >= screens.length) return;
    screens[cur].classList.remove("active");
    cur = n;
    screens[cur].classList.add("active");
    screens[cur].scrollTop = 0;
    if (cur !== 3) vid.pause();
    back.hidden = cur === 0;
    if (push) history.pushState({ n }, "", "#p" + (n + 1));
    if (cur === 1) startCountdown(); else stopCountdown();
  }
  history.replaceState({ n: 0 }, "", "#p1");
  addEventListener("popstate", e => go(e.state ? e.state.n : 0, false));
  $$("[data-next]").forEach(b => b.addEventListener("click", () => go(cur + 1)));
  back.addEventListener("click", () => go(cur - 1));

  // ---- Gallery + lightbox ----
  const lb = $("#lb"), lbImg = $("#lbImg"), lbCap = $("#lbCap"); let li = 0;
  function showLb(i) {
    li = (i + CONFIG.photos.length) % CONFIG.photos.length;
    const p = CONFIG.photos[li];
    lbImg.style.display = ""; lbImg.src = p.src; lbImg.alt = p.cap; lbCap.textContent = p.cap;
  }
  lbImg.addEventListener("error", () => (lbImg.style.display = "none"));
  CONFIG.photos.forEach((p, i) => {
    const b = document.createElement("button");
    b.className = "polaroid"; b.setAttribute("aria-label", "Open photo " + (i + 1) + ": " + p.cap);
    b.innerHTML = '<span class="ph"><img loading="lazy" alt=""></span><span class="cap"></span>';
    const img = $("img", b); img.src = p.src; img.alt = p.cap;
    img.addEventListener("error", () => (img.style.display = "none"));
    $(".cap", b).textContent = p.cap;
    b.addEventListener("click", () => { showLb(i); lb.hidden = false; $("#lbClose").focus(); });
    $("#gallery").appendChild(b);
  });
  $("#lbClose").onclick = () => (lb.hidden = true);
  $("#lbPrev").onclick = () => showLb(li - 1);
  $("#lbNext").onclick = () => showLb(li + 1);
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") lb.hidden = true;
    if (e.key === "ArrowLeft") showLb(li - 1);
    if (e.key === "ArrowRight") showLb(li + 1);
  });

  // ---- Cake ----
  $("#blow").addEventListener("click", function () {
    if (cakeDone) return go(cur + 1);
    cakeDone = true;
    $(".cake").classList.add("out"); $("#wish").classList.add("show");
    burst(18, ["💨", "✨", "💗"], "50%", "40%"); confetti();
    this.hidden = true; $("#vidWrap").hidden = false; vid.play().catch(() => {}); // song button returns after the video
  });

  // ---- Music (starts only on click) ----
  const song = $("#song"), card = $(".player"), pBtn = $("#play"), st = $("#status");
  function setPlay(on, msg) {
    card.classList.toggle("playing", on);
    pBtn.textContent = on ? "⏸ Pause" : "▶ Play";
    pBtn.setAttribute("aria-pressed", on); st.textContent = msg;
  }
  pBtn.addEventListener("click", () => {
    if (!song.paused) { song.pause(); return setPlay(false, "Paused."); }
    song.play().then(() => setPlay(true, "Now playing ♪"))
      .catch(() => setPlay(false, "Couldn't play the song. Check that assets/our-song.mp4 exists."));
  });
  song.addEventListener("error", () => setPlay(false, "Song file not found. Add assets/our-song.mp4"));

  // ---- Gift ----
  const KISS = ["😘", "💋", "❤️", "💖", "✨"], kmsg = $("#kmsg"), more = $("#more"), gnext = $("#giftNext");
  $("#openGift").addEventListener("click", function () {
    $(".gift").classList.add("open"); this.hidden = true;
    kmsg.hidden = more.hidden = gnext.hidden = false;
    burst(55, KISS);
  });
  more.addEventListener("click", () => burst(30, KISS, rnd(20, 80) + "%", rnd(40, 70) + "%"));

  // ---- Letter ----
  $("#openLetter").addEventListener("click", function () {
    $(".env").classList.add("open"); this.hidden = true; burst(20, ["🌸", "🌹", "✨"]);
    setTimeout(() => {
      ["#letter", "#closing", "#toSecret"].forEach(s => ($(s).hidden = false));
      $("#letter").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }, 700);
  });

  // ---- Cake video: song button appears when the video ends ----
  const vid = $("#vid"), blow = $("#blow");
  function showSongBtn() { blow.textContent = "Let's Play Our Song 🎶"; blow.hidden = false; }
  vid.addEventListener("ended", showSongBtn);
  vid.addEventListener("error", () => { $("#vidMsg").textContent = "Video not found. Add assets/our-video.mp4"; showSongBtn(); });

  // ---- Secret sticky notes ----
  let noteTimers = [];
  $("#secretBtn").addEventListener("click", function () {
    this.hidden = true; burst(25, ["💌", "✨", "💗"]);
    CONFIG.notes.forEach((t,i) => noteTimers.push(setTimeout(() => {
      const n = document.createElement("div");
      n.className = "note"; n.textContent = t; n.style.setProperty("--r", rnd(-5, 5) + "deg");
      $("#notes").appendChild(n);
      if (i === CONFIG.notes.length - 1) $("#replay").hidden = false;
    }, i * 900)));
  });

  // ---- Replay: reset every state ----
  $("#replay").addEventListener("click", () => {
    song.pause(); song.currentTime = 0; setPlay(false, "Press play when you're ready.");
    cakeDone = false; $(".cake").classList.remove("out"); $("#wish").classList.remove("show");
    $("#blow").textContent = "Blow Out the Candles 💨";
    $(".gift").classList.remove("open"); $("#openGift").hidden = false;
    kmsg.hidden = more.hidden = gnext.hidden = true;
    $(".env").classList.remove("open"); $("#openLetter").hidden = false;
    ["#letter", "#closing", "#toSecret"].forEach(s => ($(s).hidden = true));
    vid.pause(); vid.currentTime = 0; $("#vidWrap").hidden = true; $("#vidMsg").textContent = ""; blow.hidden = false;
    noteTimers.forEach(clearTimeout); noteTimers = []; $("#notes").textContent = "";
    $("#secretBtn").hidden = false; $("#replay").hidden = true;
    lb.hidden = true; fx.textContent = "";
    go(0);
  });
})();