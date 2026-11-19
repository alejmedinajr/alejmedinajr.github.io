/* ------------------------------------------------------------------
   The DJ room.
     - the DJ cat (a 3D low-poly render) works the decks at the top
     - below it, one small dancing cat per publication or preprint,
       with a star label: red = accepted paper, yellow = preprint
     - the pixel disco from the CDVE 2022 record is the room's wallpaper,
       kept faint so the cats stay the focus
   Everything is built from WORK, so a new publication adds a dancer
   automatically. The floor wraps to new rows as it fills.
------------------------------------------------------------------- */
(function () {
  const P = window.Portfolio;
  const root = document.getElementById('stage');
  if (!root) return;

  const pubs = window.WORK.filter(window.IS_PUB);
  const rank = w => (w.kind === 'preprint' ? 1e6 : 0) + w.year * 10 + (w.lead ? 0 : 1);
  const sorted = pubs.slice().sort((a, b) => rank(a) - rank(b));   // oldest first, preprints last
  const VARIANTS = 6;
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const star = kind => '<svg class="star ' + (kind === 'preprint' ? 'yel' : 'red') + '" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2l2.9 6.1 6.7.8-4.9 4.6 1.3 6.6L12 17l-6 3.3 1.3-6.6L2.4 9.1l6.7-.8z"/></svg>';

  root.innerHTML = '';
  const inner = h('div', 'stage-inner');
  const cv = h('canvas', 'px-bg'); cv.setAttribute('aria-hidden', 'true');
  const dj = h('div', 'dj', '<img class="dj-img" src="assets/img/dj-cat.webp?v=20261118c" width="440" height="504" alt="A cat DJing at two turntables" decoding="async">');
  const floor = h('div', 'floor'); floor.setAttribute('role', 'list'); floor.setAttribute('aria-label', 'Dancing cats, one for each publication and preprint. Click one for details.');
  inner.append(cv, dj, floor);
  const foot = h('div', 'stage-foot',
    '<span class="k">' + star('paper') + 'Accepted paper</span><span class="k">' + star('preprint') + 'Preprint</span>' +
    '<span class="grow">Click a dancing cat for its title, coauthors and links.</span>');
  root.append(inner, foot);

  sorted.forEach((w, i) => {
    const b = h('button', 'dancer ' + (w.kind === 'preprint' ? 'pre' : 'acc'));
    b.type = 'button'; b.dataset.id = w.id; b.setAttribute('role', 'listitem');
    b.style.setProperty('--i', i);
    b.setAttribute('aria-label', w.title + '. ' + P.KIND[w.kind] + ', ' + w.year + '. Open details.');
    b.innerHTML = '<img class="cat" src="assets/img/dancer-' + (i % VARIANTS) + '.webp?v=20261118c" width="192" height="240" alt="" decoding="async" loading="lazy">' +
      '<span class="tag">' + star(w.kind) + '<b>[' + esc(w.cv) + ']</b></span>' +
      '<span class="tip"><b>' + esc(w.title) + '</b><small>' + esc(P.KIND[w.kind]) + ' · ' + esc(w.venue) + ', ' + w.year + '</small></span>';
    b.addEventListener('click', () => P.cards.open(w.id, { from: 'stage' }));
    floor.appendChild(b);
  });

  /* ---------- the wallpaper: CDVE 2022's pixel disco, locked ---------- */
  const wallId = (window.WORK.find(w => w.id === 'polls') || sorted[0] || {}).id;
  const bg = new P.Pixels.Bg(cv);
  const th = P.Pixels.theme(wallId, 0);
  const st = root.style;
  st.setProperty('--glow', th.accent);
  bg.set(th, true);
  new ResizeObserver(() => { bg.resize(); if (P.reduced) bg.draw(0); }).observe(cv);
  bg.resize();
  let last = 0, visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(root);
  (function loop(now) {
    if (!P.reduced && visible && !document.hidden && now - last > 40) { last = now; bg.draw(now); }
    requestAnimationFrame(loop);
  })(0);
  if (P.reduced) bg.draw(0);

  P.scene = {
    focusDancer(id) {
      const d = floor.querySelector('[data-id="' + id + '"]'); if (!d) return;
      root.scrollIntoView({ behavior: 'smooth', block: 'center' });
      d.focus({ preventScroll: true }); d.classList.add('ping'); setTimeout(() => d.classList.remove('ping'), 2200);
    }
  };
})();
