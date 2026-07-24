(() => {
  "use strict";

  const STORAGE_KEY = "equine-theme";
  const DARK_CLASS = "theme-dark";

  function readTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "dark" ? "dark" : "light";
    } catch (_) {
      return "light";
    }
  }

  function updateButtons(isDark) {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode",
      );

      const icon = button.querySelector(".theme-toggle-icon");
      if (icon) icon.textContent = isDark ? "☀" : "☾";
    });
  }

  function applyTheme(theme, persist = false) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    updateButtons(isDark);

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
      } catch (_) {}
    }
  }

  function initialiseTheme() {
    applyTheme(readTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const isDark = document.documentElement.classList.contains(DARK_CLASS);
        applyTheme(isDark ? "light" : "dark", true);
      });
    });

    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) applyTheme(readTheme());
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseTheme, { once: true });
  } else {
    initialiseTheme();
  }
})();
