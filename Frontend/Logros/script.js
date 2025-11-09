const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const contenedorLogros = document.getElementById("contenedorLogros");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("idusuario");
    localStorage.removeItem("usuario");
    window.location.href = "..//InicioSesion/IndexInicioSesion.html?logout=1";
  });
}

const idusuario = JSON.parse(localStorage.getItem("idusuario") || "null");

if (idusuario) {
  postEvent("devolverusuario", { idusuario }, (data) => {
    if (data.objok && data.usuario) {
      const logros = data.usuario.logros || {};
      const racha = data.usuario.rachaactual || 0;

      const listaLogros = [
        { clave: "primerpaso", nombre: "Primer paso", descripcion: "Completa tu primer objetivo" },
        { clave: "racha3", nombre: "Racha 3", descripcion: "3 días seguidos", meta: 3 },
        { clave: "racha7", nombre: "Racha 7", descripcion: "7 días seguidos", meta: 7 },
        { clave: "racha30", nombre: "Racha 30", descripcion: "30 días seguidos", meta: 30 },
        { clave: "iniciador", nombre: "Iniciador", descripcion: "Crea tu primer objetivo" },
        { clave: "creador", nombre: "Creador", descripcion: "Crea 5 objetivos" },
        { clave: "coleccionista", nombre: "Coleccionista", descripcion: "Compra tu primera skin" },
        { clave: "explorador", nombre: "Explorador", descripcion: "Racha 5" },
        { clave: "legendario", nombre: "Legendario", descripcion: "Racha 10" },
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
            <div class="icono-logro"></div>
            <h3>${l.nombre}</h3>
            <p>${l.descripcion}</p>
            ${l.meta ? `
              <div class="barra-progreso">
                <div class="relleno" style="width:${progresoAncho};"></div>
              </div>
              <div class="texto-progreso">${progresoTexto}</div>
            ` : ""}
          </div>
        `;
      });

    } else {
      contenedorLogros.innerHTML = "<p>Error al cargar logros.</p>";
    }
  });
} else {
  contenedorLogros.innerHTML = "<p>No hay usuario activo.</p>";
}