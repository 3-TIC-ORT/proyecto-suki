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

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); 
    let mail = document.getElementById("email").value.trim();
    let contraseña = document.getElementById("contraseña").value.trim();
    let mensaje = document.getElementById("mensaje");

    
    if (mail === "" || contraseña === "") {
        mensaje.textContent = " Por favor, completa todos los campos.";
        mensaje.style.color = "red";
        return;
    }


        postEvent("login", {mail, contraseña}, (data) => {
          if (data.ok === true) {
        alert("Inicio de sesión exitoso");
        window.location.href = "../menu principal/indexMenuPrincipal.html";
          } else {
            mensaje.textContent = " Usuario o contraseña incorrectos.";
            mensaje.style.color = "red";
        }
    });

});



