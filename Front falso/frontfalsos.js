
let usuario = "Luis";
let mail = "luis@gmail.com";
let contraseña = "JAJAJA23  ";
let fecha = "20/06/2024";
let idusuario = 1761329384427;
let titulo = "Ver television";
let tipodeobjetivo = "accion";
let tiempo = null;
let veces = 10;
let icono = "💧";
let color = "#0000FF";
let idobjetivo = 1761331590535;
let nuevaskin = "trump";
let nuevousuario = "Felipe";
let nuevomail = "felipe@gmail.com";
let nuevafecha = "15/08/2023";
let skin = "oro";
connect2Server(3000);
//Copiar y Pegar
postEvent("", {}, (data) => {

})

//CREAR USUARIO
document.getElementById("crear").addEventListener("click", () => {
  postEvent("crear", { usuario, mail, contraseña, fecha }, (data) => {
    if (data.ok) {
      console.log("Usuario creado");
    } else {
      console.log("Error al crear usuario");
    }
  });
});

// LOGIN
document.getElementById("login").addEventListener("click", () => {
  postEvent("login", { mail, contraseña }, (data) => {
    if (data.ok) {
      console.log("Login exitoso");
    } else {
      console.log("Error al iniciar sesión");
    }
  });
});

//DEVOLVER USUARIO
document.getElementById("devolverusuario").addEventListener("click", () => {
    postEvent("devolverusuario", { idusuario }, (data) => {
        if (data.objok.ok) {
            console.log("Usuario devuelto");
        } else {
            console.log("Error al devolver usuario");
        }
    });
});

//CREAR OBJETIVO
document.getElementById("crearobjetivo").addEventListener("click", () => {
postEvent("crearobjetivo", { idusuario, titulo, tipodeobjetivo, tiempo, veces, icono, color }, (data) => {
    if (data.objok.ok) {
        console.log("Objetivo creado");
    } else {
        console.log("Error al crear objetivo");
    }
})});

//DEVOLVER OBJETIVO
document.getElementById("devolverobjetivo").addEventListener("click", () => {
    postEvent("devolverobjetivos", { idusuario }, (data) => {
        if (data.objok.ok) {
            console.log(data.objetivos);
        } else {
            console.log("Error al devolver objetivos");
        }
    });
});

//BORRAR OBJETIVO
document.getElementById("borrarobjetivo").addEventListener("click", () => {
postEvent("borrarobjetivo", { idobjetivo, tipodeobjetivo }, (data) => {
    if (data.ok) {
        console.log("Objetivo borrado");
    } else {
        console.log("Error al borrar objetivo");
    }
})});

//NUEVA SKIN ELEGIDA
document.getElementById("nuevaskinelegida").addEventListener("click", () => {
    postEvent("nuevaskinelegida", { idusuario, nuevaskin }, (data) => {
        if (data.objok.ok) {
            console.log("Skin elegida actualizada");
        } else {
            console.log("Error al actualizar skin elegida");
        }
})});

//MODIFICAR USUARIO
document.getElementById("modificarusuario").addEventListener("click", () => {
    postEvent("modificarusuario", { idusuario, nuevousuario }, (data) => {
        if (data.objok.ok) {
            console.log("Usuario modificado");
        } else {
            console.log("Error al modificar usuario");
        }
    });
});

//MODIFICAR MAIL
document.getElementById("modificarmail").addEventListener("click", () => {
    postEvent("modificarmail", { idusuario, nuevomail }, (data) => {
        if (data.objok.ok) {
            console.log("Mail modificado");
        } else {
            console.log("Error al modificar mail");
        }
    });
});

//MODIFICAR FECHA
document.getElementById("modificarfecha").addEventListener("click", () => {
    postEvent("modificarfecha", { idusuario, nuevafecha }, (data) => {
        if (data.objok.ok) {
            console.log("Fecha modificada");
        } else {
            console.log("Error al modificar fecha");
        }
    });
});

//COMPRAR SKIN
document.getElementById("comprar").addEventListener("click", () => {
    postEvent("comprar", { idusuario, skin }, (data) => {
        if (data.objok.ok) {
            console.log("Skin comprada");
        } else {
            console.log("Error al comprar skin");
        }
    });
});

//COMPLETAR OBJETIVO

