import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
let objok = {ok:false}
subscribePOSTEvent("crear", ({usuario, contraseña, mail, fecha}) => {
    let objusuario = {
        usuario: usuario,
        contraseña: contraseña,
        mail: mail,
        fecha: fecha,
    };
    let datos = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    datos.push(objusuario);
    let datosJSON = JSON.stringify(datos, null, 2);
    fs.writeFileSync("data/usuarios.json", datosJSON);
    objok = { ok: true};
    return objok;
});

subscribePOSTEvent("login", ({email, contraseña}) => {
let datos = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
for (let i = 0; i < datos.length; i++){

if (datos[i].mail === email && datos[i].contraseña === contraseña){
    objok = {ok:true}
    return objok;
}
}
    return objok;
})
startServer(3000, true);