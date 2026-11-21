/* =========================================================
   Persistencia local (localStorage con try/catch) y estadísticas.
   Ningún dato sale del dispositivo.
   ========================================================= */
const Guardado = {
  KEY: 'memoria_ancestral_v1',
  leer() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || { jugador: '', sesiones: [] }; }
    catch (e) { return { jugador: '', sesiones: [] }; }
  },
  escribir(d) { try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch (e) { /* modo privado */ } },
  setJugador(nombre) { const d = this.leer(); d.jugador = nombre; this.escribir(d); },
  jugador() { return this.leer().jugador || ''; },

  /** Registra una partida: {modo, nivel, puntaje, precision, span, tiempo} */
  registrar(s) {
    const d = this.leer();
    s.fecha = new Date().toISOString();
    s.jugador = d.jugador || 'Guardián';
    d.sesiones.push(s);
    if (d.sesiones.length > 200) d.sesiones = d.sesiones.slice(-200);
    this.escribir(d);
    QA.log('Partida registrada: ' + s.modo + ' · ' + s.puntaje + ' pts');
  },

  resumen() {
    const ses = this.leer().sesiones;
    const por = m => ses.filter(s => s.modo === m);
    const max = (arr, k) => arr.reduce((a, s) => Math.max(a, s[k] || 0), 0);
    const prom = (arr, k) => arr.length ? Math.round(arr.reduce((a, s) => a + (s[k] || 0), 0) / arr.length) : 0;
    const dias = [...new Set(ses.map(s => s.fecha.slice(0, 10)))].sort();
    return {
      total: ses.length,
      pares: { mejor: max(por('Pares'), 'puntaje'), precision: prom(por('Pares'), 'precision'), n: por('Pares').length },
      quipu: { mejor: max(por('Quipu'), 'puntaje'), span: max(por('Quipu'), 'span'), n: por('Quipu').length },
      mercado: { mejor: max(por('Mercado'), 'puntaje'), precision: prom(por('Mercado'), 'precision'), n: por('Mercado').length },
      ultimas: ses.slice(-10).reverse(),
      dias
    };
  },

  /** Próximo repaso sugerido según repetición espaciada (Ebbinghaus). */
  proximoRepaso() {
    const dias = this.resumen().dias;
    if (!dias.length) return 'Juega tu primera sesión hoy.';
    const n = Math.min(dias.length, CONFIG.REPASO_DIAS.length) - 1;
    const ultima = new Date(dias[dias.length - 1] + 'T12:00:00');
    const prox = new Date(ultima.getTime() + CONFIG.REPASO_DIAS[n] * 86400000);
    return 'Días practicados: ' + dias.length + '. Próximo repaso sugerido: ' +
      prox.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' }) +
      ' (intervalo de ' + CONFIG.REPASO_DIAS[n] + ' día' + (CONFIG.REPASO_DIAS[n] > 1 ? 's' : '') + ').';
  },

  borrar() { const d = this.leer(); d.sesiones = []; this.escribir(d); }
};
