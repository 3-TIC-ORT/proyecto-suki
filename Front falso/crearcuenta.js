document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-registro");
  const terminos = document.getElementById("terminos"); // ✅ agregado
  connect2Server(3000); // puerto donde corre tu backend

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

    if (!terminos.checked) {
      document.getElementById("error-terminos").textContent = "Debe aceptar los términos";
      valido = false;
    }

    if (valido) {
      postEvent("crear", {usuario, contraseña, mail, fecha}, (data) => {
        if (data.ok) {
          alert("Cuenta creada con éxito 🎉");
          form.reset();
        } else {
          alert("El mail ya está registrado ❌");
        }
      });
    }
  });
});
