import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { devolverobjetivos } from "./funciones.js";

subscribeGETEvent("objetivos", devolverobjetivos);



let datosusuario = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
subscribePOSTEvent("crear", ({idusuario, usuario, contraseña, mail, fecha}) => {
    let objok = {ok:false};
    for (let i = 0; i < datosusuario.length; i++){
        if(datosusuario[i].mail === mail){
         return objok;
        }}
        let objusuario = {
            usuario: usuario,
            id: idusuario,
            contraseña: contraseña,
            mail: mail,
            fecha: fecha,
            racha: null,
            logrosdesbloqueados: null,
            skinscompradas: null
        };
        datosusuario.push(objusuario);
        let datosusuarioJSON = JSON.stringify(datosusuario, null, 2);
        fs.writeFileSync("data/usuarios.json", datosusuarioJSON);
        objok = { ok: true};
        return objok;
});

subscribePOSTEvent("login", ({email, contraseña}) => {
    let objok = {ok:false};
let datosusuario = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
for (let i = 0; i < datos.length; i++){
if (datosusuario[i].mail === email && datosusuario[i].contraseña === contraseña){
    objok = {ok:true};
    return objok;
}
}
    return objok;
})

subscribePOSTEvent("crearobjetivo", ({idusuario, titulo, estado, tipodeobjetivo, frecuencia,}) => {
    let objok = {ok:false};
    let objetivo = {
    idusuario: idusuario,
    titulo: titulo,
    tipodeobjetivo: tipodeobjetivo,
    frecuencia: frecuencia,
    estado: estado,
};
if (tipodeobjetivo === "tiempo"){
    let datosobjetivostiempo = JSON.parse(fs.readFileSync("data/objetivos_tiempo.json","utf-8"));
    datosobjetivostiempo.push(objetivo);
    let datosobjetivostiempoJSON = JSON.stringify(datosobjetivostiempo, null, 2);
    fs.writeFileSync("data/objetivos_tiempo.json", datosobjetivostiempoJSON);
    objok = {ok:true};
    return objok;
} else if (tipodeobjetivo === "accion"){
    let datosobjetivosaccion = JSON.parse(fs.readFileSync("data/objetivos_accion.json","utf-8"));
    datosobjetivosaccion.push(objetivo);
    let datosobjetivosaccionJSON = JSON.stringify(datosobjetivosaccion, null, 2);
    fs.writeFileSync("data/objetivos_accion.json", datosobjetivosaccionJSON);
    objok = {ok:true};
    return objok;
} else if (tipodeobjetivo === "tiempo y accion"){
    let datosobjetivostiempoyaccion = JSON.parse(fs.readFileSync("data/objetivos_tiempoyaccion.json", "utf-8"));
    datosobjetivostiempoyaccion.push(objetivo);
    let datosobjetivostiempoyaccionJSON = JSON.stringify(datosobjetivostiempoyaccion, null, 2);
    fs.writeFileSync("data/objetivos_tiempoyaccion.json", datosobjetivostiempoyaccionJSON);
    objok = {ok:true};
    return objok;
}
});

startServer(3000, true);
