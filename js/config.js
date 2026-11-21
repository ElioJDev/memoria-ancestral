/* =========================================================
   MEMORIA ANCESTRAL: Guardianes del Tahuantinsuyo
   Configuración general (Deming: estandarizar parámetros en un solo lugar)
   Autor: Elio José Gabancho Catunta — Videojuegos II, UTP
   ========================================================= */
const CONFIG = {
  VERSION: '1.0.0',
  TITULO: 'MEMORIA ANCESTRAL',
  SUBTITULO: 'Guardianes del Tahuantinsuyo',
  AUTOR: 'Elio José Gabancho Catunta',
  CURSO: 'Videojuegos II',
  UNIVERSIDAD: 'Universidad Tecnológica del Perú (UTP)',

  // Modo 1: Pares del Tahuantinsuyo (memoria visual + codificación dual)
  PARES: [
    { nombre: 'Nivel 1 · Valle Sagrado', cols: 4, pares: 6,  preview: 3000, tiempo: 90 },
    { nombre: 'Nivel 2 · Cusco',         cols: 4, pares: 8,  preview: 3000, tiempo: 120 },
    { nombre: 'Nivel 3 · Machu Picchu',  cols: 5, pares: 10, preview: 2500, tiempo: 150 }
  ],

  // Modo 2: El Quipu Sagrado (memoria de trabajo / span)
  QUIPU: {
    spanInicial: 3,
    vidas: 2,
    msPorNudo: 620,     // tiempo que se ilumina cada nudo
    pausa: 220,         // pausa entre nudos
    pausaChunk: 500,    // pausa extra entre grupos de 3 (chunking, Miller 1956)
    colores: [
      { nombre: 'Rojo',     hex: '#c0392b', tecla: '1', nota: 293.66 }, // Re
      { nombre: 'Amarillo', hex: '#f2c14e', tecla: '2', nota: 329.63 }, // Mi
      { nombre: 'Verde',    hex: '#3f8f3a', tecla: '3', nota: 392.00 }, // Sol
      { nombre: 'Blanco',   hex: '#f4efe1', tecla: '4', nota: 440.00 }  // La  (escala pentatónica andina)
    ]
  },

  // Modo 3: El Mercado de Cusco (reconocimiento tras interferencia, Brown-Peterson)
  MERCADO: [
    { n: 3, estudio: 4500, distractor: 6000 },
    { n: 5, estudio: 6500, distractor: 8000 },
    { n: 7, estudio: 8500, distractor: 10000 }
  ],

  // Repetición espaciada sugerida (curva del olvido, Ebbinghaus 1885)
  REPASO_DIAS: [1, 3, 7, 14]
};
