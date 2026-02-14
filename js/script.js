// script.js

document.addEventListener("DOMContentLoaded", () => {
  setupSmoothScrolling();
  insertGreetingMessage();
  setupThemeToggle();
  setupContactForm();
});

/* ---------------- Smooth Scrolling ---------------- */
function setupSmoothScrolling() {
  // This makes clicking nav links scroll smoothly (works even without CSS scroll-behavior)
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Offset for sticky header
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;

      const top = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ---------------- Greeting Message ---------------- */
function insertGreetingMessage() {
  const headerContainer = document.querySelector("header.container");
  const nav = headerContainer?.querySelector("nav");
  if (!nav) return;

  const msg = getGreeting();

  const greetingEl = document.createElement("div");
  greetingEl.id = "greeting";
  greetingEl.textContent = msg;

  // Insert greeting below nav
  headerContainer.appendChild(greetingEl);
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "Good morning 👋";
  if (hour >= 12 && hour < 17) return "Good afternoon 👋";
  if (hour >= 17 && hour < 22) return "Good evening 👋";
  return "Welcome 👋";
}

/* ---------------- Theme Toggle (dark/light) ---------------- */
function setupThemeToggle() {
  const headerContainer = document.querySelector("header.container");
  const nav = headerContainer?.querySelector("nav");
  if (!nav) return;

  // Create the button and put it in the nav
  const btn = document.createElement("button");
  btn.type = "button";
  btn.id = "theme-toggle";
  btn.setAttribute("aria-label", "Toggle theme");
  btn.textContent = "🌙 Dark";

  nav.appendChild(btn);

  // Load saved preference (or default = dark)
  const saved = localStorage.getItem("theme");
  const initialTheme = saved === "light" ? "light" : "dark";
  applyTheme(initialTheme);
  updateThemeButton(btn, initialTheme);

  // Toggle on click
  btn.addEventListener("click", () => {
    const isLight = document.documentElement.classList.contains("theme-light");
    const newTheme = isLight ? "dark" : "light";

    applyTheme(newTheme);
    updateThemeButton(btn, newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

function applyTheme(theme) {
  // We toggle a class on <html> so CSS can switch variables
  document.documentElement.classList.toggle("theme-light", theme === "light");
}

function updateThemeButton(btn, theme) {
  if (theme === "light") {
    btn.textContent = "☀️ Light";
  } else {
    btn.textContent = "🌙 Dark";
  }
}

/* ---------------- Contact Form Interaction ---------------- */
function setupContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = (document.getElementById("name")?.value || "").trim();
    const email = (document.getElementById("email")?.value || "").trim();
    const message = (document.getElementById("message")?.value || "").trim();

    // Simple validation
    if (!name || !email || !message) {
      status.textContent = "Please fill in all fields.";
      return;
    }

    status.textContent = `Thanks, ${name}! Your message is noted (no backend connected).`;

    // Optional: clear form
    form.reset();
  });
}
