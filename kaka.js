import fs from "fs";
let cosas = {
    idusuario: 1,
    titulo: "Objetivo de tiempo",
    tipodeobjetivo: "tiempo",
    frecuencia: "diaria",
    estado: "activo",
}
let listavacia = JSON.parse(fs.readFileSync("data/objetivos_tiempo.json", "utf-8"));
listavacia.push(cosas);
let listavaciaJSON = JSON.stringify(listavacia, null, 2);
fs.writeFileSync("data/objetivos_tiempo.json", listavaciaJSON);