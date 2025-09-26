import fs from "fs";
export function devolverobjetivos(){
    objetivosaccion = JSON.parse(fs.readFileSync("data/objetivos_accion.json", "utf-8"));
    objetivostiempo = JSON.parse(fs.readFileSync("data/objetivos_tiempo.json", "utf-8"));
    let objetivos = objetivosaccion + objetivostiempo;
    let objetivosusuario = for (let i = 0; i < datosusuario.length; i++){
        
    }

    return objetivos;
}

