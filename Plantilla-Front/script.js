document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://backend:8000/optimizar"; 
  // - Si corres sin Docker: usa "http://localhost:8000/optimizar"
  // - Si corres con Docker Compose: "http://backend:8000/optimizar"

  const proyectosDiv = document.getElementById("proyectos");
  const addProyectoBtn = document.getElementById("addProyecto");
  const calcularBtn = document.getElementById("calcular");
  const limpiarBtn = document.getElementById("limpiar");
  const cargarEjemploBtn = document.getElementById("cargarEjemplo");
  const resultadosDiv = document.getElementById("resultados");
  const tablaResultados = document.getElementById("tablaResultados");
  const alerta = document.getElementById("alerta");

  let contador = 0;

  // Crear campos dinámicos para proyectos
  function agregarProyecto(nombre = "", beneficio = "", costo = "") {
    contador++;
    const proyecto = document.createElement("div");
    proyecto.className = "row g-3 mb-2 align-items-center";
    proyecto.innerHTML = `
      <div class="col-md-3">
        <input type="text" class="form-control" placeholder="Nombre del proyecto" value="${nombre}">
      </div>
      <div class="col-md-3">
        <input type="number" class="form-control" placeholder="Beneficio" value="${beneficio}">
      </div>
      <div class="col-md-3">
        <input type="number" class="form-control" placeholder="Costo" value="${costo}">
      </div>
      <div class="col-md-3">
        <button class="btn btn-danger eliminar">Eliminar</button>
      </div>
    `;

    proyecto.querySelector(".eliminar").addEventListener("click", () => {
      proyecto.remove();
    });

    proyectosDiv.appendChild(proyecto);
  }

  // Botón para añadir proyectos
  addProyectoBtn.addEventListener("click", () => agregarProyecto());

  // Botón para limpiar todo
  limpiarBtn.addEventListener("click", () => {
    proyectosDiv.innerHTML = "";
    resultadosDiv.style.display = "none";
    alerta.style.display = "none";
    contador = 0;
  });

  // Botón para cargar ejemplo
  cargarEjemploBtn.addEventListener("click", () => {
    proyectosDiv.innerHTML = "";
    agregarProyecto("Proyecto A", 100, 50);
    agregarProyecto("Proyecto B", 60, 20);
    agregarProyecto("Proyecto C", 120, 60);
    agregarProyecto("Proyecto D", 80, 40);
  });

  // Botón para calcular resultados
  calcularBtn.addEventListener("click", async () => {
    const proyectos = [];
    proyectosDiv.querySelectorAll(".row").forEach((row) => {
      const inputs = row.querySelectorAll("input");
      const nombre = inputs[0].value.trim();
      const beneficio = parseFloat(inputs[1].value);
      const costo = parseFloat(inputs[2].value);

      if (nombre && !isNaN(beneficio) && !isNaN(costo)) {
        proyectos.push({ nombre, beneficio, costo });
      }
    });

    if (proyectos.length === 0) {
      alerta.style.display = "block";
      return;
    } else {
      alerta.style.display = "none";
    }

    const data = { proyectos };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en la API");
      }

      const result = await response.json();

      // Mostrar resultados en la tabla
      tablaResultados.innerHTML = `
        <tr>
          <th>Proyectos Seleccionados</th>
          <td>${result.proyectos_seleccionados.join(", ")}</td>
        </tr>
        <tr>
          <th>Beneficio Total</th>
          <td>${result.beneficio_total}</td>
        </tr>
        <tr>
          <th>Costo Total</th>
          <td>${result.costo_total}</td>
        </tr>
      `;
      resultadosDiv.style.display = "block";
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un problema al calcular la optimización.");
    }
  });
});
