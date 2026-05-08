(() => {
  const THEME_KEY = "suki-theme";
  const root = document.documentElement;
  const DARK_LOGO_SRC = "/Frontend/imagenes/theme/logo con nombre.png";
  const DARK_CART_SRC = "/Frontend/imagenes/theme/carrito en blanco.png";

  const readTheme = () => {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark" ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtons(theme);
    updateHeaderThemeImages(theme);
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

  const swapThemeImage = (img, themeSrc, theme) => {
    if (!img) return;
    if (!img.dataset.lightSrc) {
      img.dataset.lightSrc = img.getAttribute("src") || "";
    }
    img.setAttribute("src", theme === "dark" ? themeSrc : img.dataset.lightSrc);
  };

  const updateHeaderThemeImages = (theme) => {
    const header = document.querySelector("header");
    if (!header) return;

    const logoImg = header.querySelector(
      '.logo-header img, img[alt*="Logo SUKI"], img[src$="logo.png"]'
    );
    const cartImg = header.querySelector(
      '.icono-carrito img, img[alt*="Carrito"], img[src$="Vector.png"], img[src$="vector.png"]'
    );

    swapThemeImage(logoImg, DARK_LOGO_SRC, theme);
    swapThemeImage(cartImg, DARK_CART_SRC, theme);
  };

  applyTheme(readTheme());
  document.addEventListener("DOMContentLoaded", () => {
    ensureSidebarToggle();
    updateHeaderThemeImages(readTheme());
  });
})();
