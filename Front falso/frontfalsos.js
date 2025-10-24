
let usuario = "Luis";
let mail = "luis@gmail.com";
let contraseña = "JAJAJA23  ";
let fecha = "20/06/2024";
let idusuario = 1761329384427;
connect2Server(3000);
//Copiar y Pegar
postEvent("", {}, (data) => {

})
document.getElementById("crear").addEventListener("click", () => {
  postEvent("crear", { usuario, mail, contraseña, fecha }, (data) => {
    if (data.ok) {
      console.log("Usuario creado");
    } else {
      console.log("Error al crear usuario");
    }
  });
});

document.getElementById("login").addEventListener("click", () => {
  postEvent("login", { mail, contraseña }, (data) => {
    if (data.ok) {
      console.log("Login exitoso");
    } else {
      console.log("Error al iniciar sesión");
    }
  });
});

document.getElementById("devolverusuario").addEventListener("click", () => {
    postEvent("devolverusuario", { idusuario }, (data) => {
        if (data.objok.ok) {
            console.log("Usuario devuelto");
        } else {
            console.log("Error al devolver usuario");
        }
    });
});