/* ============================================================
   BIRTHDAY EXPERIENCE — COMPLETE SCRIPT
   ============================================================ */

/* ─── AUDIO ENGINE ─── */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let musicGain = null;
let isPlaying = false;
let currentTrack = 0;
let oscillators = [];

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new AudioCtx();
    musicGain = audioCtx.createGain();
    musicGain.connect(audioCtx.destination);
    musicGain.gain.value = 0.18;
  }
  return audioCtx;
}

function playNote(freq, dur, type = "sine", gain = 0.3, delay = 0) {
  const ctx = getAudioCtx();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + delay);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
  osc.connect(g);
  g.connect(musicGain || ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + dur + 0.1);
}

const tracks = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    src: "music/perfect.mpeg",
  },
  {
    title: "I Wanna Be Yours",
    artist: "Arctic Monkeys",
    src: "music/wanna be yours.mpeg",
  },
  {
    title: "Under the influence",
    artist: "Chris Brown",
    src: "music/Under The Influence Song.mpeg",
  },
];

let melodyInterval = null;
function startMelody(trackIndex) {
  const audio = document.getElementById("audioPlayer");

  audio.src = tracks[trackIndex].src;
  audio.play();
}

function stopMelody() {
  document.getElementById("audioPlayer").pause();
}

/* ─── LOCK SCREEN ─── */
const correctCode = "120800";
let wrongAttempts = 0;

function initLockScreen() {
  const bg = document.getElementById("floatingHeartsBg");
  for (let i = 0; i < 18; i++) {
    const h = document.createElement("div");
    h.className = "floating-heart-item";
    h.textContent = "♥";
    h.style.cssText = `left:${Math.random() * 95}%;top:${Math.random() * 95}%;font-size:${1 + Math.random() * 2}rem;animation-delay:${Math.random() * 6}s;animation-duration:${6 + Math.random() * 5}s`;
    bg.appendChild(h);
  }

  // Scattered small hearts
  const sc = document.getElementById("scatteredHearts");
  ["♥", "❤", "♡"].forEach(() => {
    for (let i = 0; i < 5; i++) {
      const h = document.createElement("span");
      h.textContent = "❤";
      h.style.cssText = `position:absolute;left:${Math.random() * 90}%;top:${Math.random() * 90}%;font-size:${0.6 + Math.random() * 0.8}rem;color:var(--maroon);opacity:${0.1 + Math.random() * 0.15};transform:rotate(${Math.random() * 40 - 20}deg)`;
      sc.appendChild(h);
    }
  });

  const inputs = document.querySelectorAll(".code-digit");
  inputs.forEach((inp, i) => {
    inp.addEventListener("input", (e) => {
      const val = e.target.value.replace(/[^0-9]/g, "");
      e.target.value = val;
      if (val && i < inputs.length - 1) inputs[i + 1].focus();
      if (i === inputs.length - 1 && val) checkCode();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !e.target.value && i > 0)
        inputs[i - 1].focus();
    });
  });
}

function checkCode() {
  const inputs = document.querySelectorAll(".code-digit");
  const entered = Array.from(inputs)
    .map((i) => i.value)
    .join("");
  if (entered.length < 6) return;

  const msg = document.getElementById("codeMessage");
  if (entered === correctCode) {
    msg.textContent = "✨ The magic begins... ✨";
    document.querySelectorAll(".code-digit").forEach((i) => {
      i.disabled = true;
      i.style.borderColor = "var(--gold)";
    });
    document.getElementById("lockIcon").classList.add("lock-unlocking");
    setTimeout(unlockAnimation, 700);
  } else {
    wrongAttempts++;
    inputs.forEach((i) => {
      i.value = "";
      i.style.borderColor = "#c0392b";
    });
    inputs[0].focus();
    if (wrongAttempts === 1) msg.textContent = "Hmm... that's not it 😏";
    else if (wrongAttempts === 2) msg.textContent = "Try our special date ❤️";
    else msg.textContent = "Almost there... think special 💕";
    gsap.to(".code-inputs", { x: [-8, 8, -6, 6, -4, 4, 0], duration: 0.4 });
    setTimeout(() => inputs.forEach((i) => (i.style.borderColor = "")), 1000);
  }
}

function spawnGoldParticle(x, y) {
  const p = document.createElement("div");
  p.className = "gold-particle";
  const size = 4 + Math.random() * 8;
  p.style.cssText = `width:${size}px;height:${size}px;left:${x + (Math.random() - 0.5) * 60}px;top:${y + (Math.random() - 0.5) * 60}px;`;
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 2100);
}

function unlockAnimation() {
  const card = document.querySelector(".lock-card");
  const rect = card.getBoundingClientRect();
  for (let i = 0; i < 40; i++) {
    setTimeout(
      () =>
        spawnGoldParticle(
          rect.left + rect.width / 2,
          rect.top + rect.height / 2,
        ),
      i * 30,
    );
  }
  playNote(523, 0.3);
  setTimeout(() => playNote(659, 0.3), 150);
  setTimeout(() => playNote(784, 0.6), 300);
  gsap.to("#lockScreen", {
    opacity: 0,
    duration: 1.2,
    delay: 0.8,
    onComplete: () => {
      document.getElementById("lockScreen").style.display = "none";
      startCinematicIntro();
    },
  });
}

/* ─── CINEMATIC INTRO ─── */
function startCinematicIntro() {
  const intro = document.getElementById("cinematicIntro");
  intro.classList.add("active");
  startStarCanvas();
  const lines = [
    { el: "twLine1", text: "Someone special has arrived..." },
    { el: "twLine2", text: "Loading memories..." },
    { el: "twLine3", text: "Collecting smiles..." },
    { el: "twLine4", text: "Preparing surprises..." },
    { el: "welcomeTitle", text: "HAPPY BIRTHDAY, PRINCESS ❤️" },
  ];
  let delay = 400;
  lines.forEach((l, idx) => {
    setTimeout(() => typewrite(l.el, l.text, 50), delay);
    delay += l.text.length * 52 + 700;
  });
  setTimeout(() => {
    gsap.to("#cinematicIntro", {
      opacity: 0,
      duration: 1.5,
      onComplete: () => {
        intro.classList.remove("active");
        intro.style.display = "none";
        startMainWebsite();
      },
    });
  }, delay + 1000);
}

function typewrite(elId, text, speed) {
  const el = document.getElementById(elId);
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(interval);
  }, speed);
}

function startStarCanvas() {
  const canvas = document.getElementById("starsCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    a: Math.random(),
    speed: 0.005 + Math.random() * 0.015,
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((s) => {
      s.a += s.speed;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,180,131,${Math.abs(Math.sin(s.a)) * 0.8})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── MAIN WEBSITE ─── */
function startMainWebsite() {
  document.getElementById("mainWebsite").classList.add("active");
  gsap.from("#mainWebsite", { opacity: 0, duration: 1.5 });
  initBgCanvas();
  initBalloons();
  initCarousel();
  initLetters();
  initMusicPlayer();
  initTimeline();
  initConstellation();
  initGifts();
  initGame();
  initCinema();
  initCake();
  initEnding();
  startMelody(0);
}

/* ─── BACKGROUND CANVAS (petals + floating hearts) ─── */
function initBgCanvas() {
  const canvas = document.getElementById("bgCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const petals = Array.from({ length: 28 }, () => createPetal());
  const bgHearts = Array.from({ length: 14 }, () => createBgHeart());

  function createPetal() {
    return {
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height,
      r: 3 + Math.random() * 6,
      speed: 0.5 + Math.random() * 1.2,
      drift: (Math.random() - 0.5) * 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      opacity: 0.15 + Math.random() * 0.25,
    };
  }
  function createBgHeart() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 40,
      size: 8 + Math.random() * 16,
      speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.5,
      opacity: 0.06 + Math.random() * 0.1,
    };
  }

  function drawHeart(ctx, x, y, size, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#6D2B35";
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size * 0.5, y, x - size * 0.5, y + size * 0.3);
    ctx.bezierCurveTo(
      x - size * 0.5,
      y + size * 0.65,
      x,
      y + size * 0.9,
      x,
      y + size,
    );
    ctx.bezierCurveTo(
      x,
      y + size * 0.9,
      x + size * 0.5,
      y + size * 0.65,
      x + size * 0.5,
      y + size * 0.3,
    );
    ctx.bezierCurveTo(x + size * 0.5, y, x, y, x, y + size * 0.3);
    ctx.fill();
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      if (p.y > canvas.height + 30) Object.assign(p, createPetal(), { y: -20 });
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = "#8D3A46";
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r * 1.8, p.r, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    bgHearts.forEach((h) => {
      h.y -= h.speed;
      h.x += h.drift;
      if (h.y < -40)
        Object.assign(h, createBgHeart(), { y: canvas.height + 40 });
      drawHeart(ctx, h.x, h.y, h.size, h.opacity);
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─── SECTION 1: BALLOONS ─── */
const balloonMemories = [
  {
    emoji: "🧸",
    text: "",
    image: "images/i1.jfif",
    title: "Our sweetest little memory together.",
    color: "#8D3A46",
  },
  {
    emoji: "🎀",
    text: "",
    image: "images/i2.jfif",
    title: "The day your smile became my favorite view.",
    color: "#6D2B35",
  },
  {
    emoji: "💞",
    text: "",
    image: "images/i3.jfif",
    title: "A soft memory wrapped in love.",
    color: "#4B1E24",
  },
  {
    emoji: "✨",
    text: "",
    image: "images/i4.jfif",
    title: "Cute, cozy, and forever mine.",
    color: "#8D3A46",
  },
  {
    emoji: "🌷",
    text: "",
    image: "images/i5.jfif",
    title: "My favorite person, my favorite memory.",
    color: "#6D2B35",
  },
  // {
  //   emoji: '❤️',
  //   text: "",
  //   image: "images/i6.jfif",
  //   title: "This one feels like a warm hug.",
  //   color: "#4B1E24"
  // },
];

function initBalloons() {
  const container = document.getElementById("balloonsContainer");
  if (!container) return;

  const positions = [
    { left: "8%", top: "12%" },
    { left: "28%", top: "5%" },
    { left: "50%", top: "8%" },
    { left: "70%", top: "6%" },
    { left: "84%", top: "15%" },
    // { left: '18%', top: '32%' },
  ];

  balloonMemories.forEach((mem, i) => {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.cssText = `
      left:${positions[i].left};
      top:${positions[i].top};
      animation-delay:${i * 0.6}s;
    `;

    balloon.innerHTML = `
      <div class="balloon-body" style="background: radial-gradient(circle at 30% 28%, ${lighten(mem.color)}, ${mem.color});">
        <div class="balloon-highlight"></div>
        <span class="balloon-emoji">${mem.emoji}</span>
      </div>
      <div class="balloon-string"></div>
      <div class="balloon-knot"></div>
    `;

    balloon.addEventListener("click", () => popBalloon(balloon, mem));
    container.appendChild(balloon);
  });
}

function lighten(hex) {
  const r = parseInt(hex.slice(1, 3), 16) + 40;
  const g = parseInt(hex.slice(3, 5), 16) + 30;
  const b = parseInt(hex.slice(5, 7), 16) + 40;
  return `rgb(${Math.min(r, 255)},${Math.min(g, 255)},${Math.min(b, 255)})`;
}

function popBalloon(el, mem) {
  el.classList.add("popped");
  playNote(880, 0.15, "sine", 0.2);
  spawnConfetti(el.getBoundingClientRect());

  setTimeout(() => {
    const reveal = document.createElement("div");
    reveal.className = "memory-reveal memory-card";

    reveal.innerHTML = `
      <button class="memory-close">✕</button>
      <div class="memory-image-wrap">
        <img src="${mem.image}" alt="${mem.title}" class="memory-image" onerror="this.style.display='none'">
        <div class="memory-image-fallback">🧸</div>
      </div>
      <div class="memory-content">
        <h3>${mem.title}</h3>
        <p><span>🧸</span> ${mem.text}</p>
      </div>
    `;

    reveal.style.cssText = `
      left:${el.style.left};
      top:${el.style.top};
    `;

    document.getElementById("balloonsContainer").appendChild(reveal);

    reveal.querySelector(".memory-close").addEventListener("click", () => {
      reveal.classList.add("fade-out");
      setTimeout(() => reveal.remove(), 250);
    });
  }, 280);
}

function spawnConfetti(rect) {
  const layer = document.getElementById("confettiLayer");
  const colors = ["#6D2B35", "#D4B483", "#ECE3D6", "#8D3A46", "#4B1E24"];
  for (let i = 0; i < 30; i++) {
    const c = document.createElement("div");
    c.className = "confetti-piece";
    const size = 6 + Math.random() * 8;
    c.style.cssText = `
      width:${size}px;height:${size * 0.6}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${rect.left + rect.width / 2 + (Math.random() - 0.5) * 80}px;
      top:${rect.top + rect.height / 2}px;
      animation-delay:${Math.random() * 0.3}s;
      animation-duration:${1.2 + Math.random() * 0.8}s;
      transform:rotate(${Math.random() * 360}deg);
    `;
    layer.appendChild(c);
    setTimeout(() => c.remove(), 2200);
  }
}

/* ─── SECTION 2: CAROUSEL ─── */
/* ─── PREMIUM SMOOTH 3D CAROUSEL ─── */

const carouselData = [
  {
    img: "images/i1.jfif",
    caption: "Happy Birthday to my favourite person",
    note: "Sending all my love ❤️",
  },
  {
    img: "images/i2.jfif",
    caption: "Every memory with you is a treasure",
    note: "Always & forever 💕",
  },
  {
    img: "images/i3.jfif",
    caption: "Counting the smiles you've given me",
    note: "Too many to count ✨",
  },
  {
    img: "images/i4.jfif",
    caption: "Here's to another year of us",
    note: "Many more to come 🌹",
  },
  {
    img: "images/i5.jfif",
    caption: "You make every day magical",
    note: "My favourite person 🎀",
  },
  {
    img: "images/i6.jfif",
    caption: "A world more beautiful because you're in it",
    note: "Always yours ❤️",
  },
];

let carouselAngle = 0;

let isDragging = false;
let dragStartX = 0;
let lastDragX = 0;

let autoRotateSpeed = 0.08; // slower premium speed
let autoRotate = true;

function initCarousel() {
  const c3d = document.getElementById("carousel3d");

  const count = carouselData.length;

  const radius = window.innerWidth < 768 ? 180 : 320;

  carouselData.forEach((item, i) => {
    const angle = (360 / count) * i;

    const wrapper = document.createElement("div");

    wrapper.className = "carousel-item";

    wrapper.style.transform = `
      rotateY(${angle}deg)
      translateZ(${radius}px)
      translate(-50%, -50%)
      `;

    wrapper.innerHTML = `
      <div class="polaroid">

        <div class="polaroid-img">
          <img
            src="${item.img}"
            alt="memory"
            draggable="false"
            onerror="
              this.style.display='none';
              this.parentElement.innerHTML='❤️'
            "
          />
        </div>

        <span class="polaroid-label">
          ${item.caption}
        </span>

      </div>
    `;

    wrapper.addEventListener("mouseenter", () => {
      document.getElementById("carouselCaption").textContent = item.caption;
    });

    wrapper.addEventListener("click", () => {
      openPhotoModal(item);
    });

    c3d.appendChild(wrapper);
  });

  const wrapper = document.getElementById("carouselWrapper");

  /* ─── DRAG START ─── */

  wrapper.addEventListener("mousedown", (e) => {
    isDragging = true;

    autoRotate = false;

    dragStartX = e.clientX;
    lastDragX = e.clientX;

    wrapper.style.cursor = "grabbing";
  });

  wrapper.addEventListener("touchstart", (e) => {
    isDragging = true;

    autoRotate = false;

    dragStartX = e.touches[0].clientX;
    lastDragX = e.touches[0].clientX;
  });

  /* ─── DRAG MOVE ─── */

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const delta = e.clientX - lastDragX;

    carouselAngle += delta * 0.18; // MUCH smoother

    lastDragX = e.clientX;

    updateCarousel();
  });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging) return;

    const delta = e.touches[0].clientX - lastDragX;

    carouselAngle += delta * 0.18;

    lastDragX = e.touches[0].clientX;

    updateCarousel();
  });

  /* ─── DRAG END ─── */

  window.addEventListener("mouseup", () => {
    isDragging = false;

    wrapper.style.cursor = "grab";

    setTimeout(() => {
      autoRotate = true;
    }, 1500);
  });

  window.addEventListener("touchend", () => {
    isDragging = false;

    setTimeout(() => {
      autoRotate = true;
    }, 1500);
  });

  /* ─── START ANIMATION LOOP ─── */

  animateCarousel();
}

/* ─── UPDATE ─── */

function updateCarousel() {
  document.getElementById("carousel3d").style.transform =
    `rotateY(${carouselAngle}deg)`;
}

/* ─── SMOOTH AUTO ROTATION ─── */

function animateCarousel() {
  if (autoRotate && !isDragging) {
    carouselAngle -= autoRotateSpeed;

    updateCarousel();
  }

  requestAnimationFrame(animateCarousel);
}

/* ─── PHOTO MODAL ─── */

function openPhotoModal(item) {
  const modal = document.getElementById("photoModal");

  const ph = document.getElementById("modalPhoto");

  ph.innerHTML = `
    <img
      src="${item.img}"
      alt="memory"
      style="
        width:100%;
        height:100%;
        object-fit:cover;
      "
      onerror="
        this.style.display='none';
        this.parentElement.innerHTML='❤️'
      "
    />
  `;

  document.getElementById("modalCaption").textContent = item.caption;

  document.getElementById("modalNote").textContent = item.note;

  modal.classList.add("open");
}

/* ─── MODAL CLOSE ─── */

document.getElementById("modalClose").addEventListener("click", () => {
  document.getElementById("photoModal").classList.remove("open");
});

/* ─── SECTION 3: LETTERS ─── */
const letters = [
  {
    label: "Letter #1",
    text: `My dearest,\n\nOn this special day, I want you to know that every moment I've spent with you has been the greatest gift of my life.\n\nYou laugh like sunshine sounds, and you make the whole world feel kinder just by being in it.\n\nHappy Birthday, my favourite person. ❤️`,
  },
  {
    label: "Letter #2",
    text: `To the one who makes ordinary days feel extraordinary,\n\nI remember every small detail about you — the way you smile when you think no one's watching, the way you make everything feel safe.\n\nThank you for being exactly who you are. ✨`,
  },
  {
    label: "Letter #3",
    text: `Dearest,\n\nIf I could collect all the beautiful moments we've shared and turn them into stars, the sky would never be dark again.\n\nYou are my favourite story, my dearest chapter, my favourite everything.\n\nForever yours, with love. 🌹`,
  },
];

function initLetters() {
  const container = document.getElementById("envelopesContainer");
  letters.forEach((letter, i) => {
    const env = document.createElement("div");
    env.className = "envelope";
    env.style.animationDelay = `${i * 1.5}s`;
    env.innerHTML = `
      <div class="env-body">
        <div class="env-flap"></div>
        <div class="env-bow">🎀</div>
        <div class="env-label">${letter.label}</div>
      </div>`;
    env.addEventListener("click", () => openLetter(letter));
    container.appendChild(env);
  });

  // Flying envelopes bg
  const flyingBg = document.getElementById("flyingEnvelopes");
  for (let i = 0; i < 5; i++) {
    const fe = document.createElement("div");
    fe.className = "flying-env";
    fe.textContent = "✉️";
    fe.style.cssText = `top:${10 + Math.random() * 80}%;animation-delay:${i * 2.5}s;animation-duration:${10 + Math.random() * 8}s`;
    flyingBg.appendChild(fe);
  }
}

let letterTyping = null;
function openLetter(letter) {
  const modal = document.getElementById("letterModal");
  const content = document.getElementById("letterContent");
  content.textContent = "";
  modal.classList.add("open");
  if (letterTyping) clearInterval(letterTyping);
  let i = 0;
  letterTyping = setInterval(() => {
    content.textContent += letter.text[i];
    i++;
    if (i >= letter.text.length) clearInterval(letterTyping);
  }, 28);
}

document.getElementById("letterClose").addEventListener("click", () => {
  document.getElementById("letterModal").classList.remove("open");
  if (letterTyping) clearInterval(letterTyping);
});

/* ─── SECTION 4: MUSIC ─── */
function initMusicPlayer() {
  const playlist = document.getElementById("playlist");
  tracks.forEach((t, i) => {
    const item = document.createElement("div");
    item.className = `playlist-item ${i === 0 ? "active" : ""}`;
    item.innerHTML = `<span class="track-num">${i + 1}</span> ${t.title} — <em>${t.artist}</em>`;
    item.addEventListener("click", () => selectTrack(i));
    playlist.appendChild(item);
  });

  document.getElementById("playBtn").addEventListener("click", togglePlay);
  document
    .getElementById("prevBtn")
    .addEventListener("click", () =>
      selectTrack((currentTrack - 1 + tracks.length) % tracks.length),
    );
  document
    .getElementById("nextBtn")
    .addEventListener("click", () =>
      selectTrack((currentTrack + 1) % tracks.length),
    );

  // Music notes floating
  const notes = document.getElementById("floatingNotesBg");
  ["♪", "♫", "♩", "♬"].forEach((n, ni) => {
    for (let i = 0; i < 4; i++) {
      const el = document.createElement("div");
      el.className = "float-note";
      el.textContent = n;
      el.style.cssText = `left:${Math.random() * 90}%;animation-delay:${Math.random() * 10}s;animation-duration:${8 + Math.random() * 6}s;font-size:${1.5 + Math.random() * 1.5}rem`;
      notes.appendChild(el);
    }
  });

  const audio = document.getElementById("audioPlayer");

  audio.addEventListener("ended", () => {
    selectTrack((currentTrack + 1) % tracks.length);

    if (isPlaying) {
      startMelody(currentTrack);
    }
  });

  updateMusicUI();
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById("playBtn").textContent = isPlaying ? "⏸" : "▶";
  const vinyl = document.getElementById("vinylRecord");
  const eq = document.getElementById("equalizer");
  if (isPlaying) {
    vinyl.classList.add("spinning");
    eq.classList.remove("paused");
    startMelody(currentTrack);
  } else {
    vinyl.classList.remove("spinning");
    eq.classList.add("paused");
    stopMelody();
  }
}

function selectTrack(i) {
  currentTrack = i;
  document.querySelectorAll(".playlist-item").forEach((el, idx) => {
    el.classList.toggle("active", idx === i);
  });
  updateMusicUI();
  if (isPlaying) startMelody(i);
}

function updateMusicUI() {
  const t = tracks[currentTrack];

  document.getElementById("nowPlayingTitle").textContent = t.title;
  document.getElementById("nowPlayingArtist").textContent = t.artist;

  const audio = document.getElementById("audioPlayer");
  audio.src = t.src;
}

/* ─── SECTION 5: TIMELINE ─── */
const timelineData = [
  {
    year: "2023 ❤️",
    desc: "First Meeting",
    detail:
      "The universe decided two hearts should find each other. And somehow, they did. The very first moment felt like a page turning in a story that was always meant to be written.",
  },
  {
    year: "2024 📸",
    desc: "Best Memories",
    detail:
      "A year of laughter, late nights, small adventures, and moments so beautiful they deserve their own constellation. Every single one is treasured.",
  },
  {
    year: "2025 ✨",
    desc: "Today",
    detail:
      "Happy Birthday, my favourite person. Here we are, another chapter written together. May every day ahead feel as magical as you make me feel.",
  },
];

function initTimeline() {
  const path = document.getElementById("timelinePath");
  timelineData.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "timeline-item";
    div.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-year">${item.year}</div>
        <div class="timeline-desc">${item.desc}</div>
        <div class="timeline-expanded" id="tl-exp-${i}">
          <p style="font-family:'Crimson Text',serif;font-style:italic;color:var(--rose);line-height:1.7">${item.detail}</p>
        </div>
      </div>`;
    div.querySelector(".timeline-card").addEventListener("click", () => {
      const exp = document.getElementById(`tl-exp-${i}`);
      exp.classList.toggle("open");
    });
    path.appendChild(div);
  });
}

/* ─── SECTION 6: CONSTELLATION ─── */
const starMemories = [
  {
    x: 0.22,
    y: 0.32,
    label: "⭐ First Meeting",
    text: "The day our worlds collided and everything changed forever.",
  },

  {
    x: 0.48,
    y: 0.26,
    label: "⭐ First Selfie",
    text: "That silly photo that we both secretly treasured.",
  },

  {
    x: 0.75,
    y: 0.34,
    label: "⭐ Best Day",
    text: "The day when everything was perfect and time stood still.",
  },

  {
    x: 0.35,
    y: 0.55,
    label: "⭐ Favourite Moment",
    text: "The quiet moment I realized how lucky I am to have you.",
  },

  {
    x: 0.65,
    y: 0.65,
    label: "⭐ Endless Laughter",
    text: "Those moments when we laughed until our cheeks hurt.",
  },

  {
    x: 0.18,
    y: 0.72,
    label: "⭐ Warmest Memory",
    text: "Wrapped in comfort, knowing you were there.",
  },

  {
    x: 0.84,
    y: 0.58,
    label: "⭐ Our Song",
    text: "That melody that will always belong to us.",
  },
];

function initConstellation() {
  const canvas = document.getElementById("constellationCanvas");
  const ctx = canvas.getContext("2d");
  const section = document.getElementById("sec-constellation");

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  let animFrame;
  let sparkles = [];
  let hovered = -1;

  function getStarPos(s) {
    return { x: s.x * canvas.width, y: s.y * canvas.height };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Gradient sky
    const grad = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.height,
    );
    grad.addColorStop(0, "#1a0910");
    grad.addColorStop(1, "#060308");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Lines between stars
    ctx.strokeStyle = "rgba(212,180,131,0.18)";
    ctx.lineWidth = 1;
    for (let i = 0; i < starMemories.length - 1; i++) {
      const a = getStarPos(starMemories[i]);
      const b = getStarPos(starMemories[i + 1]);
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // Stars
    starMemories.forEach((s, i) => {
      const p = getStarPos(s);
      const glow = i === hovered ? 20 : 8;
      const grad2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow);
      grad2.addColorStop(0, "rgba(212,180,131,1)");
      grad2.addColorStop(1, "rgba(212,180,131,0)");
      ctx.beginPath();
      ctx.arc(p.x, p.y, glow, 0, Math.PI * 2);
      ctx.fillStyle = grad2;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
    });

    // Sparkles
    sparkles = sparkles.filter((sp) => {
      sp.life -= 0.02;
      if (sp.life <= 0) return false;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sp.r * sp.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,180,131,${sp.life})`;
      ctx.fill();
      sp.x += sp.vx;
      sp.y += sp.vy;
      return true;
    });

    animFrame = requestAnimationFrame(draw);
  }
  draw();

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    hovered = -1;
    starMemories.forEach((s, i) => {
      const p = getStarPos(s);
      if (Math.hypot(mx - p.x, my - p.y) < 20) hovered = i;
    });
    canvas.style.cursor = hovered >= 0 ? "pointer" : "default";
  });

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    starMemories.forEach((s, i) => {
      const p = getStarPos(s);
      if (Math.hypot(mx - p.x, my - p.y) < 38) {
        showStarMemory(s);
        for (let j = 0; j < 20; j++) {
          sparkles.push({
            x: p.x,
            y: p.y,
            r: 4 + Math.random() * 4,
            life: 1,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
          });
        }
      }
    });
  });
}

let starCardTimeout;
function showStarMemory(s) {
  const card = document.getElementById("starMemoryCard");
  card.innerHTML = `
    <button class="star-close" onclick="document.getElementById('starMemoryCard').classList.remove('open')">✕</button>
    <h3 style="font-family:'Dancing Script',cursive;font-size:1.4rem;color:var(--maroon);margin-bottom:10px">${s.label}</h3>
    <p style="font-family:'Crimson Text',serif;font-style:italic;color:var(--rose)">${s.text}</p>`;
  card.classList.add("open");
  clearTimeout(starCardTimeout);
  starCardTimeout = setTimeout(() => card.classList.remove("open"), 5000);
}

/* ─── SECTION 7: GIFTS ─── */
/* ─── SECTION 7: MYSTERY GIFTS ─── */

let correctGiftCount = 0;

const mysteryGifts = [
  {
    correct: true,
    icon: "🎀",
    message: "You found a box full of love, hugs, and birthday kisses ❤️",
    bouquet: "💐",
  },
  {
    correct: true,
    icon: "🧸",
    message: "A teddy carrying all my warm wishes for you 🥺",
    bouquet: "🌸",
  },
  {
    correct: true,
    icon: "💝",
    message: "Inside this gift is every beautiful memory we've made ✨",
    bouquet: "🌹",
  },

  // Wrong gifts
  {
    correct: false,
    icon: "📦",
    quote: "Common babe 😭 wrong one",
  },
  {
    correct: false,
    icon: "🎁",
    quote: "Soooo close sweetie 💕",
  },
];

function initGifts() {
  const area = document.getElementById("giftsArea");

  if (!area) return;

  area.innerHTML = "";

  const positions = [
    { left: "10%", top: "18%" },
    { left: "42%", top: "15%" },
    { left: "72%", top: "22%" },
    { left: "25%", top: "65%" },
    { left: "65%", top: "68%" },
  ];

  mysteryGifts.forEach((gift, i) => {
    const box = document.createElement("div");

    box.className = "mystery-gift";

    box.style.left = positions[i].left;
    box.style.top = positions[i].top;

    box.innerHTML = `
      <div class="gift-box-inner">
        <div class="gift-lid"></div>
        <div class="gift-body">
          <span>${gift.icon}</span>
        </div>
      </div>
    `;

    box.addEventListener("click", () => openMysteryGift(box, gift));

    area.appendChild(box);
  });
}

function openMysteryGift(el, gift) {
  if (el.classList.contains("opened")) return;

  el.classList.add("opened");

  playNote(784, 0.25, "sine", 0.2);

  if (!gift.correct) {
    const wrongToast = document.createElement("div");

    wrongToast.className = "wrong-gift-toast";

    wrongToast.textContent = gift.quote;

    document.body.appendChild(wrongToast);

    setTimeout(() => {
      wrongToast.classList.add("show");
    }, 50);

    setTimeout(() => {
      wrongToast.classList.remove("show");
      setTimeout(() => wrongToast.remove(), 500);
    }, 2400);

    return;
  }

  correctGiftCount++;

  const reveal = document.createElement("div");

  reveal.className = "gift-reveal-modal";

  reveal.innerHTML = `
    <div class="gift-reveal-card">

      <div class="gift-bouquet">
        ${gift.bouquet}
      </div>

      <h2>You Found A Mystery Gift ❤️</h2>

      <p>
        ${gift.message}
      </p>

      <div class="gift-open-box">
        🎁✨
      </div>

      <button class="gift-close-btn">
        Opened With Love 💕
      </button>

    </div>
  `;

  document.body.appendChild(reveal);

  setTimeout(() => reveal.classList.add("active"), 30);

  reveal.querySelector(".gift-close-btn").addEventListener("click", () => {
    reveal.classList.remove("active");

    setTimeout(() => reveal.remove(), 500);

    if (correctGiftCount >= 3) {
      showFinalGiftCelebration();
    }
  });
}

function showFinalGiftCelebration() {
  const finalBox = document.createElement("div");

  finalBox.className = "final-gift-box";

  finalBox.innerHTML = `
    <div class="final-gift-inner">

      <button class="final-close-btn">
        ✕
      </button>

      <div class="final-gift-icon">
        🎁💖
      </div>

      <h1>
        All Mystery Gifts Found ✨
      </h1>

      <p>
        The real gift was always YOU ❤️
      </p>

      <button class="final-gift-btn">
        Open Final Surprise
      </button>

    </div>
  `;

  document.body.appendChild(finalBox);

  setTimeout(() => {
    finalBox.classList.add("active");
  }, 50);

  // OPEN FINALE
  finalBox.querySelector(".final-gift-btn").addEventListener(
    "click",
    () => {
      playFinale();

      finalBox.remove();
    },
    { once: true },
  );

  // CLOSE BUTTON
  finalBox.querySelector(".final-close-btn").addEventListener("click", () => {
    finalBox.classList.remove("active");

    setTimeout(() => {
      finalBox.remove();
    }, 400);
  });
}

/* ─── SECTION 8: GAME ─── */

let heartScore = 0;
let gameRunning = false;
let gameInterval = null;
let spawnedCount = 0;
let gameStartedOnce = false;

const gameItems = [
  { emoji: "❤️", count: true },
  { emoji: "💖", count: true },
  { emoji: "💗", count: true },
  { emoji: "💘", count: true },
  { emoji: "💕", count: true },
  { emoji: "🧸", count: false },
  { emoji: "🎀", count: false },
  { emoji: "✨", count: false },
  { emoji: "🌷", count: false },
  { emoji: "💞", count: true },
  { emoji: "🍓", count: false },
  { emoji: "💝", count: true },
];

function initGame() {
  const startBtn = document.getElementById("startGameBtn");
  const gameArea = document.getElementById("gameArea");

  if (startBtn) {
    startBtn.addEventListener("click", startGame);
  }

  if (gameArea) {
    gameArea.addEventListener("pointerdown", (e) => {
      const target = e.target.closest(".game-heart");
      if (!target) return;
      e.preventDefault();
      catchHeart(target);
    });
  }

  document.querySelector(".reward-close")?.addEventListener("click", () => {
    document.getElementById("gameReward")?.classList.remove("active");
    document.getElementById("startGameBtn").style.display = "block";
  });
}

function startGame() {
  heartScore = 0;
  spawnedCount = 0;
  gameRunning = true;

  document.getElementById("heartScore").textContent = "0";
  document.getElementById("startGameBtn").style.display = "none";

  const area = document.getElementById("gameArea");
  area.innerHTML = "";

  clearInterval(gameInterval);

  gameInterval = setInterval(() => {
    spawnGameItem();
  }, 350);

  // optional cap so it does not run forever
  setTimeout(() => {
    if (!gameRunning) return;

    clearInterval(gameInterval);

    /* failed to reach target */
    if (heartScore < 20) {
      gameRunning = false;

      const retry = document.createElement("div");

      retry.className = "sweetie-retry-popup";

      retry.innerHTML = `
      <div class="sweetie-box">

        <div class="sweetie-emoji">🥺💖</div>

        <h2>Sweetieee...</h2>

        <p>
          You almost caught all my love hearts 💕<br>
          Wanna try once again?
        </p>

        <button id="retryLoveGame">
          Try Again ❤️
        </button>

      </div>
    `;

      document.body.appendChild(retry);

      gsap.from(".sweetie-box", {
        scale: 0.7,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      });

      document.getElementById("retryLoveGame").addEventListener("click", () => {
        retry.remove();

        startGame();
      });
    }
  }, 25000);
}

/* ─── SPAWN MANY FALLING HEARTS ─── */

function spawnGameItem() {
  if (!gameRunning) return;

  const area = document.getElementById("gameArea");

  if (!area) return;

  /* spawn 3–5 emojis together */
  const batchCount = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < batchCount; i++) {
    const picked = gameItems[Math.floor(Math.random() * gameItems.length)];

    const item = document.createElement("div");

    item.className = "game-heart";

    item.textContent = picked.emoji;

    item.dataset.count = picked.count ? "1" : "0";

    /* wider spread */
    const left = Math.random() * 92;

    const fallDistance = area.clientHeight + 140;

    item.style.left = `${left}%`;

    item.style.top = `${-40 - Math.random() * 120}px`;

    item.style.setProperty("--fall", `${fallDistance}px`);

    /* BIGGER */
    item.style.fontSize = `${2.2 + Math.random() * 1.4}rem`;

    /* SLOWER */
    item.style.animationDuration = `${4.5 + Math.random() * 2.5}s`;

    /* random rotate */
    item.style.transform = `rotate(${(Math.random() - 0.5) * 40}deg)`;

    /* easy clicking */
    item.style.padding = "12px";

    item.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();

      catchHeart(item);
    });

    area.appendChild(item);

    setTimeout(() => {
      if (item.isConnected) {
        item.remove();
      }
    }, 8000);
  }
}

function catchHeart(el) {
  if (!el || el.classList.contains("caught")) return;

  el.classList.add("caught");
  el.style.pointerEvents = "none";

  const isCountable = el.dataset.count === "1";

  if (isCountable) {
    heartScore++;
    document.getElementById("heartScore").textContent = heartScore;
    playNote(784, 0.2, "sine", 0.2);

    if (heartScore >= 20) {
      gameRunning = false;
      clearInterval(gameInterval);

      setTimeout(() => {
        document.getElementById("gameReward").classList.add("active");
        document.querySelector(".reward-close")?.addEventListener(
          "click",
          () => {
            document.getElementById("gameReward").classList.remove("active");
            document.getElementById("startGameBtn").style.display = "block";
            document.getElementById("heartScore").textContent = "0";
          },
          { once: true },
        );
      }, 500);
    }
  } else {
    playNote(523, 0.12, "sine", 0.12);
  }
}

/* close reward by clicking outside button text if needed */
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("reward-close")) {
    document.getElementById("gameReward")?.classList.remove("active");
    document.getElementById("startGameBtn").style.display = "block";
    gameRunning = false;
    clearInterval(gameInterval);
  }
});

/* ─── SECTION 9: CINEMA ─── */
let currentSlide = 0;
let cinemaInterval;

function initCinema() {
  const slides = document.querySelectorAll(".cinema-slide");

  if (!slides.length) return;

  const dotsContainer = document.getElementById("cinemaDots");

  if (!dotsContainer) return;

  dotsContainer.innerHTML = "";

  slides.forEach((s, i) => {
    const dot = document.createElement("button");

    dot.className = `cinema-dot ${i === 0 ? "active" : ""}`;

    dot.addEventListener("click", () => gotoSlide(i));

    dotsContainer.appendChild(dot);
  });

  updateCinemaCaption();

  cinemaInterval = setInterval(() => {
    gotoSlide((currentSlide + 1) % slides.length);
  }, 5000);
}

function gotoSlide(i) {
  const slides = document.querySelectorAll(".cinema-slide");

  slides.forEach((slide) => {
    const video = slide.querySelector("video");

    if (video) {
      video.pause();
    }
  });

  slides[currentSlide].classList.remove("active");

  currentSlide = i;

  slides[currentSlide].classList.add("active");

  const activeVideo = slides[currentSlide].querySelector("video");

  if (activeVideo) {
    activeVideo.currentTime = 0;

    activeVideo.play().catch((err) => {
      console.log("Video autoplay blocked:", err);
    });
  }
  updateCinemaCaption();
}

function updateCinemaCaption() {
  const slides = document.querySelectorAll(".cinema-slide");
  const cap = slides[currentSlide].dataset.caption;
  const captionBox = document.getElementById("cinemaCaptionBox");
  gsap.to(captionBox, {
    opacity: 0,
    duration: 0.4,
    onComplete: () => {
      captionBox.textContent = cap;
      gsap.to(captionBox, { opacity: 1, duration: 0.6 });
    },
  });
}

/* ─── SECTION 10: CAKE ─── */
let candlesLit = [];
const CANDLE_COUNT = 5;

function initCake() {
  const canvas = document.getElementById("cakeCanvas");
  canvas.width = Math.min(500, window.innerWidth - 40);
  canvas.height = canvas.width * 0.9;
  candlesLit = Array(CANDLE_COUNT).fill(true);
  drawCake();

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
    const my = (e.clientY - rect.top) * (canvas.height / rect.height);
    const W = canvas.width;
    const H = canvas.height;
    const cakeTop = H * 0.32;
    const totalWidth = W * 0.48;
    const candleSpacing = totalWidth / (CANDLE_COUNT - 1);
    const startX = (W - totalWidth) / 2;
    for (let i = 0; i < CANDLE_COUNT; i++) {
      const cx = startX + i * candleSpacing;
      const cy = cakeTop - 30;
      if (
        Math.abs(mx - cx) < 28 &&
        Math.abs(my - (cy - 50)) < 45 &&
        candlesLit[i]
      ) {
        blowOutCandle(i);
      }
    }
  });

  // Mic support
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const micCtx = new AudioCtx();
        const src = micCtx.createMediaStreamSource(stream);
        const analyser = micCtx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
        setInterval(() => {
          analyser.getByteTimeDomainData(data);
          const max = Math.max(...data);
          if (max > 175 && candlesLit.some(Boolean)) {
            const litIdx = candlesLit.findIndex(Boolean);
            if (litIdx !== -1) blowOutCandle(litIdx);
          }
        }, 300);
      })
      .catch(() => {});
  }

  let cakeAnim;
  let flickerT = 0;
  function animCake() {
    flickerT += 0.08;
    drawCake(flickerT);
    cakeAnim = requestAnimationFrame(animCake);
  }
  animCake();
}

function blowOutCandle(i) {
  candlesLit[i] = false;
  playNote(523, 0.2, "sine", 0.15);
  if (!candlesLit.some(Boolean)) {
    setTimeout(() => {
      document.getElementById("wishReveal").style.display = "block";
      launchFireworks();
    }, 600);
  }
}

function drawCake(t = 0) {
  const canvas = document.getElementById("cakeCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width,
    H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  // Plate
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(W / 2, H * 0.82, W * 0.38, H * 0.04, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(212,180,131,0.3)";
  ctx.fill();
  ctx.restore();

  // Bottom tier
  ctx.save();
  const btGrad = ctx.createLinearGradient(W * 0.15, 0, W * 0.85, 0);
  btGrad.addColorStop(0, "#8D3A46");
  btGrad.addColorStop(0.5, "#6D2B35");
  btGrad.addColorStop(1, "#8D3A46");
  ctx.fillStyle = btGrad;
  ctx.beginPath();
  ctx.roundRect(W * 0.15, H * 0.52, W * 0.7, H * 0.3, [8]);
  ctx.fill();
  // Bottom frosting
  ctx.fillStyle = "#F5EFE6";
  for (let x = W * 0.15; x < W * 0.85; x += 22) {
    ctx.beginPath();
    ctx.arc(x + 11, H * 0.52, 11, Math.PI, 0);
    ctx.fill();
  }
  ctx.restore();

  // Top tier
  ctx.save();
  const ttGrad = ctx.createLinearGradient(W * 0.25, 0, W * 0.75, 0);
  ttGrad.addColorStop(0, "#7a3040");
  ttGrad.addColorStop(0.5, "#6D2B35");
  ttGrad.addColorStop(1, "#7a3040");
  ctx.fillStyle = ttGrad;
  ctx.beginPath();
  ctx.roundRect(W * 0.25, H * 0.32, W * 0.5, H * 0.22, [8]);
  ctx.fill();
  // Top frosting
  ctx.fillStyle = "#F5EFE6";
  for (let x = W * 0.25; x < W * 0.75; x += 18) {
    ctx.beginPath();
    ctx.arc(x + 9, H * 0.32, 9, Math.PI, 0);
    ctx.fill();
  }
  ctx.restore();

  // Decorative dots
  const dots = [
    { x: 0.35, y: 0.62 },
    { x: 0.5, y: 0.65 },
    { x: 0.65, y: 0.62 },
    { x: 0.42, y: 0.72 },
    { x: 0.58, y: 0.72 },
  ];
  dots.forEach((d) => {
    ctx.beginPath();
    ctx.arc(W * d.x, H * d.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#D4B483";
    ctx.fill();
  });

  /// CANDLES
  const cakeTop = H * 0.32;

  /* Better centered candle layout */
  const totalWidth = W * 0.48;
  const candleSpacing = totalWidth / (CANDLE_COUNT - 1);
  const startX = (W - totalWidth) / 2;

  for (let i = 0; i < CANDLE_COUNT; i++) {
    const cx = startX + i * candleSpacing;
    const cy = cakeTop;

    /* Candle Body */
    ctx.save();

    const cGrad = ctx.createLinearGradient(cx - 6, cy - 42, cx + 6, cy - 42);

    const cColors = ["#D4B483", "#6D2B35", "#ECE3D6", "#8D3A46", "#D4B483"];

    cGrad.addColorStop(0, "#ffffff");
    cGrad.addColorStop(1, cColors[i]);

    ctx.fillStyle = cGrad;

    ctx.beginPath();
    ctx.roundRect(cx - 6, cy - 42, 12, 42, [5]);

    ctx.fill();
    ctx.restore();

    /* Decorative stripes */
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1;

    for (let s = 0; s < 4; s++) {
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 35 + s * 8);
      ctx.lineTo(cx + 5, cy - 39 + s * 8);
      ctx.stroke();
    }

    /* Wick */
    ctx.beginPath();
    ctx.moveTo(cx, cy - 42);
    ctx.lineTo(cx, cy - 50);

    ctx.strokeStyle = "#2A1A1A";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* Flame */
    if (candlesLit[i]) {
      const flick = Math.sin(t * 8 + i) * 1.5;

      const flameY = cy - 60 + flick;

      /* Glow */
      const flameGlow = ctx.createRadialGradient(cx, flameY, 2, cx, flameY, 18);

      flameGlow.addColorStop(0, "rgba(255,255,255,1)");
      flameGlow.addColorStop(0.3, "rgba(255,220,120,0.95)");
      flameGlow.addColorStop(0.7, "rgba(255,160,50,0.5)");
      flameGlow.addColorStop(1, "rgba(255,120,0,0)");

      ctx.fillStyle = flameGlow;

      ctx.beginPath();
      ctx.arc(cx, flameY, 16, 0, Math.PI * 2);
      ctx.fill();

      /* Main flame */
      ctx.beginPath();

      ctx.moveTo(cx, flameY - 12);

      ctx.quadraticCurveTo(cx - 8, flameY, cx, flameY + 12);

      ctx.quadraticCurveTo(cx + 8, flameY, cx, flameY - 12);

      const flameGradient = ctx.createLinearGradient(
        cx,
        flameY - 12,
        cx,
        flameY + 12,
      );

      flameGradient.addColorStop(0, "#fff8dc");
      flameGradient.addColorStop(0.4, "#ffd36b");
      flameGradient.addColorStop(1, "#ff8c42");

      ctx.fillStyle = flameGradient;
      ctx.fill();
    }
  }

  /// SHOW TEXT ONLY AFTER ALL CANDLES ARE BLOWN
  if (!candlesLit.some(Boolean)) {
    ctx.save();

    /* Pinterest luxury glow */
    ctx.shadowColor = "rgba(255,220,180,0.9)";
    ctx.shadowBlur = 25;

    /* Main text */
    ctx.fillStyle = "rgba(133, 14, 14, 0.85)";

    ctx.textAlign = "center";

    ctx.font = `bold ${W * 0.085}px "Dancing Script", cursive`;

    ctx.fillText("Happy Birthday ❤️", W / 2, H * 0.18);

    ctx.restore();
  }
}

function lightenCss(color) {
  return color;
}

/* ─── FIREWORKS ─── */
function launchFireworks() {
  const canvas = document.createElement("canvas");
  canvas.id = "fireworksCanvas";

  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";

  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  function createExplosion(x, y) {
    const colors = ["#D4B483", "#6D2B35", "#FFFFFF", "#F5EFE6", "#8D3A46"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      });
    }
  }

  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createExplosion(
        Math.random() * canvas.width,
        Math.random() * canvas.height * 0.6,
      );
    }, i * 600);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, index) => {
      p.x += p.vx;
      p.y += p.vy;

      p.vy += 0.03;
      p.life -= 0.01;

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  animate();
}

/* ─── ENDING SECTION ─── */
function initEnding() {
  const endingBtn = document.getElementById("finalWishBtn");

  if (!endingBtn) return;

  endingBtn.addEventListener("click", () => {
    playFinale();

    gsap.to(window, {
      duration: 2,
      scrollTo: document.body.scrollHeight,
    });
  });
}

function playFinale() {
  // REMOVE OLD OVERLAY IF EXISTS
  const old = document.querySelector(".birthday-finale");

  if (old) old.remove();

  const overlay = document.createElement("div");

  overlay.className = "birthday-finale";

  overlay.innerHTML = `

    <button class="finale-close">
      ✕
    </button>

    <div class="finale-content">

      <h1>
        Happy Birthday ❤️
      </h1>

      <p>
        Thank you for existing.<br>
        Thank you for every smile,<br>
        every laugh,<br>
        every beautiful memory.<br><br>

        You truly make this world brighter ✨
      </p>

    </div>

  `;

  document.body.appendChild(overlay);

  // SHOW
  setTimeout(() => {
    overlay.classList.add("show");
  }, 50);

  // FIREWORKS
  launchFireworks();

  // CLOSE
  overlay.querySelector(".finale-close").addEventListener("click", () => {
    overlay.classList.remove("show");

    setTimeout(() => {
      overlay.remove();
    }, 500);
  });
}

function unlockFuturePlans() {
  const name = document.getElementById("nameInput").value.trim().toLowerCase();
  const msg = document.getElementById("unlockMsg");

  if (name === "x") {
    document.getElementById("lastSurprise").classList.add("hidden");
    document.getElementById("futurePlans").classList.remove("hidden");
  } else {
    msg.innerText = "Hmm... that is not her name yet 💭";
  }
}

function openPlan(num) {
  const title = document.getElementById("planTitle");
  const text = document.getElementById("planText");
  const popup = document.getElementById("planPopup");

  const plans = {
    1: {
      title: "Cute Dates",
      text: "Late-night walks, café dates, silly photos, and endless laughter together.",
    },
    2: {
      title: "Dream Trip",
      text: "A beautiful trip where we collect memories, sunsets, and tiny adventures.",
    },
    3: {
      title: "Forever Support",
      text: "Being each other's safe place, biggest cheerleader, and happy home.",
    },
  };

  title.innerText = plans[num].title;
  text.innerText = plans[num].text;
  popup.classList.remove("hidden");
}

function closePlan() {
  document.getElementById("planPopup").classList.add("hidden");
}

/* ─── GSAP SCROLL ANIMATIONS ─── */
function initScrollAnimations() {
  gsap.utils.toArray("section").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 80,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
      },
    });
  });
}

/* ─── MODAL CLOSE OUTSIDE CLICK ─── */
window.addEventListener("click", (e) => {
  const photoModal = document.getElementById("photoModal");
  const letterModal = document.getElementById("letterModal");

  if (e.target === photoModal) {
    photoModal.classList.remove("open");
  }

  if (e.target === letterModal) {
    letterModal.classList.remove("open");
  }
});

/* ─── RESIZE FIXES ─── */
window.addEventListener("resize", () => {
  const bgCanvas = document.getElementById("bgCanvas");

  if (bgCanvas) {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
});

/* ─── CUSTOM CURSOR PARTICLES ─── */
document.addEventListener("mousemove", (e) => {
  if (Math.random() > 0.92) {
    const p = document.createElement("div");

    p.style.position = "fixed";
    p.style.left = `${e.clientX}px`;
    p.style.top = `${e.clientY}px`;

    p.style.width = "6px";
    p.style.height = "6px";

    p.style.borderRadius = "50%";

    p.style.background = "#D4B483";

    p.style.pointerEvents = "none";

    p.style.zIndex = "9999";

    p.style.opacity = "0.8";

    p.style.transition = "all 1s ease";

    document.body.appendChild(p);

    requestAnimationFrame(() => {
      p.style.transform = `translate(${(Math.random() - 0.5) * 80}px,
                   ${(Math.random() - 0.5) * 80}px) scale(0)`;

      p.style.opacity = "0";
    });

    setTimeout(() => p.remove(), 1000);
  }
});

/* ─── AUTO GSAP INIT ─── */
window.addEventListener("load", () => {
  if (typeof gsap !== "undefined") {
    if (typeof ScrollTrigger !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof ScrollToPlugin !== "undefined") {
      gsap.registerPlugin(ScrollToPlugin);
    }

    initScrollAnimations();
  }
});

/* ─── START ─── */
document.addEventListener("DOMContentLoaded", () => {
  initLockScreen();
});
