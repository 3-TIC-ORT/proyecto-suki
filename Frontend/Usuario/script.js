document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000);

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

  const usuario = JSON.parse(localStorage.getItem("idusuario"));
  const idusuario = usuario?.idusuario;



  document.getElementById("nombreHeader").textContent = usuario.nombre;

  const listaLogros = [
    { clave: "primerpaso", nombre: "Primer paso" },
    { clave: "racha3", nombre: "Racha 3" },
    { clave: "racha7", nombre: "Racha 7" },
    { clave: "racha30", nombre: "Racha 30" },
    { clave: "iniciador", nombre: "Iniciador" },
    { clave: "creador", nombre: "Creador" },
    { clave: "coleccionista", nombre: "Coleccionista" },
    { clave: "explorador", nombre: "Explorador" },
    { clave: "legendario", nombre: "Legendario" },
    { clave: "centenario", nombre: "Centenario" },
    { clave: "ganador", nombre: "Ganador" },
    { clave: "extraganador", nombre: "Extra ganador" },
    { clave: "extasis", nombre: "Éxtasis" }
  ];

  function rutaSkin(clave) {
    const mapa = {
      suki: "Suki",
      oro: "De oro",
      minecraft: "SALCHICRAFT",
      flash: "salchiflash",
      rabino: "Salchirabino",
      trump: "salchitrump",
      turro: "salchiturro",
      sullivan: "salchivan",
      bizarrap: "BzRP"
    };
    const nombre = mapa[clave] || "Suki";
    return `../imagenes/skins/${encodeURIComponent(nombre)}.png`;
  }

  function pintarCalendario(racha) {
    const cont = document.getElementById("calendarioDias");
    cont.innerHTML = "";
    const total = 35;
    for (let i = 0; i < total; i++) {
      const d = document.createElement("div");
      d.className = "punto";
      if (i < 7) d.classList.add("vacio");
      else if (i >= total - racha) d.classList.add("ok");
      cont.appendChild(d);
    }
    document.querySelector("#rachaActual span").textContent = `${racha} Días`;
  }

  const contarActivos = (obj) => Object.values(obj || {}).filter(Boolean).length;
  const total = (obj) => Object.keys(obj || {}).length;

  function setLogrosDestacados(logrosObj) {
    const claves = ["racha3", "racha7", "coleccionista", "ganador"];
    const elegidos = listaLogros.filter(l => claves.includes(l.clave));
    elegidos.forEach((l, i) => {
      const c = document.getElementById(`logro${i + 1}`);
      const hecho = !!logrosObj[l.clave];
      c.innerHTML = `
        <img src="../imagenes/Frame 71.png" alt="trofeo">
        <p>${l.nombre}</p>
        <small>${hecho ? "Completado" : "Pendiente"}</small>
      `;
      c.classList.toggle("hecho", hecho);
    });
  }

  function cargarPerfil() {
    postEvent("devolverusuario", { idusuario }, (data) => {
      if (!data?.objok || !data.usuario) return;
      const u = data.usuario;
      document.getElementById("nombreUsuario").textContent = u.usuario;
      document.getElementById("mailUsuario").textContent = u.mail || "—";
      document.getElementById("cumple").textContent = u.fecha || "—";
      document.getElementById("fechaPerfil").textContent = u.fechadecreacion || "—";
      document.getElementById("skinsCantidad").textContent = `${contarActivos(u.skins)}/${total(u.skins)}`;
      document.getElementById("skinTexto").textContent = `Skin: ${u.skinseleccionada}`;
      document.getElementById("imgPerro").src = rutaSkin(u.skinseleccionada);
      document.getElementById("logrosCompletados").textContent = `${contarActivos(u.logros)}/${total(u.logros)}`;
      setLogrosDestacados(u.logros);
      document.getElementById("rachaLarga").textContent = `${u.rachamaslarga || 0} días`;
      pintarCalendario(u.rachaactual || 0);
    });
  }
});