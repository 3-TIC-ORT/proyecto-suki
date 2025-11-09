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

  const raw = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof raw === "number" ? raw : raw?.idusuario ?? null
  const nombreGuardado =
    (typeof raw === "object" && raw?.nombre) ||
    JSON.parse(localStorage.getItem("usuario") || "{}")?.usuario ||
    "Usuario"
  if (!idusuario) {
    window.location.href = "../Login/indexLogin.html?force=1"
    return
  }

  const setNombreHeader = (nombre) => {
    const el = document.querySelector(".nombre-usuario")
    if (el) el.textContent = nombre || "Usuario"
  }
  setNombreHeader(nombreGuardado)

  const contarActivos = (o) => Object.values(o || {}).filter(Boolean).length
  const total = (o) => Object.keys(o || {}).length
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
    }
    const nombre = mapa[clave] || "Suki"
    return `../imagenes/skins/${encodeURIComponent(nombre)}.png`
  }

  const claveISO = (d) => d.toISOString().slice(0, 10)
  const inicioDia = (d) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
  }
  const sumarDias = (d, n) => {
    const x = new Date(d)
    x.setDate(x.getDate() + n)
    return x
  }
  function inicioCuadricula(ultimoISO) {
    const ref = ultimoISO ? new Date(ultimoISO + "T00:00:00") : new Date()
    const fin = inicioDia(ref)
    const domingoFin = sumarDias(fin, -fin.getDay())
    return sumarDias(domingoFin, -3 * 7)
  }
  function armarFechas(ultimoISO) {
    const ini = inicioCuadricula(ultimoISO)
    const out = []
    for (let i = 0; i < 35; i++) {
      if (i < 7) out.push(null)
      else out.push(sumarDias(ini, i - 7))
    }
    return out
  }
  function diasDeRacha(racha, ultimoISO) {
    const set = new Set()
    if (!racha) return set
    const base = inicioDia(
      new Date((ultimoISO || claveISO(new Date())) + "T00:00:00")
    )
    for (let i = 0; i < Number(racha || 0); i++) {
      set.add(claveISO(sumarDias(base, -i)))
    }
    return set
  }
  function pintarCalendarioEstilo(racha, ultimoISO, faltasISO = []) {
    const cont = document.getElementById("calendarioDias")
    if (!cont) return
    const fechas = armarFechas(ultimoISO)
    const setRacha = diasDeRacha(racha, ultimoISO)
    const setFaltas = new Set(faltasISO || [])
    const hoy = claveISO(inicioDia(new Date()))
    cont.innerHTML = ""
    fechas.forEach((d, idx) => {
      const el = document.createElement("div")
      if (d === null) {
        el.className = "punto vacio"
        cont.appendChild(el)
        return
      }
      const iso = claveISO(d)
      const esUltimaFila = idx >= 28
      const enRacha = setRacha.has(iso)
      if (setFaltas.has(iso)) {
        el.className = "punto negro"
      } else if (enRacha && esUltimaFila) {
        el.className = "fuego"
        el.textContent = "🔥"
      } else if (enRacha) {
        el.className = "punto ok"
      } else {
        el.className = "punto"
      }
      if (iso === hoy && !enRacha) {
        el.classList.add("hoy")
      }
      cont.appendChild(el)
    })
    const num = Number(racha || 0)
    const ley = document.getElementById("rachaActual")
    if (ley)
      ley.innerHTML = `Racha actual: <span>${num} Día${num === 1 ? "" : "s"}</span>`
  }

  const setLogrosDestacados = (logrosObj) => {
    const claves = ["racha3", "racha7", "coleccionista", "ganador"]
    const nombres = {
      racha3: "Racha 3",
      racha7: "Racha 7",
      coleccionista: "Coleccionista",
      ganador: "Ganador",
    }
    claves.forEach((k, i) => {
      const c = document.getElementById(`logro${i + 1}`)
      if (!c) return
      const hecho = !!logrosObj[k]
      c.innerHTML = `<img src="../imagenes/Frame 71.png" alt="trofeo"><p>${nombres[k]}</p><small>${hecho ? "Completado" : "Pendiente"}</small>`
      c.classList.toggle("hecho", hecho)
    })
  }

  const cargarPerfil = () => {
    postEvent("devolverusuario", { idusuario }, (data) => {
      if (!data?.objok || !data.usuario) return
      const u = data.usuario
      document.getElementById("nombreUsuario").textContent = u.usuario
      document.getElementById("mailUsuario").textContent = u.mail || "—"
      document.getElementById("cumple").textContent = u.fecha || "—"
      document.getElementById("fechaPerfil").textContent = u.fechadecreacion || "—"
      document.getElementById("skinsCantidad").textContent = `${contarActivos(u.skins)}/${total(u.skins)}`
      document.getElementById("skinTexto").textContent = `Skin: ${u.skinseleccionada}`
      document.getElementById("imgPerro").src = rutaSkin(u.skinseleccionada)
      document.getElementById("logrosCompletados").textContent = `${contarActivos(u.logros)}/${total(u.logros)}`
      document.getElementById("rachaLarga").textContent = `${u.rachamaslarga || 0} días`
      setNombreHeader(u.usuario)
      pintarCalendarioEstilo(u.rachaactual || 0, u.ultimodiaderacha || null, [])
      setLogrosDestacados(u.logros)
    })
  }

  const btnCambiarNombre = document.getElementById("btnCambiarNombre")
  const btnMail = document.getElementById("btnMail")
  const btnFecha = document.getElementById("btnFecha")

  btnCambiarNombre?.addEventListener("click", () => {
    const actual = (document.getElementById("nombreUsuario")?.textContent || "").trim()
    const nuevo = prompt("Nuevo nombre de usuario:", actual)
    if (!nuevo) return
    postEvent("modificarusuario", { idusuario, nuevousuario: nuevo }, (resp) => {
      if (!resp?.objok?.ok) return
      document.getElementById("nombreUsuario").textContent = resp.usuario || nuevo
      setNombreHeader(resp.usuario || nuevo)
      const guardado = typeof raw === "number" ? { idusuario } : { idusuario, nombre: resp.usuario || nuevo }
      localStorage.setItem("idusuario", JSON.stringify(guardado))
    })
  })

  btnMail?.addEventListener("click", () => {
    const actual = (document.getElementById("mailUsuario")?.textContent || "").trim()
    const nuevo = prompt("Nuevo e-mail:", actual === "—" ? "" : actual)
    if (!nuevo) return
    postEvent("modificarmail", { idusuario, nuevomail: nuevo }, (resp) => {
      if (!resp?.objok?.ok) return
      document.getElementById("mailUsuario").textContent = resp.mail || nuevo
    })
  })

  btnFecha?.addEventListener("click", () => {
    const actual = (document.getElementById("cumple")?.textContent || "").trim()
    const nuevo = prompt("Nueva fecha (YYYY-MM-DD):", actual === "—" ? "" : actual)
    if (!nuevo) return
    postEvent("modificarfecha", { idusuario, nuevafecha: nuevo }, (resp) => {
      if (!resp?.objok?.ok) return
      document.getElementById("cumple").textContent = resp.fecha || nuevo
    })
  })

  window.completarobjetivo = (idobjetivo, tipodeobjetivo) => {
    postEvent("completarobjetivo", { idusuario, idobjetivo, tipodeobjetivo }, (resp) => {
      if (!resp?.objok?.ok) return
      const hoyISO = new Date().toISOString().slice(0, 10)
      pintarCalendarioEstilo(resp.racha || 0, hoyISO, [])
      document.getElementById("rachaLarga").textContent = `${resp.rachamaslarga || 0} días`
      if (resp.logros) {
        document.getElementById("logrosCompletados").textContent = `${Object.values(resp.logros).filter(Boolean).length}/${Object.keys(resp.logros).length}`
        setLogrosDestacados(resp.logros)
      }
    })
  }

  const btnCerrarSesion = document.getElementById("btnCerrarSesion")
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
      localStorage.removeItem("idusuario")
      localStorage.removeItem("usuario")
      window.location.href = "../Login/indexLogin.html?logout=1"
    })
  }

  cargarPerfil()
})
