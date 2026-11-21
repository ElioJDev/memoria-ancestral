/* =========================================================
   Panel de Control de Calidad (F2) — W. E. Deming
   "Lo que no se mide no se puede mejorar": FPS, errores, aciertos,
   tiempos de reacción y registro de eventos (ciclo Check del PDCA).
   ========================================================= */
const QA = {
  visible: false, el: null, frames: 0, fps: 0, last: performance.now(),
  errores: 0, aciertos: 0, intentos: 0, reacciones: [], eventos: [],

  init() {
    this.el = document.getElementById('qa');
    window.addEventListener('error', e => { this.errores++; this.log('ERROR: ' + e.message); });
    window.addEventListener('unhandledrejection', e => { this.errores++; this.log('ERROR promesa: ' + e.reason); });
    const loop = (t) => {
      this.frames++;
      if (t - this.last >= 1000) { this.fps = this.frames; this.frames = 0; this.last = t; if (this.visible) this.render(); }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },
  toggle() { this.visible = !this.visible; this.el.classList.toggle('oculto', !this.visible); this.render(); },
  log(msg) {
    const h = new Date().toLocaleTimeString('es-PE');
    this.eventos.unshift('[' + h + '] ' + msg);
    this.eventos = this.eventos.slice(0, 8);
    if (this.visible) this.render();
  },
  intento(ok, ms) {
    this.intentos++; if (ok) this.aciertos++;
    if (ms) { this.reacciones.push(ms); if (this.reacciones.length > 50) this.reacciones.shift(); }
  },
  render() {
    if (!this.el) return;
    const prec = this.intentos ? Math.round(100 * this.aciertos / this.intentos) : 0;
    const rt = this.reacciones.length ? Math.round(this.reacciones.reduce((a, b) => a + b, 0) / this.reacciones.length) : 0;
    const okFps = this.fps >= 50 ? 'ok' : 'mal';
    this.el.innerHTML =
      '<h4>PANEL QA · DEMING (F2)</h4>' +
      '<div>Versión: ' + CONFIG.VERSION + '</div>' +
      '<div>Escena: <b>' + (App.escena || '-') + '</b></div>' +
      '<div class="' + okFps + '">FPS: ' + this.fps + ' (meta ≥ 50)</div>' +
      '<div class="' + (this.errores ? 'mal' : 'ok') + '">Errores en consola: ' + this.errores + ' (meta 0)</div>' +
      '<div>Aciertos / intentos: ' + this.aciertos + ' / ' + this.intentos + ' (' + prec + '%)</div>' +
      '<div>Tiempo de reacción prom.: ' + rt + ' ms</div>' +
      '<div>Audio: ' + (Audio8.muted ? 'silenciado' : 'activo') + '</div>' +
      '<div class="pdca">Ciclo PDCA: P plan → D hacer → C medir (este panel) → A ajustar</div>' +
      '<h5>Eventos</h5><ul>' + this.eventos.map(e => '<li>' + e + '</li>').join('') + '</ul>';
  }
};
