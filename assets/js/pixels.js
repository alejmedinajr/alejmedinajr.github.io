/* ------------------------------------------------------------------
   Pixel disco engine.
   Every publication gets a randomly generated (but repeatable) theme:
   a pattern, a palette built from the site accents, and a tempo.
   Changing track dissolves the old pixels into the new ones.
   The same generator paints each record's cover art.
------------------------------------------------------------------- */
(function () {
  const P = window.Portfolio;
  const BASE_HUES = [190, 258, 350, 48]; // cyan, lavender, red, yellow
  const PATTERNS = 6;

  function theme(id, salt) {
    const r = P.rng(P.hash(id) + (salt || 0) * 977);
    const hues = BASE_HUES.slice();
    for (let i = hues.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [hues[i], hues[j]] = [hues[j], hues[i]]; }
    const hs = hues.map(h => (h + (r() - .5) * 36 + 360) % 360);
    const pal = [];
    hs.forEach(h => [[88, 56], [90, 69], [86, 82]].forEach(([s, l]) => pal.push('hsl(' + (h | 0) + ' ' + s + '% ' + l + '%)')));
    return {
      id, salt: salt || 0, pat: Math.floor(r() * PATTERNS), pal, hs,
      bpm: 104 + Math.floor(r() * 26), a: .35 + r() * .5, b: .3 + r() * .5, c: .2 + r() * .4, ph: r() * 6.28,
      accent: 'hsl(' + (hs[0] | 0) + ' 85% 62%)', accent2: 'hsl(' + (hs[1] | 0) + ' 85% 66%)', accent3: 'hsl(' + (hs[2] | 0) + ' 85% 70%)'
    };
  }

  const h2 = (x, y, k) => (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(k, 83492791)) >>> 0;

  /* returns an index into theme.pal, or -1 for an "off" (white) cell */
  function cell(th, x, y, t, W, H) {
    const beat = t * th.bpm / 60;
    let v;
    switch (th.pat) {
      case 0: v = (((x >> 1) + (y >> 1) + Math.floor(beat)) & 3) / 4 + ((x + y) & 1) * .08; break;                              // checker floor
      case 1: v = (Math.sin(x * th.a + t * 1.2 + th.ph) + Math.sin(y * th.b + t) + Math.sin((x + y) * th.c - t * 1.5) + Math.sin(Math.hypot(x - W / 2, y - H / 2) * .35 - t * 2) + 4) / 8; break; // plasma
      case 2: v = (((Math.hypot(x - W / 2, (y - H * .35) * 1.2) * .2 - t * .8 * th.bpm / 120) % 1) + 1) % 1; break;             // rings
      case 3: v = ((((x + y) * .12 + (x - y) * .03 + t * .6) % 1) + 1) % 1; break;                                               // diagonal stripes
      case 4: v = (h2(x, y, Math.floor(beat * 2)) % 1000) / 1000; break;                                                         // twinkle noise
      default: {                                                                                                                 // equalizer bars
        const hh = (.22 + .72 * Math.abs(Math.sin(x * .9 + beat * 1.7 + th.ph) * Math.sin(x * .37 + t * 1.3))) * H;
        if (y < H - hh) return -1;
        v = (H - y) / H; break;
      }
    }
    return Math.min(th.pal.length - 1, Math.max(0, Math.floor(v * th.pal.length)));
  }

  function Bg(canvas) {
    this.cv = canvas; this.ctx = canvas.getContext('2d');
    this.cur = null; this.prev = null; this.t0 = 0; this.p = 1; this.thr = [];
    this.cs = 20; this.last = 0;
  }
  Bg.prototype.resize = function () {
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = this.cv.clientWidth, h = this.cv.clientHeight;
    if (!w || !h) return;
    this.cv.width = w * dpr; this.cv.height = h * dpr; this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.cs = this.fixedCs || Math.max(14, Math.round(w / 30));
    this.W = Math.ceil(w / this.cs); this.H = Math.ceil(h / this.cs);
    const r = P.rng(7); this.thr = Array.from({ length: this.W * this.H }, () => r());
    this.draw(this.now || 0);
  };
  Bg.prototype.set = function (th, instant) {
    this.prev = instant ? th : (this.cur || th); this.cur = th; this.t0 = performance.now(); this.p = instant ? 1 : 0;
    const r = P.rng(P.hash(th.id) + th.salt + 3); this.thr = this.thr.map(() => r());
  };
  Bg.prototype.draw = function (now) {
    if (!this.cur || !this.W) return;
    this.now = now;
    const t = now / 1000, ctx = this.ctx, cs = this.cs, W = this.W, H = this.H;
    this.p = Math.min(1, (performance.now() - this.t0) / 1100);
    ctx.clearRect(0, 0, this.cv.clientWidth, this.cv.clientHeight);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const th = this.thr[y * W + x] < this.p ? this.cur : this.prev;
      const i = cell(th, x, y, t, W, H);
      ctx.fillStyle = i < 0 ? 'rgba(255,255,255,.78)' : th.pal[i];
      ctx.fillRect(x * cs + 1, y * cs + 1, cs - 1, cs - 1);
    }
    const bp = (t * this.cur.bpm / 60) % 1, a = .26 * Math.pow(1 - bp, 2.4);
    ctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')'; ctx.fillRect(0, 0, this.cv.clientWidth, this.cv.clientHeight);
  };

  /* chunky pixel cover art for a record sleeve */
  function cover(canvas, th) {
    const W = 22, H = 16, ctx = canvas.getContext('2d');
    canvas.width = W; canvas.height = H;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = cell(th, x, y, 4.3, W, H);
      ctx.fillStyle = i < 0 ? '#ffffff' : th.pal[i]; ctx.fillRect(x, y, 1, 1);
    }
  }

  P.Pixels = { theme, Bg, cover };
})();
