# MEMORIA ANCESTRAL · Guardianes del Tahuantinsuyo

Juego web en pixel art para **reforzar la memoria** con el patrimonio cultural del Perú.

- **Integrante:** Elio José Gabancho Catunta
- **Curso:** Videojuegos II, Universidad Tecnológica del Perú (UTP)
- **Juego en línea:** https://eliojdev.github.io/memoria-ancestral/
- **Tecnología:** HTML5, CSS3, JavaScript puro (sin librerías), Canvas 2D y Web Audio API
- **Plataforma:** web (escritorio y móvil, sin instalación)
- **Calidad total:** W. Edwards Deming (ciclo PDCA y panel QA con F2)

## Modos de juego

| Modo | Tipo de memoria | Base psicológica |
|---|---|---|
| **1. Pares del Tahuantinsuyo** (3 niveles + 2 jugadores) | Visual y episódica | Codificación dual (Paivio, 1971); niveles de procesamiento (Craik y Lockhart, 1972) |
| **2. El Quipu Sagrado** (directo / inverso, con o sin agrupación) | Memoria de trabajo (span) | Baddeley y Hitch (1974); 7 ± 2 y *chunking* (Miller, 1956) |
| **3. El Mercado de Cusco** (3 rondas: 3, 5 y 7 productos) | Corto plazo con interferencia | Brown (1958) y Peterson y Peterson (1959); curva del olvido (Ebbinghaus, 1885) |
| **Mi progreso** | Seguimiento y repaso espaciado | Repetición espaciada (Ebbinghaus); medición (Deming) |

## Controles

| Acción | Tecla |
|---|---|
| Comenzar / confirmar | Enter o clic |
| Nudos del quipu | 1 · 2 · 3 · 4 o clic |
| Volver al menú | Esc |
| Silenciar | M |
| Panel de calidad (QA) | F2 |

## Estructura

```
memoria-ancestral/
├── index.html                pantallas: portada, menú, 3 modos, progreso, ayuda, créditos
├── css/style.css             estilo pixel art (fuente Press Start 2P)
├── js/
│   ├── config.js             parámetros de niveles (un solo lugar = estandarización)
│   ├── pixelart.js           12 sprites 16x16 de patrimonio peruano + datos culturales
│   ├── audio.js              música andina pentatónica y efectos sintetizados
│   ├── qa.js                 panel QA (FPS, errores, aciertos, tiempo de reacción)
│   ├── guardado.js           historial y repaso espaciado (localStorage)
│   ├── fondo.js              paisaje andino animado
│   ├── main.js               máquina de estados de escenas
│   └── modes/pares.js · quipu.js · mercado.js
├── assets/pixelart/png|jpg   sprites exportados (PNG y JPG)
├── tools/exportar_pixelart.py
├── docs/                     registro PDCA, pruebas, guion del video
└── entregables/capturas/     pantallazos de la funcionalidad
```

## Ejecutar en local

Abre `index.html` en Chrome o Edge, o sirve la carpeta con `python -m http.server` y entra a `http://localhost:8000`.

## Créditos

Código, pixel art y sonido: Elio José Gabancho Catunta. Fuente *Press Start 2P* de CodeMan38 (SIL Open Font License).
