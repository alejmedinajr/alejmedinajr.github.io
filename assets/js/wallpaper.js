/* The CDVE 2022 pixel disco, reused as a faint wallpaper behind the navbar,
   the map's water and the contact card. One shared animation loop. */
(function () {
  const P = window.Portfolio, list = [];
  const th = P.Pixels.theme('polls', 0);
  P.wall = function (el, o) {
    if (!el) return;
    o = o || {};
    const cv = document.createElement('canvas'); cv.className = 'wall-bg'; cv.setAttribute('aria-hidden', 'true'); cv.style.opacity = o.opacity == null ? .3 : o.opacity;
    el.insertBefore(cv, el.firstChild);
    const bg = new P.Pixels.Bg(cv); bg.fixedCs = o.cs || 18; bg.set(th, true);
    const e = { bg, vis: true }; list.push(e);
    new ResizeObserver(() => { bg.resize(); if (P.reduced) bg.draw(0); }).observe(cv);
    new IntersectionObserver(es => { e.vis = es[0].isIntersecting; }).observe(el);
    bg.resize();
  };
  let last = 0;
  (function loop(now) {
    if (!P.reduced && !document.hidden && now - last > 60) { last = now; list.forEach(e => { if (e.vis) e.bg.draw(now); }); }
    requestAnimationFrame(loop);
  })(0);
  P.wall(document.querySelector('.site-header .bar'), { opacity: .26, cs: 16 });
  P.wall(document.getElementById('map-stage'), { opacity: .42, cs: 20 });
  P.wall(document.querySelector('.contact-card'), { opacity: .3, cs: 22 });
})();
