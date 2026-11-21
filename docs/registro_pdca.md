# Registro PDCA (Deming) — Memoria Ancestral

| Ciclo | Plan (objetivo y criterio) | Do (hecho) | Check (medición) | Act (ajuste) |
|---|---|---|---|---|
| 1 · Base | Portada con título e integrante, menú y navegación entre escenas sin errores | Máquina de estados, fondo animado, música, portada | Navegación completa: 0 errores en consola; 60 FPS en el panel QA | Se estandarizan los parámetros en `config.js` |
| 2 · Pares | 3 niveles jugables; tablero visible sin scroll | Mazo aleatorio, vista previa, combos, datos culturales, 2 jugadores | Nivel 3 (20 cartas) se salía de la pantalla en 1366×768 | Se agregó `ajustar()`: el tablero se calcula según el alto de la ventana |
| 3 · Quipu | Medir el span y compararlo con 7 ± 2 | Secuencias con color y sonido, agrupación de 3, modo inverso, medidor | Prueba automatizada: 4 rondas correctas, span 6, el error resta vida | Pausa extra entre bloques de 3 para facilitar el *chunking* |
| 4 · Mercado | Reconocimiento después de una distracción | Estudio → cálculo distractor → reconocimiento con señuelos | Aciertos, falsas alarmas y olvidos se marcan por color | Puntaje penaliza falsas alarmas para evitar marcar todo |
| 5 · Calidad final | 0 errores, notificaciones limpias, versión móvil | Favicon, toast oculto, diseño responsive | 22 pantallazos automáticos en escritorio y móvil, 0 errores | Se publica en GitHub Pages |

## Principios de Deming aplicados

1. **Constancia en el propósito:** un objetivo fijo, reforzar la memoria, guía cada modo.
2. **Mejora continua (PDCA):** cinco ciclos documentados arriba.
3. **No depender de la inspección final:** pruebas automáticas en cada ciclo (`entregables/capturas`).
4. **Medir para mejorar:** panel QA (F2) con FPS, errores, precisión y tiempo de reacción.
5. **Eliminar barreras:** juego sin instalación, en el navegador y en móvil.
6. **Capacitación:** pantalla "Cómo jugar y ciencia" y consejos al final de cada partida.
7. **Orgullo del trabajo bien hecho:** estrellas, récords e historial de progreso.
8. **Estandarizar:** todos los parámetros de dificultad en `config.js`.
