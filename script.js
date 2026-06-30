const parallaxItems = Array.from(document.querySelectorAll("[data-parallax]"));
const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const loveButtons = Array.from(document.querySelectorAll(".love-button"));
const response = document.getElementById("response");
const conclusion = document.getElementById("conclusion");
const finale = document.getElementById("finale");
const heartLayer = conclusion?.querySelector(".conclusion-hearts");
const giftModal = document.getElementById("giftModal");
const modalClosers = Array.from(document.querySelectorAll("[data-close]"));
const heroBouquets = Array.from(document.querySelectorAll(".hero-bouquet"));
const siteParticleLayer = document.getElementById("siteParticleLayer");
const sectionFxItems = Array.from(document.querySelectorAll(".panel-scrollfx"));

let currentScroll = 0;
let targetScroll = 0;
const heroIntroSection = document.getElementById("intro");

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function applyResponsiveViewportUnits() {
  const viewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
  const safeVh = Math.max(1, viewportHeight * 0.01);
  document.documentElement.style.setProperty("--safe-vh", `${safeVh}px`);
}

function initValentineIntro() {
  const intro = document.getElementById("valentineIntro");
  const giftBtn = document.getElementById("valentineGiftBtn");
  const count = document.getElementById("valentineGiftCount");
  const hint = document.getElementById("valentineSubhint");
  const sparkleLayer = document.getElementById("valentineSparkleLayer");
  const introCard = intro?.querySelector(".valentine-intro-card");
  const url = new URL(window.location.href);
  const skipIntro = url.searchParams.get("skip_intro") === "1";
  if (skipIntro && intro) {
    intro.remove();
    document.body.classList.remove("intro-active");
    document.body.classList.add("landing-reveal");
    return;
  }
  if (!intro || !giftBtn || !count || !hint || !sparkleLayer) {
    document.body.classList.add("landing-reveal");
    return;
  }

  const maxClicks = 3;
  let clicks = 0;
  let isOpening = false;
  const cuteHints = [
    "Aww, it felt that. Two more clicks.",
    "It is glowing now. One more click to open."
  ];
  const heartColors = ["#ffd3e4", "#ffc1d8", "#fff0f5", "#ffe4ee", "#ffecf4"];

  document.body.classList.add("intro-active");
  let ambientInterval = null;

  function triggerCardFlash() {
    if (!introCard) return;
    introCard.classList.remove("flash");
    void introCard.offsetWidth;
    introCard.classList.add("flash");
  }

  function nudgeIntro() {
    intro.classList.remove("nudge");
    void intro.offsetWidth;
    intro.classList.add("nudge");
  }

  function spawnHeartBurst(strength = 1) {
    const heartBurstCount = 6 + strength * 5;
    const glintBurstCount = 2 + strength * 4;
    const spreadX = 120 + strength * 70;
    const liftY = 80 + strength * 45;

    for (let i = 0; i < heartBurstCount; i += 1) {
      const piece = document.createElement("span");
      piece.className = "valentine-heart-burst";
      const x = (Math.random() - 0.5) * spreadX;
      const y = -(30 + Math.random() * liftY);
      const rotation = `${-35 + Math.random() * 70}deg`;
      const duration = 760 + Math.random() * (210 + strength * 110);
      piece.style.setProperty("--x", `${x}px`);
      piece.style.setProperty("--y", `${y}px`);
      piece.style.setProperty("--rot", rotation);
      piece.style.setProperty("--burst-duration", `${duration}ms`);
      piece.style.setProperty(
        "--heart-color",
        heartColors[Math.floor(Math.random() * heartColors.length)]
      );
      sparkleLayer.appendChild(piece);

      setTimeout(() => {
        piece.remove();
      }, duration + 90);
    }

    for (let i = 0; i < glintBurstCount; i += 1) {
      const glint = document.createElement("span");
      const x = (Math.random() - 0.5) * (spreadX + 80);
      const y = -(20 + Math.random() * (liftY + 35));
      const duration = 700 + Math.random() * (240 + strength * 90);
      const size = 6 + Math.random() * (4 + strength * 1.5);
      glint.className = "valentine-glint-burst";
      glint.style.setProperty("--x", `${x}px`);
      glint.style.setProperty("--y", `${y}px`);
      glint.style.setProperty("--size", `${size}px`);
      glint.style.setProperty("--burst-duration", `${duration}ms`);
      sparkleLayer.appendChild(glint);

      setTimeout(() => {
        glint.remove();
      }, duration + 90);
    }
  }

  function spawnIntroMote() {
    const mote = document.createElement("span");
    const size = 6 + Math.random() * 12;
    const x = (Math.random() - 0.5) * 460;
    const startY = 18 + Math.random() * 80;
    const riseY = -(170 + Math.random() * 240);
    const dur = 2600 + Math.random() * 2600;
    mote.className = "valentine-intro-mote";
    mote.style.setProperty("--size", `${size}px`);
    mote.style.setProperty("--x", `${x}px`);
    mote.style.setProperty("--y", `${startY}px`);
    mote.style.setProperty("--dur", `${dur}ms`);
    mote.style.setProperty("--rise-end", `${riseY}px`);
    sparkleLayer.appendChild(mote);
    setTimeout(() => mote.remove(), dur + 140);
  }

  function startAmbientMotes() {
    for (let i = 0; i < 12; i += 1) {
      setTimeout(spawnIntroMote, i * 120);
    }
    ambientInterval = setInterval(spawnIntroMote, 180);
  }

  function stopAmbientMotes() {
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
  }

  function onIntroMouseMove(event) {
    if (isOpening) return;
    const rect = intro.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (event.clientY - rect.top) / rect.height - 0.5;
    const tiltX = xRatio * 5.5;
    const lift = Math.max(-12, -3 - Math.abs(yRatio * 14));
    giftBtn.style.setProperty("--gift-tilt", `${tiltX}deg`);
    giftBtn.style.setProperty("--gift-lift", `${lift}px`);
  }

  function onIntroMouseLeave() {
    if (isOpening) return;
    giftBtn.style.removeProperty("--gift-tilt");
    giftBtn.style.removeProperty("--gift-lift");
  }

  intro.addEventListener("mousemove", onIntroMouseMove);
  intro.addEventListener("mouseleave", onIntroMouseLeave);
  startAmbientMotes();
  setTimeout(() => {
    spawnHeartBurst(2);
  }, 900);

  function clearReactionClasses() {
    giftBtn.classList.remove(
      "bump",
      "bump-1",
      "bump-2",
      "bump-3",
      "react-1",
      "react-2",
      "react-3"
    );
  }

  function playGiftBump(level = 1) {
    clearReactionClasses();
    const clamped = Math.max(1, Math.min(3, level));
    giftBtn.classList.add(`react-${clamped}`);
    void giftBtn.offsetWidth;
    giftBtn.classList.add(`bump-${clamped}`);
  }

  function setGiftCharge(level = 1) {
    if (level >= 2) {
      giftBtn.classList.add("charged");
      triggerCardFlash();
    }
    if (level >= 3) {
      nudgeIntro();
    }
  }

  function openGift() {
    isOpening = true;
    stopAmbientMotes();
    hint.textContent = "Opening your Valentine surprise...";
    giftBtn.classList.add("opening", "charged", "react-3");
    intro.classList.add("opening");
    spawnHeartBurst(4);
    setTimeout(() => {
      spawnHeartBurst(3);
    }, 180);
    setTimeout(() => {
      intro.classList.add("hidden");
      document.body.classList.remove("intro-active");
      document.body.classList.add("landing-reveal");
      setTimeout(() => {
        intro.removeEventListener("mousemove", onIntroMouseMove);
        intro.removeEventListener("mouseleave", onIntroMouseLeave);
        intro.remove();
      }, 760);
    }, 980);
  }

  giftBtn.addEventListener("click", () => {
    if (isOpening) return;

    clicks += 1;
    const level = Math.min(clicks, maxClicks);
    spawnHeartBurst(level);
    playGiftBump(level);
    setGiftCharge(level);
    count.textContent = `${level} / ${maxClicks}`;

    if (clicks >= maxClicks) {
      openGift();
      return;
    }

    hint.textContent = cuteHints[level - 1] || cuteHints[cuteHints.length - 1];
  });
}

function initSiteParticles() {
  if (!siteParticleLayer) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const particleKinds = ["heart", "spark", "petal"];
  const heartPalette = ["rgba(255, 203, 226, 0.86)", "rgba(255, 185, 215, 0.84)", "rgba(255, 224, 239, 0.88)"];
  let timer = null;

  function spawnSiteParticle() {
    if (document.hidden) return;
    if (siteParticleLayer.childElementCount > 52) return;

    const kind = particleKinds[Math.floor(Math.random() * particleKinds.length)];
    const particle = document.createElement("span");
    const size = kind === "spark" ? 7 + Math.random() * 10 : 10 + Math.random() * 16;
    const duration = 9000 + Math.random() * 6500;
    const x = Math.random() * 100;
    const driftX = -70 + Math.random() * 140;
    const rotStart = -45 + Math.random() * 90;
    const rotEnd = rotStart + (-80 + Math.random() * 160);

    particle.className = `site-particle ${kind}`;
    particle.style.setProperty("--size", `${size}px`);
    particle.style.setProperty("--dur", `${duration}ms`);
    particle.style.setProperty("--x", `${x}vw`);
    particle.style.setProperty("--drift-x", `${driftX}px`);
    particle.style.setProperty("--rot-start", `${rotStart}deg`);
    particle.style.setProperty("--rot-end", `${rotEnd}deg`);
    particle.style.setProperty("--particle-opacity", `${0.28 + Math.random() * 0.4}`);
    particle.style.setProperty("--scale-start", `${0.68 + Math.random() * 0.34}`);
    particle.style.setProperty("--scale-end", `${0.95 + Math.random() * 0.35}`);
    if (kind === "heart") {
      particle.style.setProperty(
        "--particle-heart",
        heartPalette[Math.floor(Math.random() * heartPalette.length)]
      );
    }
    siteParticleLayer.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, duration + 120);
  }

  for (let i = 0; i < 18; i += 1) {
    setTimeout(spawnSiteParticle, i * 130);
  }

  timer = setInterval(() => {
    spawnSiteParticle();
    if (Math.random() > 0.58) {
      spawnSiteParticle();
    }
  }, 360);

  window.addEventListener("beforeunload", () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  });
}

function updateParallax() {
  targetScroll = window.scrollY;
  currentScroll = lerp(currentScroll, targetScroll, 0.08);

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax) || 0.2;
    const offset = currentScroll * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });

  if (heroIntroSection) {
    const rect = heroIntroSection.getBoundingClientRect();
    const viewportH = window.innerHeight || 1;
    const rawProgress = Math.min(Math.max((0 - rect.top) / (viewportH * 0.95), 0), 1);
    const eased = rawProgress * rawProgress * (3 - 2 * rawProgress);
    const sideShift = 72 * eased;
    const yShift = 26 * eased;
    const scaleDrop = 0.14 * eased;

    document.documentElement.style.setProperty("--bouquet-left-shift", `${-sideShift}px`);
    document.documentElement.style.setProperty("--bouquet-right-shift", `${sideShift}px`);
    document.documentElement.style.setProperty("--bouquet-y-shift", `${yShift}px`);
    document.documentElement.style.setProperty("--bouquet-scale-drop", `${scaleDrop}`);
  }

  if (conclusion) {
    const viewportH = window.innerHeight || 1;
    const conclusionRect = conclusion.getBoundingClientRect();
    const finaleRect = finale ? finale.getBoundingClientRect() : null;

    const fadeStart = viewportH * 0.86;
    const fadeDistance = viewportH * 0.92;
    let progress = (fadeStart - conclusionRect.top) / fadeDistance;

    if (finaleRect) {
      const finaleLock = (viewportH * 0.9 - finaleRect.top) / (viewportH * 0.9);
      progress = Math.max(progress, finaleLock * 0.9);
    }

    const clampedProgress = Math.min(Math.max(progress, 0), 1);
    const easedProgress = clampedProgress * clampedProgress * (3 - 2 * clampedProgress);
    document.documentElement.style.setProperty("--alwaysyou-opacity", easedProgress.toFixed(4));
  }

  requestAnimationFrame(updateParallax);
}

const revealThreshold = window.innerWidth <= 760 ? 0.14 : 0.22;
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: revealThreshold, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => observer.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-active");
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
);

sectionFxItems.forEach((section) => sectionObserver.observe(section));
initValentineIntro();
initSiteParticles();
applyResponsiveViewportUnits();
updateParallax();
window.addEventListener("resize", applyResponsiveViewportUnits);
window.addEventListener("orientationchange", applyResponsiveViewportUnits);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", applyResponsiveViewportUnits);
}

let heartsActive = false;
function spawnHeart() {
  if (!heartLayer) return;
  if (heartLayer.childElementCount > 18) return;
  const heart = document.createElement("span");
  const sprites = ["love.png", "heart.png"];
  const sprite = sprites[Math.floor(Math.random() * sprites.length)];
  heart.className = "conclusion-heart";
  const size = 14 + Math.random() * 16;
  const startRot = -18 + Math.random() * 36;
  const endRot = startRot + (-28 + Math.random() * 56);
  const sideRoll = Math.random();
  const left =
    sideRoll < 0.5
      ? 8 + Math.random() * 26
      : 66 + Math.random() * 26;
  heart.style.width = `${size}px`;
  heart.style.height = `${size}px`;
  heart.style.left = `${left}%`;
  heart.style.bottom = `-20px`;
  heart.style.opacity = `${0.24 + Math.random() * 0.4}`;
  heart.style.animationDuration = `${6.2 + Math.random() * 3.4}s`;
  heart.style.setProperty("--heart-sprite", `url("${sprite}")`);
  heart.style.setProperty("--rot-start", `${startRot}deg`);
  heart.style.setProperty("--rot-end", `${endRot}deg`);
  heartLayer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7000);
}

const conclusionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (heartsActive) return;
        heartsActive = true;
        const burst = setInterval(() => {
          for (let i = 0; i < 2; i += 1) {
            spawnHeart();
          }
        }, 1100);
        setTimeout(() => {
          clearInterval(burst);
          heartsActive = false;
        }, 14000);
      }
    });
  },
  { threshold: 0.4 }
);

if (conclusion) {
  conclusionObserver.observe(conclusion);
}

function triggerBouquetShake(bouquet) {
  if (!bouquet) return;
  bouquet.classList.remove("shake-cute");
  void bouquet.offsetWidth;
  bouquet.classList.add("shake-cute");
}

heroBouquets.forEach((bouquet) => {
  bouquet.setAttribute("draggable", "false");
  bouquet.style.touchAction = "manipulation";
  bouquet.addEventListener("pointerdown", () => {
    triggerBouquetShake(bouquet);
  });
  bouquet.addEventListener("click", () => {
    triggerBouquetShake(bouquet);
  });
  bouquet.addEventListener("touchstart", () => {
    triggerBouquetShake(bouquet);
  }, { passive: true });
});

const messages = [
  "You just made my day even brighter.",
  "Okay, you’re getting extra kisses later.",
  "I love you more than I can say.",
  "You are my favorite forever.",
];

let messageIndex = 0;

function spawnSparkle(target) {
  const sparkle = document.createElement("span");
  sparkle.className = "sparkle";
  const rect = target.getBoundingClientRect();
  const size = 10 + Math.random() * 14;
  sparkle.style.width = `${size}px`;
  sparkle.style.height = `${size}px`;
  sparkle.style.left = `${rect.left + rect.width / 2 + (Math.random() * 60 - 30)}px`;
  sparkle.style.top = `${rect.top + rect.height / 2 + (Math.random() * 30 - 15)}px`;
  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, 1200);
}

loveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    response.textContent = messages[messageIndex % messages.length];
    messageIndex += 1;
    for (let i = 0; i < 6; i += 1) {
      spawnSparkle(button);
    }
    if (giftModal) {
      giftModal.classList.add("is-open");
      giftModal.setAttribute("aria-hidden", "false");
    }
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    if (!giftModal) return;
    giftModal.classList.remove("is-open");
    giftModal.setAttribute("aria-hidden", "true");
  });
});
