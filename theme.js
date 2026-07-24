(() => {
  "use strict";

  const STORAGE_KEY = "equine-theme";
  const DARK_CLASS = "theme-dark";
  const REVIEWS_WIDGET_SELECTOR =
    ".elfsight-app-08760789-afd9-4fa0-9275-cbac247e4400";
  const REVIEWS_THEME_STYLE_ID = "equine-reviews-theme";
  let reviewsWidgetObserver = null;

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

  function updateReviewsWidgetTheme(isDark) {
    const widget = document.querySelector(REVIEWS_WIDGET_SELECTOR);
    const shadowRoot = widget?.firstElementChild?.shadowRoot;

    if (!shadowRoot) return;

    let style = shadowRoot.getElementById(REVIEWS_THEME_STYLE_ID);

    if (!isDark) {
      style?.remove();
      return;
    }

    if (!style) {
      style = document.createElement("style");
      style.id = REVIEWS_THEME_STYLE_ID;
      shadowRoot.appendChild(style);
    }

    style.textContent = `
      .es-widget-title-container {
        color: #f3f7fb !important;
      }
    `;
  }

  function observeReviewsWidget() {
    if (reviewsWidgetObserver) return;

    const widget = document.querySelector(REVIEWS_WIDGET_SELECTOR);
    if (!widget) return;

    reviewsWidgetObserver = new MutationObserver(() => {
      updateReviewsWidgetTheme(
        document.documentElement.classList.contains(DARK_CLASS),
      );
    });

    reviewsWidgetObserver.observe(widget, {
      childList: true,
      subtree: true,
    });

    updateReviewsWidgetTheme(
      document.documentElement.classList.contains(DARK_CLASS),
    );
  }

  function applyTheme(theme, persist = false) {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle(DARK_CLASS, isDark);
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    updateButtons(isDark);
    updateReviewsWidgetTheme(isDark);

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
      } catch (_) {}
    }
  }

  function initialiseTheme() {
    applyTheme(readTheme());
    observeReviewsWidget();

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
