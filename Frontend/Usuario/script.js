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


  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("idusuario");
    localStorage.removeItem("usuario");
    window.location.href = "../InicioSesion/IndexInicioSesion.html?logout=1";
  });


  const raw = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof raw === "number" ? raw : raw?.idusuario ?? null
  const nombreGuardado =
    (typeof raw === "object" && raw?.nombre) ||
    JSON.parse(localStorage.getItem("usuario") || "{}")?.usuario ||
    "Usuario"

  if (!idusuario) {
    window.location.href = "../InicioSesion/IndexInicioSesion.html?force=1"
    return
  }

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
    const nombre = mapa[clave] || "SUKI"
    return `../imagenes/Imagenesheader/${encodeURIComponent(nombre)}.png`
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
    const nombre = mapa[clave] || "Suki"
    return `../imagenes/skins/${encodeURIComponent(nombre)}.png`
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

  function pintarCalendarioUsuario(racha, ultimoISO) {
    const cont = document.getElementById("calendarioDias")
    if (!cont) return

    const hoy = new Date()
    const hoyISO = claveISO(hoy)
    const anio = hoy.getFullYear()
    const mes = hoy.getMonth()
    const diasMes = new Date(anio, mes + 1, 0).getDate()
    const inicioMes = new Date(anio, mes, 1)
    const offset = inicioMes.getDay() // 0 = Domingo

    const setRacha = new Set()
    if (racha && ultimoISO) {
      const base = new Date(ultimoISO + "T00:00:00")
      const n = Number(racha || 0)
      for (let i = 0; i < n; i++) {
        const d = new Date(base)
        d.setDate(d.getDate() - i)
        setRacha.add(claveISO(d))
      }
    }

    cont.innerHTML = ""

    for (let i = 0; i < offset; i++) {
      const e = document.createElement("div")
      e.className = "punto vacio"
      cont.appendChild(e)
    }

    for (let d = 1; d <= diasMes; d++) {
      const fecha = new Date(anio, mes, d)
      const iso = claveISO(fecha)

      let el
      if (setRacha.has(iso)) {
        el = document.createElement("div")
        el.className = "fuego"
        el.textContent = "🔥"
      } else {
        el = document.createElement("div")
        el.className = "punto"
      }

      if (iso === hoyISO && !setRacha.has(iso)) {
        el.classList.add("hoy")
      }

      cont.appendChild(el)
    }

    const num = Number(racha || 0)
    const ley = document.getElementById("rachaActual")
    if (ley)
      ley.innerHTML = `Racha actual: <span>${num} Día${
        num === 1 ? "" : "s"
      }</span>`
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
      if (elRachaLarga)
        elRachaLarga.textContent = `${u.rachamaslarga || 0} días`

      if (elObjetivo) {
        const obj = data.objetivoactual
        if (obj) {
          elObjetivo.textContent = `${data.descripcion} (${data.progreso || 0}/${
            data.meta || 0
          })`
        } else {
          elObjetivo.textContent = "Ninguno"
        }
      }

      pintarCalendarioUsuario(u.rachaactual || 0, u.ultimodiaderacha || null)
      setLogrosDestacados(u.logros)
    })
  }

  const btnCambiarNombre = document.getElementById("btnCambiarNombre")
  const btnMail = document.getElementById("btnMail")
  const btnFecha = document.getElementById("btnFecha")

  btnCambiarNombre?.addEventListener("click", () => {
    const actual =
      (document.getElementById("nombreUsuario")?.textContent || "").trim()
    const nuevo = prompt("Nuevo nombre de usuario:", actual)
    if (!nuevo) return
    postEvent("modificarusuario", { idusuario, nuevousuario: nuevo }, (resp) => {
      if (!resp?.objok?.ok) return
      const v = resp.usuario || nuevo
      const elNombre = document.getElementById("nombreUsuario")
      if (elNombre) elNombre.textContent = v
      setNombreHeader(v)
      const guardado =
        typeof raw === "number" ? { idusuario } : { idusuario, nombre: v }
      localStorage.setItem("idusuario", JSON.stringify(guardado))
    })
  })

  btnMail?.addEventListener("click", () => {
    const actual =
      (document.getElementById("mailUsuario")?.textContent || "").trim()
    const nuevo = prompt("Nuevo e-mail:", actual === "—" ? "" : actual)
    if (!nuevo) return
    postEvent("modificarmail", { idusuario, nuevomail: nuevo }, (resp) => {
      if (!resp?.objok?.ok) return
      const elMail = document.getElementById("mailUsuario")
      if (elMail) elMail.textContent = resp.mail || nuevo
    })
  })

  btnFecha?.addEventListener("click", () => {
    const actual =
      (document.getElementById("cumple")?.textContent || "").trim()
    const nuevo = prompt("Nueva fecha (YYYY-MM-DD):", actual === "—" ? "" : actual)
    if (!nuevo) return
    postEvent("modificarfecha", { idusuario, nuevafecha: nuevo }, (resp) => {
      if (!resp?.objok?.ok) return
      const elCumple = document.getElementById("cumple")
      if (elCumple) elCumple.textContent = resp.fecha || nuevo
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

  const btnCerrarSesion = document.getElementById("btnCerrarSesion")
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("idusuario")
    localStorage.removeItem("usuario")
    window.location.href = "../Login/indexLogin.html?logout=1"
  })

  setNombreHeader(nombreGuardado)
  cargarPerfil()
})
