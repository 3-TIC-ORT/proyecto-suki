function usuarios(usuario, contraseña, mail, fecha){
    let usuario = {
        nombre: nombre,
        contraseña: contraseña,
        mail: mail,
        fecha: fecha,
    };
let datos = JSON.parse(fs.readFileSync("data/usuarios.json", "utf-8"));
datos.push(usuario);
let datosJSON = JSON.stringify(datos, null, 2);
fs.writeFileSync("data/pedidos.json",datosJSON );
objok = {ok:true};
return objok;
}