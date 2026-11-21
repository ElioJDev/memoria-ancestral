/* =========================================================
   Fondo animado en pixel art: cielo andino, Inti, montañas,
   andenes (terrazas), nubes y un cóndor volando.
   Se dibuja a 320x180 y se escala con píxeles nítidos.
   ========================================================= */
const Fondo = {
  cv: null, ctx: null, t: 0, nubes: [], condorX: -20, estrellas: [],
  init() {
    this.cv = document.getElementById('fondo');
    this.cv.width = 320; this.cv.height = 180;
    this.ctx = this.cv.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    for (let i = 0; i < 6; i++) this.nubes.push({ x: Math.random() * 320, y: 10 + Math.random() * 50, v: 0.05 + Math.random() * 0.12, w: 14 + Math.random() * 20 });
    this.condor = PixelArt.canvas('condor');
    const loop = () => { this.draw(); requestAnimationFrame(loop); };
    loop();
  },
  montana(color, base, picos, amp, seed) {
    const c = this.ctx; c.fillStyle = color;
    for (let x = 0; x < 320; x += 4) {
      const h = Math.abs(Math.sin((x + seed) / picos) * amp + Math.sin((x + seed * 3) / (picos / 2.3)) * amp / 3);
      const y = Math.round((base - h) / 4) * 4;  // escalonado = estética pixel
      c.fillRect(x, y, 4, 180 - y);
    }
  },
  draw() {
    const c = this.ctx; this.t++;
    // cielo por bandas
    const bandas = ['#2b1d3a', '#3e2650', '#5d3060', '#8a3f5c', '#c25a4f', '#e58a45', '#f4b860'];
    bandas.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, i * 14, 320, 14); });
    c.fillStyle = '#f4b860'; c.fillRect(0, 98, 320, 82);
    // Inti (sol) con rayos que giran por pasos
    const sx = 236, sy = 52, paso = Math.floor(this.t / 20) % 2;
    c.fillStyle = '#d9822b';
    for (let a = 0; a < 8; a++) {
      const ang = a * Math.PI / 4 + paso * Math.PI / 8;
      c.fillRect(Math.round(sx + Math.cos(ang) * 22) - 2, Math.round(sy + Math.sin(ang) * 22) - 2, 4, 4);
    }
    c.fillStyle = '#f2c14e'; c.fillRect(sx - 14, sy - 10, 28, 20); c.fillRect(sx - 10, sy - 14, 20, 28);
    c.fillStyle = '#fff6c8'; c.fillRect(sx - 8, sy - 8, 6, 6);
    // nubes
    c.fillStyle = 'rgba(255,240,220,0.55)';
    this.nubes.forEach(n => {
      n.x += n.v; if (n.x > 340) n.x = -40;
      const x = Math.round(n.x), y = Math.round(n.y);
      c.fillRect(x, y, n.w, 4); c.fillRect(x + 4, y - 4, n.w - 8, 4);
    });
    // montañas
    this.montana('#6b3f5f', 120, 60, 50, 10);
    this.montana('#4a2f4f', 140, 40, 38, 77);
    // nieve en picos lejanos
    // andenes (terrazas incas)
    for (let i = 0; i < 6; i++) {
      c.fillStyle = i % 2 ? '#3f6b35' : '#4e8a3f';
      c.fillRect(0, 150 + i * 5, 140 - i * 18, 5);
      c.fillStyle = '#2f4a2a'; c.fillRect(140 - i * 18, 150 + i * 5, 2, 5);
    }
    c.fillStyle = '#2a1f2e'; c.fillRect(0, 176, 320, 4);
    // cóndor
    this.condorX += 0.35; if (this.condorX > 340) this.condorX = -30;
    const cy = 70 + Math.round(Math.sin(this.t / 40) * 6);
    c.drawImage(this.condor, Math.round(this.condorX), cy, 16, 16);
  }
};
