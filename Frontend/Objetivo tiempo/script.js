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

  if (!idusuario) {
    window.location.href = "../Login/indexLogin.html?force=1"
    return
  }
  if (!idobjetivo) {
    window.location.href = "../menu principal/indexMenuPrincipal.html"
    return
  }

  const hoy = new Date()
  const hoyISO = hoy.toISOString().slice(0, 10)
  const keyUltima = `ultimaComplecion_${idobjetivo}`
  let ultimaComplecion = localStorage.getItem(keyUltima) || null
  let bloqueadoHoy = ultimaComplecion === hoyISO

  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()
  const diasMes = new Date(anio, mes + 1, 0).getDate()
  const mesClave = `${anio}${String(mes + 1).padStart(2, "0")}`
  const keyProgreso = `progresoMes_${idusuario}_${idobjetivo}_${mesClave}`

  let diasCompletadosMes = Number(localStorage.getItem(keyProgreso) || "0")
  if (Number.isNaN(diasCompletadosMes) || diasCompletadosMes < 0) diasCompletadosMes = 0
  if (diasCompletadosMes > diasMes) diasCompletadosMes = diasMes

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

  let metaPorDia = 4
  let progresoHoy = 0
  let colorCompletados = "#ffcc00"
  let colorPendientes = "#ff383c"

  let esTiempo = false
  let timerDuracionSeg = 0
  let timerRestanteSeg = 0
  let timerActivo = false
  let timerId = null

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
      trump: "salchitump",
      rabino: "salchirabino",
      oro: "de oro",
      flash: "salchiflash",
      turro: "salchiturro",
      sullivan: "salchivan",
      bizarrap: "Bzrp",
      minecraft: "SALCHICRAFT",
      bikini: "bikini"
    }
    const n = mapa[clave] || "suki-grande"
    return `../imagenes/skins/${n}.png`
  }

  function setHeader(u) {
    if (nombreHeader) nombreHeader.textContent = u.usuario || "usuario"
    if (imgHeaderSkin) imgHeaderSkin.src = rutaIconoHeader(u.skinseleccionada)
    if (plataHeader) plataHeader.textContent = String(u.dinero ?? 0)
    if (heroPerro) heroPerro.src = rutaHeroSkin(u.skinseleccionada)
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
      if (bloqueadoHoy && !esTiempo) p.classList.add("activo")
      puntosProgreso.appendChild(p)
    }
    if (bloqueadoHoy) {
      estadoCirculo.textContent = esTiempo ? "Completado" : "Completado"
      estadoCirculo.classList.add("disabled")
    } else {
      estadoCirculo.textContent = esTiempo ? formatearTiempo(timerDuracionSeg) : "Completar"
      estadoCirculo.classList.remove("disabled")
    }
    if (esTiempo) puntosProgreso.style.display = "none"
    else puntosProgreso.style.display = "flex"
  }

  function pintarCalendario(racha, ultimoISO) {
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
      if (setRacha.has(iso)) celda.classList.add("activo")
      calendario.appendChild(celda)
    }
  }

  function actualizarTotalesDeUsuario(payload) {
    if (plataHeader && payload.dinero != null) plataHeader.textContent = String(payload.dinero)
    if (rachaActualNum && payload.racha != null) rachaActualNum.textContent = String(payload.racha)
    if (rachaLarga && payload.rachamaslarga != null) rachaLarga.textContent = String(payload.rachamaslarga)
  }

  function formatearTiempo(seg) {
    const s = Math.max(0, Math.floor(seg))
    const m = Math.floor(s / 60)
    const r = s % 60
    const mm = String(m).padStart(2, "0")
    const ss = String(r).padStart(2, "0")
    return `${mm}:${ss}`
  }

  function finalizarTimerYCompletar() {
    if (bloqueadoHoy) return
    postEvent("completarobjetivo", { idusuario, idobjetivo }, (r) => {
      if (!r?.objok) return
      const nuevoTotal = Number(totalCompletado.textContent) + 1
      totalCompletado.textContent = String(nuevoTotal)
      actualizarTotalesDeUsuario(r)
      pintarCalendario(r.racha, new Date().toISOString().slice(0, 10))

      diasCompletadosMes = Math.min(diasMes, diasCompletadosMes + 1)
      localStorage.setItem(keyProgreso, String(diasCompletadosMes))
      grafico.data.datasets[0].data = [diasCompletadosMes, diasMes - diasCompletadosMes]
      grafico.update()

      bloqueadoHoy = true
      ultimaComplecion = hoyISO
      localStorage.setItem(keyUltima, hoyISO)
      estadoCirculo.textContent = "Completado"
      estadoCirculo.classList.add("disabled")
      timerActivo = false
      if (timerId) {
        clearInterval(timerId)
        timerId = null
      }
    })
  }

  function cargarObjetivo() {
    postEvent("devolverobjetivos", { idusuario }, (res) => {
      const lista = Array.isArray(res?.objetivos) ? res.objetivos : []
      const obj = lista.find((o) => o?.idobjetivo === idobjetivo)
      if (!obj) {
        window.location.href = "../menu principal/indexMenuPrincipal.html"
        return
      }

      setHeroColor(obj.color)
      totalCompletado.textContent = String(obj.vecescompletadas || 0)

      esTiempo = obj.tipodeobjetivo === "tiempo"
      if (esTiempo) {
        const minutos = Number(obj.tiempo)
        timerDuracionSeg = !Number.isNaN(minutos) && minutos > 0 ? minutos * 60 : 0
        timerRestanteSeg = timerDuracionSeg
        metaPorDia = 1
      } else {
        const v = Number(obj.veces)
        metaPorDia = obj.tipodeobjetivo === "accion" && !Number.isNaN(v) && v > 0 ? v : 4
      }

      construirPuntos()
      grafico.data.datasets[0].data = [diasCompletadosMes, diasMes - diasCompletadosMes]
      grafico.update()
    })
  }

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (r?.objok && r.usuario) {
      setHeader(r.usuario)
      if (rachaActualNum) rachaActualNum.textContent = String(r.usuario.rachaactual ?? 0)
      if (rachaLarga) rachaLarga.textContent = String(r.usuario.rachamaslarga ?? 0)
      pintarCalendario(r.usuario.rachaactual || 0, r.usuario.ultimodiaderacha || null)
    }
  })

  btnBorrar?.addEventListener("click", () => {
    if (!confirm("¿Borrar este objetivo?")) return
    postEvent("borrarobjetivo", { idobjetivo }, (r) => {
      if (r?.ok || r?.objok?.ok) {
        localStorage.removeItem(keyUltima)
        localStorage.removeItem(keyProgreso)
        window.location.href = "../menu principal/indexMenuPrincipal.html"
      }
    })
  })

  if (btnEditar) {
    btnEditar.addEventListener("click", () => {
      localStorage.setItem("modoEdicionObjetivo", "1")
      window.location.href = "../Creacion de Objetivos/IndexCreacionDeObjetivos.html#menu-disenio"
    })
  }

  estadoCirculo.addEventListener("click", () => {
    if (bloqueadoHoy || estadoCirculo.classList.contains("disabled")) return

    if (esTiempo) {
      if (timerDuracionSeg <= 0) return
      if (!timerActivo) {
        timerActivo = true
        if (!timerRestanteSeg || timerRestanteSeg <= 0) timerRestanteSeg = timerDuracionSeg
        estadoCirculo.textContent = formatearTiempo(timerRestanteSeg)
        timerId = setInterval(() => {
          timerRestanteSeg -= 1
          if (timerRestanteSeg <= 0) {
            estadoCirculo.textContent = "00:00"
            finalizarTimerYCompletar()
          } else {
            estadoCirculo.textContent = formatearTiempo(timerRestanteSeg)
          }
        }, 1000)
      } else {
        timerActivo = false
        if (timerId) {
          clearInterval(timerId)
          timerId = null
        }
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
        const nuevoTotal = Number(totalCompletado.textContent) + 1
        totalCompletado.textContent = String(nuevoTotal)
        actualizarTotalesDeUsuario(r)
        pintarCalendario(r.racha, new Date().toISOString().slice(0, 10))

        diasCompletadosMes = Math.min(diasMes, diasCompletadosMes + 1)
        localStorage.setItem(keyProgreso, String(diasCompletadosMes))
        grafico.data.datasets[0].data = [diasCompletadosMes, diasMes - diasCompletadosMes]
        grafico.update()

        bloqueadoHoy = true
        ultimaComplecion = hoyISO
        localStorage.setItem(keyUltima, hoyISO)
        estadoCirculo.textContent = "Completado"
        estadoCirculo.classList.add("disabled")
      })
    }
  })

  aplicarColoresPie()
  cargarObjetivo()
})
