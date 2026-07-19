const GAME_ORDER = ["someones-y", "scrapbook", "footfalls", "bad-eggs"];

if (typeof document !== "undefined") document.documentElement.classList.add("js");

const GAMES = {
  "someones-y": {
    title: "Someone’s Y",
    players: [4, 6],
    time: 15,
    mood: "deduction",
    moodLabel: "deduction and wordplay",
    image: "https://images.backerkit.com/active_storage/backerkit_production/blob/id5b69fiweh0fnhavxsjv7qcn6yn?auto=compress%2Cformat&cs=srgb&fit=max&ixlib=rails-4.3.1&q=80&w=748",
    target: "someones-y"
  },
  scrapbook: {
    title: "Scrapbook",
    players: [2, 6],
    time: 20,
    mood: "creative",
    moodLabel: "cooperative clue-making",
    image: "https://images.backerkit.com/active_storage/backerkit_production/blob/0hmrv8hqpis97xd0fto8sbz0r8vt?auto=compress%2Cformat&cs=srgb&fit=max&ixlib=rails-4.3.1&q=80&w=748",
    target: "scrapbook"
  },
  footfalls: {
    title: "Footfalls",
    players: [2, 4],
    time: 20,
    mood: "strategy",
    moodLabel: "strategy and racing",
    image: "https://images.backerkit.com/active_storage/backerkit_production/blob/5dl6cul4hmwrt8um6wenp21pz6wr?auto=compress%2Cformat&cs=srgb&fit=max&ixlib=rails-4.3.1&q=80&w=748",
    target: "footfalls"
  },
  "bad-eggs": {
    title: "Bad Eggs",
    players: [2, 6],
    time: 25,
    mood: "luck",
    moodLabel: "push-your-luck play",
    image: "https://images.backerkit.com/active_storage/backerkit_production/blob/wvh96o92jah84fy9n9d160k1x11l?auto=compress%2Cformat&cs=srgb&fit=max&ixlib=rails-4.3.1&q=80&w=748",
    target: "bad-eggs"
  }
};

function pickGame(players, time, mood) {
  const eligible = GAME_ORDER
    .map((id) => ({ id, ...GAMES[id] }))
    .filter((game) => players >= game.players[0] && players <= game.players[1] && game.time <= time);

  if (!eligible.length) return null;

  const moodMatch = eligible.find((game) => game.mood === mood);
  if (moodMatch) return moodMatch;

  return eligible.reduce((best, game) => (game.time < best.time ? game : best));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function initializeMotion() {
  const targets = document.querySelectorAll([
    ".section-heading",
    ".lineup__image",
    ".game-tabs",
    ".chooser__intro",
    ".chooser__form",
    ".game-panel__image",
    ".game-panel__copy",
    ".play-anywhere__copy",
    ".play-anywhere__image",
    ".story__image",
    ".story__copy",
    ".unboxing__copy",
    ".unboxing__image",
    ".campaign-status__copy",
    ".kickstarter-card",
    ".faq__list",
    ".final-cta__copy"
  ].join(","));

  targets.forEach((target, index) => {
    target.classList.add("reveal");
    target.classList.add(index % 2 === 0 ? "reveal--left" : "reveal--right");
  });

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7%" });

  targets.forEach((target) => observer.observe(target));
}

function initializeAccordions() {
  document.querySelectorAll("[data-rules]").forEach((accordion) => {
    const button = accordion.querySelector(".rules-toggle");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = accordion.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}

function initializeCountdown() {
  const countdown = document.querySelector(".campaign-countdown[data-deadline]");
  if (!countdown) return;

  const deadline = new Date(countdown.dataset.deadline).getTime();
  const days = countdown.querySelector("[data-days]");
  const hours = countdown.querySelector("[data-hours]");
  const label = countdown.querySelector("[data-countdown-label]");

  function updateCountdown() {
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      days.textContent = "0";
      hours.textContent = "0";
      label.textContent = "the campaign has ended";
      return;
    }

    const totalHours = Math.floor(remaining / 3600000);
    days.textContent = String(Math.floor(totalHours / 24));
    hours.textContent = String(totalHours % 24);
    label.textContent = "left to join the campaign";
  }

  updateCountdown();
  window.setInterval(updateCountdown, 60000);
}

function initializeScrollProgress() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  let scheduled = false;

  function updateProgress() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    header.style.setProperty("--scroll-progress", `${progress}%`);
    scheduled = false;
  }

  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  updateProgress();
}

function initializeTilt() {
  if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  document.querySelectorAll([
    ".hero__visual",
    ".lineup__image",
    ".game-panel__image",
    ".play-anywhere__image",
    ".story__image",
    ".unboxing__image"
  ].join(",")).forEach((target) => {
    target.classList.add("motion-tilt");

    target.addEventListener("pointermove", (event) => {
      const bounds = target.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      target.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
      target.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    });

    target.addEventListener("pointerleave", () => {
      target.style.setProperty("--tilt-x", "0deg");
      target.style.setProperty("--tilt-y", "0deg");
    });
  });
}

function initializePreview() {
  initializeMotion();
  initializeAccordions();
  initializeCountdown();
  initializeScrollProgress();
  initializeTilt();
  const form = document.querySelector("#game-chooser");
  const result = document.querySelector("#chooser-result");
  const error = document.querySelector("#chooser-error");
  const resultImage = document.querySelector("#result-image");
  const resultTitle = document.querySelector("#result-title");
  const resultCopy = document.querySelector("#result-copy");
  const meetButton = document.querySelector("#meet-game");
  const restartButton = document.querySelector("#restart-chooser");
  let recommendedGame = null;

  function showRecommendation(game, players, time) {
    recommendedGame = game;
    resultImage.hidden = false;
    resultImage.src = game.image;
    resultImage.alt = `${game.title} game artwork and components`;
    resultTitle.textContent = game.title;
    resultCopy.textContent = `${game.title} fits ${players} players, your ${time}-minute window, and a ${game.moodLabel} mood.`;
    meetButton.hidden = false;
    meetButton.innerHTML = `Meet ${game.title} <span aria-hidden="true">↓</span>`;
    result.hidden = false;
    result.classList.remove("is-celebrating");
    if (!prefersReducedMotion()) {
      window.requestAnimationFrame(() => result.classList.add("is-celebrating"));
      window.setTimeout(() => result.classList.remove("is-celebrating"), 1100);
    }
    result.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  }

  function showNoMatch() {
    recommendedGame = null;
    resultImage.hidden = true;
    resultImage.removeAttribute("src");
    resultImage.alt = "";
    resultTitle.textContent = "No exact match yet";
    resultCopy.textContent = "Try a little more time or a different group size.";
    meetButton.hidden = true;
    result.classList.remove("is-celebrating");
    result.hidden = false;
    result.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const players = Number(data.get("players"));
    const time = Number(data.get("time"));
    const mood = data.get("mood");

    if (!players || !time || !mood) {
      error.hidden = false;
      return;
    }

    error.hidden = true;
    const game = pickGame(players, time, mood);
    if (game) showRecommendation(game, players, time);
    else showNoMatch();
  });

  form.addEventListener("change", () => {
    error.hidden = true;
  });

  meetButton.addEventListener("click", () => {
    if (!recommendedGame) return;
    const target = document.getElementById(recommendedGame.target);
    target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => {
      target.focus({ preventScroll: true });
      target.classList.add("is-recommended");
      window.setTimeout(() => target.classList.remove("is-recommended"), 1800);
    }, prefersReducedMotion() ? 0 : 500);
  });

  restartButton.addEventListener("click", () => {
    form.reset();
    result.hidden = true;
    result.classList.remove("is-celebrating");
    error.hidden = true;
    recommendedGame = null;
    form.querySelector("input").focus();
    form.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
      if (link.classList.contains("skip-link")) target.focus({ preventScroll: true });
    });
  });
}

if (typeof document !== "undefined") initializePreview();
if (typeof module !== "undefined") module.exports = { GAME_ORDER, GAMES, pickGame };
