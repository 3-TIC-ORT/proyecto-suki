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
    window.location.href = "../Login/indexLogin.html?logout=1";
  });


  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null");
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null;
  if (!idusuario) {
    window.location.href = "../Login/indexLogin.html?force=1";
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

    const logros = usuario.logros || {};
    const racha = usuario.rachaactual || 0;

    const listaLogros = [
      { clave: "primerpaso", nombre: "Primer paso", descripcion: "Completa tu primer objetivo" },
      { clave: "racha3", nombre: "Racha 3", descripcion: "3 días seguidos", meta: 3 },
      { clave: "racha7", nombre: "Racha 7", descripcion: "7 días seguidos", meta: 7 },
      { clave: "racha30", nombre: "Racha 30", descripcion: "30 días seguidos", meta: 30 },
      { clave: "iniciador", nombre: "Iniciador", descripcion: "Crea tu primer objetivo" },
      { clave: "creador", nombre: "Creador", descripcion: "Crea 5 objetivos" },
      { clave: "coleccionista", nombre: "Coleccionista", descripcion: "Compra tu primera skin" },
      { clave: "explorador", nombre: "Explorador", descripcion: "4 skins adquiridas" },
      { clave: "legendario", nombre: "Legendario", descripcion: "8 skins adquiridas" },
      { clave: "centenario", nombre: "Centenario", descripcion: "Cumple 100 objetivos" },
      { clave: "ganador", nombre: "Ganador", descripcion: "Desbloquea 5 logros" },
      { clave: "extraganador", nombre: "Extra ganador", descripcion: "Desbloquea 10 logros" },
      { clave: "extasis", nombre: "Éxtasis", descripcion: "Desbloquea todos los logros" }
    ];

    contenedorLogros.innerHTML = "";

    listaLogros.forEach((l) => {
      let bloqueado = !logros[l.clave];
      let progresoTexto = "";
      let progresoAncho = "";

      if (l.meta) {
        let porcentaje = Math.min((racha / l.meta) * 100, 100);
        progresoAncho = porcentaje + "%";
        progresoTexto = `${Math.min(racha, l.meta)}/${l.meta}`;
      }

      contenedorLogros.innerHTML += `
        <div class="logro ${bloqueado ? "bloqueado" : ""}">
      <img src="../imagenes/Frame 71.png" alt="trofeo"><p>
          <h3>${l.nombre}</h3>
          <p>${l.descripcion}</p>
          
        </div>
      `;
    });
  });
});
