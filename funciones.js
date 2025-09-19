import fs from "fs";
export function devolverobjetivos(){
    objetivos = JSON.parse(fs.readFileSync("data/objetivos.json", "utf-8"));
    return objetivos;
}

