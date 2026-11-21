/* =========================================================
   Pixel art del juego (16x16). Cada sprite es una matriz de caracteres;
   cada carácter es un color de la paleta. Se dibuja en <canvas> y se
   escala con image-rendering: pixelated. Los mismos sprites se exportan
   a PNG y JPG con tools/exportar_pixelart.py
   ========================================================= */
const PALETA = {
  '.': null,
  k: '#1a1220', w: '#f4efe1', y: '#f2c14e', o: '#d9822b', r: '#b8322a',
  p: '#e0607e', g: '#4e9a3f', G: '#2f6b2a', b: '#3a6ea5', c: '#6cc3d5',
  n: '#a0663f', N: '#5b3a29', s: '#d8b383', h: '#9aa0a6', m: '#7b4fa0', l: '#fff6c8'
};

const SPRITES = {
  llama: [
    '..........kk....',
    '.........kwwk...',
    '.........kwwkk..',
    '.........kwkwk..',
    '.........kwwwk..',
    '.........kwwk...',
    '.........kwwk...',
    '..kkkkkkkkwwk...',
    '.kwwwwwwwwwwk...',
    '.kwwrwrwrwwwk...',
    '.kwwwwwwwwwwk...',
    '..kwwkkkkwwk....',
    '..kwk....kwk....',
    '..kwk....kwk....',
    '..kNk....kNk....',
    '..kk.....kk.....'
  ],
  condor: [
    '................',
    '................',
    '.......kk.......',
    '......kwwk......',
    '......kkok......',
    '.kkk..kkkk..kkk.',
    'kkkkkkkkkkkkkkkk',
    '.kwwkkkkkkkkwwk.',
    '..kwwkkkkkkwwk..',
    '...kwk.kk.kwk...',
    '....k..kk..k....',
    '.......kk.......',
    '......k..k......',
    '................',
    '................',
    '................'
  ],
  tumi: [
    '.....kkkkkk.....',
    '....kyyyyyyk....',
    '...kyyoyyoyyk...',
    '....kyyyyyyk....',
    '.....kykkyk.....',
    '.....kyrryk.....',
    '......kyyk......',
    '......koyk......',
    '......kyok......',
    '......koyk......',
    '....kkkyykkk....',
    '...kyyyyyyyyk...',
    '..kyyyyyyyyyyk..',
    '..kylyyyyyylyk..',
    '...kkkkkkkkkk...',
    '................'
  ],
  inti: [
    '.......oo.......',
    '..o....oo....o..',
    '...o..kkkk..o...',
    '....kkyyyykk....',
    '...kyyyyyyyyk...',
    'oo.kykkyykkyk.oo',
    'oo.kyyyyyyyyk.oo',
    '...kyyyoyyyyk...',
    '...kyykkkkyyk...',
    '...kyyyyyyyyk...',
    '....kkyyyykk....',
    '...o..kkkk..o...',
    '..o....oo....o..',
    '.......oo.......',
    '................',
    '................'
  ],
  huaco: [
    '................',
    '......kkkk......',
    '......knnk......',
    '.....knnnnk.....',
    '....kkkkkkkk....',
    '...knnnnnnnnk...',
    '..knnwwnnwwnnk..',
    '..knnkwnnkwnnk..',
    '..knnnnnnnnnnk..',
    '..knnnrrrrnnnk..',
    '..knsnsnsnsnnk..',
    '...knnnnnnnnk...',
    '....knnnnnnk....',
    '.....kkkkkk.....',
    '................',
    '................'
  ],
  chakana: [
    '................',
    '......kkkk......',
    '......kbbk......',
    '....kkkbbkkk....',
    '....kbbbbbbk....',
    '..kkkbbkkbbkkk..',
    '..kbbbkyykbbbk..',
    '..kbbbkyykbbbk..',
    '..kkkbbkkbbkkk..',
    '....kbbbbbbk....',
    '....kkkbbkkk....',
    '......kbbk......',
    '......kkkk......',
    '................',
    '................',
    '................'
  ],
  maiz: [
    '.......kk.......',
    '......kyyk......',
    '.....kyyyyk.....',
    '.....kyoyyk.....',
    '.....kyyoyk.....',
    '.....kyoyyk.....',
    '....gkyyoykg....',
    '...gGkyoyykGg...',
    '...gGkyyoykGg...',
    '...gGkyyyykGg...',
    '....gGkyykGg....',
    '.....gGkkGg.....',
    '......gGGg......',
    '.......gg.......',
    '.......Gk.......',
    '................'
  ],
  papa: [
    '................',
    '................',
    '.....kkkkk......',
    '...kkmmmmmkk....',
    '..kmmmmwmmmmk...',
    '..kmmmmmmmmmmk..',
    '.kmmwmmmmmmwmk..',
    '.kmmmmmmmmmmmk..',
    '.kmmmmmmwmmmmk..',
    '..kmmmmmmmmmk...',
    '...kkmmmmmkk....',
    '.....kkkkk......',
    '................',
    '................',
    '................',
    '................'
  ],
  colibri: [
    '................',
    '.........kk.....',
    '........kggk....',
    'kkkkkkkkgkgk....',
    '........kgggk...',
    '.......kgggggk..',
    '.....kkggcggk...',
    '...kkgggccgk....',
    '..kggggggggk....',
    '.kgggk.kgggk....',
    '.kgk...kggk.....',
    '.kk.....kgk.....',
    '.........kk.....',
    '................',
    '................',
    '................'
  ],
  chullo: [
    '.......kk.......',
    '......kwwk......',
    '.......kk.......',
    '......krrk......',
    '.....krrrrk.....',
    '....krywyrrk....',
    '...krrrrrrrrk...',
    '..kyywyywyywyk..',
    '..krrrrrrrrrrk..',
    '..kbbybbybbybk..',
    '..kkkkkkkkkkkk..',
    '..krk......krk..',
    '..kwk......kwk..',
    '..kyk......kyk..',
    '...k........k...',
    '................'
  ],
  cantuta: [
    '......kk........',
    '.....kppk.......',
    '....kppppk......',
    '....kpppprk.....',
    '.....kpprk......',
    '......kprk......',
    '......kyyk......',
    '.......kgk......',
    '.......kgk.kk...',
    '.....kk.kgkggk..',
    '....kggkkgkkk...',
    '.....kkgkgk.....',
    '.......kgk......',
    '.......kgk......',
    '.......kkk......',
    '................'
  ],
  zampona: [
    '................',
    '.kkkkkkkkkkkkkk.',
    '.kskskskskskskk.',
    '.kskskskskskskk.',
    '.krrrrrrrrrrrrk.',
    '.kskskskskskskk.',
    '.kskskskskskk...',
    '.kskskskskk.....',
    '.kskskskk.......',
    '.krrrrrk........',
    '.kskskk.........',
    '.kskk...........',
    '.kk.............',
    '................',
    '................',
    '................'
  ]
};

const OBJETOS = [
  { id: 'llama',   nombre: 'Llama',    dato: 'La llama fue el animal de carga del Tahuantinsuyo; su lana abrigaba al pueblo andino.' },
  { id: 'condor',  nombre: 'Cóndor',   dato: 'El cóndor andino simbolizaba el mundo de arriba, el Hanan Pacha.' },
  { id: 'tumi',    nombre: 'Tumi',     dato: 'El tumi es un cuchillo ceremonial de la cultura Lambayeque y hoy es símbolo del Perú.' },
  { id: 'inti',    nombre: 'Inti',     dato: 'Inti, el dios Sol, era la divinidad principal de los incas; se le celebra en el Inti Raymi.' },
  { id: 'huaco',   nombre: 'Huaco',    dato: 'Los huacos retrato de la cultura Mochica representaban rostros de personas reales.' },
  { id: 'chakana', nombre: 'Chakana',  dato: 'La chakana o cruz andina une los tres mundos de la cosmovisión andina.' },
  { id: 'maiz',    nombre: 'Maíz',     dato: 'En el Perú existen decenas de variedades de maíz, como el morado y el gigante del Cusco.' },
  { id: 'papa',    nombre: 'Papa',     dato: 'La papa se domesticó en los Andes; el Perú tiene miles de variedades nativas.' },
  { id: 'colibri', nombre: 'Colibrí',  dato: 'El colibrí es una de las figuras más famosas de las Líneas de Nasca.' },
  { id: 'chullo',  nombre: 'Chullo',   dato: 'El chullo es un gorro tejido con orejeras que protege del frío de las alturas.' },
  { id: 'cantuta', nombre: 'Cantuta',  dato: 'La cantuta es la flor sagrada de los incas y flor nacional del Perú.' },
  { id: 'zampona', nombre: 'Zampoña',  dato: 'La zampoña o siku es un instrumento andino de viento hecho de cañas.' }
];

const PixelArt = {
  cache: {},
  /** Devuelve un canvas 16x16 con el sprite dibujado. */
  canvas(id) {
    const grid = SPRITES[id];
    const c = document.createElement('canvas');
    c.width = 16; c.height = 16;
    const ctx = c.getContext('2d');
    grid.forEach((fila, y) => {
      for (let x = 0; x < 16; x++) {
        const col = PALETA[fila[x] || '.'];
        if (col) { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); }
      }
    });
    c.className = 'px';
    return c;
  },
  /** URL de imagen (data:) para usar en <img>. */
  url(id) {
    if (!this.cache[id]) this.cache[id] = this.canvas(id).toDataURL('image/png');
    return this.cache[id];
  },
  img(id, cls) {
    const im = new Image();
    im.src = this.url(id);
    im.alt = id;
    im.className = 'px ' + (cls || '');
    im.draggable = false;
    return im;
  }
};
