// --- Sidebar ---
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

connect2Server(3000);

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
    window.location.href = "../InicioSesion/IndexInicioSesion.html?logout=1";
  });
}
const formSeleccion = document.getElementById("form-seleccion");
const formTiempo = document.getElementById("form-tiempo");
const formAccion = document.getElementById("form-accion");
const menuDisenio = document.getElementById("menu-disenio");

const nombreObjetivo = document.getElementById("nombreObjetivo");
const tipoObjetivo = document.getElementById("tipoObjetivo");
const duracionTiempo = document.getElementById("duracionTiempo");
const descripcionAccion = document.getElementById("descripcionAccion");
const colorObjetivo = document.getElementById("colorObjetivo");

document.getElementById("btnSiguienteSeleccion").addEventListener("click", () => {
  if (nombreObjetivo.value.trim() === "" || tipoObjetivo.value === "") {
    alert("Completá todos los campos antes de continuar");
    return;
  }
  if (tipoObjetivo.value === "tiempo") {
    formSeleccion.classList.add("oculto");
    formTiempo.classList.remove("oculto");
  } else if (tipoObjetivo.value === "accion") {
    formSeleccion.classList.add("oculto");
    formAccion.classList.remove("oculto");
  }
});

document.getElementById("btnSiguienteTiempo").addEventListener("click", () => {
  if (duracionTiempo.value.trim() === "") {
    alert("Por favor completá la duración del objetivo");
    return;
  }
  formTiempo.classList.add("oculto");
  menuDisenio.classList.remove("oculto");
});

document.getElementById("btnSiguienteAccion").addEventListener("click", () => {
  if (descripcionAccion.value.trim() === "") {
    alert("Por favor describí tu acción");
    return;
  }
  formAccion.classList.add("oculto");
  menuDisenio.classList.remove("oculto");
});

document.querySelectorAll(".volver").forEach(btn => {
  btn.addEventListener("click", () => {
    formSeleccion.classList.remove("oculto");
    formTiempo.classList.add("oculto");
    formAccion.classList.add("oculto");
    menuDisenio.classList.add("oculto");
  });
});

function obtenerIdUsuario() {
  try {
    const u = JSON.parse(localStorage.getItem("usuario") || "null");
    return (u && (u.id ?? u._id ?? u.uid)) ?? JSON.parse(localStorage.getItem("idusuario") || "null");
  } catch {
    return JSON.parse(localStorage.getItem("idusuario") || "null");
  }
}

function setNombreUsuarioHeader() {
  try {
    const u = JSON.parse(localStorage.getItem("usuario") || "null");
    const nombre = (u && (u.nombre ?? u.name ?? u.username ?? u.email)) || "Usuario";
    const el = document.getElementById("nombreUsuarioHeader");
    if (el) el.textContent = nombre;
  } catch {}
}
setNombreUsuarioHeader();

document.querySelectorAll(".listo").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!colorObjetivo.value) {
      alert("Seleccioná un color para tu objetivo");
      return;
    }
    const titulo = nombreObjetivo.value.trim();
    const tipodeobjetivo = tipoObjetivo.value;
    const idusuario = obtenerIdUsuario();
    if (!idusuario) {
      alert("No se encontró el idusuario en localStorage. Iniciá sesión nuevamente.");
      return;
    }
    let tiempo = null, veces = null, icono = null, color = null;
    if (tipodeobjetivo === "tiempo") {
      tiempo = Number(duracionTiempo.value);
    } else if (tipodeobjetivo === "accion") {
      const v = descripcionAccion.value.trim();
      const n = Number(v);
      veces = Number.isNaN(n) ? v : n;
    }
    color = colorObjetivo.value;

    postEvent("crearobjetivo", { idusuario, titulo, tipodeobjetivo, tiempo, veces, icono, color }, (data) => {
      if (data?.ok || data?.objok || data?.success) {
        alert("Objetivo creado con éxito");
        window.location.href = "../menu principal/indexMenuPrincipal.html";
      } else {
        alert(data?.message || "No se pudo crear el objetivo.");
      }
    });
  });
});

getEvent("obtenericonos", (data) => {
  if (data?.ok && Array.isArray(data.iconos)) {
    const contenedorIconos = document.getElementById("contenedorIconos");
    data.iconos.forEach(icono => {
      const div = document.createElement("div");
      div.classList.add("icono-opcion");
      div.innerHTML = `<img src="${icono.url}" alt="Icono ${icono._id}">`;
      div.addEventListener("click", () => {
        document.querySelectorAll(".icono-opcion").forEach(el => el.classList.remove("seleccionado"));
        div.classList.add("seleccionado");
       div.dataset.seleccionado = icono._id;
      });
      contenedorIconos.appendChild(div);
    });
  }
});   

