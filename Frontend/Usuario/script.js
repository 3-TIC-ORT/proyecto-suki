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
connect2server(3000);

postEvent("idUsuario", {mail, contraseña, }, (data) => {
  if (data.ok === true) {
alert("Inicio de sesión exitoso");
window.location.href = "../menu principal/indexMenuPrincipal.html";
  } else {
    mensaje.textContent = " Usuario o contraseña incorrectos.";
    mensaje.style.color = "red";
}
});