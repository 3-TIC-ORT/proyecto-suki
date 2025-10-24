import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
let logroslista = [
  "primerpaso", "racha3", "racha7", "racha30",
  "iniciador", "creador", "coleccionista", "explorador",
  "legendario", "centenario", "ganador", "extraganador", "extasis"
];
let skinslista = {
    trump: 150,
    flash: 200,
    turro: 150,
    sullivan: 200,
    bikini: 300,
    rabino: 300,
    bizarrap: 150,
    oro: 1000,
    minecraft: 200
}

subscribePOSTEvent("modificarusuario",({idusuario, nuevousuario}) => {
    let objok = {ok: false}
    idusuario = Number(idusuario)
    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
}

if (!usuarioelegido) {
    return objok; 
}

usuarioelegido.usuario = nuevousuario
fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));
objok = {ok: true};
return{
    objok,
    usuario: usuarioelegido.usuario
}

})
subscribePOSTEvent("modificarmail",({idusuario, nuevomail}) => {
    let objok = {ok: false}
    idusuario = Number(idusuario)
    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
}

if (!usuarioelegido) {
    return objok; 
}

usuarioelegido.mail = nuevomail
fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));
objok = {ok: true};
return{
    objok,
    mail: usuarioelegido.mail
}
})
subscribePOSTEvent("modificarfecha",({idusuario, nuevafecha}) => {
    let objok = {ok: false}
    idusuario = Number(idusuario)
    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
}

if (!usuarioelegido) {
    return objok; 
}

usuarioelegido.fecha = nuevafecha
fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));
objok = {ok: true};
return{
    objok,
    fecha: usuarioelegido.fecha
}
})

subscribePOSTEvent("devolverusuario", ({idusuario}) => {
    let objok = {ok: false}
    idusuario = Number(idusuario)
    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
}

if (!usuarioelegido) {
    return objok; 
}

   objok = {ok: true}
return {
    objok,
    usuario: usuarioelegido
};
})

subscribePOSTEvent("nuevaskinelegida", ({idusuario, nuevaskin}) => {
    let objok = {ok: false}
    idusuario = Number(idusuario)
    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
    }
    if (!usuarioelegido) {
        return objok; 
    }
    usuarioelegido.skinseleccionada = nuevaskin
    fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));
    objok = {ok: true}
    return {
      objok,
      skindelusuario: usuarioelegido.skinseleccionada
    }
});

subscribePOSTEvent("comprar", ({idusuario, skin}) => {
let objok = {ok: false}
idusuario = Number(idusuario)
let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
let usuarioelegido = null;
for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].id === idusuario) {
        usuarioelegido = usuarios[i];
        break;
    }
}

if (!usuarioelegido) {
    return objok; 
}

let precio = skinslista[skin]

if (usuarioelegido.dinero < precio) {
    return objok;
  }

  usuarioelegido.dinero -= precio;
  usuarioelegido.skins[skin] = true;
  usuarioelegido.skinscompradas++;
  
  if (usuarioelegido.skinscompradas === 1 && !usuarioelegido.logros.coleccionista) {
    usuarioelegido.logros.coleccionista = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 20; 
}

if (usuarioelegido.rachaactual === 5 && !usuarioelegido.logros.explorador) {
    usuarioelegido.logros.explorador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 30; 
}
if (usuarioelegido.rachaactual === 10 && !usuarioelegido.logros.legendario) {
    usuarioelegido.logros.legendario = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 50; 
}

let totalLogros = 0;
for (let i = 0; i < logroslista.length; i++) {
    if (usuarioelegido.logros[logroslista[i]] === true) {
        totalLogros++;
    }
}

if (totalLogros >= 5 && !usuarioelegido.logros.ganador) {
    usuarioelegido.logros.ganador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 50;
}
if (totalLogros >= 10 && !usuarioelegido.logros.extraganador) {
    usuarioelegido.logros.extraganador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 100;
}
if (totalLogros === logroslista.length && !usuarioelegido.logros.extasis) {
    usuarioelegido.logros.extasis = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 200;
}



  fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));

  objok = {ok: true};
  return {
    objok,
    dinero: usuarioelegido.dinero,
    skins: usuarioelegido.skins,
    logros: usuarioelegido.logros,
    logrosdesbloqueados: usuarioelegido.logrosdesbloqueados
  };
})

subscribePOSTEvent("completarobjetivo",({idusuario, idobjetivo, tipodeobjetivo}) =>{
    let objok = {ok:false};
    let archivo = "";
    idobjetivo = Number(idobjetivo);
    idusuario = Number(idusuario);
    if (tipodeobjetivo === "tiempo"){
        archivo = "data/objetivos_tiempo.json";
    } else if (tipodeobjetivo === "accion"){
        archivo = "data/objetivos_accion.json";
    }
 
    let objetivostotal = JSON.parse(fs.readFileSync(archivo, "utf-8"));
    let objetivoelegido = null; 
    for (let i = 0; i < objetivostotal.length; i++) {
        if (objetivostotal[i].idobjetivo === idobjetivo && objetivostotal[i].idusuario === idusuario) {
            objetivoelegido = objetivostotal[i];
            break;
        }
    }
    if (!objetivoelegido) {
        return objok;
    }

    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
    }

    if (!usuarioelegido) {
        return objok; 
    }

    usuarioelegido.vecescompletadas++;
    

    let hoy = new Date().toISOString().split("T")[0];
    let ayer = new Date(Date.now() - 86400000).toISOString().split("T")[0];

 if (usuarioelegido.ultimodiaderacha === hoy) {
   
    } else if (usuarioelegido.ultimodiaderacha === ayer) {
        usuarioelegido.rachaactual+=1;
        usuarioelegido.dinero += 25;
    } else {
        usuarioelegido.rachaactual = 1;
        usuarioelegido.dinero += 25;
    }

 if (usuarioelegido.rachaactual > usuarioelegido.rachamaslarga) {
        usuarioelegido.rachamaslarga = usuarioelegido.rachaactual;
    }

    usuarioelegido.ultimodiaderacha = hoy;

   

    if (usuarioelegido.rachaactual === 3 && !usuarioelegido.logros.racha3) {
        usuarioelegido.logros.racha3 = true;
        usuarioelegido.logrosdesbloqueados++;
        usuarioelegido.dinero += 20; 
    }

    if (usuarioelegido.rachaactual === 7 && !usuarioelegido.logros.racha7) {
        usuarioelegido.logros.racha7 = true;
        usuarioelegido.logrosdesbloqueados++;
        usuarioelegido.dinero += 30; 
    }
    if (usuarioelegido.rachaactual === 30 && !usuarioelegido.logros.racha30) {
        usuarioelegido.logros.racha30 = true;
        usuarioelegido.logrosdesbloqueados++;
        usuarioelegido.dinero += 50; 
    }

let totalLogros = 0;
for (let i = 0; i < logroslista.length; i++) {
    if (usuarioelegido.logros[logroslista[i]] === true) {
        totalLogros++;
    }
}

if (totalLogros >= 5 && !usuarioelegido.logros.ganador) {
    usuarioelegido.logros.ganador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 50;
}
if (totalLogros >= 10 && !usuarioelegido.logros.extraganador) {
    usuarioelegido.logros.extraganador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 100;
}
if (totalLogros === logroslista.length && !usuarioelegido.logros.extasis) {
    usuarioelegido.logros.extasis = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 200;
}



    fs.writeFileSync(archivo, JSON.stringify(objetivostotal, null, 2));
    fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));
    objok = {ok:true};
    return {objok,
        dinero: usuarioelegido.dinero,
        racha: usuarioelegido.rachaactual,
        rachamaslarga: usuarioelegido.rachamaslarga,
        logros: usuarioelegido.logros,
        logrosdesbloqueados: usuarioelegido.logrosdesbloqueados
        }
});


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
               break;
            }
}
let objetivoJSON = JSON.stringify(objetivo, null, 2);
            fs.writeFileSync(archivo, objetivoJSON);
            objok = {ok:true};
            return objok;
});

subscribePOSTEvent("devolverobjetivos", ({idusuario}) => {
    let objok = {ok:false};
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

        objok = {ok:true};
        return {
        objok,
        objetivos: objetivousuarios
        };
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
            id: Date.now(),
            contraseña: contraseña,
            mail: mail,
            fecha: fecha,
            racha: 0,
            logrosdesbloqueados: 0,
            skinscompradas: 0,
            dinero: 0,
            fechadecreacion: new Date().toISOString().split("T")[0],
            skins: {
        suki: true,
        trump: false,
        flash: false,
        turro: false,
        sullivan: false,
        bikini: false,
        rabino: false,
        bizarrap: false,
        oro: false,
        minecraft: false
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
            rachaactual: 0,
            ultimodiaderacha: null,
            cantidadobjetivoscreados: 0,
            skinseleccionada: "suki"
        };
        datosusuario.push(objusuario);
        let datosusuarioJSON = JSON.stringify(datosusuario, null, 2);
        fs.writeFileSync("data/usuarios.json", datosusuarioJSON);
        objok = { ok: true};
        return objok;
});

subscribePOSTEvent("login", ({mail, contraseña}) => {
    let objok = {ok:false};
let datosusuario = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
for (let i = 0; i < datosusuario.length; i++){
if (datosusuario[i].mail === mail && datosusuario[i].contraseña === contraseña){
    objok = {ok:true, id: datosusuario[i].id, usuario: datosusuario[i].usuario};
    return objok;
}
}
    return objok;
})

subscribePOSTEvent("crearobjetivo", ({idusuario, titulo, tipodeobjetivo, tiempo, veces, icono, color}) => {
    let objok = {ok:false};
    let archivo = "";
    idusuario = Number(idusuario);
    if (tipodeobjetivo === "tiempo"){
        archivo = "data/objetivos_tiempo.json";
    } else if (tipodeobjetivo === "accion"){
        archivo = "data/objetivos_accion.json";
    }
    let objetivo = {
    idusuario: idusuario,
    idobjetivo: Date.now(),
    titulo: titulo,
    tipodeobjetivo: tipodeobjetivo,
    tiempo: tiempo,
    veces: veces,
    vecescompletadas: 0,
    color: color,
    icono: icono

};
    let objetivos = JSON.parse(fs.readFileSync(archivo, "utf-8"));
    objetivos.push(objetivo);
    let objetivoJSON = JSON.stringify(objetivos, null, 2);
    fs.writeFileSync(archivo, objetivoJSON);

    let usuarios = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
    let usuarioelegido = null;
    for (let i = 0; i < usuarios.length; i++) {
        if (usuarios[i].id === idusuario) {
            usuarioelegido = usuarios[i];
            break;
        }
    }
    if (!usuarioelegido) {
        return objok; 
    }

 usuarioelegido.cantidadobjetivoscreados++;


   if (usuarioelegido.cantidadobjetivoscreados === 1 && !usuarioelegido.logros.iniciador) {
        usuarioelegido.logros.iniciador = true;
        usuarioelegido.logrosdesbloqueados++;
        usuarioelegido.dinero += 10;
    }

     if (usuarioelegido.cantidadobjetivoscreados === 5 && !usuarioelegido.logros.creador) {
        usuarioelegido.logros.creador = true;
        usuarioelegido.logrosdesbloqueados++;
        usuarioelegido.dinero += 20;
    }

let totalLogros = 0;
for (let i = 0; i < logroslista.length; i++) {
    if (usuarioelegido.logros[logroslista[i]] === true) {
        totalLogros++;
    }
}

if (totalLogros >= 5 && !usuarioelegido.logros.ganador) {
    usuarioelegido.logros.ganador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 50;
}
if (totalLogros >= 10 && !usuarioelegido.logros.extraganador) {
    usuarioelegido.logros.extraganador = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 100;
}
if (totalLogros === logroslista.length && !usuarioelegido.logros.extasis) {
    usuarioelegido.logros.extasis = true;
    usuarioelegido.logrosdesbloqueados++;
    usuarioelegido.dinero += 200;
}

fs.writeFileSync("data/usuarios.json", JSON.stringify(usuarios, null, 2));
objok = {ok:true};
return {objok,
        dinero: usuarioelegido.dinero,
        racha: usuarioelegido.rachaactual,
        rachamaslarga: usuarioelegido.rachamaslarga,
        logros: usuarioelegido.logros,
        logrosdesbloqueados: usuarioelegido.logrosdesbloqueados
        }

});

startServer(3000, true);
