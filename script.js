// Obtención del canvas y su contexto de dibujo 2D
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Se agrega una escala dinamica en lugar de un valor fijo para mejorar la visualización en diferentes tamaños de canvas
let escala;
let paso = 0; // Contador de pasos para la tabla de resultados
/**
 * Limpia completamente el canvas y la tabla de resultados.
 * Se utiliza antes de cada nueva ejecución del algoritmo.
 */
function limpiar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.querySelector("#tabla tbody").innerHTML = "";
}

/**
 * Dibuja un "píxel" escalado en el canvas.
 * Se usa para representar los puntos calculados por Bresenham.
 * 
 * @param {number} x - Coordenada X
 * @param {number} y - Coordenada Y
 */
function plot(x, y) {
    // Se invierte el eje Y para simular plano cartesiano
    ctx.fillRect(
        x * escala,
        canvas.height - y * escala,
        escala,
        escala
    );
}
/**
 * Dibuja los ejes cartesianos (X e Y) junto con sus marcas numéricas.
 * Permite visualizar mejor la ubicación de los puntos.
 */


// Dibuja una cuadrícula para mejorar la visualización del plano cartesiano.
function dibujarCuadricula(maxX, maxY) {
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;

    // Líneas verticales
    for (let i = 0; i <= maxX; i++) {
        ctx.beginPath();
        ctx.moveTo(i * escala, 0);
        ctx.lineTo(i * escala, canvas.height);
        ctx.stroke();
    }

    // Líneas horizontales
    for (let i = 0; i <= maxY; i++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - i * escala);
        ctx.lineTo(canvas.width, canvas.height - i * escala);
        ctx.stroke();
    }

    // Números
    ctx.fillStyle = "black";
    for (let i = 0; i <= maxX; i++) {
        ctx.fillText(i, i * escala, canvas.height - 5);
    }

    for (let i = 0; i <= maxY; i++) {
        ctx.fillText(i, 5, canvas.height - i * escala);
    }
}

/**
 * Inserta una fila en la tabla con los valores actuales del algoritmo.
 * Permite observar el proceso paso a paso.
 * 
 * @param {number} x - Coordenada X actual
 * @param {number} y - Coordenada Y actual
 * @param {number} err - Error actual
 * @param {number} e2 - Valor auxiliar (2*err)
 */
function agregarFila(x, y, err, e2) { // funcion que agrega una nueva fila a la tabla con los valores actuales del algoritmo

    //selecciona el cuerpo de la tabla donde se agregarán las filas
    const tabla = document.querySelector("#tabla tbody");
    //crea la fila
    const fila = `
        <tr>
            <td>${paso++}</td>
            <td>${x}</td>
            <td>${y}</td>
            <td>${err}</td>
            <td>${e2}</td>
        </tr>
    `;
//agrega una nueva fila al cuerpo de la tabla ya existente 
    tabla.innerHTML += fila;
}
//Algoritmo de Bresenham para dibujar una línea entre dos puntos (x0, y0) y (x1, y1) 
/**
 * Implementación del algoritmo de Bresenham.
 * Calcula los puntos de una línea entre dos coordenadas.
 * 
 * Además, registra cada paso en la tabla.
 * 
 * @param {number} x0 - Coordenada inicial X
 * @param {number} y0 - Coordenada inicial Y
 * @param {number} x1 - Coordenada final X
 * @param {number} y1 - Coordenada final Y
 */
function bresenham(x0, y0, x1, y1) {

    // Diferencias absolutas
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);

    // Dirección de incremento
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;

    // Error inicial
    let err = dx - dy;

    while (true) {

        // Dibujar punto actual
        plot(x0, y0);

        // Calcular doble del error
        let e2 = 2 * err;

        // Registrar en tabla
        agregarFila(x0, y0, err, e2); // agrega el registro actual a la tabla con los valores de x, y, err y e2 

        // Condición de parada
        if (x0 === x1 && y0 === y1) break;

        // Ajuste en X
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        // Ajuste en Y
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}
/**
 * Función principal del programa.
 * 
 * - Limpia el entorno
 * - Dibuja los ejes
 * - Obtiene valores del usuario
 * - Ejecuta Bresenham
 */
function dibujar() {

    limpiar();
    paso = 0;

    // Obtener valores desde inputs
    const x0 = parseInt(document.getElementById("x0").value);
    const y0 = parseInt(document.getElementById("y0").value);
    const x1 = parseInt(document.getElementById("x1").value);
    const y1 = parseInt(document.getElementById("y1").value);

    // Determinar tamaño máximo
    const maxX = Math.max(x0, x1);
    const maxY = Math.max(y0, y1);

    // Calcular escala dinámica
    escala = Math.min(
        canvas.width / (maxX + 1),
        canvas.height / (maxY + 1)
    );

    // Dibujar cuadrícula
    dibujarCuadricula(maxX, maxY);

    // Ejecutar Bresenham
    bresenham(x0, y0, x1, y1);
}

