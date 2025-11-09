const modal = document.getElementById("modal-terminos");
const cerrarModal = document.getElementById("cerrar-modal");
const verTerminos = document.getElementById("ver-terminos");

verTerminos.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "block";
});
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
});

connect2Server(3000);

const existente = JSON.parse(localStorage.getItem("idusuario") || "null");
if (existente) {
  window.location.replace("../menu principal/indexMenuPrincipal.html");
}

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const mail = document.getElementById("email").value.trim();
  const contraseña = document.getElementById("contraseña").value.trim();
  const mensaje = document.getElementById("mensaje");

  if (!mail || !contraseña) {
    mensaje.textContent = " Por favor, completa todos los campos.";
    mensaje.style.color = "red";
    return;
  }

  postEvent("login", { mail, contraseña }, (data) => {
    if (data?.ok === true) {
      const id =
        (data.usuario && (data.usuario.id ?? data.usuario._id ?? data.usuario.uid)) ??
        data.idusuario ?? data.id ?? data.uid ?? null;

      if (!id) {
        mensaje.textContent = " Error: no llegó el ID de usuario.";
        mensaje.style.color = "red";
        return;
      }

      localStorage.removeItem("idusario");
      localStorage.removeItem("idsusuario");
      localStorage.removeItem("usuario");

      localStorage.setItem("idusuario",JSON.stringify({ idusuario: id, nombre: data.usuario })
      );

      window.location.href = "../menu principal/indexMenuPrincipal.html";
    } else {
      mensaje.textContent = " Usuario o contraseña incorrectos.";
      mensaje.style.color = "red";
    }
  });
});
