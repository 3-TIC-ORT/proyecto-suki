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

connect2server(3000);

postEvent("devolverusuario", {idusuario}, (data) => {
  if (data.ok === true) {
    let idusuario = data.id;
container.innerHtml

  } else {
    ""
}
});



