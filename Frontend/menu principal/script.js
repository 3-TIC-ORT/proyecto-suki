connect2Server(3000);

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

const RUTAS_POR_TIPO = {
  accion: '..//Objetivo Accion/indexObjetivoAccion.html',
  tiempo: '..//Objetivo Tiempo/indexObjetivoTiempo.html'
};

function appendObjetivoCard(obj) {
  const cont = document.getElementById('objetivos');
  if (!cont) return;

  const destino = RUTAS_POR_TIPO[(obj?.tipo || '').toLowerCase()];

  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'objetivo-card';
  card.textContent = obj?.nombre || 'Objetivo';

  if (destino) {
    card.addEventListener('click', () => {
      if (obj?.idObjetivo) localStorage.setItem('idObjetivo', obj.idObjetivo);
      window.location.href = destino;
    });
  } else {
    card.disabled = true;
  }

  cont.appendChild(card);
}

postEvent("menu_principal_loaded", idusuario, (res) => {
  const cont = document.getElementById('objetivos');
  if (!cont) return;
  cont.innerHTML = '';
  const objetivos = Array.isArray(res) ? res : (res?.objetivos || []);
  for (let i = 0; i < objetivos.length; i++) {
    const obj = objetivos[i];
    appendObjetivoCard(obj);
    if (obj?.idUsuario) localStorage.setItem('idUsuario', obj.idUsuario);
  }
});