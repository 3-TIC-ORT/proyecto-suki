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
      minecraft: "minecraft"
    }
    const n = mapa[clave] || "SUKI"
    return `../imagenes/Imagenesheader/${n}.png`
  }

  function setHeader(u) {
    if (nombreHeader) nombreHeader.textContent = u.usuario || "usuario"
    if (imgHeaderSkin) imgHeaderSkin.src = rutaIconoHeader(u.skinseleccionada)
    if (plataHeader) plataHeader.textContent = String(u.dinero ?? 0)
  }

  const hero = document.getElementById("heroObjetivo")
  const estadoCirculo = document.getElementById("estadoCirculo")
  const puntosProgreso = document.getElementById("puntosProgreso")
  const calendario = document.getElementById("calendario")
  const totalCompletado = document.getElementById("totalCompletado")
  const rachaActualNum = document.getElementById("rachaActualNum")
  const rachaLarga = document.getElementById("rachaLarga")
  const btnBorrar = document.getElementById("btnBorrar")
  const btnEditar = document.getElementById("btnEditar")

  const metaPorDia = 4
  let progresoHoy = 0
  let diasCompletadosMes = 0

  const fecha = new Date()
  const anio = fecha.getFullYear()
  const mes = fecha.getMonth()
  const diasMes = new Date(anio, mes + 1, 0).getDate()

  const ctx = document.getElementById("graficoProgreso").getContext("2d")
  const grafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Completados", "Pendientes"],
      datasets: [
        {
          data: [0, diasMes],
          backgroundColor: ["#F2BC1A", "#ff383c"]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  })

  for (let i = 0; i < metaPorDia; i++) {
    const p = document.createElement("div")
    p.className = "punto"
    puntosProgreso.appendChild(p)
  }

  function pintarCalendario(racha, ultimoISO) {
    const setRacha = new Set()
    if (racha && ultimoISO) {
      const base = new Date(ultimoISO + "T00:00:00")
      const n = Number(racha || 0)
      for (let i = 0; i < n; i++) {
        const d = new Date(base)
        d.setDate(d.getDate() - i)
        setRacha.add(d.toISOString().slice(0, 10))
      }
    }
    calendario.innerHTML = ""
    for (let d = 1; d <= diasMes; d++) {
      const celda = document.createElement("div")
      celda.className = "dia"
      const iso = new Date(anio, mes, d).toISOString().slice(0, 10)
      if (setRacha.has(iso)) celda.classList.add("activo")
      calendario.appendChild(celda)
    }
  }

  function setHeroColor(hex) {
    hero.style.background = hex || "#ffcc33"
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
      diasCompletadosMes = 0
    })
  }

  function actualizarTotalesDeUsuario(payload) {
    if (plataHeader) plataHeader.textContent = String(payload.dinero ?? 0)
    if (rachaActualNum) rachaActualNum.textContent = String(payload.racha ?? 0)
    if (rachaLarga) rachaLarga.textContent = String(payload.rachamaslarga ?? 0)
  }

  btnEditar?.addEventListener("click", () => {
    window.location.href = "../Creacion de Objetivos/IndexCreacionDeObjetivos.html#menu-disenio"
  })

  btnBorrar?.addEventListener("click", () => {
    if (!confirm("¿Borrar este objetivo?")) return
    postEvent("borrarobjetivo", { idobjetivo }, (r) => {
      if (r?.ok || r?.objok?.ok) {
        window.location.href = "../menu principal/indexMenuPrincipal.html"
      }
    })
  })

  estadoCirculo.addEventListener("click", () => {
    const puntos = puntosProgreso.querySelectorAll(".punto")
    if (progresoHoy >= metaPorDia) return
    puntos[progresoHoy].classList.add("activo")
    progresoHoy++
    if (progresoHoy === metaPorDia) {
      estadoCirculo.textContent = "Completado"
      postEvent("completarobjetivo", { idusuario, idobjetivo }, (r) => {
        if (!r?.objok) return
        const nuevoTotal = Number(totalCompletado.textContent) + 1
        totalCompletado.textContent = String(nuevoTotal)
        actualizarTotalesDeUsuario(r)
        pintarCalendario(r.racha, new Date().toISOString().slice(0, 10))
        diasCompletadosMes = Math.min(diasMes, diasCompletadosMes + 1)
        grafico.data.datasets[0].data = [diasCompletadosMes, diasMes - diasCompletadosMes]
        grafico.update()
        setTimeout(() => {
          puntos.forEach((p) => p.classList.remove("activo"))
          progresoHoy = 0
          estadoCirculo.textContent = "Completar"
        }, 600)
      })
    }
  })

  postEvent("devolverusuario", { idusuario }, (r) => {
    if (r?.objok && r.usuario) {
      setHeader(r.usuario)
      if (rachaActualNum) rachaActualNum.textContent = String(r.usuario.rachaactual || 0)
      if (rachaLarga) rachaLarga.textContent = String(r.usuario.rachamaslarga || 0)
      pintarCalendario(r.usuario.rachaactual || 0, r.usuario.ultimodiaderacha || null)
    }
  })

  cargarObjetivo()
})
