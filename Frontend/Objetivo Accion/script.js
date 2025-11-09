
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
const btnCerrarSesion = document.getElementById("btnCerrarSesion");
if (btnCerrarSesion) {
  btnCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("idusuario");
    localStorage.removeItem("usuario");
    window.location.href = "..//InicioSesion/IndexInicioSesion.html?logout=1";
  });
}



const botonCompletar = document.getElementById("botonCompletar");
const puntosProgreso = document.getElementById("puntosProgreso");
const calendario = document.getElementById("calendario");
const totalCompletado = document.getElementById("totalCompletado");

const metaPorDia = 4;
let progresoHoy = 0;
let ultimaFechaCompletada = null;
let diasCompletados = 0;


for (let i = 0; i < metaPorDia; i++) {
  const punto = document.createElement("div");
  punto.classList.add("punto");
  puntosProgreso.appendChild(punto);
}


function generarCalendario() {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  const mes = fecha.getMonth();
  const diasMes = new Date(anio, mes + 1, 0).getDate();

  calendario.innerHTML = "";
  for (let d = 1; d <= diasMes; d++) {
    const dia = document.createElement("div");
    dia.classList.add("dia");
    dia.textContent = d;
    calendario.appendChild(dia);
  }
  return diasMes;
}
const diasMes = generarCalendario();


const ctx = document.getElementById("graficoProgreso").getContext("2d");
const grafico = new Chart(ctx, {
  type: "pie",
  data: {
    labels: ["Completados", "Pendientes"],
    datasets: [{
      label: "Progreso",
      data: [0, diasMes],
      backgroundColor: ["limegreen", "#ddd"]
    }]
  },
  options: { responsive: true }
});


botonCompletar.addEventListener("click", () => {
  const hoy = new Date().toDateString();
  const diaActual = new Date().getDate();
  const puntos = document.querySelectorAll(".punto");

  if (ultimaFechaCompletada === hoy) {
    alert("Ya completaste este día");
    return;
  }

  progresoHoy++;
  puntos[progresoHoy - 1].classList.add("activo");

  if (progresoHoy === metaPorDia) {
    const dias = document.querySelectorAll(".dia");
    dias[diaActual - 1].classList.add("activo");

    ultimaFechaCompletada = hoy;
    diasCompletados++;
    totalCompletado.textContent = diasCompletados;

    grafico.data.datasets[0].data = [diasCompletados, diasMes - diasCompletados];
    grafico.update();

    setTimeout(() => {
      puntos.forEach(p => p.classList.remove("activo"));
      progresoHoy = 0;
    }, 500);
  }
});
