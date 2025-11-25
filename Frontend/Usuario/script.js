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
    window.location.href = "../InicioSesion/IndexInicioSesion.html?logout=1"
  })

  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
  const nombreGuardado =
    (typeof sesion === "object" && sesion?.nombre) ||
    JSON.parse(localStorage.getItem("usuario") || "{}")?.usuario ||
    "Usuario"

  if (!idusuario) {
    window.location.href = "../InicioSesion/IndexInicioSesion.html?force=1"
    return
  }

  const hoy = new Date()
  const hoyISO = hoy.toISOString().slice(0, 10)
  const anio = hoy.getFullYear()
  const mes = hoy.getMonth()
  const diasMes = new Date(anio, mes + 1, 0).getDate()

  const modalOverlay = document.getElementById("modalOverlay")
  const modalTitulo = document.getElementById("modalTitulo")
  const modalInput = document.getElementById("modalInput")
  const modalCancelar = document.getElementById("modalCancelar")
  const modalAceptar = document.getElementById("modalAceptar")
  const modalError = document.getElementById("modalError")

  const modalFechaOverlay = document.getElementById("modalFechaOverlay")
  const modalFechaInput = document.getElementById("modalFechaInput")
  const modalFechaCancelar = document.getElementById("modalFechaCancelar")
  const modalFechaAceptar = document.getElementById("modalFechaAceptar")

  let modalCallback = null
  let modalFechaCallback = null

  const contarActivos = (o) => Object.values(o || {}).filter(Boolean).length
  const total = (o) => Object.keys(o || {}).length

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
    return `../imagenes/Imagenesheader/${encodeURIComponent(n)}.png`
  }

  const rutaSkin = (clave) => {
    const mapa = {
      suki: "Suki",
      oro: "De oro",
      minecraft: "SALCHICRAFT",
      flash: "salchiflash",
      rabino: "Salchirabino",
      trump: "salchitrump",
      turro: "salchiturro",
      sullivan: "salchivan",
      bizarrap: "BzRP",
      bikini: "bikini"
    }
    const n = mapa[clave] || "Suki"
    return `../imagenes/skins/${encodeURIComponent(n)}.png`
  }

  const setNombreHeader = (nombre) => {
    const el =
      document.getElementById("nombreHeader") ||
      document.querySelector(".nombre-usuario")
    if (el) el.textContent = nombre || "Usuario"
  }

  const setHeaderSkin = (clave) => {
    const img =
      document.getElementById("imgHeaderSkin") ||
      document.querySelector(".foto-perfil img")
    if (img) img.src = rutaIconoHeader(clave)
  }

  const setPlataHeader = (n) => {
    const caja = document.getElementById("plataHeaderValor")
    if (caja) caja.textContent = String(n ?? 0)
  }

  const claveISO = (d) => d.toISOString().slice(0, 10)

  function abrirModalTexto(titulo, valorInicial, tipo, callback) {
    if (!modalOverlay || !modalTitulo || !modalInput || !modalError) return
    modalTitulo.textContent = titulo
    modalInput.type = tipo || "text"
    modalInput.value = valorInicial || ""
    modalError.textContent = ""
    modalCallback = callback
    modalOverlay.classList.add("abierto")
    modalInput.focus()
  }

  function cerrarModalTexto() {
    if (!modalOverlay || !modalInput || !modalError) return
    modalOverlay.classList.remove("abierto")
    modalCallback = null
    modalInput.value = ""
    modalError.textContent = ""
  }

  function abrirModalFecha(valorInicial, callback) {
    if (!modalFechaOverlay || !modalFechaInput) return
    modalFechaInput.value = valorInicial || ""
    modalFechaCallback = callback
    modalFechaOverlay.classList.add("abierto")
    modalFechaInput.focus()
  }

  function cerrarModalFecha() {
    if (!modalFechaOverlay || !modalFechaInput) return
    modalFechaOverlay.classList.remove("abierto")
    modalFechaCallback = null
    modalFechaInput.value = ""
  }

  modalCancelar?.addEventListener("click", () => {
    cerrarModalTexto()
  })

  modalOverlay?.addEventListener("click", (e) => {
    if (e.target === modalOverlay) cerrarModalTexto()
  })

  modalAceptar?.addEventListener("click", () => {
    if (!modalCallback || !modalInput) {
      cerrarModalTexto()
      return
    }
    const valor = modalInput.value.trim()
    modalCallback(valor)
  })

  modalFechaCancelar?.addEventListener("click", () => {
    cerrarModalFecha()
  })

  modalFechaOverlay?.addEventListener("click", (e) => {
    if (e.target === modalFechaOverlay) cerrarModalFecha()
  })

  modalFechaAceptar?.addEventListener("click", () => {
    if (!modalFechaCallback || !modalFechaInput) {
      cerrarModalFecha()
      return
    }
    const valor = modalFechaInput.value
    modalFechaCallback(valor)
  })

  function pintarCalendarioUsuario(racha, ultimoISO) {
    const cont = document.getElementById("calendarioDias")
    if (!cont) return

    const inicioMes = new Date(anio, mes, 1)
    const offset = (inicioMes.getDay() + 6) % 7
    const setRacha = new Set()

    if (racha && ultimoISO) {
      const base = new Date(ultimoISO + "T00:00:00")
      for (let i = 0; i < Number(racha); i++) {
        const d = new Date(base)
        d.setDate(d.getDate() - i)
        setRacha.add(claveISO(d))
      }
    }

    cont.innerHTML = ""

    for (let i = 0; i < offset; i++) {
      const vacio = document.createElement("div")
      cont.appendChild(vacio)
    }

    for (let d = 1; d <= diasMes; d++) {
      const celda = document.createElement("div")
      celda.className = "dia"
      const iso = new Date(anio, mes, d).toISOString().slice(0, 10)

      if (setRacha.has(iso)) {
        celda.classList.add("dia-racha")
      }

      if (iso === hoyISO) {
        celda.classList.add("dia-hoy")
      }

      cont.appendChild(celda)
    }
  }

  const setLogrosDestacados = (logrosObj) => {
    const claves = ["racha3", "racha7", "coleccionista", "ganador"]
    const nombres = {
      racha3: "Racha 3",
      racha7: "Racha 7",
      coleccionista: "Coleccionista",
      ganador: "Ganador"
    }
    claves.forEach((k, i) => {
      const c = document.getElementById(`logro${i + 1}`)
      if (!c) return
      const hecho = !!(logrosObj && logrosObj[k])
      c.innerHTML = `
        <img src="../imagenes/Frame 71.png" alt="trofeo" class="Iconologro">
        <p>${nombres[k]}</p>
        <small>${hecho ? "Completado" : "Pendiente"}</small>
      `
      c.classList.toggle("hecho", hecho)
    })
  }

function cargarPerfil() {
  postEvent("devolverusuario", { idusuario }, (data) => {
    if (!data?.objok || !data.usuario) return
    const u = data.usuario

    setNombreHeader(u.usuario)
    setHeaderSkin(u.skinseleccionada)
    setPlataHeader(u.dinero || 0)

    const elNombre = document.getElementById("nombreUsuario")
    const elMail = document.getElementById("mailUsuario")
    const elObjetivo = document.getElementById("totalObjetivos")
    const elCumple = document.getElementById("cumple")
    const elFechaPerf = document.getElementById("fechaPerfil")
    const elSkinsCant = document.getElementById("skinsCantidad")
    const elSkinTxt = document.getElementById("skinTexto")
    const elPerro = document.getElementById("imgPerro")
    const elLogrosComp = document.getElementById("logrosCompletados")
    const elRachaLarga = document.getElementById("rachaLarga")
    const elRachaActual = document.getElementById("rachaActual")

    if (elNombre) elNombre.textContent = u.usuario
    if (elMail) elMail.textContent = u.mail || "—"
    if (elCumple) elCumple.textContent = u.fecha || "—"
    if (elFechaPerf) elFechaPerf.textContent = u.fechadecreacion || "—"
    if (elSkinsCant)
      elSkinsCant.textContent = `${contarActivos(u.skins)}/${total(u.skins)}`
    if (elSkinTxt) elSkinTxt.textContent = `Skin: ${u.skinseleccionada}`
    if (elPerro) elPerro.src = rutaSkin(u.skinseleccionada)
    if (elLogrosComp)
      elLogrosComp.textContent = `${contarActivos(u.logros)}/${total(u.logros)}`

    const rachaUsuario = u.rachaactualusuario ?? u.rachaactual ?? 0
    const ultimaUsuario =
      u.ultimodiaderachausuario ?? u.ultimodiaderacha ?? null

    if (elRachaLarga) {
      const larga = u.rachamaslargausuario ?? u.rachamaslarga ?? 0
      elRachaLarga.textContent = `${larga} días`
    }

    if (elRachaActual) {
      elRachaActual.textContent = `Racha actual: ${rachaUsuario} Días`
    }

    if (elObjetivo) {
      elObjetivo.textContent = `${u.cantidadobjetivoscreados ?? u.objetivoscompletados ?? 0}`
    }

    pintarCalendarioUsuario(rachaUsuario, ultimaUsuario)
    setLogrosDestacados(u.logros)
  })
}


  const btnCambiarNombre = document.getElementById("btnCambiarNombre")
  const btnMail = document.getElementById("btnMail")
  const btnFecha = document.getElementById("btnFecha")

  btnCambiarNombre?.addEventListener("click", () => {
    const elNombre = document.getElementById("nombreUsuario")
    const actual = (elNombre?.textContent || "").trim()
    abrirModalTexto("Modificar nombre", actual, "text", (nuevo) => {
      const v = (nuevo || "").trim()
      if (!v) {
        if (modalError) modalError.textContent = "El nombre no puede estar vacío"
        return
      }
      postEvent("modificarusuario", { idusuario, nuevousuario: v }, (resp) => {
        if (!resp?.objok?.ok) return
        const nombreFinal = resp.usuario || v
        if (elNombre) elNombre.textContent = nombreFinal
        setNombreHeader(nombreFinal)
        const guardado =
          typeof sesion === "number" ? { idusuario } : { idusuario, nombre: nombreFinal }
        localStorage.setItem("idusuario", JSON.stringify(guardado))
        cerrarModalTexto()
      })
    })
  })

  btnMail?.addEventListener("click", () => {
    const elMail = document.getElementById("mailUsuario")
    const actual = (elMail?.textContent || "").trim()
    const inicial = actual === "—" ? "" : actual
    abrirModalTexto("Modificar e-mail", inicial, "email", (nuevo) => {
      const v = (nuevo || "").trim()
      if (!v || !v.endsWith("@gmail.com")) {
        if (modalError) modalError.textContent = "El e-mail debe terminar en @gmail.com"
        return
      }
      postEvent("modificarmail", { idusuario, nuevomail: v }, (resp) => {
        if (!resp?.objok?.ok) return
        if (elMail) elMail.textContent = resp.mail || v
        cerrarModalTexto()
      })
    })
  })

  btnFecha?.addEventListener("click", () => {
    const elCumple = document.getElementById("cumple")
    const actualTexto = (elCumple?.textContent || "").trim()
    const inicial = actualTexto === "—" ? "" : actualTexto
    abrirModalFecha(inicial, (nuevaFecha) => {
      const v = nuevaFecha || ""
      if (!v) {
        cerrarModalFecha()
        return
      }
      postEvent("modificarfecha", { idusuario, nuevafecha: v }, (resp) => {
        if (!resp?.objok?.ok) return
        if (elCumple) elCumple.textContent = resp.fecha || v
        cerrarModalFecha()
      })
    })
  })

  window.actualizarHeaderDesdeServidor = () => {
    postEvent("devolverusuario", { idusuario }, (d) => {
      if (!d?.objok || !d.usuario) return
      setNombreHeader(d.usuario.usuario)
      setHeaderSkin(d.usuario.skinseleccionada)
      setPlataHeader(d.usuario.dinero || 0)
    })
  }

  window.equiparSkin = (clave) => {
    postEvent("nuevaskinelegida", { idusuario, nuevaskin: clave }, (r) => {
      if (!r?.objok?.ok) return
      setHeaderSkin(r.skindelusuario || clave)
      window.actualizarHeaderDesdeServidor()
    })
  }

  setNombreHeader(nombreGuardado)
  cargarPerfil()
})
