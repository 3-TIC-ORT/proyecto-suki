import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
let idusuario = 1;
let idobjetivo = 1;

subscribePOSTEvent("borrarobjetivo", ({idobjetivo, tipodeobjetivo}) => {
    let objok = {ok:false};
    let archivo = "";
    idobjetivo = Number(idobjetivo);

    if (tipodeobjetivo === "tiempo"){
        archivo = "data/objetivos_tiempo.json";
    } else if (tipodeobjetivo === "accion"){
        archivo = "data/objetivos_accion.json";
    }

     let objetivo = JSON.parse(fs.readFileSync(archivo, "utf-8"));
      for (let i = 0; i < objetivo.length; i++){
            if (objetivo[i].idobjetivo === idobjetivo){
               objetivo.splice(i, 1);
            }
}
let objetivoJSON = JSON.stringify(objetivo, null, 2);
            fs.writeFileSync(archivo, objetivoJSON);
            objok = {ok:true};
            return objok;
});

subscribePOSTEvent("objetivos", ({idusuario}) => {
        idusuario = Number(idusuario);
        let  objetivosaccion = JSON.parse(fs.readFileSync("data/objetivos_accion.json", "utf-8"));
        let objetivostiempo = JSON.parse(fs.readFileSync("data/objetivos_tiempo.json", "utf-8"));
        let objetivos = objetivosaccion.concat(objetivostiempo);
        let objetivousuarios = [];
        for (let i = 0; i < objetivos.length; i++){
            if (objetivos[i].idusuario === idusuario){
                objetivousuarios.push(objetivos[i]);
            }
        }
    
        return objetivousuarios;
    });




subscribePOSTEvent("crear", ({usuario, contraseña, mail, fecha}) => {
    let datosusuario = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
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
            racha: 0,
            logrosdesbloqueados: 0,
            skinscompradas: 0,
            dinero: 0,
            skins: {
        suki: false,
        trump: false,
        flash: false,
        turro: false,
        sullivan: false,
        bikini: false,
        rabino: false,
        bizarrap: false,
        oro: false,
        gato: false
            },
            logros:{
                primerpaso: false,
                racha3: false,
                racha7: false,
                racha30: false,
                iniciador: false,
                creador: false,
                coleccionista: false,
                explorador: false,
                legendario: false,
                centenario: false,
                ganador: false,
                extraganador: false,
                extasis: false
            },
            rachamaslarga: 0,
            cantidadobjetivoscreados: 0
        };
        datosusuario.push(objusuario);
        let datosusuarioJSON = JSON.stringify(datosusuario, null, 2);
        fs.writeFileSync("data/usuarios.json", datosusuarioJSON);
        idusuario = idusuario + 1;
        objok = { ok: true};
        return objok;
});

subscribePOSTEvent("login", ({email, contraseña}) => {
    let objok = {ok:false};
let datosusuario = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
for (let i = 0; i < datosusuario.length; i++){
if (datosusuario[i].mail === email && datosusuario[i].contraseña === contraseña){
    objok = {ok:true};
    return objok;
}
}
    return objok;
})

subscribePOSTEvent("crearobjetivo", ({idusuario, titulo, estado, tipodeobjetivo, frecuencia, tiempo, veces, icono, color}) => {
    let objok = {ok:false};
    let objetivo = {
    idusuario: Number(idusuario),
    idobjetivo: idobjetivo,
    titulo: titulo,
    tipodeobjetivo: tipodeobjetivo,
    frecuencia: frecuencia,
    estado: estado,
    tiempo: tiempo,
    veces: veces,
    color: color,
    icono: icono

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
} 
idobjetivo = idobjetivo + 1;
});

startServer(3000, true);
