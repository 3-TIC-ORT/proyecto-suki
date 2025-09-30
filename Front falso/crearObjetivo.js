// Conectar con el backend de SoqueTIC
connect2Server(3000);

const form = document.getElementById("form-objetivo");
const tipoSelect = document.getElementById("tipodeobjetivo");
const campoTiempo = document.getElementById("campo-tiempo");
const campoVeces = document.getElementById("campo-veces");

// Mostrar/ocultar campos según el tipo
tipoSelect.addEventListener("change", () => {
  if (tipoSelect.value === "tiempo") {
    campoTiempo.style.display = "block";
    campoVeces.style.display = "none";
  } else if (tipoSelect.value === "accion") {
    campoTiempo.style.display = "none";
    campoVeces.style.display = "block";
  } else {
    campoTiempo.style.display = "none";
    campoVeces.style.display = "none";
  }
});

// Helper: devolver null si no hay valor
const getValueOrNull = (id, parseNum = false) => {
  const el = document.getElementById(id);
  if (!el || el.value.trim() === "") return null;
  return parseNum ? parseInt(el.value) : el.value;
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const idusuario = getValueOrNull("idusuario", true);
  const titulo = getValueOrNull("titulo");
  const estado = getValueOrNull("estado");
  const tipodeobjetivo = getValueOrNull("tipodeobjetivo");
  const frecuencia = getValueOrNull("frecuencia");
  const tiempo = tipodeobjetivo === "tiempo" ? getValueOrNull("tiempo", true) : null;
  const veces = tipodeobjetivo === "accion" ? getValueOrNull("veces", true) : null;
  const icono = getValueOrNull("icono");
  const color = getValueOrNull("color");

  const payload = {
    idusuario,
    titulo,
    estado,
    tipodeobjetivo,
    frecuencia,
    tiempo,
    veces,
    icono,
    color
  };

  console.log("📤 Enviando objetivo:", payload);

  postEvent("crearobjetivo", payload, (data) => {
    console.log("📥 Respuesta backend:", data);
    if (data.ok) {
      alert("✅ Objetivo creado correctamente");
      form.reset();
      campoTiempo.style.display = "none";
      campoVeces.style.display = "none";
    } else {
      alert("❌ Error al crear el objetivo");
    }
  });
});
