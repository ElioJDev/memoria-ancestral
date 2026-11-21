/* =========================================================
   MODO 1 · PARES DEL TAHUANTINSUYO
   Memoria visual episódica. Cada carta une imagen + palabra
   (codificación dual, Paivio 1971) y al acertar muestra un dato
   cultural (procesamiento profundo, Craik y Lockhart 1972).
   Fases: codificación (vista previa) → recuperación (buscar pares).
   1 jugador contra el reloj o 2 jugadores por turnos.
   ========================================================= */
const Pares = {
  escena: 'pares',
  st: null, timer: null, timeouts: [],
  _r: window.addEventListener('resize', () => Pares.ajustar()),

  iniciar({ nivel = 0, dosJugadores = false }) {
    this.detener();
    const cfg = CONFIG.PARES[nivel];
    const objs = OBJETOS.slice().sort(() => Math.random() - 0.5).slice(0, cfg.pares);
    const mazo = objs.concat(objs).map((o, i) => ({ ...o, uid: i })).sort(() => Math.random() - 0.5);
    this.st = {
      nivel, cfg, dos: dosJugadores, mazo, abiertas: [], encontrados: 0, movimientos: 0,
      fallos: 0, combo: 0, puntaje: 0, tiempo: cfg.tiempo, bloqueado: true, inicio: 0, ultimoClic: 0,
      turno: 0, pj: [0, 0], vistas: new Set(), fallosRepetidos: 0
    };
    $('#pares-nivel').textContent = cfg.nombre + (dosJugadores ? ' · 2 JUGADORES' : '');
    this.construir();
    this.hud();
    // Fase de codificación: vista previa de todas las cartas
    $$('#pares-tablero .carta').forEach(c => c.classList.add('volteada'));
    App.toast('👁 Memoriza las cartas… (' + cfg.preview / 1000 + ' s)', cfg.preview);
    this.timeouts.push(setTimeout(() => {
      $$('#pares-tablero .carta').forEach(c => c.classList.remove('volteada'));
      this.st.bloqueado = false; this.st.inicio = performance.now(); this.st.ultimoClic = performance.now();
      Audio8.flip();
      if (!dosJugadores) this.timer = setInterval(() => this.reloj(), 1000);
    }, cfg.preview));
    QA.log('Pares iniciado: ' + cfg.nombre + (dosJugadores ? ' (2J)' : ''));
  },

  construir() {
    const t = $('#pares-tablero');
    t.innerHTML = '';
    t.style.gridTemplateColumns = 'repeat(' + this.st.cfg.cols + ', 1fr)';
    t.dataset.cols = this.st.cfg.cols;
    this.ajustar();
    this.st.mazo.forEach((o, i) => {
      const c = document.createElement('button');
      c.className = 'carta'; c.dataset.i = i;
      c.setAttribute('aria-label', 'Carta ' + (i + 1));
      c.innerHTML = '<div class="cara dorso"><span>✦</span></div><div class="cara frente"></div>';
      const f = c.querySelector('.frente');
      f.appendChild(PixelArt.img(o.id));
      const n = document.createElement('small'); n.textContent = o.nombre; f.appendChild(n);
      c.addEventListener('click', () => this.voltear(i));
      t.appendChild(c);
    });
  },

  /** Ajusta el tablero para que quepa completo en la pantalla (sin scroll). */
  ajustar() {
    if (!this.st) return;
    const cols = this.st.cfg.cols, filas = Math.ceil(this.st.cfg.pares * 2 / cols), gap = 10;
    const altoDisp = window.innerHeight - 150;
    const altoCarta = (altoDisp - gap * (filas - 1)) / filas;
    const ancho = Math.min(window.innerWidth * 0.94, (altoCarta / 1.12) * cols + gap * (cols - 1), cols === 5 ? 760 : 640);
    $('#pares-tablero').style.width = Math.max(260, Math.floor(ancho)) + 'px';
  },

  voltear(i) {
    const st = this.st;
    if (!st || st.bloqueado) return;
    const el = $('#pares-tablero').children[i];
    if (el.classList.contains('volteada') || el.classList.contains('hecha')) return;
    el.classList.add('volteada'); Audio8.flip();
    st.abiertas.push(i);
    if (st.abiertas.length < 2) return;

    st.movimientos++; st.bloqueado = true;
    const [a, b] = st.abiertas;
    const ok = st.mazo[a].id === st.mazo[b].id;
    const ahora = performance.now();
    QA.intento(ok, ahora - st.ultimoClic); st.ultimoClic = ahora;

    if (ok) {
      this.timeouts.push(setTimeout(() => {
        [a, b].forEach(k => $('#pares-tablero').children[k].classList.add('hecha'));
        st.encontrados++; st.combo++;
        const pts = 100 + (st.combo - 1) * 25;
        if (st.dos) st.pj[st.turno] += pts; else st.puntaje += pts;
        Audio8.match();
        App.toast('<b>' + st.mazo[a].nombre + '</b> +' + pts + '<br><small>' + st.mazo[a].dato + '</small>', 3200);
        st.abiertas = []; st.bloqueado = false;
        this.hud();
        if (st.encontrados === st.cfg.pares) this.fin(true);
      }, 350));
    } else {
      // ¿El jugador ya había visto ambas cartas? (error de memoria, no de azar)
      if (st.vistas.has(a) && st.vistas.has(b)) st.fallosRepetidos++;
      st.fallos++; st.combo = 0;
      this.timeouts.push(setTimeout(() => {
        Audio8.error();
        [a, b].forEach(k => $('#pares-tablero').children[k].classList.remove('volteada'));
        st.abiertas = []; st.bloqueado = false;
        if (st.dos) { st.turno = 1 - st.turno; App.toast('Turno del Jugador ' + (st.turno + 1), 1000); }
        this.hud();
      }, 800));
    }
    st.vistas.add(a); st.vistas.add(b);
    this.hud();
  },

  reloj() {
    const st = this.st; if (!st) return;
    st.tiempo--;
    if (st.tiempo <= 10 && st.tiempo > 0) Audio8.tick();
    this.hud();
    if (st.tiempo <= 0) this.fin(false);
  },

  hud() {
    const st = this.st;
    const prec = st.movimientos ? Math.round(100 * st.encontrados / st.movimientos) : 0;
    let h = '<span>Pares: <b>' + st.encontrados + '/' + st.cfg.pares + '</b></span>' +
            '<span>Movimientos: <b>' + st.movimientos + '</b></span>' +
            '<span>Precisión: <b>' + prec + '%</b></span>';
    if (st.dos) {
      h += '<span class="' + (st.turno === 0 ? 'turno' : '') + '">J1: <b>' + st.pj[0] + '</b></span>' +
           '<span class="' + (st.turno === 1 ? 'turno' : '') + '">J2: <b>' + st.pj[1] + '</b></span>';
    } else {
      h += '<span>Puntaje: <b>' + st.puntaje + '</b></span>' +
           '<span class="' + (st.tiempo <= 10 ? 'alerta' : '') + '">⏳ <b>' + st.tiempo + ' s</b></span>';
    }
    if (st.combo > 1) h += '<span class="combo">COMBO x' + st.combo + '</span>';
    $('#pares-hud').innerHTML = h;
  },

  fin(gano) {
    const st = this.st;
    clearInterval(this.timer); st.bloqueado = true;
    const prec = st.movimientos ? Math.round(100 * st.encontrados / st.movimientos) : 0;
    const tUsado = Math.round((performance.now() - st.inicio) / 1000);
    const siguiente = st.nivel + 1 < CONFIG.PARES.length ? st.nivel + 1 : null;
    const botones = [];

    if (st.dos) {
      const g = st.pj[0] === st.pj[1] ? '¡Empate!' : '¡Gana el Jugador ' + (st.pj[0] > st.pj[1] ? 1 : 2) + '!';
      Audio8.win();
      Guardado.registrar({ modo: 'Pares', nivel: (st.nivel + 1) + ' (2J)', puntaje: Math.max(...st.pj), precision: prec });
      botones.push({ texto: 'Revancha', principal: true, accion: () => App.iniciarModo(Pares, { nivel: st.nivel, dosJugadores: true }) });
      botones.push({ texto: 'Menú', accion: () => App.salirModo() });
      App.modal(g, '<p>Jugador 1: <b>' + st.pj[0] + '</b> pts · Jugador 2: <b>' + st.pj[1] + '</b> pts</p>' +
        '<p>Movimientos: ' + st.movimientos + ' · Precisión conjunta: ' + prec + '%</p>' +
        '<p class="ciencia">Recordar la posición de las cartas que abrió el rival es memoria episódica en acción.</p>', botones);
      return;
    }

    let estrellas = 0;
    if (gano) {
      st.puntaje += st.tiempo * 5;
      estrellas = prec >= 70 ? 3 : prec >= 50 ? 2 : 1;
      Audio8.win();
    } else Audio8.lose();
    Guardado.registrar({ modo: 'Pares', nivel: st.nivel + 1, puntaje: st.puntaje, precision: prec, tiempo: tUsado });

    if (gano && siguiente !== null) botones.push({ texto: 'Siguiente nivel ▶', principal: true, accion: () => App.iniciarModo(Pares, { nivel: siguiente }) });
    botones.push({ texto: 'Repetir', principal: !gano || siguiente === null, accion: () => App.iniciarModo(Pares, { nivel: st.nivel }) });
    botones.push({ texto: 'Menú', accion: () => App.salirModo() });
    App.modal(gano ? '¡Nivel superado!' : '¡Se acabó el tiempo!',
      (gano ? App.estrellas(estrellas) : '') +
      '<p>Guardián: <b>' + App.nombre() + '</b></p>' +
      '<p>Puntaje: <b>' + st.puntaje + '</b> · Precisión: <b>' + prec + '%</b> · Tiempo: ' + tUsado + ' s</p>' +
      '<p>Errores de memoria (cartas ya vistas): ' + st.fallosRepetidos + '</p>' +
      '<p class="ciencia">Consejo: nombra en voz baja cada objeto al verlo. Unir imagen y palabra crea dos huellas en la memoria (Paivio).</p>',
      botones);
  },

  detener() {
    clearInterval(this.timer); this.timeouts.forEach(clearTimeout); this.timeouts = [];
  },
  tecla() {}
};
