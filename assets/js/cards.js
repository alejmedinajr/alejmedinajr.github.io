/* Detail cards: one modal shared by the habitat, the map and the publication list. */
(function () {
  const P = (window.Portfolio = window.Portfolio || {});
  const RANK = ['', 'C', 'B', 'A', 'A*'];
  P.byId = Object.fromEntries(window.WORK.map(w => [w.id, w]));

  const ov = document.getElementById('overlay');
  const card = ov.querySelector('.work-card');
  let lastFocus = null, current = null;

  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const chip = (text, cls) => h('span', 'chip ' + (cls || ''), text);
  const row = (k, v) => { const d = h('div'); d.append(h('b', '', k), h('span', '', v)); return d; };

  function shell() {
    card.innerHTML = '';
    const x = h('button', 'x', '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.addEventListener('click', close);
    card.appendChild(x);
  }

  function show() {
    if (!ov.classList.contains('open')) lastFocus = document.activeElement;
    ov.classList.add('open');
    document.body.style.overflow = 'hidden';
    card.querySelector('.x').focus();
  }

  function open(id, opts) {
    const w = P.byId[id]; if (!w) return;
    current = id;
    shell();
    const pre = w.kind === 'preprint', col = P.colorOf(w);

    const chips = h('div', 'chips');
    chips.append(chip(P.KIND[w.kind] + (pre ? ' · under review' : ''), col));
    if (w.cv) chips.append(chip('CV ' + w.cv));
    chips.append(chip(w.lead ? 'Lead author' : 'Co-author'));
    if (w.rank) chips.append(chip('Venue rank ' + RANK[w.rank]));
    card.append(chips);

    card.append(h('div', 'kicker', w.year + ' · ' + w.venue));
    card.append(h('h3', '', w.title));
    if (w.award) card.append(h('div', 'award-line', '★  ' + w.award + ', ' + w.venue));
    card.append(h('p', '', w.desc));

    const meta = h('div', 'meta');
    if (w.authors) meta.append(row('Authors', w.authors.join(', ')));
    meta.append(row('Where', w.place ? w.place.name : 'Venue location to be announced'));
    if (w.tags && w.tags.length) { const t = h('div', 'chips'); w.tags.filter(x => !/^(quality-diversity|machine learning|algorithms|human systems)$/i.test(x)).forEach(x => t.append(chip(x, 'lav'))); const d = h('div'); d.append(h('b', '', 'Tags'), t); meta.append(d); }
    card.append(meta);

    const acts = h('div', 'card-actions');
    (w.links || []).forEach((l, i) => { const a = h('a', 'btn small' + (i ? '' : ' primary'), l.label + ' →'); a.href = l.href; a.target = '_blank'; a.rel = 'noreferrer'; acts.append(a); });
    if (w.place && !(opts && opts.from === 'map')) { const b = h('button', 'btn small', 'Show on map'); b.type = 'button'; b.addEventListener('click', () => { close(); P.map.flyTo(id); }); acts.append(b); }
    if (window.IS_PUB(w) && !(opts && opts.from === 'stage')) { const b = h('button', 'btn small', 'Find the cat'); b.type = 'button'; b.addEventListener('click', () => { close(); P.scene.focusDancer(id); }); acts.append(b); }
    card.append(acts);

    show();
    try { history.replaceState(null, '', '#work=' + id); } catch (e) {}
    document.dispatchEvent(new CustomEvent('work:open', { detail: id }));
  }

  function openPlace(ids, name) {
    current = null;
    shell();
    const chips = h('div', 'chips'); chips.append(chip(ids.length + ' items here', 'lav')); card.append(chips);
    card.append(h('h3', '', name));
    card.append(h('p', '', 'Pick one to read more.'));
    const list = h('div', 'place-list');
    ids.map(i => P.byId[i]).sort((a, b) => b.year - a.year).forEach(w => {
      const b = h('button', 'place-item'); b.type = 'button';
      b.append(h('span', 'yr', String(w.year)));
      const t = h('span', 't', w.title); b.append(t);
      b.addEventListener('click', () => open(w.id, { from: 'map' }));
      list.append(b);
    });
    card.append(list);
    show();
  }

  function close() {
    if (!ov.classList.contains('open')) return;
    ov.classList.remove('open');
    document.body.style.overflow = '';
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    current = null;
    document.dispatchEvent(new CustomEvent('work:close'));
  }

  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  P.cards = { open, openPlace, close };

  // deep links: index.html#work=motif
  const m = location.hash.match(/^#work=(.+)$/);
  if (m && P.byId[m[1]]) window.addEventListener('load', () => open(m[1]));
})();
