/* ------------------------------------------------------------------
   The DJ booth.
     - the DJ cat (animated gif) spins one publication at a time
     - the crate at the bottom holds one record per publication or
       preprint: drag to reorder, click or drop one on the booth to play it
     - the background is a pixel disco generated from the playing record
   Everything is built from WORK, so a new publication adds a record
   to the crate automatically (5 show at once, the rest scroll).
------------------------------------------------------------------- */
(function () {
  const P = window.Portfolio;
  const root = document.getElementById('stage');
  if (!root) return;

  const pubs = window.WORK.filter(window.IS_PUB);
  const byId = Object.fromEntries(pubs.map(w => [w.id, w]));
  const NOTE = '♪';
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

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
  const booth = h('button', 'booth', '<img class="dj-gif" src="assets/img/dj-cat.gif" width="220" height="252" alt="A cat DJing at a turntable">' + '<span class="booth-tip">Open the record that is playing</span>'); booth.type = 'button'; booth.setAttribute('aria-label', 'DJ cat. Open details for the record that is playing.');
  const ui = h('div', 'deck-ui');
  const banner = h('div', 'banner', '<div class="marquee" aria-live="polite"><div class="mq-track"></div></div>' +
    '<div class="ctl"><button type="button" data-a="prev" aria-label="Previous record">⏮</button><button type="button" data-a="play" aria-label="Pause">⏸</button><button type="button" data-a="next" aria-label="Next record">⏭</button><button type="button" data-a="dice" aria-label="Remix the pixel background" title="Remix the background">🎲</button></div>');
  const track = h('div', 'crate'); track.setAttribute('role', 'list'); track.setAttribute('aria-label', 'Record crate. Drag to reorder.');
  ui.append(banner, track);
  inner.append(cv, beams, booth, ui);
  const foot = h('div', 'stage-foot',
    '<span class="k"><span class="sw cyan"></span>Quality-diversity</span><span class="k"><span class="sw lav"></span>Other areas</span><span class="k"><span class="sw yel"></span>Preprint</span>' +
    '<span class="grow">Click a record to play it, drag to reorder, or drop one on the DJ. Click the DJ for the details of what is spinning.</span>');
  root.append(inner, foot);

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
  }

  function setMarquee(w) {
    const line = NOTE + ' NOW SPINNING ' + NOTE + ' ' + w.cv + ' · ' + w.title + ' · ' + w.venue + ', ' + w.year + ' ' + NOTE + ' click the DJ for details ';
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
  P.scene = { play, focusDancer(id) { if (!byId[id]) return; root.scrollIntoView({ behavior: 'smooth', block: 'center' }); play(id); const s = track.querySelector('.sleeve[data-id="' + id + '"]'); if (s) { s.scrollIntoView({ block: 'nearest', inline: 'center' }); s.focus({ preventScroll: true }); } } };
})();
