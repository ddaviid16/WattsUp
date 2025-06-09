let productos = [];

async function cargarDatos() {
  const res = await fetch("productos_consumo.json");
  productos = await res.json();

  const marcas = [...new Set(productos.map(p => p.marca))];
  const marcaSelect = document.getElementById("marca");
  marcas.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    marcaSelect.appendChild(option);
  });

  renderLista();
}

function filtrarProductos() {
  const marca = document.getElementById("marca").value;
  const productoSelect = document.getElementById("producto");
  productoSelect.innerHTML = "";

  const filtrados = productos.filter(p => p.marca === marca);
  filtrados.forEach(p => {
    const option = document.createElement("option");
    option.value = JSON.stringify(p);
    option.textContent = p.nombre;
    productoSelect.appendChild(option);
  });
}

function agregarDispositivo() {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) {
    alert("Por favor selecciona un usuario antes de agregar dispositivos.");
    return;
  }

  const select = document.getElementById("producto");
  const seleccionado = select.value;
  if (!seleccionado) return;

  const dispositivos = JSON.parse(localStorage.getItem(`misDispositivos_${usuario}`) || "[]");
  const nuevo = JSON.parse(seleccionado);
  dispositivos.push(nuevo);
  localStorage.setItem(`misDispositivos_${usuario}`, JSON.stringify(dispositivos));
  renderLista();
}

function eliminarDispositivo(index) {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) return;

  const dispositivos = JSON.parse(localStorage.getItem(`misDispositivos_${usuario}`) || "[]");
  dispositivos.splice(index, 1);
  localStorage.setItem(`misDispositivos_${usuario}`, JSON.stringify(dispositivos));
  renderLista();
}

function renderLista() {
  const usuario = localStorage.getItem("usuarioActivo");
  const lista = document.getElementById("lista");
  if (!lista || !usuario) return;

  const dispositivos = JSON.parse(localStorage.getItem(`misDispositivos_${usuario}`) || "[]");
  lista.innerHTML = "";
  dispositivos.forEach((d, i) => {
  const li = document.createElement("li");
const marcaClase = d.marca.toLowerCase().replace(/\s/g, ''); // elimina espacios
li.className = `lista-dispositivo borde-${marcaClase}`;

li.innerHTML = `
  <div>
    <strong>${d.nombre}</strong><br>
    <small><em>Marca:</em> ${d.marca}</small><br>
    <small>${d.consumo_por_hora} KWh</small>
  </div>
  <button onclick="eliminarDispositivo(${i})">Eliminar</button>
`;


    lista.appendChild(li);
  
  });
}
window.onload = cargarDatos;

