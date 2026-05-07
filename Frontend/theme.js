(() => {
  const THEME_KEY = "suki-theme";
  const root = document.documentElement;

  const readTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark" ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtons(theme);
  };

  const updateThemeButtons = (theme) => {
    const label = theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
    document.querySelectorAll(".theme-toggle-btn").forEach((button) => {
      button.textContent = label;
      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    });
  };

  const ensureSidebarToggle = () => {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || sidebar.querySelector(".theme-toggle-btn")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle-btn";
    button.addEventListener("click", () => {
      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });

    const logoutButton = sidebar.querySelector("#btnCerrarSesion");
    if (logoutButton) {
      sidebar.insertBefore(button, logoutButton);
    } else {
      sidebar.appendChild(button);
    }

    updateThemeButtons(root.getAttribute("data-theme") || "light");
  };

  applyTheme(readTheme());
  document.addEventListener("DOMContentLoaded", ensureSidebarToggle);
})();
