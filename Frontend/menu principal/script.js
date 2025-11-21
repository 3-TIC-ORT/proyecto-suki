document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000)

  const menuBtn = document.getElementById("menuBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")

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
    window.location.href = "../InicioSesion/IndexInicioSesion.html?logout=1"
  })

  const rawId = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof rawId === "number" ? rawId : rawId?.idusuario ?? null
  if (!idusuario) {
    window.location.href = "../InicioSesion/IndexInicioSesion.html?force=1"
    return
  }

  const nombreHeader = document.getElementById("nombreHeader") || document.querySelector(".nombre-usuario")
  const imgHeader = document.getElementById("imgHeaderSkin") || document.querySelector(".foto-perfil img")
  const plataBox = document.getElementById("plataHeaderValor")

  const rutaIconoHeader = (k) => {
    const map = {
      suki: "SUKI",
      trump: "TRUMP",
      rabino: "rabino",
      oro: "oro",
      flash: "FLASH",
      turro: "TURRO",
      sullivan: "solivan",
      bizarrap: "BzRP",
      minecraft: "minecraft",
      bikini: "bikini"
    }
    return `../imagenes/Imagenesheader/${map[k] || "SUKI"}.png`
  }

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (!r?.objok || !r.usuario) return
    const u = r.usuario
    if (nombreHeader) nombreHeader.textContent = u.usuario || "usuario"
    if (imgHeader) imgHeader.src = rutaIconoHeader(u.skinseleccionada)
    if (plataBox) plataBox.textContent = String(u.dinero ?? 0)
    localStorage.setItem("usuario", JSON.stringify({ usuario: u.usuario }))
  })

  const irACrear = () => {
    window.location.href = "../Creacion de Objetivos/IndexCreacionDeObjetivos.html"
  }
  document.getElementById("botonCrear")?.addEventListener("click", irACrear)
  document.getElementById("botonCrearInferior")?.addEventListener("click", irACrear)

  const estadoVacio = document.getElementById("estadoVacio")
  const listaObjetivos = document.getElementById("listaObjetivos")
  const cont = document.getElementById("objetivos")

  const destinoPorTipo = (tipo) => {
    const t = (tipo || "").toLowerCase()
    if (t === "accion") return "../Objetivo Accion/IndexObjetivoAccion.html"
    if (t === "tiempo") return "../Objetivo tiempo/IndexObjetivoTiempo.html"
    return "../Objetivo/indexObjetivo.html"
  }

  const rutaIconoObjetivo = (clave) => {
    if (!clave) return null
    return `../imagenes/Iconos/${clave}.png`
  }

  function appendObjetivoCard(obj) {
    const titulo = obj?.titulo || obj?.nombre || "Objetivo"
    const color = obj?.color || "#000000"
    const idObj = obj?.idobjetivo ?? obj?.idObjetivo
    const iconoClave = obj?.icono || null
    const iconoSrc = rutaIconoObjetivo(iconoClave)

    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = "objetivo-card"
    btn.style.backgroundColor = color

    const imgHtml = iconoSrc
      ? `<img src="${iconoSrc}" alt="" />`
      : ""

    btn.innerHTML = `
      <div class="objetivo-left">
        <span class="bullet">${imgHtml}</span>
        <span class="label">${titulo}</span>
      </div>
      <span class="chevron">›</span>
    `

    btn.addEventListener("click", () => {
      if (idObj) localStorage.setItem("idObjetivo", JSON.stringify(idObj))
      window.location.href = destinoPorTipo(obj?.tipodeobjetivo || obj?.tipo)
    })

    cont.appendChild(btn)
  }

  function cargarObjetivos() {
    postEvent("devolverobjetivos", { idusuario }, (res) => {
      const arr = Array.isArray(res?.objetivos) ? res.objetivos : []
      if (!arr.length) {
        estadoVacio?.classList.remove("oculto")
        listaObjetivos?.classList.add("oculto")
        return
      }
      estadoVacio?.classList.add("oculto")
      listaObjetivos?.classList.remove("oculto")
      cont.innerHTML = ""
      arr.forEach((o) => o && typeof o === "object" && appendObjetivoCard(o))
    })
  }

  cargarObjetivos()
})
