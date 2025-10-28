// --- Sidebar ---
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

const formSeleccion = document.getElementById("form-seleccion");
const formTiempo = document.getElementById("form-tiempo");
const formAccion = document.getElementById("form-accion");
const menuTiempo = document.getElementById("menu-tiempo");
const menuAccion = document.getElementById("menu-accion");

const nombreObjetivo = document.getElementById("nombreObjetivo");
const tipoObjetivo = document.getElementById("tipoObjetivo");
const duracionTiempo = document.getElementById("duracionTiempo");
const descripcionAccion = document.getElementById("descripcionAccion");
const colorTiempo = document.getElementById("colorTiempo");
const colorAccion = document.getElementById("colorAccion");


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
  menuTiempo.classList.remove("oculto");
});

document.getElementById("btnSiguienteAccion").addEventListener("click", () => {
  if (descripcionAccion.value.trim() === "") {
    alert("Por favor describí tu acción");
    return;
  }
  formAccion.classList.add("oculto");
  menuAccion.classList.remove("oculto");
});

document.querySelectorAll(".volver").forEach(btn => {
  btn.addEventListener("click", () => {
    formSeleccion.classList.remove("oculto");
    formTiempo.classList.add("oculto");
    formAccion.classList.add("oculto");
    menuTiempo.classList.add("oculto");
    menuAccion.classList.add("oculto");
  });
});

document.querySelectorAll(".listo").forEach(btn => {
  btn.addEventListener("click", () => {
    if ((btn.closest("#menu-tiempo") && !colorTiempo.value) ||
        (btn.closest("#menu-accion") && !colorAccion.value)) {
      alert("Seleccioná un color para tu objetivo");
      return;
    }

    alert(" Objetivo creado con éxito");
    window.location.reload();
  });
});
