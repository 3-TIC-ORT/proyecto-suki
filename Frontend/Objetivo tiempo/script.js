document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000)

  const menuBtn = document.getElementById("menuBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  const dataEdicion = JSON.parse(localStorage.getItem("objetivoEnEdicion") || "null")

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
    window.location.href = "../cuenta/IndexcuentaI.html?logout=1";
  })

  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
  const idobjetivo = JSON.parse(localStorage.getItem("idObjetivo") || "null")

  if (!idusuario) {
    window.location.href = "../InicioSesion/indexInicioSesion.html?force=1"
    return
  }
  if (!idobjetivo) {
    window.location.href = "../menu principal/indexMenuPrincipal.html"
    return
  }

  const hoyISO = new Date().toISOString().slice(0, 10)
  const keyUltima = `ultimaComplecion_${idobjetivo}`
  let ultimaComplecion = localStorage.getItem(keyUltima) || null
  let bloqueadoHoy = false

  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()
  const diasMes = new Date(anio, mes + 1, 0).getDate()

  const keyDias = `diasCompletados_${idusuario}_${idobjetivo}_${anio}-${String(
    mes + 1
  ).padStart(2, "0")}`
  const keyTimer = `timerTiempo_${idusuario}_${idobjetivo}`

  let diasCompletadosSet = new Set(JSON.parse(localStorage.getItem(keyDias) || "[]"))
  let diasCompletadosMes = 0

  const nombreHeader = document.getElementById("nombreHeader")
  const imgHeaderSkin = document.getElementById("imgHeaderSkin")
  const plataHeader = document.getElementById("plataHeaderValor")
  const hero = document.getElementById("heroObjetivo")
  const heroPerro = document.querySelector(".hero-perro")
  const estadoCirculo = document.getElementById("estadoCirculo")
  const puntosProgreso = document.getElementById("puntosProgreso")
  const calendario = document.getElementById("calendario")
  const totalCompletado = document.getElementById("totalCompletado")
  const rachaActualNum = document.getElementById("rachaActualNum")
  const rachaLarga = document.getElementById("rachaLarga")
  const btnBorrar = document.getElementById("btnBorrar")
  const btnEditar = document.getElementById("btnEditar")
  const leyendaOk = document.querySelector(".leyenda-torta .ok")
  const leyendaPend = document.querySelector(".leyenda-torta .pend")
  const tituloObjetivo = document.getElementById("tituloObjetivo")

  let metaPorDia = 4
  let progresoHoy = 0

  let colorCompletados = "#ffcc00"
  let colorPendientes = "#ff383c"

  let timerTotalSegundos = 0
  let timerRestante = 0
  let timerId = null
  let timerEnMarcha = false

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

  const rutaHeroSkin = (clave) => {
    const mapa = {
      suki: "Suki",
      trump: "salchitrump",
      rabino: "salchirabino",
      oro: "de oro",
      flash: "salchiflash",
      turro: "salchiturro",
      sullivan: "salchivan",
      bizarrap: "Bzrp",
      minecraft: "SALCHICRAFT",
      bikini: "bikini"
    }
    const n = mapa[clave] || "Suki"
    return `../imagenes/skins/${n}.png`
  }

  function setHeader(u) {
    if (nombreHeader) nombreHeader.textContent = u.usuario || "usuario"
    if (imgHeaderSkin) imgHeaderSkin.src = rutaIconoHeader(u.skinseleccionada)
    if (plataHeader) plataHeader.textContent = String(u.dinero ?? 0)
    if (heroPerro) heroPerro.src = rutaHeroSkin(u.skinseleccionada)
  }

  function parseTiempoToSegundos(t) {
    if (!t) return 0
    if (typeof t === "number") return t * 60
    const str = String(t).trim()
    if (!str) return 0
    if (str.includes(":")) {
      const partes = str.split(":")
      const m = Number(partes[0]) || 0
      const s = Number(partes[1]) || 0
      return m * 60 + s
    }
    const m = Number(str)
    if (Number.isNaN(m)) return 0
    return m * 60
  }

  function formatearSegundos(seg) {
    const total = Math.max(0, seg | 0)
    const m = Math.floor(total / 60)
    const s = total % 60
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  const ctx = document.getElementById("graficoProgreso").getContext("2d")
  const grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Completados", "Pendientes"],
      datasets: [
        {
          data: [diasCompletadosMes, diasMes - diasCompletadosMes],
          backgroundColor: [colorCompletados, colorPendientes]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  })

  function aplicarColoresPie() {
    grafico.data.datasets[0].backgroundColor = [colorCompletados, colorPendientes]
    grafico.update()
    if (leyendaOk) leyendaOk.style.color = colorCompletados
    if (leyendaPend) leyendaPend.style.color = colorPendientes
  }

  function setHeroColor(hex) {
    const c = hex || "#ffcc00"
    if (hero) hero.style.background = c
    colorCompletados = c
    aplicarColoresPie()
  }

  function construirPuntos() {
    puntosProgreso.innerHTML = ""
    progresoHoy = 0
    for (let i = 0; i < metaPorDia; i++) {
      const p = document.createElement("div")
      p.className = "punto"
      if (bloqueadoHoy) p.classList.add("activo")
      puntosProgreso.appendChild(p)
    }
    if (bloqueadoHoy) {
      estadoCirculo.textContent = "Completado"
      estadoCirculo.classList.add("disabled")
    } else {
      const esTiempo = hero.classList.contains("modo-tiempo")
      if (!esTiempo) estadoCirculo.textContent = "Completar"
      estadoCirculo.classList.remove("disabled")
    }
  }

  function pintarCalendario(racha, ultimoISO, diasSet = diasCompletadosSet) {
    const inicioMes = new Date(anio, mes, 1)
    const setRacha = new Set()
    if (racha && ultimoISO) {
      const base = new Date(ultimoISO + "T00:00:00")
      for (let i = 0; i < Number(racha || 0); i++) {
        const d = new Date(base)
        d.setDate(d.getDate() - i)
        setRacha.add(d.toISOString().slice(0, 10))
      }
    }

    calendario.innerHTML = ""
    const offset = (inicioMes.getDay() + 6) % 7
    for (let i = 0; i < offset; i++) {
      const e = document.createElement("div")
      calendario.appendChild(e)
    }

    for (let d = 1; d <= diasMes; d++) {
      const celda = document.createElement("div")
      celda.className = "dia"
      const iso = new Date(anio, mes, d).toISOString().slice(0, 10)

      if (setRacha.has(iso)) {
        celda.classList.add("dia-racha")
      } else if (diasSet && diasSet.has(iso)) {
        celda.classList.add("dia-normal")
      }

      calendario.appendChild(celda)
    }
  }

  function manejarRespuestaCompletar(r) {
    const isoHoy = hoyISO

    if (!diasCompletadosSet.has(isoHoy)) {
      diasCompletadosSet.add(isoHoy)
      localStorage.setItem(keyDias, JSON.stringify([...diasCompletadosSet]))
    }

    bloqueadoHoy = true
    ultimaComplecion = isoHoy
    localStorage.setItem(keyUltima, isoHoy)

    estadoCirculo.textContent = "Completado"
    estadoCirculo.classList.add("disabled")
    const puntos = puntosProgreso.querySelectorAll(".punto")
    puntos.forEach((p) => p.classList.add("activo"))

    if (hero.classList.contains("modo-tiempo")) {
      timerEnMarcha = false
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
      timerRestante = 0
      localStorage.setItem(
        keyTimer,
        JSON.stringify({ restante: 0, fecha: isoHoy, completado: true })
      )
    }

    if (r.dinero != null && plataHeader) {
      plataHeader.textContent = String(r.dinero)
    }

    cargarObjetivo()
  }

  function guardarEstadoTimer() {
    localStorage.setItem(
      keyTimer,
      JSON.stringify({
        restante: timerRestante,
        fecha: hoyISO,
        completado: false
      })
    )
  }

  function iniciarTimer() {
    if (!timerTotalSegundos || timerEnMarcha || bloqueadoHoy) return
    timerEnMarcha = true
    if (!timerRestante || timerRestante <= 0 || timerRestante > timerTotalSegundos) {
      timerRestante = timerTotalSegundos
    }
    estadoCirculo.classList.add("corriendo")
    estadoCirculo.textContent = formatearSegundos(timerRestante)
    timerId = setInterval(() => {
      timerRestante -= 1
      if (timerRestante < 0) timerRestante = 0
      estadoCirculo.textContent = formatearSegundos(timerRestante)
      guardarEstadoTimer()
      if (timerRestante <= 0) {
        clearInterval(timerId)
        timerId = null
        timerEnMarcha = false
        estadoCirculo.classList.remove("corriendo")
        postEvent("completarobjetivo", { idusuario, idobjetivo }, (r) => {
          if (!r?.objok) return
          manejarRespuestaCompletar(r)
        })
      }
    }, 1000)
  }

  function restaurarEstadoTimer() {
    const guardadoRaw = localStorage.getItem(keyTimer)
    if (!guardadoRaw) return false
    let data
    try {
      data = JSON.parse(guardadoRaw)
    } catch {
      return false
    }
    if (!data || data.fecha !== hoyISO) return false
    if (data.completado) {
      bloqueadoHoy = true
      estadoCirculo.textContent = "Completado"
      estadoCirculo.classList.add("disabled")
      return true
    }
    if (typeof data.restante === "number" && data.restante > 0) {
      timerRestante = Math.min(data.restante, timerTotalSegundos || data.restante)
      estadoCirculo.textContent = formatearSegundos(timerRestante)
      timerEnMarcha = false
      estadoCirculo.classList.remove("corriendo")
      return true
    }
    return false
  }

  function actualizarDesdeObjetivo(obj) {
    setHeroColor(obj.color)

    ultimaComplecion = obj.ultimodiaderacha || null
    bloqueadoHoy = ultimaComplecion === hoyISO
    if (ultimaComplecion) {
      localStorage.setItem(keyUltima, ultimaComplecion)
    } else {
      localStorage.removeItem(keyUltima)
    }

    const completadas = Number(obj.vecescompletadas) || 0
    totalCompletado.textContent = String(completadas)
    diasCompletadosMes = completadas
    if (diasCompletadosMes > diasMes) diasCompletadosMes = diasMes

    if (tituloObjetivo) {
      const nombre =
        obj.descripcion ||
        obj.nombre ||
        obj.titulo ||
        "Nombre del objetivo"
      tituloObjetivo.textContent = nombre
    }

    const esTiempo = obj.tipodeobjetivo === "tiempo"
    hero.classList.toggle("modo-tiempo", esTiempo)

    if (esTiempo) {
      metaPorDia = 1
      timerTotalSegundos = parseTiempoToSegundos(obj.tiempo)
      if (!restaurarEstadoTimer()) {
        timerRestante = timerTotalSegundos
        if (bloqueadoHoy) {
          estadoCirculo.textContent = "Completado"
          estadoCirculo.classList.add("disabled")
        } else {
          estadoCirculo.textContent = formatearSegundos(timerRestante || 0)
          estadoCirculo.classList.remove("disabled")
        }
      }
    } else {
      const v = Number(obj.veces)
      metaPorDia = !Number.isNaN(v) && v > 0 ? v : 4
      if (bloqueadoHoy) {
        estadoCirculo.textContent = "Completado"
        estadoCirculo.classList.add("disabled")
      } else {
        estadoCirculo.textContent = "Completar"
        estadoCirculo.classList.remove("disabled")
      }
    }

    const rachaObjActual = Number(obj.rachaactual) || 0
    const rachaObjMax = Number(obj.rachamaslarga) || 0
    if (rachaActualNum) rachaActualNum.textContent = String(rachaObjActual)
    if (rachaLarga) rachaLarga.textContent = String(rachaObjMax)

    pintarCalendario(rachaObjActual, obj.ultimodiaderacha || null, diasCompletadosSet)

    construirPuntos()

    grafico.data.datasets[0].data = [
      diasCompletadosMes,
      diasMes - diasCompletadosMes
    ]
    grafico.update()
  }

  function cargarObjetivo() {
    postEvent("devolverobjetivos", { idusuario }, (res) => {
      const lista = Array.isArray(res?.objetivos) ? res.objetivos : []
      const obj = lista.find((o) => o?.idobjetivo === idobjetivo)
      if (!obj) {
        window.location.href = "../menu principal/indexMenuPrincipal.html"
        return
      }
      actualizarDesdeObjetivo(obj)
    })
  }

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (r?.objok && r.usuario) {
      setHeader(r.usuario)
    }
  })

  btnBorrar?.addEventListener("click", () => {
    if (!confirm("¿Borrar este objetivo?")) return
    postEvent("borrarobjetivo", { idobjetivo }, (r) => {
      if (r?.ok || r?.objok?.ok) {
        window.location.href = "../menu principal/indexMenuPrincipal.html"
      }
    })
  })

  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
      const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
      const idobjetivo = JSON.parse(localStorage.getItem("idObjetivo") || "null")

      if (!idusuario || !idobjetivo) return

      localStorage.setItem("modoEdicionObjetivo", "1")
      localStorage.setItem(
        "objetivoEnEdicion",
        JSON.stringify({ idusuario, idobjetivo })
      )

      window.location.href =
        "../Creacion de Objetivos/IndexCreacionDeObjetivos.html#menu-disenio"
    })
  }

  estadoCirculo.addEventListener("click", () => {
    if (bloqueadoHoy || estadoCirculo.classList.contains("disabled")) return
    const esTiempo = hero.classList.contains("modo-tiempo")

    if (esTiempo) {
      if (timerEnMarcha) {
        if (timerId) {
          clearInterval(timerId)
          timerId = null
        }
        timerEnMarcha = false
        estadoCirculo.classList.remove("corriendo")
        guardarEstadoTimer()
      } else {
        iniciarTimer()
      }
      return
    }

    const puntos = puntosProgreso.querySelectorAll(".punto")
    if (!puntos.length) return
    if (progresoHoy >= metaPorDia) return

    puntos[progresoHoy].classList.add("activo")
    progresoHoy++

    if (progresoHoy === metaPorDia) {
      postEvent("completarobjetivo", { idusuario, idobjetivo }, (r) => {
        if (!r?.objok) return
        manejarRespuestaCompletar(r)
      })
    }
  })

  aplicarColoresPie()
  cargarObjetivo()
})
