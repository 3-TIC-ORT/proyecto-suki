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
function handleCredentialResponse(response) {

  const token = response.credential;

  const data = parseJwt(token);

  const mail = data.email;
  const nombre = data.name;

  postEvent("logingoogle", {
    mail,
    nombre
  }, (respuesta) => {

    if (respuesta?.ok === true) {

      localStorage.setItem(
        "idusuario",
        JSON.stringify({
          idusuario: respuesta.idusuario,
          nombre: respuesta.nombre
        })
      );

      window.location.href =
      "../menu principal/indexMenuPrincipal.html";

    } else {

      alert("Error al iniciar sesión con Google");

    }

  });

}

function parseJwt(token) {

  const base64Url = token.split('.')[1];

  const base64 = base64Url
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  return JSON.parse(atob(base64));

}

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
