document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000)

  const menuBtn = document.getElementById("menuBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  const btnCerrarSesion = document.getElementById("btnCerrarSesion")

  menuBtn?.addEventListener("click", () => {
    sidebar.classList.toggle("open")
    overlay.classList.toggle("show")
  })
  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open")
    overlay.classList.remove("show")
  })
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("idusuario")
    localStorage.removeItem("usuario")
    window.location.href = "../Login/indexLogin.html?logout=1"
  })

  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
  if (!idusuario) {
    window.location.href = "../InicioSesion/IndexInicioSesion.html?force=1"
    return
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
    }
    return `../imagenes/Imagenesheader/${mapa[clave] || "SUKI.png"}`
  }

  const setHeader = (nombre, skin, dinero) => {
    const elNombre = document.getElementById("nombreHeader")
    const elImg = document.getElementById("imgHeaderSkin")
    const plata = document.getElementById("plataHeaderValor")
    if (elNombre) elNombre.textContent = nombre || "Usuario"
    if (elImg) elImg.src = rutaIconoHeader(skin)
    if (plata) plata.textContent = dinero ?? 0
  }

  postEvent("devolverusuario", { idusuario }, (data) => {
    if (!data?.objok || !data.usuario) return
    const u = data.usuario
    setHeader(u.usuario, u.skinseleccionada, u.dinero)
    localStorage.setItem("usuario", JSON.stringify({ usuario: u.usuario }))
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

  document.getElementById("btnSiguienteSeleccion").addEventListener("click", () => {
    const titulo = nombreObjetivo.value.trim()
    const tipo = tipoObjetivo.value
    if (!titulo || !tipo) {
      alert("Completá todos los campos antes de continuar")
      return
    }
    if (tipo === "tiempo") {
      formSeleccion.classList.add("oculto")
      formTiempo.classList.remove("oculto")
    } else if (tipo === "accion") {
      formSeleccion.classList.add("oculto")
      formAccion.classList.remove("oculto")
    }
  })

  document.getElementById("btnSiguienteTiempo").addEventListener("click", () => {
    const valor = String(duracionTiempo.value || "").trim()
    if (!valor) {
      alert("Por favor completá la duración del objetivo")
      return
    }
    formTiempo.classList.add("oculto")
    menuDisenio.classList.remove("oculto")
  })

  document.getElementById("btnSiguienteAccion").addEventListener("click", () => {
    const valor = String(descripcionAccion.value || "").trim()
    if (!valor) {
      alert("Por favor completá la cantidad de veces")
      return
    }
    formAccion.classList.add("oculto")
    menuDisenio.classList.remove("oculto")
  })

  document.querySelectorAll(".volver").forEach((b) => {
    b.addEventListener("click", () => {
      formSeleccion.classList.remove("oculto")
      formTiempo.classList.add("oculto")
      formAccion.classList.add("oculto")
      menuDisenio.classList.add("oculto")
    })
  })

  document.querySelector(".listo").addEventListener("click", () => {
    const titulo = nombreObjetivo.value.trim()
    const tipodeobjetivo = tipoObjetivo.value
    if (!titulo || !tipodeobjetivo) {
      alert("Completá el nombre y el tipo de objetivo")
      return
    }
    if (!colorObjetivo.value) {
      alert("Seleccioná un color para tu objetivo")
      return
    }

    let tiempo = null
    let veces = null
    if (tipodeobjetivo === "tiempo") {
      const n = Number(duracionTiempo.value)
      if (!Number.isFinite(n) || n <= 0) {
        alert("Ingresá una duración válida en minutos")
        return
      }
      tiempo = n
    } else if (tipodeobjetivo === "accion") {
      const n = Number(descripcionAccion.value)
      if (!Number.isFinite(n) || n <= 0) {
        alert("Ingresá una cantidad válida de veces")
        return
      }
      veces = n
    }

    const icono = ""
    const color = colorObjetivo.value

    postEvent(
      "crearobjetivo",
      { idusuario, titulo, tipodeobjetivo, tiempo, veces, icono, color },
      (res) => {
        if (res?.objok?.ok) {
          window.location.href = "../menu principal/indexMenuPrincipal.html"
        } else {
          alert("No se pudo crear el objetivo")
        }
      }
    )
  })
})
