/* =========================================================
   Núcleo del juego: máquina de estados de escenas, menú,
   modal de resultados, notificaciones y teclado global.
   Estados: CARGA → PORTADA → MENU → (PARES | QUIPU | MERCADO | PROGRESO | AYUDA | CREDITOS) → RESULTADO → MENU
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const App = {
  escena: null,
  modoActivo: null,

  init() {
    QA.init();
    Fondo.init();
    this.pintarIconos();
    $('#nombre').value = Guardado.jugador();
    $('#version').textContent = 'v' + CONFIG.VERSION;

    // Botones del menú
    $$('[data-ir]').forEach(b => b.addEventListener('click', () => { Audio8.click(); this.ir(b.dataset.ir); }));
    $$('[data-pares]').forEach(b => b.addEventListener('click', () => {
      Audio8.click(); this.guardarNombre();
      this.iniciarModo(Pares, { nivel: +b.dataset.pares, dosJugadores: b.dataset.dos === '1' });
    }));
    $('#btn-quipu').addEventListener('click', () => { Audio8.click(); this.guardarNombre(); this.iniciarModo(Quipu, { inverso: $('#quipu-inverso').checked, chunking: $('#quipu-chunk').checked }); });
    $('#btn-mercado').addEventListener('click', () => { Audio8.click(); this.guardarNombre(); this.iniciarModo(Mercado, {}); });
    $('#btn-borrar').addEventListener('click', () => { Guardado.borrar(); this.pintarProgreso(); this.toast('Historial borrado'); });
    $$('.btn-salir').forEach(b => b.addEventListener('click', () => this.salirModo()));
    $('#btn-sonido').addEventListener('click', () => this.mute());
    $('#btn-qa').addEventListener('click', () => QA.toggle());

    // Portada: cualquier clic o Enter comienza (y desbloquea el audio)
    $('#sc-portada').addEventListener('click', () => this.comenzar());

    document.addEventListener('keydown', e => this.teclado(e));
    this.ir('portada');
    QA.log('Juego iniciado v' + CONFIG.VERSION);
  },

  pintarIconos() {
    $$('[data-icono]').forEach(el => { el.innerHTML = ''; el.appendChild(PixelArt.img(el.dataset.icono)); });
  },

  comenzar() {
    if (this.escena !== 'portada') return;
    Audio8.init(); Audio8.start(); Audio8.startMusic();
    this.ir('menu');
  },

  ir(nombre) {
    $$('.escena').forEach(s => s.classList.remove('activa'));
    const sc = $('#sc-' + nombre);
    if (sc) sc.classList.add('activa');
    this.escena = nombre;
    if (nombre === 'progreso') this.pintarProgreso();
    QA.log('Escena → ' + nombre);
  },

  guardarNombre() {
    const n = $('#nombre').value.trim().slice(0, 18);
    Guardado.setJugador(n);
  },
  nombre() { return Guardado.jugador() || 'Guardián'; },

  iniciarModo(modo, opciones) {
    this.cerrarModal();
    if (this.modoActivo && this.modoActivo.detener) this.modoActivo.detener();
    this.modoActivo = modo;
    this.ir(modo.escena);
    modo.iniciar(opciones);
  },
  salirModo() {
    Audio8.click();
    if (this.modoActivo && this.modoActivo.detener) this.modoActivo.detener();
    this.modoActivo = null;
    this.cerrarModal();
    this.ir('menu');
  },

  // ---- Modal de resultados ----
  modal(titulo, html, botones) {
    $('#modal-titulo').textContent = titulo;
    $('#modal-cuerpo').innerHTML = html;
    const pie = $('#modal-botones'); pie.innerHTML = '';
    botones.forEach(b => {
      const el = document.createElement('button');
      el.className = 'btn' + (b.principal ? ' principal' : '');
      el.textContent = b.texto;
      el.addEventListener('click', () => { Audio8.click(); b.accion(); });
      pie.appendChild(el);
    });
    $('#modal').classList.remove('oculto');
    const p = pie.querySelector('.principal'); if (p) p.focus();
  },
  cerrarModal() { $('#modal').classList.add('oculto'); },

  toast(msg, ms = 2600) {
    const t = $('#toast');
    t.innerHTML = msg; t.classList.add('ver');
    clearTimeout(this._toastT);
    this._toastT = setTimeout(() => t.classList.remove('ver'), ms);
  },

  estrellas(n) { return '<span class="estrellas">' + '★'.repeat(n) + '<i>' + '★'.repeat(3 - n) + '</i></span>'; },

  mute() {
    const m = Audio8.toggleMute();
    $('#btn-sonido').textContent = m ? '🔇' : '🔊';
    this.toast(m ? 'Sonido desactivado (M)' : 'Sonido activado (M)', 1200);
  },

  teclado(e) {
    if (e.key === 'F2') { e.preventDefault(); QA.toggle(); return; }
    if (e.target.tagName === 'INPUT') { if (e.key === 'Enter') e.target.blur(); return; }
    if (e.key === 'm' || e.key === 'M') { this.mute(); return; }
    if (this.escena === 'portada' && (e.key === 'Enter' || e.key === ' ')) { this.comenzar(); return; }
    if (e.key === 'Escape') {
      if (!$('#modal').classList.contains('oculto')) return;
      if (this.modoActivo) this.salirModo(); else if (this.escena !== 'menu' && this.escena !== 'portada') this.ir('menu');
      return;
    }
    if (this.modoActivo && this.modoActivo.tecla) this.modoActivo.tecla(e);
  },

  // ---- Pantalla de progreso ----
  pintarProgreso() {
    const r = Guardado.resumen();
    $('#prog-resumen').innerHTML =
      '<div class="tarjeta-stat"><b>' + r.total + '</b><span>partidas</span></div>' +
      '<div class="tarjeta-stat"><b>' + r.pares.mejor + '</b><span>récord Pares</span></div>' +
      '<div class="tarjeta-stat"><b>' + r.quipu.span + '</b><span>span máximo Quipu</span></div>' +
      '<div class="tarjeta-stat"><b>' + r.mercado.precision + '%</b><span>precisión Mercado</span></div>';
    $('#prog-repaso').textContent = Guardado.proximoRepaso();
    const tb = $('#prog-tabla tbody');
    tb.innerHTML = r.ultimas.length ? r.ultimas.map(s =>
      '<tr><td>' + new Date(s.fecha).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' }) + '</td><td>' + s.jugador +
      '</td><td>' + s.modo + '</td><td>' + (s.nivel || '-') + '</td><td>' + s.puntaje + '</td><td>' +
      (s.precision != null ? s.precision + '%' : '-') + '</td><td>' + (s.span || '-') + '</td></tr>').join('')
      : '<tr><td colspan="7">Aún no hay partidas. ¡Empieza a entrenar tu memoria!</td></tr>';
    this.graficar(r.ultimas.slice().reverse());
  },
  graficar(ses) {
    const cv = $('#prog-grafico'), c = cv.getContext('2d');
    cv.width = 320; cv.height = 110; c.imageSmoothingEnabled = false;
    c.fillStyle = '#1d1426'; c.fillRect(0, 0, 320, 110);
    c.fillStyle = '#5d3060'; for (let y = 10; y < 100; y += 20) c.fillRect(0, y, 320, 1);
    if (!ses.length) return;
    const max = Math.max(...ses.map(s => s.puntaje), 1);
    const w = Math.floor(300 / ses.length);
    const col = { Pares: '#f2c14e', Quipu: '#c0392b', Mercado: '#3f8f3a' };
    ses.forEach((s, i) => {
      const h = Math.max(2, Math.round(90 * s.puntaje / max / 2) * 2);
      c.fillStyle = col[s.modo] || '#fff';
      c.fillRect(10 + i * w, 100 - h, w - 4, h);
    });
  }
};

window.addEventListener('DOMContentLoaded', () => App.init());
