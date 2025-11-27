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

  const rejilla = document.getElementById("gridSkins")
  const etiquetaDinero = document.getElementById("dinero")

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

  const setDinero = (n) => {
    if (etiquetaDinero) etiquetaDinero.textContent = String(n ?? 0)
    if (cajaPlataHeader) cajaPlataHeader.textContent = String(n ?? 0)
  }

  const setHeader = (nombre, skin) => {
    const elNombre = document.querySelector(".nombre-usuario")
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

  const pintarTienda = () => {
    if (!rejilla || !usuario) return
    rejilla.innerHTML = ""
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

  cargarUsuario()
})
