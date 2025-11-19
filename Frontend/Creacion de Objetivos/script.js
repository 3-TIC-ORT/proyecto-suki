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

  document.getElementById("btnCerrarSesion")?.addEventListener("click", () => {
    localStorage.removeItem("idusuario")
    localStorage.removeItem("usuario")
    window.location.href = "../InicioSesion/IndexInicioSesion.html?logout=1"
  })

  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
  const idobjetivo = JSON.parse(localStorage.getItem("idObjetivo") || "null")
  const modoEdicion = localStorage.getItem("modoEdicionObjetivo") === "1"

  if (!idusuario) {
    window.location.href = "../Login/indexLogin.html?force=1"
    return
  }

  const nombreHeader = document.getElementById("nombreHeader")
  const imgHeaderSkin = document.getElementById("imgHeaderSkin")
  const plataHeader = document.getElementById("plataHeaderValor")

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
      minecraft: "minecraft",
      bikini: "bikini"
    }
    const n = mapa[clave] || "SUKI"
    return `../imagenes/Imagenesheader/${n}.png`
  }

  function setHeader(u) {
    if (nombreHeader) nombreHeader.textContent = u.usuario || "usuario"
    if (imgHeaderSkin) imgHeaderSkin.src = rutaIconoHeader(u.skinseleccionada)
    if (plataHeader) plataHeader.textContent = String(u.dinero ?? 0)
  }

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (r?.objok && r.usuario) setHeader(r.usuario)
  })

  const formSeleccion = document.getElementById("form-seleccion")
  const formTiempo = document.getElementById("form-tiempo")
  const formAccion = document.getElementById("form-accion")
  const menuDisenio = document.getElementById("menu-disenio")
  const nombreObjetivo = document.getElementById("nombreObjetivo")
  const tipoObjetivo = document.getElementById("tipoObjetivo")
  const duracionTiempo = document.getElementById("duracionTiempo")
  const descripcionAccion = document.getElementById("descripcionAccion")
  const colorObjetivo = document.getElementById("colorObjetivo")

  let objetivoEnEdicion = null

  if (modoEdicion && idobjetivo) {
    formSeleccion.classList.add("oculto")
    formTiempo.classList.add("oculto")
    formAccion.classList.add("oculto")
    menuDisenio.classList.remove("oculto")

    postEvent("devolverobjetivos", { idusuario }, (res) => {
      const lista = Array.isArray(res?.objetivos) ? res.objetivos : []
      objetivoEnEdicion = lista.find((o) => o?.idobjetivo === idobjetivo) || null
      if (objetivoEnEdicion && colorObjetivo) {
        if (objetivoEnEdicion.color) colorObjetivo.value = objetivoEnEdicion.color
      }
    })
  }

  document.getElementById("btnSiguienteSeleccion").addEventListener("click", () => {
    if (modoEdicion) return
    if (nombreObjetivo.value.trim() === "" || tipoObjetivo.value === "") {
      alert("Completá todos los campos antes de continuar")
      return
    }
    if (tipoObjetivo.value === "tiempo") {
      formSeleccion.classList.add("oculto")
      formTiempo.classList.remove("oculto")
    } else if (tipoObjetivo.value === "accion") {
      formSeleccion.classList.add("oculto")
      formAccion.classList.remove("oculto")
    }
  })

  document.getElementById("btnSiguienteTiempo").addEventListener("click", () => {
    if (modoEdicion) return
    if (duracionTiempo.value.trim() === "") {
      alert("Por favor completá la duración del objetivo")
      return
    }
    formTiempo.classList.add("oculto")
    menuDisenio.classList.remove("oculto")
  })

  document.getElementById("btnSiguienteAccion").addEventListener("click", () => {
    if (modoEdicion) return
    if (descripcionAccion.value.trim() === "") {
      alert("Por favor describí tu acción")
      return
    }
    formAccion.classList.add("oculto")
    menuDisenio.classList.remove("oculto")
  })

  document.querySelectorAll(".volver").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (modoEdicion) return
      formSeleccion.classList.remove("oculto")
      formTiempo.classList.add("oculto")
      formAccion.classList.add("oculto")
      menuDisenio.classList.add("oculto")
    })
  })

  document.querySelectorAll(".listo").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!colorObjetivo.value) {
        alert("Seleccioná un color para tu objetivo")
        return
      }

      if (modoEdicion && idobjetivo) {
        const nuevocolor = colorObjetivo.value
        const nuevoicono = objetivoEnEdicion ? objetivoEnEdicion.icono : null
        postEvent(
          "nuevodiseño",
          { idobjetivo, nuevoicono, nuevocolor },
          (data) => {
            if (data?.objok?.ok || data?.objok) {
              localStorage.removeItem("modoEdicionObjetivo")
              window.location.href = "../Objetivo Accion/indexObjetivoAccion.html"
              window.location.href = "../Objetivo tiempo/indexObjetivoTiempo.html"
            } else {
              alert("No se pudo actualizar el objetivo")
            }
          }
        )
        return
      }

      const titulo = nombreObjetivo.value.trim()
      const tipodeobjetivo = tipoObjetivo.value
      if (!titulo || !tipodeobjetivo) {
        alert("Completá todos los campos")
        return
      }

      let tiempo = null
      let veces = null
      let icono = null
      const color = colorObjetivo.value

      if (tipodeobjetivo === "tiempo") {
        const n = Number(duracionTiempo.value)
        if (Number.isNaN(n) || n <= 0) {
          alert("Indicá una duración válida en minutos")
          return
        }
        tiempo = n
      } else if (tipodeobjetivo === "accion") {
        const v = descripcionAccion.value.trim()
        const n = Number(v)
        veces = Number.isNaN(n) ? v : n
      }
      

      postEvent(
        "crearobjetivo",
        { idusuario, titulo, tipodeobjetivo, tiempo, veces, icono, color },
        (data) => {
          if (data?.objok) {
            window.location.href = "../menu principal/indexMenuPrincipal.html"
          } else {
            alert("No se pudo crear el objetivo.")
          }
        }
      )
    })
  })
})
