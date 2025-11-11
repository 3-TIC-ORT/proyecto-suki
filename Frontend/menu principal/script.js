document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000)

  const menuBtn = document.getElementById("menuBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  const estadoVacio = document.getElementById("estadoVacio")
  const listaObjetivos = document.getElementById("listaObjetivos")
  const cont = document.getElementById("objetivos")

  menuBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("open")
    overlay.classList.toggle("show")
  })
  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open")
    overlay.classList.remove("show")
  })

  const btnCerrarSesion = document.getElementById("btnCerrarSesion")
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("idusuario")
    localStorage.removeItem("usuario")
    window.location.href = "..//InicioSesion/IndexInicioSesion.html?logout=1"
  })

  const rawId = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof rawId === "number" ? rawId : rawId?.idusuario ?? null
  if (!idusuario) {
    window.location.href = "../Login/indexLogin.html?force=1"
    return
  }

  const cacheUsuario = JSON.parse(localStorage.getItem("usuario") || "null")
  const nombreHeader = document.getElementById("nombreHeader") || document.querySelector(".nombre-usuario")
  if (nombreHeader) {
    const nombreCache = cacheUsuario?.usuario || cacheUsuario?.nombre || "usuario"
    nombreHeader.textContent = nombreCache
  }

  const rutaIconoHeader = (clave) => {
    const mapa = {
      suki: "SUKI",
      trump: "TRUMP",
      rabino: "rabino",
      oro: "oro",
      flash: "FLASH",
      turro: "TURRO",
      sullivan: "solivan",
      bizarrap: "BzRP",
      minecraft: "minecraft"
    }
    const nombre = mapa[clave] || "SUKI"
    return `../imagenes/Imagenesheader/${encodeURIComponent(nombre)}.png`
  }

  const setPlataHeader = (n) => {
    const caja = document.getElementById("plataHeaderValor")
    if (caja) caja.textContent = String(n ?? 0)
  }

  function cargarHeader() {
    postEvent("devolverusuario", { idusuario }, (data) => {
      if (!data?.objok || !data.usuario) return
      const u = data.usuario
      if (nombreHeader) nombreHeader.textContent = u.usuario || "usuario"
      const imgHeader = document.getElementById("imgHeaderSkin") || document.querySelector(".foto-perfil img")
      if (imgHeader) imgHeader.src = rutaIconoHeader(u.skinseleccionada)
      setPlataHeader(u.dinero || 0)
      localStorage.setItem("usuario", JSON.stringify({ usuario: u.usuario }))
    })
  }

  const rutasPorTipo = {
    accion: "../Objetivo Accion/indexObjetivoAccion.html",
    tiempo: "../Objetivo Tiempo/indexObjetivoTiempo.html"
  }

  function appendObjetivoCard(obj) {
    const card = document.createElement("button")
    card.type = "button"
    card.className = "objetivo-card"
    card.textContent = obj?.titulo || obj?.nombre || "Objetivo"
    const tipo = (obj?.tipodeobjetivo || obj?.tipo || "").toLowerCase()
    const destino = rutasPorTipo[tipo]
    if (destino) {
      card.addEventListener("click", () => {
        if (obj?.idobjetivo) localStorage.setItem("idObjetivo", obj.idobjetivo)
        window.location.href = destino
      })
    } else {
      card.disabled = true
    }
    cont.appendChild(card)
  }

  function cargarObjetivos() {
    postEvent("devolverobjetivos", { idusuario }, (res) => {
      const objetivos = Array.isArray(res?.objetivos) ? res.objetivos : []
      if (!objetivos.length) {
        estadoVacio?.classList.remove("oculto")
        listaObjetivos?.classList.add("oculto")
        return
      }
      estadoVacio?.classList.add("oculto")
      listaObjetivos?.classList.remove("oculto")
      cont.innerHTML = ""
      objetivos.forEach((obj) => {
        if (obj && typeof obj === "object") appendObjetivoCard(obj)
      })
    })
  }

  cargarHeader()
  cargarObjetivos()
})
nod