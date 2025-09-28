// Conectar al servidor backend
connect2Server(3000);

const form = document.getElementById("formObjetivos");
const lista = document.getElementById("listaObjetivos");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // leer idusuario del input
  const idusuario = document.getElementById("idusuario").value.trim();

  // pedir al backend
  postEvent("objetivos", { idusuario }, (data) => {
    // limpiar lista
    lista.innerHTML = "";

    if (!data || data.length === 0) {
      lista.innerHTML = "<li>No hay objetivos para este usuario ❌</li>";
      return;
    }

    // mostrar cada objetivo
    data.forEach(obj => {
      const li = document.createElement("li");
      li.textContent = `${obj.titulo} (${obj.tipodeobjetivo}) → ${obj.estado}`;
      lista.appendChild(li);
    });
  });
});
