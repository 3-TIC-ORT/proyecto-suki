// -------- MENÚ (se mantiene igual) --------
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

// -------- PROGRESO (se mantiene, pero sin event listener del botón Completar) --------
const puntosProgreso = document.getElementById("puntosProgreso");
const calendario = document.getElementById("calendario");
const totalCompletado = document.getElementById("totalCompletado");

const metaPorDia = 4;
let progresoHoy = 0;
let ultimaFechaCompletada = null;
let diasCompletados = 0;

// Crear puntos de progreso
for (let i = 0; i < metaPorDia; i++) {
  const punto = document.createElement("div");
  punto.classList.add("punto");
  puntosProgreso.appendChild(punto);
}

// Generar calendario según mes actual
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

// -------- GRÁFICO PIE (se mantiene igual) --------
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

// -------- TIMER CIRCULAR --------
const DURACION_TIMER = 60; // 60 segundos por tarea (cámbialo si quieres)
let timeLeft = DURACION_TIMER;
let isRunning = false;
let intervalId = null;
const hoy = new Date().toDateString();
const diaActual = new Date().getDate();

// Elementos del timer
const timerTimeEl = document.getElementById("timerTime");
const timerStatusEl = document.getElementById("timerStatus");
const timerProgressEl = document.querySelector(".timer-progress");
const btnComenzar = document.getElementById("btnComenzar");
const btnFrenar = document.getElementById("btnFrenar");
const puntos = document.querySelectorAll(".punto");
const dias = document.querySelectorAll(".dia");

// Configuración inicial del SVG
const radius = 80;
const circumference = 2 * Math.PI * radius; // ≈502.65
timerProgressEl.setAttribute("stroke-dasharray", circumference);
timerProgressEl.setAttribute("stroke-dashoffset", circumference);

// Formatear tiempo como MM:SS
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Actualizar display y animación
function updateTimer() {
  timerTimeEl.textContent = formatTime(timeLeft);
  
  // Calcular progreso (0% al inicio, 100% al final)
  const progress = ((DURACION_TIMER - timeLeft) / DURACION_TIMER) * 100;
  const offset = circumference - (progress / 100) * circumference;
  timerProgressEl.setAttribute("stroke-dashoffset", offset);
  
  if (timeLeft === 0) {
    timerStatusEl.textContent = "¡Completado!";
    isRunning = false;
    clearInterval(intervalId);
    btnFrenar.disabled = true;
    btnComenzar.disabled = true; // Deshabilitar hasta reset
    
    // Completar la tarea
    completarTarea();
    
    // Resetear después de 2 segundos
    setTimeout(() => {
      resetTimer();
    }, 2000);
  } else if (isRunning) {
    timerStatusEl.textContent = "Corriendo...";
  } else {
    timerStatusEl.textContent = "Pausado";
  }
}

// Comenzar timer
function startTimer() {
  if (ultimaFechaCompletada === hoy) {
    alert("Ya completaste este día ✅");
    return;
  }
  
  if (progresoHoy >= metaPorDia) {
    alert("¡Has completado todas las tareas del día! 🎉");
    return;
  }
  
  if (isRunning) return; // Ya está corriendo
  
  isRunning = true;
  timeLeft = DURACION_TIMER;
  btnComenzar.disabled = true;
  btnFrenar.disabled = false;
  btnFrenar.textContent = "Frenar";
  timerStatusEl.textContent = "Corriendo...";
  updateTimer();
  
  intervalId = setInterval(() => {
    if (isRunning) {
      timeLeft--;
      updateTimer();
    }
  }, 1000);
}

// Pausar o reanudar timer (toggle)
function toggleTimer() {
  if (timeLeft === 0) return; // No hacer nada si el timer terminó

  if (isRunning) {
    // Pausar
    isRunning = false;
    btnFrenar.textContent = "Reanudar";
    timerStatusEl.textContent = "Pausado";
  } else {
    // Reanudar
    isRunning = true;
    btnFrenar.textContent = "Frenar";
    timerStatusEl.textContent = "Corriendo...";
  }
}

// Resetear timer
function resetTimer() {
  clearInterval(intervalId);
  isRunning = false;
  timeLeft = DURACION_TIMER;
  btnComenzar.disabled = false;
  btnFrenar.disabled = true;
  btnFrenar.textContent = "Frenar";
  timerStatusEl.textContent = "Listo";
  updateTimer();
}

// Completar tarea (lógica integrada)
function completarTarea() {
  progresoHoy++;
  if (progresoHoy <= metaPorDia) {
    puntos[progresoHoy - 1].classList.add("activo");
  }
  
  if (progresoHoy === metaPorDia) {
    dias[diaActual - 1].classList.add("activo");
    ultimaFechaCompletada = hoy;
    diasCompletados++;
    totalCompletado.textContent = diasCompletados;
    
    grafico.data.datasets[0].data = [diasCompletados, diasMes - diasCompletados];
    grafico.update();
    
    // Resetear puntos después de animación
    setTimeout(() => {
      puntos.forEach(p => p.classList.remove("activo"));
      progresoHoy = 0;
    }, 500);
    
    alert("¡Día completado! ✅ Has alcanzado la meta.");
  } else {
    alert("¡Tarea completada! Sigue así. 👍");
  }
}

// Eventos
btnComenzar.addEventListener("click", startTimer);
btnFrenar.addEventListener("click", toggleTimer);

updateTimer();