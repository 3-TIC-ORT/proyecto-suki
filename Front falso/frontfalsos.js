
let usuario = "Luis";
let mail = "luis@gmail.com";
let contraseña = "JAJAJA23  ";
let fecha = "20/06/2024";
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







