document.addEventListener("DOMContentLoaded", () => {
  connect2Server(3000)
  const form = document.getElementById("form-registro");
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

  
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  
  form.addEventListener("submit", function(e) {
    e.preventDefault();

    
    document.querySelectorAll(".error").forEach(span => span.textContent = "");

    let usuario = document.getElementById("usuario").value.trim();
    let mail = document.getElementById("mail").value.trim();
    let contraseña = document.getElementById("contraseña").value.trim();
    let fecha = document.getElementById("calendario").value;

    let valido = true;

   
    if (!usuario) {
      document.getElementById("error-usuario").textContent = "Ingrese un nombre de usuario";
      valido = false;
    }

    if (!mail.endsWith("@gmail.com")) {
      document.getElementById("error-mail").textContent = "El mail debe terminar en @gmail.com";
      valido = false;
    }

  
    let regexMayus = /[A-Z]/;
    if (contraseña.length < 6 || !regexMayus.test(contraseña)) {
      document.getElementById("error-contraseña").textContent =
        "La contraseña debe tener al menos 6 caracteres y 1 mayúscula";
      valido = false;
    }

   
    if (!fecha) {
      document.getElementById("error-fecha").textContent = "Seleccione una fecha";
      valido = false;
    }

    
  

    
  function sukiAlert(msg, cb) {
    const overlay = document.getElementById("sukiAlertOverlay")
    const msgEl = document.getElementById("sukiAlertMsg")
    const okBtn = document.getElementById("sukiAlertOk")
    msgEl.textContent = msg
    overlay.classList.add("abierto")
    const handler = () => {
      overlay.classList.remove("abierto")
      okBtn.removeEventListener("click", handler)
      if (cb) cb()
    }
    okBtn.addEventListener("click", handler)
  }

   if(valido){
    postEvent("crear", {usuario, mail, contraseña, fecha}, (objok) => {
      if (objok.ok === true) {
        sukiAlert("¡Usuario creado exitosamente!", () => {
          window.location.href = "../cuenta/IndexcuentaI.html";
        });
      } else {
        sukiAlert("Hubo un error al crear el usuario. Intentá de nuevo.");
      }
    });

  }

  });
});