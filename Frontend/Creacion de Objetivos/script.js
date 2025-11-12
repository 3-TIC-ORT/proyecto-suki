
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





document.querySelectorAll(".listo").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!colorObjetivo.value) {
      alert("Seleccioná un color para tu objetivo");
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
    postEvent("crearobjetivo", {idusuario, titulo, tipodeobjetivo, tiempo, veces, icono, color}, (data) => {
      if (data?.objok.ok) {
        alert("Objetivo creado con éxito");
        window.location.href = "../menu principal/indexMenuPrincipal.html";
      } else {
        alert(data?.message || "No se pudo crear el objetivo.");
      }
    });
  });
});
