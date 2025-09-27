connect2Server(3000); // puerto donde corre tu backend

const loginForm = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();

    if (email === "" || contraseña === "") {
        mensaje.textContent = "⚠️ Por favor, completa todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    // Enviar datos al backend usando postEvent
    postEvent("login", { email, contraseña }, (data) => {
        if (data.ok) {
            alert("✅ Haz iniciado sesión");
            window.location.href = "../menu principal/indexMenuPrincipal.html";
        } else {
            alert("❌ Te has equivocado");
            mensaje.textContent = "Usuario o contraseña incorrectos.";
            mensaje.style.color = "red";
        }
    });
});