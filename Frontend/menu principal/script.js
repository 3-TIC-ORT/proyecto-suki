const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
});

let botonCrear = document.getElementById('botonCrear');


let rutaCrearObjetivo = '..//Creacion de Objetivos/IndexCreacionDeObjetivos.html';

if (botonCrear) {
  botonCrear.addEventListener('click', function () {
    window.location.href = rutaCrearObjetivo;
  });
}
