

   

document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault(); 
    let email = document.getElementById("email").value.trim();
    let contraseña = document.getElementById("contraseña").value.trim();
    let mensaje = document.getElementById("mensaje");

    
    if (email === "" || contraseña === "") {
        mensaje.textContent = " Por favor, completa todos los campos.";
        mensaje.style.color = "red";
        return;
    }


    if (email === emailValido && contraseña === contraseñaValida) {
        window.location.href = "../menu principal/indexMenuPrincipal.html";
    } else {
        mensaje.textContent = " Usuario o contraseña incorrectos.";
        mensaje.style.color = "red";
    }

    let valido =false;
    if(valido){
        postEvent("crear", {mail, contraseña}, (objok) => {
          if (objok.ok === true) {
            alert("El usuario ha sido creado exitosamente");
          } else {
            alert("Hubo un error al crear el usuario");
       
        }
    });
}
});



