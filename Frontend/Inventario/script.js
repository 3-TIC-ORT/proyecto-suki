const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("idusuario");
    localStorage.removeItem("usuario");
    window.location.href = "..//InicioSesion/IndexInicioSesion.html?logout=1";
  });
}

const tarjetasContainer = document.getElementById("tarjetas");
const inventarioContainer = document.getElementById("inventario");
const dineroSpan = document.getElementById("dinero");

let dineroActual = 0;

let skinslista = {
  trump: 150,
  flash: 200,
  turro: 150,
  sullivan: 200,
  bikini: 300,
  rabino: 300,
  bizarrap: 150,
  oro: 1000,
  minecraft: 200
}

postEvent("obtenerUsuario", {}, (res) => {
  if (res.ok) {
    dineroActual = res.usuario.dinero;
    dineroSpan.textContent = dineroActual;
    mostrarInventario(res.usuario.inventario);
  } else {
    alert("Error al cargar datos del usuario");
  }
});


postEvent("obtenerProductos", {}, (res) => {
  if (res.ok) {
    mostrarProductos(res.productos);
  } else {
    alert("Error al obtener productos");
  }
});


function mostrarProductos(productos) {
  tarjetasContainer.innerHTML = "";
  productos.forEach((p) => {
    const div = document.createElement("div");
    div.className = "tarjeta";
    div.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p>Precio: $${p.precio}</p>
      <button onclick="comprarProducto(${p.id}, ${p.precio})">Comprar</button>
    `;
    tarjetasContainer.appendChild(div);
  });
}


function mostrarInventario(inventario) {
  inventarioContainer.innerHTML = "";
  if (inventario.length === 0) {
    inventarioContainer.innerHTML = "<p>No tenés objetos aún.</p>";
    return;
  }
  inventario.forEach((item) => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}">
      <h4>${item.nombre}</h4>
    `;
    inventarioContainer.appendChild(div);
  });
}


function comprarProducto(idProducto, precio) {
  if (dineroActual < precio) {
    alert("No tenés suficiente dinero ");
    return;
  }

  postEvent("comprarProducto", { id: idProducto }, (res) => {
    if (res.ok) {
      alert("Compra realizada con éxito ");
      dineroActual -= precio;
      dineroSpan.textContent = dineroActual;
      mostrarInventario(res.inventarioActualizado);
    } else {
      alert("No se pudo completar la compra");
    }
  });
}