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

  const hoyISO = new Date().toISOString().slice(0, 10)
  const keyUltima = `ultimaComplecion_${idobjetivo}`
  let ultimaComplecion = localStorage.getItem(keyUltima) || null
  let bloqueadoHoy = ultimaComplecion === hoyISO

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
  let diasCompletadosMes = 0

  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()
  const diasMes = new Date(anio, mes + 1, 0).getDate()

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
          data: [0, diasMes],
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
      estadoCirculo.textContent = "Completar"
      estadoCirculo.classList.remove("disabled")
    }
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
    if (plataHeader) plataHeader.textContent = String(payload.dinero ?? 0)
    if (rachaActualNum) rachaActualNum.textContent = String(payload.racha ?? 0)
    if (rachaLarga) rachaLarga.textContent = String(payload.rachamaslarga ?? 0)
    
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
      if (obj.tipodeobjetivo === "accion") {
        const v = Number(obj.veces)
        metaPorDia = !Number.isNaN(v) && v > 0 ? v : 4
      } else {
        metaPorDia = 4
      }
      construirPuntos()
      diasCompletadosMes = 0
      grafico.data.datasets[0].data = [0, diasMes]
      grafico.update()
    })
  }

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (r?.objok && r.usuario) {
      setHeader(r.usuario)
      pintarCalendario(r.usuario.rachaactual || 0, r.usuario.ultimodiaderacha || null)
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
    localStorage.setItem("modoEdicionObjetivo", "1")
    window.location.href = "../Creacion de Objetivos/IndexCreacionDeObjetivos.html#menu-disenio"
  })
}



  estadoCirculo.addEventListener("click", () => {
    if (bloqueadoHoy || estadoCirculo.classList.contains("disabled")) return
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
