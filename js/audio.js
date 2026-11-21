/* =========================================================
   Audio sintetizado con Web Audio API (sin archivos externos).
   Música andina procedural en escala pentatónica + efectos.
   ========================================================= */
const Audio8 = {
  ctx: null, master: null, musicGain: null, sfxGain: null,
  muted: false, musicTimer: null, musicStep: 0,

  init() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);
    this.musicGain = this.ctx.createGain(); this.musicGain.gain.value = 0.22; this.musicGain.connect(this.master);
    this.sfxGain = this.ctx.createGain(); this.sfxGain.gain.value = 0.6; this.sfxGain.connect(this.master);
  },

  tone(freq, dur = 0.15, type = 'square', vol = 0.5, when = 0, dest = null) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(dest || this.sfxGain);
    o.start(t); o.stop(t + dur + 0.02);
  },

  // ---- Efectos ----
  click()  { this.tone(660, 0.05, 'square', 0.25); },
  flip()   { this.tone(520, 0.06, 'triangle', 0.4); this.tone(780, 0.06, 'triangle', 0.3, 0.04); },
  match()  { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.12, 'square', 0.35, i * 0.07)); },
  error()  { this.tone(196, 0.18, 'sawtooth', 0.35); this.tone(147, 0.25, 'sawtooth', 0.3, 0.12); },
  win()    { [392, 440, 523, 587, 659, 784].forEach((f, i) => this.tone(f, 0.18, 'square', 0.35, i * 0.1)); this.tone(1047, 0.5, 'triangle', 0.4, 0.65); },
  lose()   { [392, 349, 311, 262].forEach((f, i) => this.tone(f, 0.25, 'triangle', 0.4, i * 0.18)); },
  tick()   { this.tone(1200, 0.03, 'square', 0.15); },
  knot(i)  { const c = CONFIG.QUIPU.colores[i]; this.tone(c.nota, 0.35, 'triangle', 0.55); this.tone(c.nota * 2, 0.2, 'sine', 0.15); },
  start()  { [294, 392, 440, 587].forEach((f, i) => this.tone(f, 0.15, 'triangle', 0.4, i * 0.09)); },

  // ---- Música: melodía tipo quena sobre bajo pentatónico ----
  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    const escala = [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25]; // pentatónica andina (Re)
    const melodia = [5, 4, 3, 2, 3, -1, 2, 1, 0, -1, 2, 3, 4, 3, 2, -1,
                     5, 6, 5, 4, 3, -1, 4, 3, 2, -1, 1, 2, 0, -1, -1, -1];
    const bajo = [0, 0, 3, 3, 2, 2, 0, 0];
    this.musicStep = 0;
    this.musicTimer = setInterval(() => {
      if (!this.ctx) return;
      const s = this.musicStep % melodia.length;
      const n = melodia[s];
      if (n >= 0) this.tone(escala[n] * 2, 0.32, 'sine', 0.35, 0, this.musicGain);
      if (s % 4 === 0) this.tone(escala[bajo[(s / 4) % bajo.length]] / 2, 0.5, 'triangle', 0.4, 0, this.musicGain);
      if (s % 2 === 1) this.tone(90, 0.05, 'square', 0.12, 0, this.musicGain); // bombo suave
      this.musicStep++;
    }, 260);
  },
  stopMusic() { clearInterval(this.musicTimer); this.musicTimer = null; },

  toggleMute() {
    this.muted = !this.muted;
    if (this.master) this.master.gain.value = this.muted ? 0 : 0.9;
    return this.muted;
  }
};
