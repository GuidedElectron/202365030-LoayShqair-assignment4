document.addEventListener("DOMContentLoaded", () => {
  const state = {
    theme: localStorage.getItem("portfolio-theme") || "dark",
    level: localStorage.getItem("portfolio-level") || "all",
    visitorName: localStorage.getItem("portfolio-visitor-name") || "",
    isLoggedIn: localStorage.getItem("portfolio-login-state") === "true",
    timerSeconds: 0,
    repos: [],
    repoCacheKey: "portfolio-repo-cache-v1",
    repoCacheDurationMs: 10 * 60 * 1000,
    projectControlsBound: false
  };

  setupSmoothScrolling();
  insertGreetingMessage();
  setupTheme(state);
  setupVisitorName(state);
  setupTimer(state);
  setupLoginState(state);
  setupDifficultyPreference(state);
  setupProjectControls(state);
  setupContactForm();
  setupRepoLoader(state);
});

function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const headerOffset = document.querySelector(".site-header")?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset + 4;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function insertGreetingMessage() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const hour = new Date().getHours();
  let message = "Welcome. Explore the portfolio and try the interactive features.";

  if (hour >= 5 && hour < 12) {
    message = "Good morning. This portfolio highlights engineering interests and interactive web features.";
  } else if (hour >= 12 && hour < 17) {
    message = "Good afternoon. Browse projects, test the filters, and view live GitHub data below.";
  } else if (hour >= 17 && hour < 22) {
    message = "Good evening. The site remembers your preferences and updates sections dynamically.";
  }

  greeting.textContent = message;
}

function setupTheme(state) {
  const button = document.getElementById("theme-toggle");
  if (!button) return;

  applyTheme(state.theme);

  button.addEventListener("click", () => {
    state.theme = document.documentElement.classList.contains("theme-light") ? "dark" : "light";
    localStorage.setItem("portfolio-theme", state.theme);
    applyTheme(state.theme);
  });
}

function applyTheme(theme) {
  const isLight = theme === "light";
  document.documentElement.classList.toggle("theme-light", isLight);
  const button = document.getElementById("theme-toggle");
  if (button) {
    button.textContent = isLight ? "Light mode" : "Dark mode";
    button.setAttribute("aria-pressed", String(isLight));
  }
}

function setupVisitorName(state) {
  const input = document.getElementById("visitor-name");
  const saveButton = document.getElementById("save-name");
  const clearButton = document.getElementById("clear-name");
  const message = document.getElementById("visitor-message");
  if (!input || !saveButton || !clearButton || !message) return;

  input.value = state.visitorName;
  renderVisitorMessage(state.visitorName, message);

  saveButton.addEventListener("click", () => {
    const value = input.value.trim();
    state.visitorName = value;
    localStorage.setItem("portfolio-visitor-name", value);
    renderVisitorMessage(value, message);
  });

  clearButton.addEventListener("click", () => {
    input.value = "";
    state.visitorName = "";
    localStorage.removeItem("portfolio-visitor-name");
    renderVisitorMessage("", message);
  });
}

function renderVisitorMessage(name, target) {
  target.textContent = name
    ? `Welcome, ${name}. Your name was stored locally for this portfolio.`
    : "Your preference can be stored locally for a more personal visit.";
}

function setupTimer(state) {
  const timer = document.getElementById("visit-timer");
  if (!timer) return;

  setInterval(() => {
    state.timerSeconds += 1;
    timer.textContent = formatDuration(state.timerSeconds);
  }, 1000);
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function setupLoginState(state) {
  const button = document.getElementById("login-toggle");
  const badge = document.getElementById("login-status");
  const note = document.getElementById("login-message");
  if (!button || !badge || !note) return;

  const render = () => {
    badge.textContent = state.isLoggedIn ? "Logged in" : "Guest mode";
    note.textContent = state.isLoggedIn
      ? "Session state is stored locally to demonstrate persistent UI behavior."
      : "This simulated session can be toggled and remembered with localStorage.";
    button.textContent = state.isLoggedIn ? "Log out" : "Simulate login";
    button.setAttribute("aria-pressed", String(state.isLoggedIn));
  };

  button.addEventListener("click", () => {
    state.isLoggedIn = !state.isLoggedIn;
    localStorage.setItem("portfolio-login-state", String(state.isLoggedIn));
    render();
  });

  render();
}

function setupDifficultyPreference(state) {
  const buttons = Array.from(document.querySelectorAll(".difficulty-button"));
  const message = document.getElementById("difficulty-message");
  if (!buttons.length || !message) return;

  const apply = (level) => {
    state.level = level;
    localStorage.setItem("portfolio-level", level);
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.level === level));
    updateDifficultyMessage(level, message);
    updateProjects(state);
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => apply(button.dataset.level || "all"));
  });

  apply(state.level);
}

function updateDifficultyMessage(level, target) {
  const messages = {
    all: "Showing all projects. Use the controls to focus on beginner-friendly or more advanced work.",
    beginner: "Beginner view selected. Easier entry points are emphasized first.",
    advanced: "Advanced view selected. More technical and systems-heavy projects are emphasized first."
  };
  target.textContent = messages[level] || messages.all;
}

function setupProjectControls(state) {
  const searchInput = document.getElementById("project-search");
  const filterSelect = document.getElementById("project-filter");
  const sortSelect = document.getElementById("project-sort");

  if (!searchInput || !filterSelect || !sortSelect) return;

  if (!state.projectControlsBound) {
    searchInput.addEventListener("input", debounce(() => updateProjects(state), 180));
    filterSelect.addEventListener("change", () => updateProjects(state));
    sortSelect.addEventListener("change", () => updateProjects(state));
    state.projectControlsBound = true;
  }

  updateProjects(state);
}

function updateProjects(state) {
  const searchInput = document.getElementById("project-search");
  const filterSelect = document.getElementById("project-filter");
  const sortSelect = document.getElementById("project-sort");
  const grid = document.getElementById("projects-grid");
  const resultCount = document.getElementById("results-count");
  const emptyState = document.getElementById("empty-state");
  const viewModeLabel = document.getElementById("view-mode-label");

  if (!searchInput || !filterSelect || !sortSelect || !grid || !resultCount || !emptyState || !viewModeLabel) {
    return;
  }

  const cards = Array.from(grid.querySelectorAll(".project-card"));
  if (!cards.length) return;

  const query = searchInput.value.trim().toLowerCase();
  const category = filterSelect.value;
  const sort = sortSelect.value;
  const level = state.level || "all";

  const visibleCards = cards.filter((card) => {
    const cardText = [card.dataset.title, card.dataset.tags, card.textContent].join(" ").toLowerCase();
    const cardCategory = card.dataset.category || "";
    const cardLevel = card.dataset.level || "";

    const matchesQuery = !query || cardText.includes(query);
    const matchesCategory = category === "all" || cardCategory === category;
    const matchesLevel = level === "all" || cardLevel === level;
    const visible = matchesQuery && matchesCategory && matchesLevel;
    card.classList.toggle("is-hidden", !visible);
    return visible;
  });

  const sortedCards = [...visibleCards].sort((a, b) => {
    if (sort === "year-asc") return Number(a.dataset.year) - Number(b.dataset.year);
    if (sort === "title-asc") return (a.dataset.title || "").localeCompare(b.dataset.title || "");
    return Number(b.dataset.year) - Number(a.dataset.year);
  });

  const fragment = document.createDocumentFragment();
  sortedCards.forEach((card) => fragment.appendChild(card));
  grid.appendChild(fragment);

  resultCount.textContent = `${sortedCards.length} project${sortedCards.length === 1 ? "" : "s"} shown`;
  viewModeLabel.textContent = `${capitalize(level)} projects`;
  emptyState.hidden = sortedCards.length !== 0;
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  const counter = document.getElementById("message-counter");
  const messageField = document.getElementById("message");
  if (!form || !status || !counter || !messageField) return;

  messageField.addEventListener("input", () => {
    counter.textContent = `${messageField.value.trim().length} / 20 characters minimum`;
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    if (!name || !email || !message) {
      showFormStatus(status, "Please complete all fields before submitting.", "error");
      return;
    }

    if (!/^[A-Za-z\s'-]{2,}$/.test(name)) {
      showFormStatus(status, "Name must contain at least 2 letters and should not include numbers.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormStatus(status, "Please enter a valid email address.", "error");
      return;
    }

    if (message.length < 20) {
      showFormStatus(status, "Message must be at least 20 characters so the submission is meaningful.", "error");
      return;
    }

    showFormStatus(status, `Thanks, ${name}. Your message passed all validation checks.`, "success");
    form.reset();
    counter.textContent = "0 / 20 characters minimum";
  });
}

function showFormStatus(element, message, type) {
  element.textContent = message;
  element.className = `form-status show ${type}`;
}

function setupRepoLoader(state) {
  const reloadButton = document.getElementById("reload-repos");
  if (reloadButton) {
    reloadButton.addEventListener("click", () => loadRepositories(state, { forceRefresh: true }));
  }
  loadRepositories(state);
}

async function loadRepositories(state, options = {}) {
  const repoList = document.getElementById("repo-list");
  const repoError = document.getElementById("repo-error");
  const apiStatus = document.getElementById("api-status");
  const cacheNote = document.getElementById("repo-cache-note");
  if (!repoList || !repoError || !apiStatus || !cacheNote) return;

  apiStatus.textContent = "Loading repositories...";
  cacheNote.textContent = "";
  repoError.hidden = true;
  repoList.innerHTML = "";

  const cachedData = getCachedRepos(state);
  if (cachedData && !options.forceRefresh) {
    state.repos = cachedData.items;
    renderRepositories(state.repos, repoList);
    apiStatus.textContent = "Repositories loaded successfully.";
    cacheNote.textContent = "Loaded from local cache for faster performance.";
    return;
  }

  try {
    const response = await fetch("https://api.github.com/users/GuidedElectron/repos?sort=updated&per_page=6", {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API responded with status ${response.status}`);
    }

    const data = await response.json();
    state.repos = data.filter((repo) => !repo.fork).slice(0, 6);

    if (!state.repos.length) {
      throw new Error("No public repositories were returned.");
    }

    storeCachedRepos(state, state.repos);
    renderRepositories(state.repos, repoList);
    apiStatus.textContent = "Repositories loaded successfully.";
    cacheNote.textContent = "Loaded from the GitHub API and cached locally.";
  } catch (error) {
    apiStatus.textContent = "Unable to load live data.";
    repoError.hidden = false;
    repoError.textContent = `GitHub data could not be loaded right now. ${error.message}`;
  }
}

function getCachedRepos(state) {
  try {
    const raw = localStorage.getItem(state.repoCacheKey);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const isFresh = Date.now() - parsed.savedAt < state.repoCacheDurationMs;
    const hasItems = Array.isArray(parsed.items) && parsed.items.length > 0;

    return isFresh && hasItems ? parsed : null;
  } catch {
    return null;
  }
}

function storeCachedRepos(state, repos) {
  const payload = {
    savedAt: Date.now(),
    items: repos
  };
  localStorage.setItem(state.repoCacheKey, JSON.stringify(payload));
}

function renderRepositories(repositories, container) {
  const fragment = document.createDocumentFragment();
  container.innerHTML = "";

  repositories.forEach((repo) => {
    const article = document.createElement("article");
    article.className = "card repo-card";

    const language = document.createElement("span");
    language.className = "repo-language";
    language.textContent = repo.language || "Not specified";

    const heading = document.createElement("h3");
    const link = document.createElement("a");
    link.href = repo.html_url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = repo.name;
    heading.appendChild(link);

    const description = document.createElement("p");
    description.textContent = repo.description || "No description provided.";

    const meta = document.createElement("div");
    meta.className = "meta-row";

    const stars = document.createElement("span");
    stars.textContent = `★ ${repo.stargazers_count}`;

    const updated = document.createElement("span");
    updated.textContent = `Updated ${new Date(repo.updated_at).toLocaleDateString()}`;

    meta.append(stars, updated);
    article.append(language, heading, description, meta);
    fragment.appendChild(article);
  });

  container.appendChild(fragment);
}

function debounce(callback, delay = 200) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
