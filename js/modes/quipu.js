/* =========================================================
   MODO 2 · EL QUIPU SAGRADO
   Tarea de amplitud de memoria (span) tipo Simón, con nudos de
   colores y tonos (bucle fonológico + agenda visoespacial,
   Baddeley y Hitch 1974). La secuencia crece de uno en uno;
   el récord se compara con el "mágico 7 ± 2" de Miller (1956).
   Opciones: orden inverso (ejecutivo central) y agrupación
   en bloques de 3 (chunking).
   ========================================================= */
const Quipu = {
  escena: 'quipu',
  st: null, timeouts: [],

  iniciar({ inverso = false, chunking = true }) {
    this.detener();
    this.st = {
      inverso, chunking, secuencia: [], entrada: [], vidas: CONFIG.QUIPU.vidas,
      ronda: 0, puntaje: 0, span: 0, mostrando: true, ultimo: 0
    };
    this.construir();
    $('#quipu-modo').textContent = (inverso ? 'ORDEN INVERSO' : 'ORDEN DIRECTO') + (chunking ? ' · CON AGRUPACIÓN' : '');
    for (let i = 0; i < CONFIG.QUIPU.spanInicial - 1; i++) this.st.secuencia.push(this.azar());
    this.hud();
    App.toast(inverso ? 'Observa y repite la secuencia AL REVÉS' : 'Observa y repite la secuencia de nudos', 2000);
    this.timeouts.push(setTimeout(() => this.nuevaRonda(), 1600));
    QA.log('Quipu iniciado ' + (inverso ? '(inverso)' : '(directo)'));
  },

  azar() { return Math.floor(Math.random() * CONFIG.QUIPU.colores.length); },

  construir() {
    const cont = $('#quipu-cuerdas');
    cont.innerHTML = '';
    CONFIG.QUIPU.colores.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'cuerda'; b.dataset.i = i;
      b.style.setProperty('--col', c.hex);
      b.innerHTML = '<span class="hilo"></span><span class="nudo"></span><span class="nudo"></span><span class="nudo"></span>' +
                    '<span class="tecla">' + c.tecla + '</span>';
      b.setAttribute('aria-label', 'Nudo ' + c.nombre);
      b.addEventListener('click', () => this.pulsar(i));
      cont.appendChild(b);
    });
  },

  nuevaRonda() {
    const st = this.st;
    st.secuencia.push(this.azar());
    st.ronda++; st.entrada = []; st.mostrando = true;
    this.hud();
    $('#quipu-estado').textContent = 'Observa… (' + st.secuencia.length + ' nudos)';
    this.reproducir();
  },

  reproducir() {
    const st = this.st, q = CONFIG.QUIPU;
    const vel = Math.max(380, q.msPorNudo - st.ronda * 15);
    let t = 500;
    st.secuencia.forEach((n, k) => {
      if (st.chunking && k > 0 && k % 3 === 0) t += q.pausaChunk;
      this.timeouts.push(setTimeout(() => this.iluminar(n, vel), t));
      t += vel + q.pausa;
    });
    this.timeouts.push(setTimeout(() => {
      st.mostrando = false; st.ultimo = performance.now();
      $('#quipu-estado').textContent = st.inverso ? '¡Tu turno! Repite AL REVÉS' : '¡Tu turno! Repite la secuencia';
    }, t));
  },

  iluminar(i, ms = 300) {
    const el = $('#quipu-cuerdas').children[i];
    if (!el) return;
    el.classList.add('luz'); Audio8.knot(i);
    this.timeouts.push(setTimeout(() => el.classList.remove('luz'), ms));
  },

  pulsar(i) {
    const st = this.st;
    if (!st || st.mostrando) return;
    this.iluminar(i, 200);
    const objetivo = st.inverso ? st.secuencia.slice().reverse() : st.secuencia;
    const pos = st.entrada.length;
    const ok = objetivo[pos] === i;
    const ahora = performance.now();
    QA.intento(ok, ahora - st.ultimo); st.ultimo = ahora;
    st.entrada.push(i);

    if (!ok) {
      st.vidas--; st.mostrando = true;
      Audio8.error();
      $('#quipu-cuerdas').classList.add('temblor');
      this.timeouts.push(setTimeout(() => $('#quipu-cuerdas').classList.remove('temblor'), 400));
      this.hud();
      if (st.vidas <= 0) { this.timeouts.push(setTimeout(() => this.fin(), 700)); return; }
      $('#quipu-estado').textContent = 'Nudo equivocado. Mira otra vez la misma secuencia.';
      st.entrada = [];
      this.timeouts.push(setTimeout(() => this.reproducir(), 1300));
      return;
    }
    if (st.entrada.length === objetivo.length) {
      st.mostrando = true;
      st.span = Math.max(st.span, objetivo.length);
      st.puntaje += objetivo.length * 50 * (st.inverso ? 2 : 1);
      this.hud();
      Audio8.match();
      $('#quipu-estado').textContent = '¡Correcto! Span ' + objetivo.length;
      if (objetivo.length === 7) App.toast('¡Llegaste al mágico número 7 de Miller!', 2500);
      this.timeouts.push(setTimeout(() => this.nuevaRonda(), 1100));
    }
  },

  hud() {
    const st = this.st;
    $('#quipu-hud').innerHTML =
      '<span>Ronda: <b>' + st.ronda + '</b></span>' +
      '<span>Longitud: <b>' + st.secuencia.length + '</b></span>' +
      '<span>Span máximo: <b>' + st.span + '</b></span>' +
      '<span>Puntaje: <b>' + st.puntaje + '</b></span>' +
      '<span>Vidas: <b>' + '♥'.repeat(Math.max(0, st.vidas)) + '</b></span>';
    // Medidor del span frente a 7 ± 2
    const m = $('#quipu-medidor'); m.innerHTML = '';
    for (let k = 1; k <= 12; k++) {
      const d = document.createElement('i');
      if (k <= st.span) d.className = 'lleno';
      if (k >= 5 && k <= 9) d.classList.add('miller');
      m.appendChild(d);
    }
  },

  fin() {
    const st = this.st;
    Audio8.lose();
    Guardado.registrar({ modo: 'Quipu', nivel: st.inverso ? 'Inverso' : 'Directo', puntaje: st.puntaje, span: st.span,
                         precision: Math.round(100 * Math.max(0, st.ronda - 1) / Math.max(1, st.ronda + CONFIG.QUIPU.vidas - 1)) });
    let lectura;
    if (st.span >= 7) lectura = 'Excelente: tu amplitud supera el promedio de 7 ± 2 elementos.';
    else if (st.span >= 5) lectura = 'Estás dentro del rango típico de 7 ± 2 elementos (Miller, 1956).';
    else lectura = 'Sigue practicando: agrupar en bloques de 3 (chunking) ayuda a recordar más.';
    App.modal('El quipu se cerró',
      '<p>Guardián: <b>' + App.nombre() + '</b></p>' +
      '<p>Span máximo: <b class="grande">' + st.span + '</b> · Puntaje: <b>' + st.puntaje + '</b></p>' +
      '<p class="ciencia">' + lectura + '</p>',
      [
        { texto: 'Jugar otra vez', principal: true, accion: () => App.iniciarModo(Quipu, { inverso: st.inverso, chunking: st.chunking }) },
        { texto: 'Menú', accion: () => App.salirModo() }
      ]);
  },

  tecla(e) {
    const i = CONFIG.QUIPU.colores.findIndex(c => c.tecla === e.key);
    if (i >= 0) this.pulsar(i);
  },
  detener() { this.timeouts.forEach(clearTimeout); this.timeouts = []; }
};
