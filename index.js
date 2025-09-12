import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { usuarios } from "./funciones.js"
subscribePOSTEvent("crear", (usuario, contraseña, mail, fecha) => {
    let usuario = {
        nombre: nombre,
        contraseña: contraseña,
        mail: mail,
        fecha: fecha,
    };
    let datos = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    datos.push(usuario);
    let datosJSON = JSON.stringify(datos, null, 2);
    fs.writeFileSync("data/pedidos.json", datosJSON);
    objok = { ok: true };
    return objok;
});

let listausuario = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"))

subscribePOSTEvent("login", (mail, contraseña) => {
    objok =  {ok: false};
    for (let i = 0; i < listausuario.length; i++) {
        let usuario = listausuario[i];
    
        if (usuario.mail === mail && usuario.contraseña === contraseña) {
          objok = {ok: true};
        return objok;
}else if (usuario.mail !== mail && usuario.contraseña !== contraseña){
    objok = {ok: false};
    return objok;
}
}})