/* =========================================================
   MODO 3 · EL MERCADO DE CUSCO
   La vendedora dicta un pedido de productos (estudio). Luego una
   tarea distractora de cálculo impide repasar mentalmente
   (paradigma de Brown-Peterson, 1958-1959). Al final el jugador
   reconoce los productos entre señuelos. Mide aciertos y falsas
   alarmas; ilustra la curva del olvido de Ebbinghaus (1885).
   3 rondas: 3, 5 y 7 productos.
   ========================================================= */
const Mercado = {
  escena: 'mercado',
  st: null, timeouts: [], intervalo: null,

  iniciar() {
    this.detener();
    this.st = { ronda: 0, puntaje: 0, aciertosTot: 0, objetivosTot: 0, falsasTot: 0, distractorOk: 0, distractorTot: 0 };
    this.ronda();
    QA.log('Mercado iniciado');
  },

  fase(nombre) {
    $$('#sc-mercado .fase').forEach(f => f.classList.toggle('activa', f.id === 'mer-' + nombre));
  },

  hud() {
    const st = this.st, cfg = CONFIG.MERCADO[st.ronda];
    $('#mercado-hud').innerHTML =
      '<span>Ronda: <b>' + (st.ronda + 1) + '/' + CONFIG.MERCADO.length + '</b></span>' +
      '<span>Productos: <b>' + cfg.n + '</b></span>' +
      '<span>Puntaje: <b>' + st.puntaje + '</b></span>';
  },

  barra(sel, ms) {
    const b = $(sel); b.style.transition = 'none'; b.style.width = '100%';
    void b.offsetWidth; b.style.transition = 'width ' + ms + 'ms linear'; b.style.width = '0%';
  },

  // ---- Fase 1: estudio ----
  ronda() {
    const st = this.st, cfg = CONFIG.MERCADO[st.ronda];
    const mezcla = OBJETOS.slice().sort(() => Math.random() - 0.5);
    st.objetivo = mezcla.slice(0, cfg.n);
    st.senuelos = mezcla.slice(cfg.n, Math.min(OBJETOS.length, cfg.n * 2));
    this.hud();
    this.fase('estudio');
    $('#mer-instr').innerHTML = '«Guardián, tráeme del mercado estos <b>' + cfg.n + '</b> productos…»';
    const lista = $('#mer-lista'); lista.innerHTML = '';
    st.objetivo.forEach((o, k) => {
      const d = document.createElement('div'); d.className = 'producto aparece';
      d.style.animationDelay = (k * 120) + 'ms';
      d.appendChild(PixelArt.img(o.id));
      const s = document.createElement('small'); s.textContent = o.nombre; d.appendChild(s);
      lista.appendChild(d);
    });
    Audio8.start();
    this.barra('#mer-barra-estudio', cfg.estudio);
    this.timeouts.push(setTimeout(() => this.distractor(), cfg.estudio));
  },

  // ---- Fase 2: tarea distractora (impide el repaso) ----
  distractor() {
    const st = this.st, cfg = CONFIG.MERCADO[st.ronda];
    this.fase('distractor');
    this.barra('#mer-barra-dist', cfg.distractor);
    this.pregunta();
    this.timeouts.push(setTimeout(() => this.reconocer(), cfg.distractor));
  },
  pregunta() {
    const a = 20 + Math.floor(Math.random() * 60), b = 3 + Math.floor(Math.random() * 7);
    const resta = Math.random() < 0.5;
    const r = resta ? a - b : a + b;
    $('#mer-cuenta').textContent = a + (resta ? ' − ' : ' + ') + b + ' = ?';
    const ops = [r, r + 1 + Math.floor(Math.random() * 3), r - 1 - Math.floor(Math.random() * 3)].sort(() => Math.random() - 0.5);
    const cont = $('#mer-opciones'); cont.innerHTML = '';
    ops.forEach(v => {
      const b2 = document.createElement('button'); b2.className = 'btn'; b2.textContent = v;
      b2.addEventListener('click', () => {
        this.st.distractorTot++;
        if (v === r) { this.st.distractorOk++; Audio8.click(); } else Audio8.error();
        this.pregunta();
      });
      cont.appendChild(b2);
    });
  },

  // ---- Fase 3: reconocimiento ----
  reconocer() {
    const st = this.st;
    this.fase('reconocer');
    st.elegidos = new Set();
    const todos = st.objetivo.concat(st.senuelos).sort(() => Math.random() - 0.5);
    const g = $('#mer-opciones-obj'); g.innerHTML = '';
    todos.forEach(o => {
      const d = document.createElement('button'); d.className = 'producto elegible'; d.dataset.id = o.id;
      d.appendChild(PixelArt.img(o.id));
      const s = document.createElement('small'); s.textContent = o.nombre; d.appendChild(s);
      d.addEventListener('click', () => {
        if (st.revisado) return;
        Audio8.flip();
        if (st.elegidos.has(o.id)) { st.elegidos.delete(o.id); d.classList.remove('marcado'); }
        else { st.elegidos.add(o.id); d.classList.add('marcado'); }
        $('#mer-contador').textContent = st.elegidos.size + ' / ' + st.objetivo.length + ' seleccionados';
      });
      g.appendChild(d);
    });
    st.revisado = false;
    st.tRecon = performance.now();
    $('#mer-contador').textContent = '0 / ' + st.objetivo.length + ' seleccionados';
    $('#mer-confirmar').onclick = () => this.revisar();
  },

  revisar() {
    const st = this.st;
    if (st.revisado) return;
    st.revisado = true;
    const ids = new Set(st.objetivo.map(o => o.id));
    let aciertos = 0, falsas = 0;
    $$('#mer-opciones-obj .producto').forEach(d => {
      const esObj = ids.has(d.dataset.id), marcado = st.elegidos.has(d.dataset.id);
      if (esObj && marcado) { aciertos++; d.classList.add('bien'); }
      else if (!esObj && marcado) { falsas++; d.classList.add('mal'); }
      else if (esObj && !marcado) d.classList.add('olvidado');
    });
    QA.intento(aciertos === st.objetivo.length && falsas === 0, performance.now() - st.tRecon);
    const pts = Math.max(0, aciertos * 100 - falsas * 50);
    st.puntaje += pts; st.aciertosTot += aciertos; st.objetivosTot += st.objetivo.length; st.falsasTot += falsas;
    this.hud();
    if (aciertos === st.objetivo.length && falsas === 0) Audio8.match(); else Audio8.error();
    $('#mer-contador').innerHTML = 'Recordaste <b>' + aciertos + '/' + st.objetivo.length + '</b> · Falsas alarmas: <b>' + falsas + '</b> · +' + pts;
    const ultima = st.ronda + 1 >= CONFIG.MERCADO.length;
    $('#mer-confirmar').textContent = ultima ? 'Ver resultados' : 'Siguiente ronda ▶';
    $('#mer-confirmar').onclick = () => {
      Audio8.click();
      $('#mer-confirmar').textContent = 'Confirmar';
      if (ultima) this.fin(); else { st.ronda++; this.ronda(); }
    };
  },

  fin() {
    const st = this.st;
    const prec = Math.round(100 * st.aciertosTot / Math.max(1, st.objetivosTot));
    Guardado.registrar({ modo: 'Mercado', nivel: 'Rondas 1-3', puntaje: st.puntaje, precision: prec });
    prec >= 70 ? Audio8.win() : Audio8.lose();
    const est = prec >= 90 ? 3 : prec >= 70 ? 2 : prec >= 40 ? 1 : 0;
    App.modal('Pedido entregado',
      App.estrellas(est) +
      '<p>Guardián: <b>' + App.nombre() + '</b></p>' +
      '<p>Productos recordados: <b>' + st.aciertosTot + '/' + st.objetivosTot + '</b> (' + prec + '%) · Falsas alarmas: ' + st.falsasTot + '</p>' +
      '<p>Cálculos correctos en la distracción: ' + st.distractorOk + '/' + st.distractorTot + '</p>' +
      '<p>Puntaje: <b>' + st.puntaje + '</b></p>' +
      '<p class="ciencia">Sin repaso, la memoria de corto plazo se desvanece en segundos (Brown-Peterson). Repasar en días espaciados frena la curva del olvido (Ebbinghaus).</p>',
      [
        { texto: 'Jugar otra vez', principal: true, accion: () => App.iniciarModo(Mercado, {}) },
        { texto: 'Menú', accion: () => App.salirModo() }
      ]);
  },

  detener() { this.timeouts.forEach(clearTimeout); this.timeouts = []; },
  tecla(e) { if (e.key === 'Enter' && $('#mer-reconocer').classList.contains('activa')) $('#mer-confirmar').click(); }
};
