/* ------------------------------------------------------------------
   Zoomable world map. Pure SVG, no tiles, no library.
   Drag to pan, Ctrl/Cmd + scroll or pinch to zoom, double-click to zoom in.
   Pins are built from WORK entries that have a `place`. Pins that sit
   close together merge into a numbered cluster until you zoom in.
------------------------------------------------------------------- */
(function () {
  const P = (window.Portfolio = window.Portfolio || {});
  const stage = document.getElementById('map-stage');
  if (!stage || !window.WORLD_MAP) return;
  const NS = 'http://www.w3.org/2000/svg';
  const M = window.WORLD_MAP;
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs || {}) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  // equirectangular, viewBox 0 0 1000 500; cropped to lat 84N..58S
  const Y_TOP = 16.7, Y_BOT = 411, VIEW_H = Y_BOT - Y_TOP;
  const proj = (lng, lat) => [(lng + 180) / 360 * 1000, (90 - lat) / 180 * 500];
  const items = window.WORK.filter(w => w.place).map(w => { const [x, y] = proj(w.place.lng, w.place.lat); return { w, x, y }; });

  const svg = mk('svg', { class: 'world', role: 'application', 'aria-label': 'World map of papers, posters and talks. Use plus and minus to zoom, arrow keys to pan.' }, stage);
  const world = mk('g', {}, svg);
  mk('path', { class: 'grat', d: M.graticule }, world);
  mk('path', { class: 'land', d: M.land }, world);
  mk('path', { class: 'borders', d: M.borders }, world);
  if (M.states) mk('path', { class: 'borders states', d: M.states }, world);
  const pinLayer = mk('g', {}, svg);
  const tip = document.createElement('div'); tip.className = 'map-tip'; stage.appendChild(tip);
  const hint = stage.querySelector('.map-hint');

  let vw = 1000, vh = 394, k = 1, k0 = 1, tx = 0, ty = 0, inited = false, sel = null, sig = '', clusters = [], moved = 0;
  const kMax = () => k0 * 40;

  function clamp() {
    tx = Math.min(0, Math.max(vw - 1000 * k, tx));
    ty = Math.min(-Y_TOP * k, Math.max(vh - Y_BOT * k, ty));
  }
  function resize() {
    vw = stage.clientWidth || 1000;
    vh = Math.max(300, Math.round(vw * VIEW_H / 1000));
    stage.style.height = vh + 'px';
    svg.setAttribute('viewBox', '0 0 ' + vw + ' ' + vh);
    k0 = Math.max(vw / 1000, vh / VIEW_H);
    if (!inited) { k = k0; tx = vw / 2 - 416 * k; ty = -Y_TOP * k; inited = true; } else k = Math.max(k, k0);
    clamp(); render(true);
  }

  /* ---------- pins ---------- */
  const star = (cx, cy) => Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? 1.6 : 3.8; return (cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1); }).join(' ');
  const GLYPH = {
    paper: 'M-4 -32h5.5l3.5 3.5v9h-9z M1.5 -32v3.5h3.5 M-2 -24h5 M-2 -21h5',
    companion: 'M-4 -32h5.5l3.5 3.5v9h-9z M1.5 -32v3.5h3.5 M-2 -24h5 M-2 -21h5',
    preprint: 'M-4 -32h5.5l3.5 3.5v9h-9z M1.5 -32v3.5h3.5 M-2 -24h5 M-2 -21h5',
    poster: 'M-6.5 -32h13v9h-13z M-2.5 -23l-2 6 M2.5 -23l2 6 M-3 -29h6 M-3 -26h3.5',
    talk: 'M-6.5 -31h13v9h-6l-3.5 3.5v-3.5h-3.5z M-3 -27.5h6 M-3 -25h3.5'
  };

  function pinEl(it) {
    const w = it.w, col = P.colorOf(w);
    const g = mk('g', { class: 'pin ' + col + (sel === w.id ? ' sel' : ''), tabindex: 0, role: 'button', 'aria-label': w.title + ', ' + w.venue }), body = mk('g', { class: 'pin-body' }, g);
    if (w.kind === 'preprint') mk('circle', { class: 'pulse', cx: 0, cy: -26, r: 14 }, g);
    mk('path', { class: 'drop', d: 'M0 0C-4 -9 -14 -14 -14 -26A14 14 0 1 1 14 -26C14 -14 4 -9 0 0Z' }, body);
    mk('circle', { class: 'plate', cx: 0, cy: -26, r: 9.6 }, body);
    mk('path', { class: 'glyph', d: GLYPH[w.kind] }, body);
    const lab = mk('text', { class: 'pin-label', y: 15 }, g); lab.textContent = w.place.label || w.place.name.split(',')[0];
    if (w.award) { mk('circle', { class: 'award', cx: 11, cy: -38, r: 6.4 }, body); mk('polygon', { class: 'award-star', points: star(11, -38) }, body); }
    g.addEventListener('pointerenter', () => showTip(it, w.title, P.KIND[w.kind] + ' · ' + w.year + ' · ' + w.venue));
    g.addEventListener('pointerleave', hideTip);
    g.addEventListener('focus', () => showTip(it, w.title, P.KIND[w.kind] + ' · ' + w.year));
    g.addEventListener('blur', hideTip);
    const go = () => { if (moved > 5) return; hideTip(); P.cards.open(w.id, { from: 'map' }); };
    g.addEventListener('click', go);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    return g;
  }
  function clusterEl(c) {
    const g = mk('g', { class: 'cluster', tabindex: 0, role: 'button', 'aria-label': c.members.length + ' items near ' + c.members[0].w.place.name + '. Zoom in.' });
    mk('circle', { class: 'c-ring', r: 22 }, g); mk('circle', { class: 'c-bg', r: 17 }, g);
    const t = mk('text', {}, g); t.textContent = c.members.length;
    const names = [...new Set(c.members.map(m => m.w.place.name))];
    g.addEventListener('pointerenter', () => showTip(c, c.members.length + ' items', names.slice(0, 3).join(' · ') + (names.length > 3 ? ' …' : '')));
    g.addEventListener('pointerleave', hideTip);
    const go = () => {
      if (moved > 5) return; hideTip();
      const same = c.members.every(m => Math.abs(m.x - c.members[0].x) < 1e-6 && Math.abs(m.y - c.members[0].y) < 1e-6);
      if (same || k >= kMax() * .95) P.cards.openPlace(c.members.map(m => m.w.id), names.length === 1 ? names[0] : 'Nearby');
      else fitTo(c.members);
    };
    g.addEventListener('click', go);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    return g;
  }

  function computeClusters() {
    const R = 34 / k, out = [];
    items.forEach(it => {
      const c = out.find(o => Math.hypot(o.x - it.x, o.y - it.y) < R);
      if (c) { c.members.push(it); c.x = c.members.reduce((s, m) => s + m.x, 0) / c.members.length; c.y = c.members.reduce((s, m) => s + m.y, 0) / c.members.length; }
      else out.push({ x: it.x, y: it.y, members: [it] });
    });
    return out;
  }

  function render(force) {
    world.setAttribute('transform', 'translate(' + tx + ' ' + ty + ') scale(' + k + ')');
    const next = computeClusters(), s = next.map(c => c.members.map(m => m.w.id).join('+')).sort().join('|') + (sel || '');
    if (force || s !== sig) {
      sig = s; clusters = next; pinLayer.textContent = '';
      clusters.forEach(c => { c.el = c.members.length > 1 ? clusterEl(c) : pinEl(c.members[0]); pinLayer.appendChild(c.el); });
    } else { next.forEach((c, i) => { c.el = clusters[i].el; }); clusters = next; }
    pinLayer.classList.toggle('zoomed', k >= k0 * 3);
    clusters.forEach(c => { if (c.el) c.el.setAttribute('transform', 'translate(' + (c.x * k + tx).toFixed(1) + ' ' + (c.y * k + ty).toFixed(1) + ')'); });
  }

  /* ---------- tooltip ---------- */
  function showTip(c, title, sub) {
    tip.innerHTML = ''; const b = document.createElement('div'); b.textContent = title; const s = document.createElement('small'); s.textContent = sub; tip.append(b, s);
    const x = c.x * k + tx, y = c.y * k + ty - (c.members && c.members.length > 1 ? 30 : 46);
    tip.style.left = Math.min(vw - 130, Math.max(130, x)) + 'px'; tip.style.top = Math.max(60, y) + 'px'; tip.classList.add('show');
  }
  function hideTip() { tip.classList.remove('show'); }

  /* ---------- view control ---------- */
  let anim = 0;
  function tween(nk, ntx, nty, ms) {
    cancelAnimationFrame(anim);
    nk = Math.min(kMax(), Math.max(k0, nk));
    const k1 = k, x1 = tx, y1 = ty, t0 = performance.now();
    // interpolate the world point under the viewport centre so zooming feels smooth
    const step = now => {
      const p = Math.min(1, (now - t0) / ms), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      k = k1 * Math.pow(nk / k1, e); tx = x1 + (ntx - x1) * e; ty = y1 + (nty - y1) * e; clamp(); render();
      if (p < 1) anim = requestAnimationFrame(step);
    };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { k = nk; tx = ntx; ty = nty; clamp(); render(); } else anim = requestAnimationFrame(step);
  }
  function centerOn(x, y, nk, ms) { tween(nk, vw / 2 - x * nk, vh / 2 - y * nk, ms || 650); }
  function zoomAt(px, py, f, ms) {
    const nk = Math.min(kMax(), Math.max(k0, k * f)), r = nk / k;
    const ntx = px - (px - tx) * r, nty = py - (py - ty) * r;
    if (ms) tween(nk, ntx, nty, ms); else { k = nk; tx = ntx; ty = nty; clamp(); render(); }
  }
  function fitTo(members) {
    const xs = members.map(m => m.x), ys = members.map(m => m.y);
    const bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
    let nk = Math.min(vw * .55 / (bw || 1), vh * .55 / (bh || 1));
    nk = Math.min(kMax(), Math.max(nk, k * 1.8));
    centerOn((Math.max(...xs) + Math.min(...xs)) / 2, (Math.max(...ys) + Math.min(...ys)) / 2, nk, 600);
  }
  function reset() { tween(k0, vw / 2 - 416 * k0, -Y_TOP * k0, 600); }

  /* ---------- input ---------- */
  const ptrs = new Map(); let drag = null, pinch = null;
  const local = e => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  svg.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    cancelAnimationFrame(anim);
    ptrs.set(e.pointerId, local(e)); moved = 0;
    if (ptrs.size === 1) { const [x, y] = local(e); drag = { x, y, tx, ty }; }
    else if (ptrs.size === 2) { drag = null; const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), k }; }
    stage.classList.add('grabbing');
  });
  window.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, local(e));
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2;
      zoomAt(cx, cy, Math.min(kMax(), Math.max(k0, pinch.k * d / pinch.d)) / k); moved = 99; hideTip();
    } else if (drag && ptrs.size === 1) {
      const [x, y] = local(e); moved = Math.max(moved, Math.hypot(x - drag.x, y - drag.y));
      if (moved > 5) { tx = drag.tx + x - drag.x; ty = drag.ty + y - drag.y; clamp(); render(); hideTip(); }
    }
  });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) { drag = null; stage.classList.remove('grabbing'); } else if (ptrs.size === 1) { const [x, y] = [...ptrs.values()][0]; drag = { x, y, tx, ty }; } };
  window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);

  let hintT = 0;
  svg.addEventListener('wheel', e => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); const [x, y] = local(e); zoomAt(x, y, Math.exp(-e.deltaY * (e.deltaMode ? .05 : .0025))); }
    else if (hint) { hint.classList.add('show'); clearTimeout(hintT); hintT = setTimeout(() => hint.classList.remove('show'), 1600); }
  }, { passive: false });
  svg.addEventListener('dblclick', e => { if (e.target.closest('.pin, .cluster')) return; const [x, y] = local(e); zoomAt(x, y, 2.2, 350); });
  stage.setAttribute('tabindex', '0');
  stage.addEventListener('keydown', e => {
    if (e.target !== stage) return;
    const step = 60;
    if (e.key === '+' || e.key === '=') zoomAt(vw / 2, vh / 2, 1.5, 250);
    else if (e.key === '-' || e.key === '_') zoomAt(vw / 2, vh / 2, 1 / 1.5, 250);
    else if (e.key === 'ArrowLeft') { tx += step; clamp(); render(); }
    else if (e.key === 'ArrowRight') { tx -= step; clamp(); render(); }
    else if (e.key === 'ArrowUp') { ty += step; clamp(); render(); }
    else if (e.key === 'ArrowDown') { ty -= step; clamp(); render(); }
    else return;
    e.preventDefault();
  });
  const on = (sel, fn) => { const b = stage.querySelector(sel); if (b) b.addEventListener('click', fn); };
  on('[data-z="in"]', () => zoomAt(vw / 2, vh / 2, 1.8, 300));
  on('[data-z="out"]', () => zoomAt(vw / 2, vh / 2, 1 / 1.8, 300));
  on('[data-z="reset"]', reset);

  document.addEventListener('work:open', e => { sel = e.detail; render(true); });
  document.addEventListener('work:close', () => { sel = null; render(true); });

  P.map = {
    flyTo(id) {
      const it = items.find(i => i.w.id === id); if (!it) return;
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sel = id; centerOn(it.x, it.y, k0 * 7, 900); render(true);
    }
  };

  const cnt = document.getElementById('map-count');
  if (cnt) cnt.innerHTML = '<b>' + items.length + '</b>pins · ' + new Set(items.map(i => i.w.place.name)).size + ' places';

  new ResizeObserver(resize).observe(stage);
  resize();
})();
