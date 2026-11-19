/* ------------------------------------------------------------------
   The DJ booth.
     - a cat with sunglasses spins one publication at a time
     - the crate at the bottom holds one record per publication or
       preprint: drag to reorder, click or drop one on the booth to play it
     - the background is a pixel disco generated from the playing record
     - one cat per publication or preprint dances in the back; click it
       for the details card
   Everything is built from WORK, so a new publication adds a record
   and a dancer automatically.
------------------------------------------------------------------- */
(function () {
  const P = window.Portfolio;
  const root = document.getElementById('stage');
  if (!root) return;

  const pubs = window.WORK.filter(window.IS_PUB);
  const byId = Object.fromEntries(pubs.map(w => [w.id, w]));
  const FUR = { cyan: '#8fe9f7', lav: '#cdbbff', yel: '#ffe58a' };
  const NOTE = '♪';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- art ---------- */
  function catSVG(acc) {
    const arm = (side, glow) => {
      const left = side === 'L', d = left ? 'M34 78 C20 74 14 60 18 48' : 'M66 78 C80 74 86 60 82 48';
      return '<g class="c-arm' + side + '"><path d="' + d + '" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="var(--fur)" stroke-width="10" stroke-linecap="round"/>' +
        (glow ? '<path d="M' + (left ? '18 47 L11 32' : '82 47 L89 32') + '" stroke="' + (left ? '#22d3ee' : '#ff5d6c') + '" stroke-width="5" stroke-linecap="round" class="glow-stick"/>' : '') + '</g>';
    };
    const accessory = [
      '<path d="M39 20 L50 -8 L61 20Z" fill="#ff5d6c" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="-8" r="4" fill="#ffd43b" stroke="#fff" stroke-width="1.5"/>',
      '<path d="M50 68 L36 60 L36 76Z M50 68 L64 60 L64 76Z" fill="#ffd43b" stroke="#fff" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="68" r="4" fill="#ff5d6c" stroke="#fff" stroke-width="1.5"/>',
      '<path d="M28 28 C36 12 64 12 72 28" fill="none" stroke="#a78bfa" stroke-width="5" stroke-linecap="round"/><path d="M50 9 l2.4 5 5.4.6-4 3.8 1 5.4-4.8-2.7-4.8 2.7 1-5.4-4-3.8 5.4-.6z" fill="#ffd43b" stroke="#fff" stroke-width="1.2"/>',
      ''
    ][acc % 4];
    return '<svg viewBox="0 -12 100 136" aria-hidden="true"><g class="c-all">' +
      '<path class="c-tail" d="M66 100 C92 100 94 74 84 60" fill="none" stroke="#fff" stroke-width="14" stroke-linecap="round"/><path class="c-tail" d="M66 100 C92 100 94 74 84 60" fill="none" stroke="var(--fur)" stroke-width="10" stroke-linecap="round"/>' +
      '<rect x="32" y="104" width="14" height="17" rx="7" fill="var(--fur)" stroke="#fff" stroke-width="2.5"/><rect x="54" y="104" width="14" height="17" rx="7" fill="var(--fur)" stroke="#fff" stroke-width="2.5"/>' +
      '<ellipse cx="50" cy="88" rx="22" ry="26" fill="var(--fur)" stroke="#fff" stroke-width="2.5"/><ellipse cx="50" cy="95" rx="13" ry="15" fill="#fff" opacity=".7"/>' +
      arm('L', acc % 4 === 3) + arm('R', acc % 4 === 3) +
      '<g class="c-head">' +
      '<path d="M27 32 L31 6 L48 20Z" fill="var(--fur)" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/><path d="M73 32 L69 6 L52 20Z" fill="var(--fur)" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M33 26 L34 13 L43 21Z" fill="#ffb3c1"/><path d="M67 26 L66 13 L57 21Z" fill="#ffb3c1"/>' +
      '<circle cx="50" cy="42" r="25" fill="var(--fur)" stroke="#fff" stroke-width="2.5"/>' +
      '<path d="M37 40 q5 -6 10 0 M53 40 q5 -6 10 0" fill="none" stroke="#17203a" stroke-width="2.8" stroke-linecap="round"/>' +
      '<circle cx="35" cy="48" r="4.5" fill="#ff8fa3" opacity=".5"/><circle cx="65" cy="48" r="4.5" fill="#ff8fa3" opacity=".5"/>' +
      '<path d="M46.5 47 h7 l-3.5 4z" fill="#ff7b93"/><path d="M44 53 q6 6 12 0" fill="none" stroke="#17203a" stroke-width="2.4" stroke-linecap="round"/>' +
      '<path d="M30 46 l-9 -2 M30 50 l-9 3 M70 46 l9 -2 M70 50 l9 3" stroke="#17203a" stroke-opacity=".45" stroke-width="1.4" stroke-linecap="round"/>' +
      (acc % 4 !== 1 ? accessory : '') + '</g>' + (acc % 4 === 1 ? accessory : '') + '</g></svg>';
  }

  function discoBall() {
    return '<svg viewBox="0 0 80 110" aria-hidden="true"><defs><radialGradient id="ball" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#d9d2ff"/><stop offset="1" stop-color="#8fdcf2"/></radialGradient><clipPath id="ballclip"><circle cx="40" cy="68" r="30"/></clipPath></defs>' +
      '<path d="M40 0 V38" stroke="#fff" stroke-width="3"/><circle cx="40" cy="68" r="30" fill="url(#ball)" stroke="#fff" stroke-width="2.5"/>' +
      '<g clip-path="url(#ballclip)" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.2">' +
      [50, 58, 66, 74, 82, 90].map(y => '<path d="M6 ' + y + ' Q40 ' + (y + 10) + ' 74 ' + y + '"/>').join('') +
      [0, 1, 2, 3, 4].map(i => '<ellipse class="facet" style="animation-delay:-' + (i * .55) + 's" cx="40" cy="68" rx="30" ry="30"/>').join('') + '</g>' +
      '<path d="M28 52 q8 -10 18 -8" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".85" fill="none"/>' +
      '<g class="sparkles" fill="#fff"><path d="M8 40 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path d="M70 62 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" style="animation-delay:-.7s"/><path d="M64 28 l1.4 3.4 3.4 1.4 -3.4 1.4 -1.4 3.4 -1.4 -3.4 -3.4 -1.4 3.4 -1.4z" style="animation-delay:-1.3s"/></g></svg>';
  }

  function djSVG() {
    const rec = (cx, cls, v) => '<g transform="translate(' + cx + ' 178)"><circle r="40" fill="#e8edfb" stroke="#fff" stroke-width="2.5"/><g class="rec ' + cls + '"><circle r="35" fill="#1c2136"/>' +
      '<circle r="29" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.5"/><circle r="23" fill="none" stroke="#fff" stroke-opacity=".1" stroke-width="1.5"/>' +
      '<circle r="14" fill="var(' + v + ')"/><circle r="2.6" fill="#fff"/><path d="M14 0 H35" stroke="#fff" stroke-opacity=".55" stroke-width="2.2"/></g>' +
      '<path d="M-25 -24 A35 35 0 0 1 24 -25" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="5" stroke-linecap="round"/></g>';
    const armPath = (d) => '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="20" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#fff4e1" stroke-width="15" stroke-linecap="round"/>';
    return '<svg viewBox="0 0 240 236" class="dj-svg" role="img" aria-label="A cat with sunglasses and headphones DJing at two turntables">' +
      '<defs><linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".92"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient></defs>' +
      '<ellipse cx="120" cy="124" rx="52" ry="42" fill="#fff4e1" stroke="#fff" stroke-width="3"/>' +
      '<g class="dj-head">' +
      '<path d="M82 46 L86 6 L116 32Z" fill="#fff4e1" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M158 46 L154 6 L124 32Z" fill="#fff4e1" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M91 38 L93 17 L108 31Z" fill="#ffb3c1"/><path d="M149 38 L147 17 L132 31Z" fill="#ffb3c1"/>' +
      '<circle cx="120" cy="66" r="42" fill="#fff4e1" stroke="#fff" stroke-width="3"/>' +
      '<path d="M120 26 v11 M109 28 l2 10 M131 28 l-2 10" stroke="#e8b27a" stroke-width="3.2" stroke-linecap="round"/>' +
      '<circle cx="92" cy="88" r="7" fill="#ff8fa3" opacity=".55"/><circle cx="148" cy="88" r="7" fill="#ff8fa3" opacity=".55"/>' +
      '<path d="M114 82 h12 l-6 7z" fill="#ff7b93"/><path d="M109 94 q11 10 22 0" fill="none" stroke="#17203a" stroke-width="2.8" stroke-linecap="round"/>' +
      '<g class="shades"><rect x="85" y="55" width="33" height="23" rx="11" fill="#141827" stroke="#fff" stroke-width="1.5"/><rect x="122" y="55" width="33" height="23" rx="11" fill="#141827" stroke="#fff" stroke-width="1.5"/><rect x="116" y="61" width="8" height="4" rx="2" fill="#141827"/>' +
      '<path d="M92 61 h11 l-7 9z M129 61 h11 l-7 9z" fill="#fff" opacity=".32"/><path class="glint" d="M106 58 l3 0 -5 15 -3 0z" fill="#fff" opacity=".7"/></g>' +
      '<path d="M78 62 C74 6 166 6 162 62" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/><path d="M78 62 C74 6 166 6 162 62" fill="none" stroke="#7c5cf0" stroke-width="7" stroke-linecap="round"/>' +
      '<rect x="70" y="50" width="15" height="32" rx="7.5" fill="#a78bfa" stroke="#fff" stroke-width="2.5"/><rect x="155" y="50" width="15" height="32" rx="7.5" fill="#a78bfa" stroke="#fff" stroke-width="2.5"/>' +
      '</g>' +
      '<rect x="8" y="136" width="224" height="94" rx="26" fill="url(#desk)" stroke="#fff" stroke-width="2.5"/>' +
      '<rect x="8" y="136" width="224" height="94" rx="26" fill="var(--glow)" opacity=".18"/>' +
      rec(60, 'spinA', '--ta') + rec(180, 'spinB', '--tb') +
      '<rect x="98" y="152" width="44" height="66" rx="11" fill="#fff" opacity=".7"/>' +
      '<circle cx="108" cy="165" r="4.5" fill="var(--ta)"/><circle cx="120" cy="165" r="4.5" fill="#a78bfa"/><circle cx="132" cy="165" r="4.5" fill="var(--tb)"/>' +
      '<g stroke="#17203a" stroke-opacity=".35" stroke-width="2" stroke-linecap="round"><path d="M108 178 v22 M120 178 v22 M132 178 v22"/></g>' +
      '<g fill="#fff" stroke="#17203a" stroke-opacity=".4"><rect class="fader" x="104" y="184" width="8" height="5" rx="2"/><rect class="fader f2" x="116" y="192" width="8" height="5" rx="2"/><rect class="fader f3" x="128" y="186" width="8" height="5" rx="2"/></g>' +
      '<rect x="104" y="208" width="32" height="5" rx="2.5" fill="#17203a" fill-opacity=".25"/><rect class="xfade" x="112" y="206" width="9" height="9" rx="3" fill="#fff" stroke="#17203a" stroke-opacity=".4"/>' +
      '<g class="arm-l">' + armPath('M84 130 C66 142 58 150 58 166') + '<circle cx="58" cy="166" r="9.5" fill="#fff4e1" stroke="#fff" stroke-width="2"/></g>' +
      '<g class="arm-r">' + armPath('M156 130 C174 142 182 150 182 166') + '<circle cx="182" cy="166" r="9.5" fill="#fff4e1" stroke="#fff" stroke-width="2"/></g>' +
      '</svg>';
  }

  /* ---------- state ---------- */
  const rank = w => (w.kind === 'preprint' ? 1e6 : 0) + w.year * 10 + (w.lead ? 1 : 0);
  let order = pubs.slice().sort((a, b) => rank(b) - rank(a)).map(w => w.id);
  const salts = {}, themes = {};
  const themeOf = id => themes[id] || (themes[id] = P.Pixels.theme(id, salts[id] || 0));
  let cur = order[0], playing = true, lastUser = 0, timer = 0;

  /* ---------- DOM ---------- */
  root.innerHTML = '';
  const inner = h('div', 'stage-inner');
  const cv = h('canvas', 'px-bg'); cv.setAttribute('aria-hidden', 'true');
  const beams = h('div', 'beams'); beams.setAttribute('aria-hidden', 'true');
  const ball = h('div', 'discoball', discoBall()); ball.setAttribute('aria-hidden', 'true');
  const dancers = h('div', 'dancers'); dancers.setAttribute('role', 'group'); dancers.setAttribute('aria-label', 'Dancing cats, one for each publication and preprint');
  const booth = h('button', 'booth', djSVG() + '<span class="booth-tip">Open the record that is playing</span>'); booth.type = 'button'; booth.setAttribute('aria-label', 'DJ cat. Open details for the record that is playing.');
  const ui = h('div', 'deck-ui');
  const banner = h('div', 'banner', '<div class="marquee" aria-live="polite"><div class="mq-track"></div></div>' +
    '<div class="ctl"><button type="button" data-a="prev" aria-label="Previous record">⏮</button><button type="button" data-a="play" aria-label="Pause">⏸</button><button type="button" data-a="next" aria-label="Next record">⏭</button><button type="button" data-a="dice" aria-label="Remix the pixel background" title="Remix the background">🎲</button></div>');
  const track = h('div', 'crate'); track.setAttribute('role', 'list'); track.setAttribute('aria-label', 'Record crate. Drag to reorder.');
  ui.append(banner, track);
  inner.append(cv, beams, ball, dancers, booth, ui);
  const foot = h('div', 'stage-foot',
    '<span class="k"><span class="sw cyan"></span>Quality-diversity</span><span class="k"><span class="sw lav"></span>Other areas</span><span class="k"><span class="sw yel"></span>Preprint</span>' +
    '<span class="grow">Click a cat for its details. Drag records to remix the set, or drop one on the booth to play it.</span>');
  root.append(inner, foot);

  /* dancers */
  pubs.forEach((w, i) => {
    const b = h('button', 'dancer ' + P.colorOf(w) + ' m' + (i % 4));
    b.type = 'button'; b.dataset.id = w.id; b.style.setProperty('--i', i); b.style.setProperty('--fur', FUR[P.colorOf(w)]);
    b.setAttribute('aria-label', w.title + '. ' + P.KIND[w.kind] + ', ' + w.year + '. Open details.');
    b.innerHTML = '<span class="d-sprite">' + catSVG(i) + '</span><span class="d-tag">' + esc(w.cv) + ' · ' + esc(w.short) + '</span>' +
      '<span class="d-tip"><b>' + esc(w.title) + '</b><small>' + esc(P.KIND[w.kind]) + ' · ' + w.year + '<br>' + esc(w.authors.join(', ')) + '</small></span>';
    b.addEventListener('click', () => P.cards.open(w.id, { from: 'stage' }));
    dancers.appendChild(b);
  });

  /* sleeves */
  function sleeve(id) {
    const w = byId[id];
    const s = h('div', 'sleeve ' + P.colorOf(w)); s.setAttribute('role', 'listitem'); s.tabIndex = 0; s.dataset.id = id;
    s.setAttribute('aria-label', w.title + '. Press Enter to play, Left and Right with Shift to move.');
    const c = h('canvas', 'cover'); P.Pixels.cover(c, themeOf(id));
    s.append(c);
    s.insertAdjacentHTML('beforeend', '<span class="s-cv">' + esc(w.cv) + '</span><span class="s-t">' + esc(w.short) + '</span><span class="s-k">' + esc(P.KIND[w.kind]) + '</span><i class="eq" aria-hidden="true"><b></b><b></b><b></b></i>');
    return s;
  }
  function renderCrate() { track.innerHTML = ''; order.forEach(id => track.appendChild(sleeve(id))); mark(); }

  function mark() {
    track.querySelectorAll('.sleeve').forEach(s => s.classList.toggle('playing', s.dataset.id === cur));
    dancers.querySelectorAll('.dancer').forEach(d => d.classList.toggle('live', d.dataset.id === cur));
  }

  function setMarquee(w) {
    const line = NOTE + ' NOW SPINNING ' + NOTE + ' ' + w.cv + ' · ' + w.title + ' · ' + w.venue + ', ' + w.year + ' ' + NOTE + ' click the dancing cats for details ';
    root.querySelector('.mq-track').innerHTML = '<span>' + esc(line) + '</span><span aria-hidden="true">' + esc(line) + '</span>';
  }

  /* ---------- playback ---------- */
  const bg = new P.Pixels.Bg(cv);
  function applyTheme(th, instant) {
    bg.set(th, instant);
    const st = root.style;
    st.setProperty('--beat', (60 / th.bpm).toFixed(3) + 's');
    st.setProperty('--t0', th.accent); st.setProperty('--t1', th.accent2); st.setProperty('--t2', th.accent3);
    st.setProperty('--glow', th.accent); st.setProperty('--beam', th.accent.replace(')', ' / .38)').replace('hsl(', 'hsl('));
    st.setProperty('--ta', th.pal[1]);
    const nx = byId[order[(order.indexOf(cur) + 1) % order.length]];
    st.setProperty('--tb', themeOf(nx.id).pal[4]);
  }
  function play(id, instant) {
    if (!byId[id]) return;
    cur = id; applyTheme(themeOf(id), instant); setMarquee(byId[id]); mark();
    clearInterval(timer);
    if (playing && !P.reduced) timer = setInterval(() => { if (Date.now() - lastUser > 25000) step(1); }, 15000);
  }
  function step(d) { const i = order.indexOf(cur); play(order[(i + d + order.length) % order.length]); }
  function setPlaying(on) {
    playing = on; root.classList.toggle('paused', !on);
    const b = banner.querySelector('[data-a="play"]'); b.textContent = on ? '⏸' : '▶'; b.setAttribute('aria-label', on ? 'Pause' : 'Play');
    play(cur);
  }
  function remix() {
    salts[cur] = (salts[cur] || 0) + 1 + Math.floor(Math.random() * 999); themes[cur] = P.Pixels.theme(cur, salts[cur]);
    const s = track.querySelector('.sleeve[data-id="' + cur + '"] canvas'); if (s) P.Pixels.cover(s, themes[cur]);
    applyTheme(themes[cur]);
  }

  banner.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return; lastUser = Date.now();
    ({ prev: () => step(-1), next: () => step(1), play: () => setPlaying(!playing), dice: remix }[b.dataset.a] || (() => {}))();
  });
  booth.addEventListener('click', () => P.cards.open(cur, { from: 'stage' }));
  root.addEventListener('pointerdown', () => { lastUser = Date.now(); });

  /* ---------- drag to reorder / drop on the booth ---------- */
  let down = null, drag = null;
  track.addEventListener('pointerdown', e => {
    const s = e.target.closest('.sleeve'); if (!s || (e.pointerType === 'mouse' && e.button !== 0)) return;
    down = { s, x: e.clientX, y: e.clientY, id: s.dataset.id };
  });
  window.addEventListener('pointermove', e => {
    if (!down) return;
    if (!drag && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 7) begin(e);
    if (drag) move(e);
  });
  window.addEventListener('pointerup', e => {
    if (!down) return;
    if (drag) end(e); else { lastUser = Date.now(); play(down.id); }
    down = null;
  });
  window.addEventListener('pointercancel', () => { if (drag) end(null); down = null; });

  function begin(e) {
    const s = down.s, r = s.getBoundingClientRect();
    const ph = h('div', 'sleeve-ph'); ph.style.width = r.width + 'px'; ph.style.height = r.height + 'px';
    s.parentNode.insertBefore(ph, s);
    s.classList.add('drag'); s.style.cssText = 'position:fixed;left:' + r.left + 'px;top:' + r.top + 'px;width:' + r.width + 'px;height:' + r.height + 'px;';
    document.body.appendChild(s);
    drag = { s, ph, dx: e.clientX - r.left, dy: e.clientY - r.top, over: false };
    document.body.classList.add('dragging-record');
  }
  function move(e) {
    const { s, ph } = drag;
    s.style.left = (e.clientX - drag.dx) + 'px'; s.style.top = (e.clientY - drag.dy) + 'px';
    const br = booth.getBoundingClientRect();
    drag.over = e.clientX > br.left - 20 && e.clientX < br.right + 20 && e.clientY > br.top - 40 && e.clientY < br.bottom;
    booth.classList.toggle('drop-ready', drag.over);
    const tr = track.getBoundingClientRect();
    if (e.clientX < tr.left + 36) track.scrollLeft -= 10; else if (e.clientX > tr.right - 36) track.scrollLeft += 10;
    const sibs = [...track.children].filter(c => c !== ph);
    const before = new Map(sibs.map(c => [c, c.getBoundingClientRect().left]));
    let idx = 0; sibs.forEach(c => { const cr = c.getBoundingClientRect(); if (e.clientX > cr.left + cr.width / 2) idx++; });
    const ref = sibs[idx] || null;
    if (ph.nextSibling !== ref && !(ref === null && track.lastChild === ph)) {
      track.insertBefore(ph, ref);
      sibs.forEach(c => { const dx = before.get(c) - c.getBoundingClientRect().left; if (dx) c.animate([{ transform: 'translateX(' + dx + 'px)' }, { transform: 'none' }], { duration: 180, easing: 'ease-out' }); });
    }
  }
  function end() {
    const { s, ph, over } = drag;
    s.classList.remove('drag'); s.style.cssText = '';
    track.insertBefore(s, ph); ph.remove();
    order = [...track.children].map(c => c.dataset.id);
    booth.classList.remove('drop-ready'); document.body.classList.remove('dragging-record');
    lastUser = Date.now();
    drag = null;
    if (over) play(s.dataset.id); else { mark(); applyTheme(themeOf(cur)); }
  }
  track.addEventListener('keydown', e => {
    const s = e.target.closest('.sleeve'); if (!s) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lastUser = Date.now(); play(s.dataset.id); }
    else if (e.shiftKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault(); const i = order.indexOf(s.dataset.id), j = i + (e.key === 'ArrowLeft' ? -1 : 1);
      if (j < 0 || j >= order.length) return; order.splice(j, 0, order.splice(i, 1)[0]); renderCrate(); track.querySelector('.sleeve[data-id="' + s.dataset.id + '"]').focus(); applyTheme(themeOf(cur));
    }
  });

  /* ---------- go ---------- */
  renderCrate();
  new ResizeObserver(() => bg.resize()).observe(cv);
  play(cur, true); bg.resize();
  let last = 0;
  (function loop(now) {
    if (!P.reduced && playing && !document.hidden && now - last > 40) { last = now; bg.draw(now); }
    requestAnimationFrame(loop);
  })(0);
  P.scene = { play, focusDancer(id) { const d = dancers.querySelector('[data-id="' + id + '"]'); if (!d) return; root.scrollIntoView({ behavior: 'smooth', block: 'center' }); play(id); d.focus({ preventScroll: true }); } };
})();
