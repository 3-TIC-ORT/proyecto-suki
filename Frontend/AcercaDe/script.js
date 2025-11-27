
document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000);

  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const contenedorLogros = document.getElementById("contenedorLogros");

  menuBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("idusuario");
    localStorage.removeItem("usuario");
    window.location.href = "../cuenta/IndexcuentaI.html?logout=1";
  });


  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null");
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null;
  if (!idusuario) {
    window.location.href = "../InicioSesion/IndexInicioSesion.html?force=1";
    return;
  }


  const rutaIconoHeader = (clave) => {
    const mapa = {
      suki: "SUKI.png",
      trump: "TRUMP.png",
      rabino: "rabino.png",
      oro: "oro.png",
      flash: "FLASH.png",
      turro: "TURRO.png",
      sullivan: "solivan.png",
      bizarrap: "BzRP.png",
      minecraft: "minecraft.png"
    };
    return `../imagenes/Imagenesheader/${mapa[clave] || "SUKI.png"}`;
  };


  const setHeader = (nombre, skin, dinero) => {
    const elNombre = document.getElementById("nombreHeader");
    const elImg = document.getElementById("imgHeaderSkin");
    const plata = document.getElementById("plataHeaderValor");

    if (elNombre) elNombre.textContent = nombre || "Usuario";
    if (elImg) elImg.src = rutaIconoHeader(skin);
    if (plata) plata.textContent = dinero ?? 0;
  };

 
  postEvent("devolverusuario", { idusuario }, (data) => {
    if (!data.objok || !data.usuario) {
      contenedorLogros.innerHTML = "<p>Error al cargar logros.</p>";
      return;
    }

    const usuario = data.usuario;
    setHeader(usuario.usuario, usuario.skinseleccionada, usuario.dinero);
  });
});