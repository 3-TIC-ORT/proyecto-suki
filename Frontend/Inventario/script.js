document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000)

  const botonMenu = document.getElementById("menuBtn")
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("overlay")
  botonMenu?.addEventListener("click", () => {
    sidebar.classList.toggle("open")
    overlay.classList.toggle("show")
  })
  overlay?.addEventListener("click", () => {
    sidebar.classList.remove("open")
    overlay.classList.remove("show")
  })

  const btnCerrarSesion = document.getElementById("btnCerrarSesion");
  btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("idusuario");
    localStorage.removeItem("usuario");
    window.location.href = "../cuenta/IndexcuentaI.html?logout=1";
  });


  const sesion = JSON.parse(localStorage.getItem("idusuario") || "null")
  const idusuario = typeof sesion === "number" ? sesion : sesion?.idusuario ?? null
  if (!idusuario) { window.location.href = "../InicioSesion/indexInicioSesion.html?force=1"; return }

  const rutaSkinTienda = (clave) => {
    const mapa = {
      suki: "suki.png",
      trump: "trump.png",
      rabino: "salchirabino.png",
      oro: "DeOro.png",
      flash: "Flash.png",
      turro: "Turro.png",
      sullivan: "solivan.png",
      bizarrap: "BzRP.png",
      minecraft: "Salchicraft.png"
    }
    const archivo = mapa[clave] || "suki.png"
    return `../imagenes/Tienda/${archivo}`
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
    const archivo = mapa[clave] || "SUKI.png"
    return `../imagenes/Imagenesheader/${archivo}`
  }

  const rutaSkinGrande = (clave) => {
    const mapa = {
      suki: "Suki",
      oro: "De oro",
      minecraft: "SALCHICRAFT",
      flash: "salchiflash",
      rabino: "Salchirabino",
      trump: "salchitrump",
      turro: "salchiturro",
      sullivan: "salchivan",
      bizarrap: "Bzrp"
    }
    const nombre = mapa[clave] || "Suki"
    return `../imagenes/skins/${encodeURIComponent(nombre)}.png`
  }

  const catalogoSkins = [
    { clave: "suki", nombre: "Suki", precio: 0 },
    { clave: "trump", nombre: "Salchitrump", precio: 150 },
    { clave: "rabino", nombre: "Salchirabino", precio: 300 },
    { clave: "oro", nombre: "Salchioro", precio: 1000 },
    { clave: "flash", nombre: "Salchiflash", precio: 200 },
    { clave: "turro", nombre: "Salchiturro", precio: 150 },
    { clave: "sullivan", nombre: "Salchivan", precio: 200 },
    { clave: "bizarrap", nombre: "Salchitrap", precio: 150 },
    { clave: "minecraft", nombre: "SALCHICRAFT", precio: 200 }
  ]
  const ruleta = { clave: "ruleta", nombre: "Ruleta misteriosa", precio: 400 }
  const ICONO_HUESO = "Plata.png"

  const nombreSkin = (clave) => {
    const item = catalogoSkins.find((skin) => skin.clave === clave)
    return item?.nombre || clave
  }

  const rejilla = document.getElementById("gridSkins")
  const panelRuleta = document.getElementById("panelRuleta")
  const etiquetaDinero = document.getElementById("dinero")
  const modalRuleta = document.getElementById("modalRuleta")
  const ruletaDisco = document.getElementById("ruletaDisco")
  const ruletaTablero = document.querySelector(".ruleta-tablero")
  const ruletaEstado = document.getElementById("ruletaEstado")
  const btnCerrarRuleta = document.getElementById("btnCerrarRuleta")
  const btnCerrarRuletaX = document.getElementById("btnCerrarRuletaX")
  const ruletaPremioMedia = document.getElementById("ruletaPremioMedia")
  const ruletaPremioImg = document.getElementById("ruletaPremioImg")
  const ruletaPremioTexto = document.getElementById("ruletaPremioTexto")

  let cajaPlataHeader = document.getElementById("plataHeaderValor")
  if (!cajaPlataHeader) {
    const contIzq = document.querySelector("header .izquierda")
    if (contIzq) {
      const cont = document.createElement("div")
      cont.className = "plata-header"
      const img = document.createElement("img")
      img.src = "Plata.png"
      img.alt = "Plata"
      img.className = "plata-icono"
      const valor = document.createElement("div")
      valor.id = "plataHeaderValor"
      valor.className = "plata-valor"
      valor.textContent = "0"
      cont.appendChild(img)
      cont.appendChild(valor)
      contIzq.appendChild(cont)
      cajaPlataHeader = valor
    }
  }

  let usuario = null
  let ruletaGirando = false
  let rotacionRuletaActual = 0

  const setDinero = (n) => {
    if (etiquetaDinero) etiquetaDinero.textContent = String(n ?? 0)
    if (cajaPlataHeader) cajaPlataHeader.textContent = String(n ?? 0)
  }

  const setHeader = (nombre, skin) => {
    const elNombre = document.getElementById("nombreHeader") || document.querySelector(".nombre-usuario")
    if (elNombre) elNombre.textContent = nombre || "Usuario"
    const iconoHeader = document.getElementById("imgHeaderSkin") || document.querySelector(".foto-perfil img")
    if (iconoHeader) iconoHeader.src = rutaIconoHeader(skin)
  }

  const setPreview = (skin) => {
    const preview1 = document.getElementById("imgPerro")
    const preview2 = document.getElementById("imgPreviewSkin")
    if (preview1) preview1.src = rutaSkinTienda(skin)
    if (preview2) preview2.src = rutaSkinGrande(skin)
  }

  const formatearPremio = (premio) => {
    if (!premio) return ""
    if (premio.tipo === "skin") return `Ganaste la skin ${nombreSkin(premio.valor)}!`
    if (premio.tipo === "puntos") return `Ganaste ${premio.valor} puntos!`
    if (premio.tipo === "cero") return "Salió 0"
    return "Ganaste un premio!"
  }

  const etiquetaOpcionRuleta = (opcion) => {
    if (opcion.tipo === "skin") return ""
    if (opcion.tipo === "puntos") return String(opcion.valor)
    return "0"
  }

  const imagenOpcionRuleta = (opcion) => {
    if (opcion.tipo === "skin") return rutaSkinTienda(opcion.valor)
    return ICONO_HUESO
  }

  const normalizarOpcionesRuleta = (opciones) => {
    const lista = Array.isArray(opciones) ? [...opciones] : []
    const skins = lista.filter((op) => op?.tipo === "skin")
    const skinA = skins[0] || { tipo: "skin", valor: "trump" }
    const skinB = skins[1] || skins[0] || { tipo: "skin", valor: "flash" }
    return [
      { slot: 0, tipo: "puntos", valor: 1000 },
      { slot: 1, tipo: "skin", valor: skinA.valor },
      { slot: 2, tipo: "puntos", valor: 200 },
      { slot: 3, tipo: "cero", valor: 0 },
      { slot: 4, tipo: "puntos", valor: 500 },
      { slot: 5, tipo: "skin", valor: skinB.valor }
    ]
  }

  const limpiarPremioVisual = () => {
    if (!ruletaPremioMedia || !ruletaPremioImg || !ruletaPremioTexto) return
    ruletaPremioMedia.classList.remove("visible")
    ruletaPremioImg.classList.remove("puntos")
    ruletaPremioImg.removeAttribute("src")
    ruletaPremioTexto.textContent = ""
  }

  const mostrarPremioVisual = (premio) => {
    if (!ruletaPremioMedia || !ruletaPremioImg || !ruletaPremioTexto) return
    if (!premio) return
    ruletaPremioMedia.classList.add("visible")
    if (premio.tipo === "skin") {
      ruletaPremioImg.classList.remove("puntos")
      ruletaPremioImg.src = rutaSkinGrande(premio.valor)
      ruletaPremioImg.alt = `Skin ${nombreSkin(premio.valor)}`
      ruletaPremioTexto.textContent = `Perro elegido: ${nombreSkin(premio.valor)}`
      return
    }
    if (premio.tipo === "cero") {
      ruletaPremioImg.classList.add("puntos")
      ruletaPremioImg.src = ICONO_HUESO
      ruletaPremioImg.alt = "Cero"
      ruletaPremioTexto.textContent = "0 puntos"
      return
    }
    ruletaPremioImg.classList.add("puntos")
    ruletaPremioImg.src = ICONO_HUESO
    ruletaPremioImg.alt = "Puntos"
    ruletaPremioTexto.textContent = `${premio.valor} puntos`
  }

  const cerrarModalRuleta = () => {
    if (!modalRuleta || ruletaGirando) return
    modalRuleta.classList.remove("abierto")
    modalRuleta.setAttribute("aria-hidden", "true")
  }

  const abrirModalRuleta = () => {
    if (!modalRuleta || !ruletaEstado || !btnCerrarRuleta) return
    modalRuleta.classList.add("abierto")
    modalRuleta.setAttribute("aria-hidden", "false")
    ruletaEstado.textContent = "Girando..."
    limpiarPremioVisual()
    btnCerrarRuleta.style.display = "none"
  }

  const renderizarOpcionesRuleta = (opciones) => {
    if (!ruletaDisco) return
    ruletaDisco.innerHTML = ""
    if (!Array.isArray(opciones) || !opciones.length) return
    const tamDisco = ruletaDisco.clientWidth || (window.innerWidth <= 768 ? 290 : 320)
    const inicioRuleta = -120
    const colorOpcion = (opcion) => {
      if (opcion?.tipo === "skin") return "#f6c400"
      if (opcion?.tipo === "cero") return "#ff313a"
      return "#7b2f14"
    }
    const paso = 360 / opciones.length
    const sectores = opciones.map((_, i) => {
      const inicio = i * paso
      const fin = (i + 1) * paso
      return `${colorOpcion(opciones[i])} ${inicio}deg ${fin}deg`
    }).join(", ")
    ruletaDisco.style.setProperty("--ruleta-sectores", `conic-gradient(from ${inicioRuleta}deg, ${sectores})`)
    const centro = tamDisco / 2
    const radioContenido = tamDisco * 0.37
    opciones.forEach((opcion, i) => {
      const etiqueta = document.createElement("div")
      etiqueta.className = `ruleta-opcion ${opcion.tipo} slot-${i}`
      const texto = etiquetaOpcionRuleta(opcion)
      etiqueta.innerHTML = `
        <div class="ruleta-opcion-contenido">
          <img src="${imagenOpcionRuleta(opcion)}" alt="${texto || "skin"}">
          ${texto ? `<span>${texto}</span>` : ""}
        </div>
      `
      const anguloSector = inicioRuleta + (i * paso) + (paso / 2)
      const angulo = (anguloSector * Math.PI) / 180
      const x = centro + (Math.sin(angulo) * radioContenido)
      const y = centro - (Math.cos(angulo) * radioContenido)
      etiqueta.style.left = `${x}px`
      etiqueta.style.top = `${y}px`
      etiqueta.style.transform = "translate(-50%, -50%)"
      etiqueta.style.setProperty("--rot", "0deg")
      ruletaDisco.appendChild(etiqueta)
    })
  }

  const igualarAlturaTarjetaRuleta = () => {
    if (!rejilla || !panelRuleta) return
    const tarjetaRuleta = panelRuleta.querySelector(".tarjeta-ruleta")
    const tarjetaReferencia = rejilla.querySelector(".tarjeta-skin, .card-skin")
    if (!tarjetaRuleta || !tarjetaReferencia) return
    tarjetaRuleta.style.height = `${tarjetaReferencia.offsetHeight}px`
  }

  const animarRuleta = (opciones, premio) => {
    if (!ruletaDisco || !ruletaEstado || !btnCerrarRuleta || !Array.isArray(opciones) || !opciones.length) return
    const indiceGanador = opciones.findIndex((op) => {
      if (premio?.slot != null && op?.slot != null) return op.slot === premio.slot
      return op.tipo === premio?.tipo && op.valor === premio?.valor
    })
    if (indiceGanador < 0) {
      ruletaGirando = false
      ruletaEstado.textContent = formatearPremio(premio)
      mostrarPremioVisual(premio)
      btnCerrarRuleta.style.display = "inline-flex"
      return
    }
    const inicioRuleta = -120
    const paso = 360 / opciones.length
    const anguloGanador = inicioRuleta + (indiceGanador * paso) + (paso / 2)
    const objetivo = (360 - (((anguloGanador % 360) + 360) % 360)) % 360
    const vueltas = 8 + Math.floor(Math.random() * 3)
    const desde = rotacionRuletaActual
    const deltaObjetivo = ((objetivo - (desde % 360)) + 360) % 360
    const hasta = desde + (vueltas * 360) + deltaObjetivo
    const anim = ruletaDisco.animate(
      [
        { transform: `rotate(${desde}deg)` },
        { transform: `rotate(${hasta}deg)` }
      ],
      {
        duration: 5200,
        easing: "cubic-bezier(0.08, 0.9, 0.19, 1)",
        fill: "forwards"
      }
    )
    if (ruletaTablero) ruletaTablero.classList.add("girando")
    anim.onfinish = () => {
      rotacionRuletaActual = hasta % 360
      ruletaDisco.style.transform = `rotate(${rotacionRuletaActual}deg)`
      ruletaGirando = false
      ruletaEstado.textContent = formatearPremio(premio)
      mostrarPremioVisual(premio)
      if (ruletaTablero) ruletaTablero.classList.remove("girando")
      btnCerrarRuleta.style.display = "inline-flex"
    }
  }

  const pintarTienda = () => {
    if (!rejilla || !panelRuleta || !usuario) return
    rejilla.innerHTML = ""
    panelRuleta.innerHTML = ""
    catalogoSkins.forEach(item => {
      const adquirida = !!usuario.skins[item.clave]
      const tarjeta = document.createElement("div")
      tarjeta.className = `card-skin tarjeta-skin ${adquirida ? "propia" : "bloqueada"} ${usuario.skinseleccionada===item.clave ? "equipada" : ""}`
      tarjeta.dataset.clave = item.clave
      tarjeta.innerHTML = `
        <div class="skin-thumb imagen-skin"><img src="${rutaSkinTienda(item.clave)}" alt="${item.nombre}"></div>
        <div class="skin-title titulo-skin">${item.nombre}</div>
        <div class="skin-actions acciones-skin">
          ${
            adquirida
              ? `<button class="btn boton equipar">Equipar</button>`
              : `<button class="btn boton comprar"${(usuario.dinero||0) < item.precio ? " disabled" : ""}>
                   Comprar <img src="Plata.png" class="icono-hueso" alt=""> <b class="monto">${item.precio}</b>
                 </button>`
          }
        </div>
      `
      rejilla.appendChild(tarjeta)
    })

    const tarjetaRuleta = document.createElement("div")
    tarjetaRuleta.className = "card-skin tarjeta-skin tarjeta-ruleta"
    tarjetaRuleta.dataset.clave = ruleta.clave
    tarjetaRuleta.innerHTML = `
      <div class="ruleta-caja-contenido">
        <div class="ruleta-caja-texto">
          <div class="skin-title titulo-skin">¡${ruleta.nombre}!</div>
          <div class="premio-ruleta">Arriesgate por skins o puntos del 200 hasta los 1000!</div>
          <div class="skin-actions acciones-skin acciones-ruleta-caja">
            <button class="btn boton girar boton-ruleta-caja"${(usuario.dinero||0) < ruleta.precio ? " disabled" : ""}>
              Comprar <img src="Plata.png" class="icono-hueso icono-hueso-ruleta" alt=""> <b class="monto">${ruleta.precio}</b>
            </button>
          </div>
        </div>
        <div class="ruleta-caja-vista" aria-hidden="true">
          <img class="ruleta-caja-imagen" src="ruleta.png" alt="Ruleta misteriosa">
        </div>
      </div>
    `
    panelRuleta.appendChild(tarjetaRuleta)
    requestAnimationFrame(igualarAlturaTarjetaRuleta)
  }

  rejilla?.addEventListener("click", (e) => {
    const boton = e.target.closest("button")
    if (!boton) return
    const tarjeta = e.target.closest(".tarjeta-skin, .card-skin")
    if (!tarjeta) return
    const clave = tarjeta.dataset.clave
    const item = catalogoSkins.find(x => x.clave === clave)
    if (!item) return

    if (boton.classList.contains("comprar")) {
      postEvent("comprar", { idusuario, skin: clave }, (resp) => {
        if (!resp?.objok?.ok) return
        usuario.dinero = resp.dinero
        usuario.skins = resp.skins
        setDinero(usuario.dinero)
        pintarTienda()
      })
    } else if (boton.classList.contains("equipar")) {
      postEvent("nuevaskinelegida", { idusuario, nuevaskin: clave }, (resp) => {
        if (!resp?.objok?.ok) return
        usuario.skinseleccionada = resp.skindelusuario || clave
        setPreview(usuario.skinseleccionada)
        setHeader(usuario.usuario, usuario.skinseleccionada)
        document.querySelectorAll(".tarjeta-skin, .card-skin").forEach(c =>
          c.classList.toggle("equipada", c.dataset.clave === usuario.skinseleccionada)
        )
      })
    }
  })

  panelRuleta?.addEventListener("click", (e) => {
    const boton = e.target.closest("button")
    if (!boton || !boton.classList.contains("girar")) return
    if (boton.disabled || ruletaGirando) return
    if (boton.classList.contains("girar")) {
      ruletaGirando = true
      postEvent("comprarruleta", { idusuario }, (resp) => {
        if (!resp?.objok?.ok) {
          ruletaGirando = false
          return
        }
        usuario.dinero = resp.dinero
        usuario.skins = resp.skins
        setDinero(usuario.dinero)
        pintarTienda()
        abrirModalRuleta()
        const opcionesRuleta = normalizarOpcionesRuleta(resp.opcionesruleta || [])
        renderizarOpcionesRuleta(opcionesRuleta)
        animarRuleta(opcionesRuleta, resp.premio)
      })
    }
  })

  btnCerrarRuleta?.addEventListener("click", cerrarModalRuleta)
  btnCerrarRuletaX?.addEventListener("click", cerrarModalRuleta)
  modalRuleta?.addEventListener("click", (e) => {
    if (e.target === modalRuleta) cerrarModalRuleta()
  })

  const cargarUsuario = () => {
    postEvent("devolverusuario", { idusuario }, (data) => {
      if (!data?.objok || !data.usuario) return
      usuario = data.usuario
      setHeader(usuario.usuario, usuario.skinseleccionada)
      setDinero(usuario.dinero || 0)
      setPreview(usuario.skinseleccionada)
      pintarTienda()
    })
  }

  window.addEventListener("resize", igualarAlturaTarjetaRuleta)
  cargarUsuario()
})
