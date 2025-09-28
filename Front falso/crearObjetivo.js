// Conectamos con el servidor
connect2Server(3000);

const form = document.getElementById("form-objetivo");
const resultado = document.getElementById("resultado");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const idusuario = parseInt(document.getElementById("idusuario").value);
  const titulo = document.getElementById("titulo").value.trim();
  const tipodeobjetivo = document.getElementById("tipodeobjetivo").value;
  const frecuencia = document.getElementById("frecuencia").value.trim();
  const estado = document.getElementById("estado").value.trim();

  postEvent("crearobjetivo", { idusuario, titulo, tipodeobjetivo, frecuencia, estado }, (data) => {
    if (data.ok) {
      resultado.textContent = "✅ Objetivo creado con éxito";
      form.reset();
    } else {
      resultado.textContent = "❌ Error al crear el objetivo";
    }
  });
});
