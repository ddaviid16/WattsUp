function pedirUsuario() {
  const nombre = prompt("Ingresa un nombre para tu hogar o usuario:");
  if (nombre) {
    let usuarios = JSON.parse(localStorage.getItem("usuariosLista")) || [];
    if (!usuarios.includes(nombre)) {
      usuarios.push(nombre);
      localStorage.setItem("usuariosLista", JSON.stringify(usuarios));
    }
    localStorage.setItem('usuarioActivo', nombre);
    mostrarNotificacion("Sesión iniciada para: " + nombre);
  }
}

function cambiarUsuario() {
  localStorage.removeItem('usuarioActivo');
  pedirUsuario();
}

function cargarUsuarios() {
  const contenedor = document.getElementById("listaUsuarios");
  if (!contenedor) return; // Solo funciona en usuarios.html

  contenedor.innerHTML = "";

  const usuarios = JSON.parse(localStorage.getItem("usuariosLista")) || [];

  if (usuarios.length === 0) {
    contenedor.innerHTML = "<p>No hay usuarios registrados.</p>";
    return;
  }

usuarios.forEach(nombre => {
  const div = document.createElement("div");
  div.className = "usuario-card"; // <- aquí se agrega la clase de estilo
  div.innerHTML = `
    <strong>${nombre}</strong>
    <div class="usuario-botones">
      <button onclick="usar('${nombre}')">Usar</button>
      <button onclick="eliminar('${nombre}')">Eliminar</button>
    </div>
  `;
  contenedor.appendChild(div);
});
}

function usar(nombre) {
  localStorage.setItem("usuarioActivo", nombre);
  mostrarNotificacion(`Ahora estás usando: ${nombre}`);
  
}

function eliminar(nombre) {
  let usuarios = JSON.parse(localStorage.getItem("usuariosLista")) || [];
  usuarios = usuarios.filter(u => u !== nombre);
  localStorage.setItem("usuariosLista", JSON.stringify(usuarios));
  if (localStorage.getItem("usuarioActivo") === nombre) {
    localStorage.removeItem("usuarioActivo");
  }
  mostrarNotificacion(`Usuario eliminado: ${nombre}`);
  cargarUsuarios();
}


function nuevoUsuario() {
  document.getElementById("modalUsuario").classList.remove("oculto");
}

function cerrarModalUsuario() {
  document.getElementById("modalUsuario").classList.add("oculto");
  document.getElementById("inputUsuario").value = "";
}

function confirmarNuevoUsuario() {
  const nombre = document.getElementById("inputUsuario").value.trim();
  if (!nombre) {
    mostrarNotificacion("Debes ingresar un nombre.");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuariosLista")) || [];
  if (!usuarios.includes(nombre)) {
    usuarios.push(nombre);
    localStorage.setItem("usuariosLista", JSON.stringify(usuarios));
  }
  localStorage.setItem("usuarioActivo", nombre);
  mostrarNotificacion("Usuario añadido y activado.");
  cerrarModalUsuario();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);
}


function mostrarNotificacion(mensaje, duracion = 3000) {
  const noti = document.getElementById("notificacion");
  if (!noti) return;
  noti.textContent = mensaje;
  noti.classList.remove("oculto");
  noti.classList.add("visible");

  setTimeout(() => {
    noti.classList.remove("visible");
    noti.classList.add("oculto");
  }, duracion);
}

window.onload = () => {
  const usuario = localStorage.getItem('usuarioActivo');

  if (!usuario && !location.href.includes("Usuarios.html")) {
    mostrarNotificacion("¡Bienvenida/o! Para continuar, primero registra tu hogar o usuario.");
    return;
  }

  cargarUsuarios(); // Si estamos en usuarios.html
};


function confirmarNuevoUsuario() {
  const nombre = document.getElementById("inputUsuario").value.trim();
  if (!nombre) {
    mostrarNotificacion("Debes ingresar un nombre.");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuariosLista")) || [];

  if (usuarios.includes(nombre)) {
    mostrarNotificacion("Ese nombre ya existe. Intenta con otro.");
    return;
  }

  usuarios.push(nombre);
  localStorage.setItem("usuariosLista", JSON.stringify(usuarios));
  localStorage.setItem("usuarioActivo", nombre);
  mostrarNotificacion("Usuario añadido y activado.");
cerrarModalUsuario();
cargarUsuarios(); // recargar visualmente la lista

}
