document.addEventListener("DOMContentLoaded", () => {
    const btnAcceder = document.getElementById("btn-acceder");
    const terminos = document.getElementById("terminos");
    const modal = document.getElementById("modal-terminos");
    const cerrarModal = document.getElementById("cerrar-modal");
  
    // Mostrar modal al marcar términos
    terminos.addEventListener("change", function() {
      if (this.checked) {
        modal.style.display = "block";
      }
    });
  
    // Cerrar modal
    cerrarModal.addEventListener("click", () => {
      modal.style.display = "none";
    });
  
    // Validaciones al crear cuenta
    btnAcceder.addEventListener("click", function(e) {
      e.preventDefault();
  
      // limpiar errores previos
      document.querySelectorAll(".error").forEach(e => e.textContent = "");
  
      let usuario = document.getElementById("usuario").value.trim();
      let mail = document.getElementById("mail").value.trim();
      let contraseña = document.getElementById("contraseña").value.trim();
      let fecha = document.getElementById("calendario").value;
  
      let valido = true;
  
      // Usuario vacío
      if (!usuario) {
        document.getElementById("error-usuario").textContent = "Ingrese un nombre de usuario";
        valido = false;
      }
  
      // Mail válido
      if (!mail.endsWith("@gmail.com")) {
        document.getElementById("error-mail").textContent = "El mail debe terminar en @gmail.com";
        valido = false;
      }
  
      // Contraseña: min 6 + al menos 1 mayúscula
      let regexMayus = /[A-Z]/;
      if (contraseña.length < 6 || !regexMayus.test(contraseña)) {
        document.getElementById("error-contraseña").textContent =
          "La contraseña debe tener al menos 6 caracteres y 1 mayúscula";
        valido = false;
      }
  
      // Fecha
      if (!fecha) {
        document.getElementById("error-fecha").textContent = "Seleccione una fecha";
        valido = false;
      }
  
      // Términos
      if (!terminos.checked) {
        document.getElementById("error-terminos").textContent = "Debe aceptar los términos";
        valido = false;
      }
  
      // Si todo ok, guardar y redirigir
      if (valido) {
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("mail", mail);
        localStorage.setItem("contraseña", contraseña);
        localStorage.setItem("fechaNacimiento", fecha);
  
        alert("Cuenta creada con éxito ✅");
        window.location.href = "../menu principal/indexMenuPrincipal.html";
      }
    });
  });
  