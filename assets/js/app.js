/* Page glue: stats, news, publications, presentations, nav highlight. */
(function () {
  const P = window.Portfolio;
  const $ = (s, r) => (r || document).querySelector(s);
  const h = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /* news */
  const news = $('#news');
  if (news) window.NEWS.forEach(n => { const r = h('div', 'news-row'); r.append(h('b', '', n.k), h('span', '', n.t)); news.append(r); });

  /* scholar stats (refreshed weekly by the GitHub Action) */
  function stats(s) {
    const box = $('#stats'); if (!box) return;
    box.innerHTML = '';
    [[s.publications, 'Publications'], [s.citations, 'Citations'], [s.h_index, 'h-index']].forEach(([n, l]) => {
      const d = h('div', 'stat glass'); d.append(h('b', '', String(n)), h('span', '', l)); box.append(d);
    });
    const a = h('a', 'stat-link', 'Google Scholar, ' + s.updated + ' →');
    a.href = 'https://scholar.google.com/citations?user=nSbbG7gAAAAJ'; a.target = '_blank'; a.rel = 'noreferrer'; box.append(a);
  }
  stats(window.SCHOLAR_FALLBACK);
  fetch('assets/data/scholar.json?v=' + Date.now()).then(r => r.ok ? r.json() : null).then(j => { if (j) stats(j); }).catch(() => {});

  /* publications */
  const pubs = $('#pubs');
  if (pubs) window.PUBS.forEach(p => {
    if (p.group) { const gh = h('div', 'sub-h'); gh.append(h('h3', '', p.group)); pubs.append(gh); return; }
    const row = h('article', 'pub glass');
    row.append(h('div', 'yr', String(p.year)));
    const ref = h('div', 'ref');
    p.authors.forEach(t => ref.append(h('span', t === 'Alejandro Medina' ? 'me' : '', t)));
    ref.append(document.createTextNode('. ' + p.year + '. '));
    const a = h('a', 't', p.title); a.href = p.href; a.target = '_blank'; a.rel = 'noreferrer'; ref.append(a);
    ref.append(document.createTextNode('. ' + (p.rest ? 'In ' : '')), h('em', '', p.venue), document.createTextNode('. ' + p.rest + ' '));
    if (p.doi) { const d = h('a', 'doi', p.doi); d.href = p.doi; d.target = '_blank'; d.rel = 'noreferrer'; ref.append(d); }
    row.append(ref);
    const b = h('button', 'link-btn', 'Details'); b.type = 'button'; b.addEventListener('click', () => P.cards.open(p.work)); row.append(b);
    pubs.append(row);
  });

  /* presentations */
  const talks = $('#talks');
  if (talks) window.TALKS.forEach(g => {
    const box = h('div', 'talk-group glass'); box.append(h('div', 'yr', g.head));
    const ul = h('ul');
    g.items.forEach(i => {
      const li = h('li'); li.append(h('span', 'cvid', i.cv + ' · ' + i.year + '  '), document.createTextNode(i.text + ' '));
      if (i.award) li.append(h('span', 'award-tag', i.award));
      if (i.work) { const b = h('button', 'link-btn', 'Details'); b.type = 'button'; b.style.marginLeft = '8px'; b.addEventListener('click', () => P.cards.open(i.work)); li.append(b); }
      ul.append(li);
    });
    box.append(ul); talks.append(box);
  });

  /* footer year */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* nav highlight */
  const links = [...document.querySelectorAll('.nav a')];
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  }
})();
