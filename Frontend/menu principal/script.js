document.addEventListener('DOMContentLoaded', () => {
  connect2Server(3000);

  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const estadoVacio = document.getElementById("estadoVacio");
  const listaObjetivos = document.getElementById("listaObjetivos");
  const cont = document.getElementById("objetivos");

  if (menuBtn && sidebar && overlay) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      overlay.classList.toggle("show");
    });
    overlay.addEventListener("click", () => {
      sidebar.classList.remove("open");
      overlay.classList.remove("show");
    });
  }

  const irACrear = () => {
    window.location.href = "../Creacion de Objetivos/IndexCreacionDeObjetivos.html";
  };

  document.getElementById("botonCrear")?.addEventListener("click", irACrear);
  document.getElementById("botonCrearInferior")?.addEventListener("click", irACrear);

  const RUTAS_POR_TIPO = {
    accion: "../Objetivo Accion/indexObjetivoAccion.html",
    tiempo: "../Objetivo Tiempo/indexObjetivoTiempo.html",
  };

  function appendObjetivoCard(obj) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "objetivo-card";
    card.textContent = obj?.nombre || "Objetivo";

    const tipo = (obj?.tipo || "").toLowerCase();
    const destino = RUTAS_POR_TIPO[tipo];

    if (destino) {
      card.addEventListener("click", () => {
        if (obj?.idObjetivo) localStorage.setItem("idObjetivo", obj.idObjetivo);
        window.location.href = destino;
      });
    } else {
      card.disabled = true;
      card.title = `Tipo desconocido: ${tipo}`;
    }

    cont.appendChild(card);
  }

  postEvent("devolverobjetivos", idusuario, (res) => {
    const objetivos =
      Array.isArray(res) ? res :
      Array.isArray(res?.objetivos) ? res.objetivos :
      Array.isArray(res?.data?.objetivos) ? res.data.objetivos :
      [];

    if (!objetivos.length) {
      estadoVacio.classList.remove("oculto");
      listaObjetivos.classList.add("oculto");
      return;
    }

    const firstWithUser = objetivos.find(o => o?.idUsuario);
    if (firstWithUser) localStorage.setItem("idUsuario", firstWithUser.idUsuario);

    estadoVacio.classList.add("oculto");
    listaObjetivos.classList.remove("oculto");
    cont.innerHTML = "";

    objetivos.forEach(obj => {
      if (obj && typeof obj === "object") appendObjetivoCard(obj);
    });
  });
});
