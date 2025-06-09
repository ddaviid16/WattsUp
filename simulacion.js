function cargarSimulacion() {
  const usuario = localStorage.getItem("usuarioActivo");
  if (!usuario) {
    alert("Por favor selecciona un usuario antes de continuar.");
    return;
  }

  const dispositivos = JSON.parse(localStorage.getItem(`misDispositivos_${usuario}`) || "[]");
  const lista = document.getElementById("seleccionables");
  lista.innerHTML = "";

  dispositivos.forEach((d, i) => {
    const li = document.createElement("li");
    li.className = "lista-simulacion";
    li.dataset.nombre = d.nombre;
    li.dataset.marca = d.marca;
    li.dataset.consumo = d.consumo_por_hora;

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.checked = true;
    chk.dataset.index = i;
    chk.dataset.nombre = d.nombre;
    chk.dataset.consumo = d.consumo_por_hora;
    chk.dataset.marca = d.marca;
    chk.onchange = calcularTotal;

    const label = document.createElement("span");
    label.innerHTML = `
      <strong>${d.nombre}</strong><br>
      <small><em>Marca:</em> ${d.marca}</small><br>
      <small>${d.consumo_por_hora} KWh</small>
    `;

    li.appendChild(chk);
    li.appendChild(label);
    lista.appendChild(li);
  });

  calcularTotal();
}

function calcularTotal() {
  const checks = document.querySelectorAll("#seleccionables input[type=checkbox]:checked");
  let total = 0;
  let labels = [], data = [];

  const colores = [
    "#42a5f5", "#ef5350", "#ffa726", "#ffee58", "#4db6ac", "#ba68c8", "#7986cb", "#ff7043"
  ];

  checks.forEach(c => {
    const consumo = parseFloat(c.dataset.consumo) * 2 * 30;
    total += consumo;
    labels.push(c.dataset.nombre);
    data.push(consumo.toFixed(1));
  });

  document.getElementById("consumoTotal").textContent = total.toFixed(1) + " KWh";

  const nivel = document.getElementById("nivel");
  const panel = document.getElementById("panelConsumo");

  panel.classList.remove("panel-bajo", "panel-medio", "panel-alto");

  if (total < 75) {
    nivel.textContent = "Consumo Bajo";
    panel.classList.add("panel-bajo");
  } else if (total < 200) {
    nivel.textContent = "Consumo Medio";
    panel.classList.add("panel-medio");
  } else {
    nivel.textContent = "Consumo Alto";
    panel.classList.add("panel-alto");
  }

  const ctx = document.getElementById("grafica").getContext("2d");
  if (window.chart) window.chart.destroy();
  window.chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Consumo por producto en KWh',
        data: data,
        backgroundColor: colores
      }]
    }
  });

  const items = document.querySelectorAll("#seleccionables li");
  let i = 0;
  items.forEach(item => {
    const checkbox = item.querySelector("input[type=checkbox]");
    if (checkbox && checkbox.checked) {
      item.style.borderLeft = "5px solid " + colores[i % colores.length];
      i++;
    } else {
      item.style.borderLeft = "5px solid transparent";
    }
  });
}

window.onload = cargarSimulacion;
