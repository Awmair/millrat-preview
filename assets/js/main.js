const GAME_ORDER = ["someones-y", "scrapbook", "footfalls", "bad-eggs"];

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

function initializePreview() {
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
    resultImage.src = game.image;
    resultImage.alt = `${game.title} game artwork and components`;
    resultTitle.textContent = game.title;
    resultCopy.textContent = `${game.title} fits ${players} players, your ${time}-minute window, and a ${game.moodLabel} mood.`;
    meetButton.hidden = false;
    meetButton.innerHTML = `Meet ${game.title} <span aria-hidden="true">↓</span>`;
    result.hidden = false;
    result.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
  }

  function showNoMatch() {
    recommendedGame = null;
    resultImage.removeAttribute("src");
    resultImage.alt = "";
    resultTitle.textContent = "No exact match yet";
    resultCopy.textContent = "Try a little more time or a different group size.";
    meetButton.hidden = true;
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
    });
  });
}

if (typeof document !== "undefined") initializePreview();
if (typeof module !== "undefined") module.exports = { GAME_ORDER, GAMES, pickGame };
