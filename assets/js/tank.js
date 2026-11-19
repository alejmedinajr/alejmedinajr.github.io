/* ------------------------------------------------------------------
   The habitat: one creature per piece of work, generated from WORK.
     full paper      -> whale
     companion paper -> fish
     poster          -> sea turtle
     talk            -> jellyfish
     in progress     -> glowing egg
   Colour: cyan = quality-diversity, lavender = everything else,
           yellow = in progress. Hollow body = co-authored.
   Red rosette = prize or award.
------------------------------------------------------------------- */
(function () {
  const P = (window.Portfolio = window.Portfolio || {});
  const SPRITES = {
    whale: { w: 140, ratio: 70 / 120, speed: [9, 16], svg:
      '<svg viewBox="0 0 120 70"><path class="body tail-w" d="M96 42C104 36 112 30 118 20C119 31 117 41 112 47C116 52 118 58 120 64C110 62 102 56 96 50Z"/>' +
      '<path class="body" d="M6 42C6 22 34 10 62 14C84 17 98 30 100 44C100 54 86 60 64 60C36 60 6 58 6 42Z"/>' +
      '<path class="shade" d="M10 46C30 56 70 58 98 48C96 56 84 60 64 60C36 60 12 58 10 46Z"/>' +
      '<path class="body" d="M48 54C52 66 62 68 72 66C66 62 64 58 64 55Z"/>' +
      '<ellipse class="sheen" cx="52" cy="22" rx="22" ry="4.5" transform="rotate(-8 52 22)"/>' +
      '<circle class="eye" cx="24" cy="38" r="3"/><path class="line" d="M13 46C20 51 28 51 33 47"/></svg>' },
    fish: { w: 92, ratio: 50 / 90, speed: [20, 34], svg:
      '<svg viewBox="0 0 90 50"><path class="body tail-w" d="M60 26L86 8C84 18 84 34 86 44Z"/>' +
      '<path class="body" d="M30 12C34 1 46 1 50 12Z"/>' +
      '<path class="body" d="M6 26C14 8 44 4 62 16C70 21 72 31 62 36C44 48 14 44 6 26Z"/>' +
      '<path class="shade" d="M10 32C24 42 48 44 62 36C56 46 20 48 10 32Z"/>' +
      '<path class="line" d="M42 14C46 22 46 30 42 38"/>' +
      '<ellipse class="sheen" cx="30" cy="16" rx="12" ry="3" transform="rotate(-10 30 16)"/>' +
      '<circle class="eye" cx="20" cy="22" r="2.8"/></svg>' },
    turtle: { w: 104, ratio: 0.62, speed: [12, 20], svg:
      '<svg viewBox="0 0 100 62"><path class="body" d="M66 38C70 54 84 54 82 46Z"/><path class="body" d="M80 35L94 38L80 41Z"/>' +
      '<path class="body" d="M36 38C28 54 42 56 52 46Z"/><ellipse class="body" cx="14" cy="35" rx="10" ry="7.5"/>' +
      '<path class="body" d="M22 38C22 12 80 12 82 38Z"/><path class="shade" d="M22 38H82C76 45 28 45 22 38Z"/>' +
      '<path class="line" d="M52 18V38M36 38C36 28 40 22 52 20M68 38C68 28 64 22 52 20"/>' +
      '<ellipse class="sheen" cx="42" cy="24" rx="9" ry="3" transform="rotate(-18 42 24)"/>' +
      '<circle class="eye" cx="11" cy="33" r="2.4"/></svg>' },
    jelly: { w: 60, ratio: 84 / 60, speed: [8, 15], svg:
      '<svg viewBox="0 0 60 84"><g class="jelly-t"><path class="line" d="M16 40C11 52 21 58 16 74"/><path class="line" d="M30 40C35 52 25 63 30 80"/><path class="line" d="M44 40C49 52 39 58 44 72"/></g>' +
      '<path class="body" d="M6 34C6 6 54 6 54 34C54 39 48 41 44 38C40 41 34 42 30 38C26 42 20 41 16 38C12 41 6 39 6 34Z"/>' +
      '<ellipse class="sheen" cx="22" cy="16" rx="9" ry="3.4" transform="rotate(-24 22 16)"/>' +
      '<circle class="eye" cx="23" cy="27" r="2.3"/><circle class="eye" cx="37" cy="27" r="2.3"/><path class="line" d="M26 32C28 34 32 34 34 32"/></svg>' },
    egg: { w: 40, ratio: 52 / 40, speed: [0, 0], fixed: true, svg:
      '<svg viewBox="0 0 40 52" class="egg-glow"><ellipse class="body" cx="20" cy="28" rx="15" ry="20"/>' +
      '<circle class="shade" cx="14" cy="23" r="3.2"/><circle class="shade" cx="26" cy="33" r="3.6"/><circle class="shade" cx="17" cy="40" r="2.2"/>' +
      '<ellipse class="sheen" cx="13" cy="15" rx="3.6" ry="7" transform="rotate(18 13 15)"/></svg>' }
  };
  const speciesOf = w => w.status === 'wip' ? 'egg' : w.kind === 'paper' ? 'whale' : w.kind === 'companion' ? 'fish' : w.kind === 'poster' ? 'turtle' : 'jelly';
  const colorOf = w => w.status === 'wip' ? 'yel' : w.area === 'qd' ? 'cyan' : 'lav';
  P.sprite = n => SPRITES[n].svg;
  P.speciesOf = speciesOf; P.colorOf = colorOf;
  P.KIND = { paper: 'Full paper', companion: 'Companion paper', poster: 'Poster', talk: 'Lightning talk' };

  const root = document.getElementById('tank');
  if (!root) return;
  const stage = root.querySelector('.tank-stage');
  const layer = root.querySelector('.critters');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  let W = 600, H = 460, S = 1, floorY = 0;
  const crit = [];

  function build() {
    layer.innerHTML = '';
    crit.length = 0;
    window.WORK.forEach(w => {
      const sp = speciesOf(w), spec = SPRITES[sp], r = rng(hash(w.id));
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'critter ' + colorOf(w) + (w.lead ? '' : ' co');
      b.dataset.id = w.id;
      b.setAttribute('aria-label', w.title + ', ' + w.venue + '. Open details.');
      b.innerHTML = '<span class="sprite">' + spec.svg + '</span>' +
        (w.award ? '<span class="rosette" title="' + w.award + '" aria-hidden="true">★</span>' : '') +
        '<span class="tag"></span><span class="tip"><span class="tt"></span><small></small></span>';
      b.querySelector('.tag').textContent = w.short;
      b.querySelector('.tt').textContent = w.title;
      b.querySelector('small').textContent = P.KIND[w.kind] + ' · ' + w.year + (w.award ? ' · ' + w.award : '');
      b.addEventListener('click', () => P.cards.open(w.id));
      b.addEventListener('pointerenter', () => { c.hover = true; });
      b.addEventListener('pointerleave', () => { c.hover = false; });
      b.addEventListener('focus', () => { c.hover = true; });
      b.addEventListener('blur', () => { c.hover = false; });
      layer.appendChild(b);
      const c = { w, sp, spec, el: b, sprite: b.querySelector('.sprite'), r, x: 0, y: 0, tx: 0, ty: 0, face: -1, faceNow: -1,
        speed: spec.speed[0] + r() * (spec.speed[1] - spec.speed[0]), phase: r() * 6.28, hover: false, wait: 0, fixed: !!spec.fixed };
      crit.push(c);
    });
    root.classList.toggle('many', crit.length > 26);
    layout(true);
  }

  function size(c) { const w = c.spec.w * S; return [w, w * c.spec.ratio]; }

  function pickTarget(c) {
    const [cw, ch] = size(c);
    const mx = cw / 2 + 12, top = ch / 2 + 22, bot = floorY - ch / 2 - 10;
    c.tx = mx + c.r() * Math.max(1, W - 2 * mx);
    c.ty = top + c.r() * Math.max(1, bot - top);
    if (c.sp === 'jelly') c.ty = top + c.r() * Math.max(1, (bot - top) * .8);
  }

  function layout(initial) {
    W = stage.clientWidth || 600; H = stage.clientHeight || 460;
    S = Math.max(.6, Math.min(1.2, W / 600));
    floorY = H * .86;
    const eggs = crit.filter(c => c.fixed);
    crit.forEach(c => {
      const [cw, ch] = size(c);
      c.el.style.width = cw + 'px'; c.el.style.height = ch + 'px';
      if (c.fixed) return;
      if (initial || c.x === 0) {
        c.x = cw / 2 + 12 + c.r() * Math.max(1, W - cw - 24);
        c.y = ch / 2 + 22 + c.r() * Math.max(1, floorY - ch - 40);
        pickTarget(c);
      } else {
        c.x = Math.min(Math.max(c.x, cw / 2 + 8), W - cw / 2 - 8);
        c.y = Math.min(Math.max(c.y, ch / 2 + 8), floorY - ch / 2);
        pickTarget(c);
      }
    });
    eggs.forEach((c, i) => {
      const [cw, ch] = size(c);
      const slot = (i + .5) / eggs.length;
      c.x = Math.max(cw, Math.min(W - cw, W * (.12 + slot * .76) + (c.r() - .5) * 26));
      c.y = H - ch / 2 - H * .045 - c.r() * 14;
      c.baseY = c.y;
    });
    render(0);
  }

  function render(t) {
    crit.forEach(c => {
      const [cw, ch] = size(c);
      const bob = c.fixed ? Math.sin(t / 700 + c.phase) * 3 : Math.sin(t / 900 + c.phase) * 4;
      c.el.style.transform = 'translate3d(' + (c.x - cw / 2).toFixed(1) + 'px,' + (c.y - ch / 2 + bob).toFixed(1) + 'px,0)';
      c.sprite.style.transform = 'scaleX(' + c.faceNow.toFixed(2) + ')';
    });
  }

  let last = 0, raf = 0;
  function tick(t) {
    const dt = Math.min(.05, (t - last) / 1000 || .016); last = t;
    for (const c of crit) {
      if (c.fixed) continue;
      if (!c.hover && !document.hidden) {
        if (c.wait > 0) c.wait -= dt;
        else {
          const dx = c.tx - c.x, dy = c.ty - c.y, d = Math.hypot(dx, dy);
          if (d < 6) { pickTarget(c); c.wait = c.r() * 2.2; }
          else {
            const sp = c.speed * S * Math.min(1, d / 50 + .35);
            c.x += dx / d * sp * dt; c.y += dy / d * sp * dt;
            if (Math.abs(dx) > 4) c.face = dx > 0 ? 1 : -1;
          }
        }
      }
      c.faceNow += (c.face - c.faceNow) * Math.min(1, dt * 6);
    }
    // gentle separation so creatures do not stack
    for (let i = 0; i < crit.length; i++) for (let j = i + 1; j < crit.length; j++) {
      const a = crit[i], b = crit[j]; if (a.fixed || b.fixed) continue;
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, m = (size(a)[0] + size(b)[0]) * .32;
      if (d < m) { const push = (m - d) * .5 * dt * 4; a.x -= dx / d * push; a.y -= dy / d * push; b.x += dx / d * push; b.y += dy / d * push; }
    }
    render(t);
    raf = requestAnimationFrame(tick);
  }

  function bubbles() {
    const host = root.querySelector('.bubbles'); if (!host || RM) return;
    for (let i = 0; i < 14; i++) {
      const b = document.createElement('i'); b.className = 'bubble';
      const s = 5 + Math.random() * 13;
      b.style.cssText = 'left:' + (Math.random() * 100) + '%;width:' + s + 'px;height:' + s + 'px;animation-duration:' + (9 + Math.random() * 12) + 's;animation-delay:-' + (Math.random() * 18) + 's';
      host.appendChild(b);
    }
  }
  function plants() {
    const host = root.querySelector('.plants'); if (!host) return;
    const cols = ['#7fe3d3', '#b9a6ff', '#ff9aa6', '#ffe27a'];
    let h = '';
    for (let i = 0; i < 9; i++) {
      const left = 3 + i * 11 + (i % 2) * 2, ht = 52 + (i * 37) % 44, c = cols[i % 4];
      h += '<svg class="plant" style="left:' + left + '%;animation-delay:-' + (i * .7) + 's" width="34" height="' + ht + '" viewBox="0 0 34 ' + ht + '">' +
        '<path d="M17 ' + ht + 'C6 ' + (ht * .6) + ' 22 ' + (ht * .45) + ' 12 ' + (ht * .12) + 'C20 ' + (ht * .4) + ' 30 ' + (ht * .55) + ' 17 ' + ht + 'Z" fill="' + c + '" fill-opacity=".55" stroke="#fff" stroke-opacity=".8" stroke-width="1.5"/></svg>';
    }
    host.innerHTML = h;
  }
  function legend() {
    const host = root.querySelector('.tank-foot'); if (!host) return;
    const items = [['whale', 'Full paper', ''], ['fish', 'Companion paper', ''], ['turtle', 'Poster', ''], ['jelly', 'Talk', ''], ['egg', 'In progress', 'yel']];
    host.innerHTML = items.map(i => '<span class="k ' + i[2] + '">' + SPRITES[i[0]].svg.replace('<svg', '<svg aria-hidden="true"') + i[1] + '</span>').join('') +
      '<span class="k"><span class="sw cyan"></span>Quality-diversity</span><span class="k"><span class="sw lav"></span>Other</span><span class="k"><span class="sw red"></span>Prize</span>' +
      '<span class="grow"><span id="tank-count">' + window.WORK.length + '</span> creatures. Hollow means co-authored.</span>';
  }

  P.tank = {
    focus(id) {
      const c = crit.find(x => x.w.id === id); if (!c) return;
      root.scrollIntoView({ behavior: 'smooth', block: 'center' });
      c.el.classList.add('ping'); setTimeout(() => c.el.classList.remove('ping'), 2000);
      c.el.focus({ preventScroll: true });
    }
  };

  build(); bubbles(); plants(); legend();
  new ResizeObserver(() => layout(false)).observe(stage);
  if (!RM) raf = requestAnimationFrame(tick);
})();
