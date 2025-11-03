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

connect2server(3000)

let idusuario = Number(sessionStorage.getItem("idusuario") || localStorage.getItem("idusuario") || 1)

const listaLogros = [
  { clave: "primerpaso", nombre: "Primer paso", descripcion: "Completa tu primer objetivo" },
  { clave: "racha3", nombre: "Racha 3", descripcion: "3 días seguidos" },
  { clave: "racha7", nombre: "Racha 7", descripcion: "7 días seguidos" },
  { clave: "racha30", nombre: "Racha 30", descripcion: "30 días seguidos" },
  { clave: "iniciador", nombre: "Iniciador", descripcion: "Crea tu primer objetivo" },
  { clave: "creador", nombre: "Creador", descripcion: "Crea 5 objetivos" },
  { clave: "coleccionista", nombre: "Coleccionista", descripcion: "Compra tu primera skin" },
  { clave: "explorador", nombre: "Explorador", descripcion: "Racha 5" },
  { clave: "legendario", nombre: "Legendario", descripcion: "Racha 10" },
  { clave: "centenario", nombre: "Centenario", descripcion: "Cumple 100 objetivos" },
  { clave: "ganador", nombre: "Ganador", descripcion: "Desbloquea 5 logros" },
  { clave: "extraganador", nombre: "Extra ganador", descripcion: "Desbloquea 10 logros" },
  { clave: "extasis", nombre: "Éxtasis", descripcion: "Desbloquea todos los logros" }
]

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
  }
  const nombre = mapa[clave] || "Suki"
  return `imagenes/skins/normal=${encodeURIComponent(nombre)}.png`
}

function pintarCalendario(racha) {
  const cont = document.getElementById("calendarioDias")
  cont.innerHTML = ""
  const total = 35
  for (let i = 0; i < total; i++) {
    const d = document.createElement("div")
    d.className = "punto"
    if (i < 7) d.classList.add("vacio")
    else if (i >= total - racha) d.classList.add("ok")
    cont.appendChild(d)
  }
  document.querySelector("#rachaActual span").textContent = `${racha} Días`
}

function contarSkins(skinsObj) {
  const total = Object.keys(skinsObj).length
  let activas = 0
  for (const k in skinsObj) if (skinsObj[k]) activas++
  return { activas, total }
}

function contarLogros(logrosObj) {
  const total = Object.keys(logrosObj).length
  let hechos = 0
  for (const k in logrosObj) if (logrosObj[k]) hechos++
  return { hechos, total }
}

function setLogrosDestacados(logrosObj) {
  const claves = ["racha3", "racha7", "coleccionista", "ganador"]
  const elegidos = listaLogros.filter(l => claves.includes(l.clave))
  elegidos.forEach((l, i) => {
    const c = document.getElementById(`logro${i + 1}`)
    const hecho = !!logrosObj[l.clave]
    c.innerHTML = `
      <img src="../imagenes/Frame/ 71.png" alt="trofeo">
      <p>${l.nombre}</p>
      <small>${hecho ? "Completado " : "Pendiente"}</small>
    `
  })
}

function cargarPerfil() {
  postEvent("devolverusuario", { idusuario }, (data) => {
    if (!data || !data.objok || !data.usuario) return
    const u = data.usuario
    document.getElementById("nombreUsuario").textContent = u.usuario
    document.getElementById("imgPerro").src = rutaSkin(u.skinseleccionada)
    document.getElementById("skinTexto").textContent = `Skin: ${u.skinseleccionada}`
    document.getElementById("mailUsuario").textContent = u.mail || "—"
    document.getElementById("cumple").textContent = u.fecha || "—"
    document.getElementById("fechaPerfil").textContent = u.fechadecreacion || "—"
    const { activas, total } = contarSkins(u.skins || {})
    document.getElementById("skinsCantidad").textContent = `${activas}/${total}`
    const { hechos, total: totalLogros } = contarLogros(u.logros || {})
    document.getElementById("logrosCompletados").textContent = `${hechos}/${totalLogros}`
    document.getElementById("rachaLarga").textContent = `${u.rachamaslarga || 0} días`
    pintarCalendario(u.rachaactual || 0)
    setLogrosDestacados(u.logros || {})
  })

  postEvent("devolverobjetivos", { idusuario }, (data) => {
    if (data && data.objok && Array.isArray(data.objetivos))
      document.getElementById("totalObjetivos").textContent = data.objetivos.length
  })
}

document.getElementById("btnCambiarNombre").addEventListener("click", () => {
  const nuevousuario = prompt("Nuevo nombre de usuario:")
  if (!nuevousuario) return
  postEvent("modificarusuario", { idusuario, nuevousuario }, (data) => {
    if (data && data.objok)
      document.getElementById("nombreUsuario").textContent = data.usuario
  })
})

document.getElementById("btnMail").addEventListener("click", () => {
  const nuevomail = prompt("Nuevo e-mail:")
  if (!nuevomail) return
  postEvent("modificarmail", { idusuario, nuevomail }, (data) => {
    if (data && data.objok)
      document.getElementById("mailUsuario").textContent = data.mail
  })
})

document.getElementById("btnFecha").addEventListener("click", () => {
  const nuevafecha = prompt("Nuevo cumpleaños (DD/MM/AAAA):")
  if (!nuevafecha) return
  postEvent("modificarfecha", { idusuario, nuevafecha }, (data) => {
    if (data && data.objok)
      document.getElementById("cumple").textContent = data.fecha
  })
})

cargarPerfil()