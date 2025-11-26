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

  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
  const idobjetivo = JSON.parse(localStorage.getItem("idObjetivo") || "null")

  if (!idusuario) {
    window.location.href = "../InicioSesion/IndexInicioSesion.html?force=1"
    return
  }
  if (!idobjetivo) {
    window.location.href = "../menu principal/indexMenuPrincipal.html"
    return
  }

  const hoyISO = new Date().toISOString().slice(0, 10)
  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()
  const diasMes = new Date(anio, mes + 1, 0).getDate()

  const keyUltima = `ultimaComplecion_${idobjetivo}`
  const keyPuntosHoy = `puntosHoy_${idusuario}_${idobjetivo}_${hoyISO}`

  let ultimaComplecion = localStorage.getItem(keyUltima) || null
  let bloqueadoHoy = false
  let progresoHoy = Number(localStorage.getItem(keyPuntosHoy) || 0)
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
  let colorCompletados = "#ffcc00"
  let colorPendientes = "#ff383c"

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
    const n = mapa[clave] || "Suki"
    return `../imagenes/skins/${n}.png`
  }

  function setHeader(u) {
    nombreHeader.textContent = u.usuario
    imgHeaderSkin.src = rutaIconoHeader(u.skinseleccionada)
    plataHeader.textContent = String(u.dinero ?? 0)
    heroPerro.src = rutaHeroSkin(u.skinseleccionada)
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
    options: { responsive: true, plugins: { legend: { display: false } } }
  })

  function actualizarPie() {
    if (diasCompletadosMes > diasMes) diasCompletadosMes = diasMes
    grafico.data.datasets[0].data = [
      diasCompletadosMes,
      diasMes - diasCompletadosMes
    ]
    grafico.update()
  }

  function aplicarColoresPie() {
    grafico.data.datasets[0].backgroundColor = [
      colorCompletados,
      colorPendientes
    ]
    grafico.update()
    leyendaOk.style.color = colorCompletados
    leyendaPend.style.color = colorPendientes
  }

  function setHeroColor(hex) {
    const c = hex || "#ffcc00"
    hero.style.background = c
    colorCompletados = c
    aplicarColoresPie()
  }

  function construirPuntos() {
    puntosProgreso.innerHTML = ""
    for (let i = 0; i < metaPorDia; i++) {
      const p = document.createElement("div")
      p.className = "punto"
      if (i < progresoHoy || bloqueadoHoy) p.classList.add("activo")
      puntosProgreso.appendChild(p)
    }
    if (bloqueadoHoy) {
      estadoCirculo.textContent = "Completado"
      estadoCirculo.classList.add("disabled")
    } else {
      estadoCirculo.textContent = "Completar"
      estadoCirculo.classList.remove("disabled")
    }
  }

  function pintarCalendario(racha, ultimoISO) {
    const inicioMes = new Date(anio, mes, 1)
    const setRacha = new Set()
    if (racha && ultimoISO) {
      const base = new Date(ultimoISO + "T00:00:00")
      for (let i = 0; i < Number(racha); i++) {
        const d = new Date(base)
        d.setDate(d.getDate() - i)
        setRacha.add(d.toISOString().slice(0, 10))
      }
    }
    calendario.innerHTML = ""
    const offset = (inicioMes.getDay() + 6) % 7
    for (let i = 0; i < offset; i++) {
      calendario.appendChild(document.createElement("div"))
    }
    for (let d = 1; d <= diasMes; d++) {
      const celda = document.createElement("div")
      celda.className = "dia"
      const iso = new Date(anio, mes, d).toISOString().slice(0, 10)
      if (setRacha.has(iso)) {
        celda.classList.add("dia-racha")
      }
      calendario.appendChild(celda)
    }
  }

  function actualizarVistaDesdeObjetivo(obj) {
    setHeroColor(obj.color)

    const ultimaBack = obj.ultimodiaderacha || null
    ultimaComplecion = ultimaBack || null
    bloqueadoHoy = ultimaComplecion === hoyISO

    if (ultimaComplecion) {
      localStorage.setItem(keyUltima, ultimaComplecion)
    } else {
      localStorage.removeItem(keyUltima)
    }

    const completadas = Number(obj.vecescompletadas) || 0
    totalCompletado.textContent = completadas
    diasCompletadosMes = completadas
    if (diasCompletadosMes > diasMes) diasCompletadosMes = diasMes

    const v = Number(obj.veces)
    metaPorDia = !isNaN(v) && v > 0 ? v : 4

    if (tituloObjetivo) {
      const nombre =
        obj.descripcion ||
        obj.nombre ||
        obj.titulo ||
        "Nombre del objetivo"
      tituloObjetivo.textContent = nombre
    }

    const rachaObjActual = Number(obj.rachaactual) || 0
    const rachaObjMax = Number(obj.rachamaslarga) || 0
    if (rachaActualNum) rachaActualNum.textContent = String(rachaObjActual)
    if (rachaLarga) rachaLarga.textContent = String(rachaObjMax)

    pintarCalendario(rachaObjActual, obj.ultimodiaderacha || null)

    if (bloqueadoHoy) {
      progresoHoy = metaPorDia
      localStorage.setItem(keyPuntosHoy, metaPorDia)
    } else {
      progresoHoy = Number(localStorage.getItem(keyPuntosHoy) || 0)
      if (progresoHoy > metaPorDia) progresoHoy = metaPorDia
    }

    construirPuntos()
    actualizarPie()
  }

  function cargarObjetivo() {
    postEvent("devolverobjetivos", { idusuario }, (res) => {
      const lista = res?.objetivos || []
      const obj = lista.find((o) => o.idobjetivo === idobjetivo)
      if (!obj) {
        window.location.href = "../menu principal/indexMenuPrincipal.html"
        return
      }
      actualizarVistaDesdeObjetivo(obj)
    })
  }

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (r?.objok && r.usuario) {
      setHeader(r.usuario)
    }
  })

  estadoCirculo.addEventListener("click", () => {
    if (bloqueadoHoy || progresoHoy >= metaPorDia) return

    progresoHoy++
    if (progresoHoy > metaPorDia) progresoHoy = metaPorDia
    localStorage.setItem(keyPuntosHoy, progresoHoy)
    construirPuntos()

    if (progresoHoy < metaPorDia) return

    postEvent("completarobjetivo", { idusuario, idobjetivo }, (r) => {
      if (!r?.objok) return

      if (r.dinero != null) {
        plataHeader.textContent = String(r.dinero)
      }

      bloqueadoHoy = true
      ultimaComplecion = hoyISO
      localStorage.setItem(keyUltima, hoyISO)
      localStorage.setItem(keyPuntosHoy, metaPorDia)

      cargarObjetivo()
    })
  })

  btnEditar.addEventListener("click", () => {
    localStorage.setItem("modoEdicionObjetivo", "1")
    localStorage.setItem(
      "objetivoEnEdicion",
      JSON.stringify({ idusuario, idobjetivo })
    )
    window.location.href =
      "../Creacion de Objetivos/IndexCreacionDeObjetivos.html#menu-disenio"
  })

  btnBorrar.addEventListener("click", () => {
    if (!confirm("¿Borrar este objetivo?")) return
    postEvent("borrarobjetivo", { idobjetivo }, (r) => {
      if (r?.ok || r?.objok?.ok) {
        window.location.href = "../menu principal/indexMenuPrincipal.html"
      }
    })
  })

  aplicarColoresPie()
  cargarObjetivo()
})
