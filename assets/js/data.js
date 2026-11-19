/* ------------------------------------------------------------------
   Single source of truth for the DJ booth, the map, and the cards.
   Mirrors "Alejandro Medina CV.pdf" (the [C#], [P#], [T#], [PS#] ids).

   kind:   paper | companion | preprint   -> a record AND a dancing cat
           poster | talk                  -> a map pin only
   lead:   1 = I led it, 0 = co-author
   rank:   venue rank 0 (none) .. 4  (C, B, A, A*)
   area:   qd | ml | alg | hum
   place:  { name, lat, lng, label?, virtual? }  (omit for "no pin")

   Add an object here and the page grows: a new publication adds a
   record to the crate and a cat to the dance floor, and any entry with
   a `place` adds a pin to the map.
------------------------------------------------------------------- */
window.WORK = [
  /* ---------- publications and preprints (records + cats) ---------- */
  { id: 'motif', cv: 'C3', short: 'GECCO 2026', title: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites', year: 2026,
    venue: 'Genetic and Evolutionary Computation Conference Companion (GECCO Companion)', kind: 'companion', lead: 1, rank: 3, area: 'qd',
    authors: ['Alejandro Medina', 'Mary Lauren Benton'],
    desc: 'Frames DNA motif discovery as a quality-diversity problem, so one run returns many strong motif hypotheses. A MAP-Elites pipeline validated against HOCOMOCO on five human liver ChIP-seq datasets (30 seeds, three descriptor pairings), competitive with MEME.',
    tags: ['Quality-diversity', 'Genomics'],
    links: [{ label: 'Read the paper', href: 'https://dl.acm.org/doi/10.1145/3795101.3805456' }],
    place: { name: 'San José, Costa Rica', lat: 9.93, lng: -84.08 } },

  { id: 'fly', cv: 'C2', short: 'GECCO 2023', title: 'Evolving Flying Machines in Minecraft Using Quality Diversity', year: 2023,
    venue: 'Genetic and Evolutionary Computation Conference (GECCO)', kind: 'paper', lead: 1, rank: 3, area: 'qd',
    authors: ['Alejandro Medina', 'Melanie Richey', 'Mark Mueller', 'Jacob Schrum'],
    desc: 'MAP-Elites with a piston-orientation behavior characterization evolved working flying machines in Minecraft in 93% of runs (28 of 30), against 47% for fitness-only search (p < 0.001).',
    tags: ['Quality-diversity', 'Creative AI'],
    links: [{ label: 'Read the paper', href: 'https://dl.acm.org/doi/10.1145/3583131.3590352' }],
    place: { name: 'Lisbon, Portugal', lat: 38.72, lng: -9.14 } },

  { id: 'polls', cv: 'C1', short: 'CDVE 2022', title: 'Prioritizing Self, Team, or Job: Trends in Sincerity in Cooperative Polls', year: 2022,
    venue: 'International Conference on Cooperative Design, Visualization, and Engineering (CDVE)', kind: 'paper', lead: 0, rank: 1, area: 'hum',
    authors: ['Barbara Anthony', 'Alejandro Medina', 'Mark Mueller'],
    desc: 'A study of 200+ students at 40+ US colleges on whether people vote sincerely in cooperative scheduling polls. Fewer than 3% were fully sincere across all scenarios, and sincerity varied with meeting type, region, and institutional Pell Grant eligibility. Presented at the 19th CDVE as a paper presentation [T1].',
    tags: ['Voting theory', 'Analysis'],
    links: [{ label: 'Read the paper', href: 'https://link.springer.com/chapter/10.1007/978-3-031-16538-2_4' }],
    place: { name: 'Kraków, Poland (held virtually because of political tensions in the region)', label: 'Kraków (virtual)', lat: 50.06, lng: 19.94, virtual: true } },

  { id: 'prepr', cv: 'P1', short: 'arXiv 2026', title: 'Diversity Preservation Recovers Transcription Factor Motifs Across Challenging Confounder Landscapes', year: 2026,
    venue: 'Preprint on arXiv, under review at EvoApplications 2027', kind: 'preprint', lead: 1, rank: 0, area: 'qd',
    authors: ['Alejandro Medina', 'Mary Lauren Benton'],
    desc: 'Tests whether quality-diversity search keeps recovering target transcription factors through GC-box and zinc-finger confounders, and independently rediscovers the DR1 half-site architecture in HNF4A and RXRA. Under review at EvoApplications 2027.',
    tags: ['Preprint', 'Under review', 'Quality-diversity', 'Motif discovery'],
    links: [{ label: 'Read on arXiv', href: 'http://arxiv.org/abs/2611.21859' }],
    place: { name: 'Mainz, Germany (EvoApplications 2027, if accepted)', label: 'Mainz', lat: 49.99, lng: 8.27 } },

  /* ---------- posters and talks (map pins) ---------- */
  { id: 'tapia', cv: 'PS7', short: 'Tapia 2026', title: 'Using Quality Diversity for Motif Discovery', year: 2026,
    venue: 'CMD-IT/ACM Richard Tapia Conference 2026', kind: 'poster', lead: 1, rank: 1, area: 'qd', award: '3rd place',
    desc: 'Poster for the ACM Graduate Poster Competition at the 2026 Tapia Conference. It won 3rd place.',
    tags: ['Poster competition'],
    place: { name: 'Atlanta, GA, USA', lat: 33.75, lng: -84.39 } },

  { id: 'psgecco', cv: 'PS6', short: 'GECCO 2026', title: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites', year: 2026,
    venue: 'Genetic and Evolutionary Computation Conference 2026', kind: 'poster', lead: 1, rank: 3, area: 'qd',
    desc: 'Poster presenting the GECCO companion paper [C3].',
    tags: ['Poster', 'Genomics'],
    place: { name: 'San José, Costa Rica', lat: 9.93, lng: -84.08 } },

  { id: 'cra', cv: 'T3', short: 'CRA-WP 2026', title: 'Exploring CTCF Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites', year: 2026,
    venue: 'CRA-WP Graduate Cohort Workshop', kind: 'talk', lead: 1, rank: 0, area: 'qd',
    desc: 'Lightning talk at the CRA-WP Graduate Cohort Workshop.',
    tags: ['Lightning talk'],
    place: { name: 'Seattle, WA, USA', lat: 47.61, lng: -122.33 } },

  { id: 'etoh', cv: 'PS5', short: 'AI4BM 2025', title: 'Revisiting Predictive Models of Alcohol Consumption in Nonhuman Primates', year: 2025,
    venue: 'AI for Biology & Medicine Symposium', kind: 'poster', lead: 1, rank: 0, area: 'ml',
    desc: 'Tested whether published stable drinking categories generalize, on 90 rhesus macaques (48 added beyond the original cohorts). Composite accuracy fell from about 72% to about 60%, and ordinal regression ranked well in-sample (rho = 0.98) but not out-of-sample (rho = 0.08), suggesting drinking severity is better modeled as a continuum.',
    tags: ['Machine learning', 'Bioinformatics'],
    place: { name: 'Denton, TX, USA', lat: 33.21, lng: -97.13 } },

  { id: 'snitch', cv: 'PS4', short: 'CCSC 2024', title: "SNITCH: Southwestern's Newest Innovation to Cultivate Honor", year: 2024,
    venue: 'South Central CCSC Regional Meeting', kind: 'poster', lead: 1, rank: 0, area: 'hum', award: '3rd place',
    desc: 'An anonymous, AI-assisted honor code reporting system built to raise reporting rates while keeping students psychologically safe.',
    tags: ['Systems', 'HCI'],
    place: { name: 'Nacogdoches, TX, USA', lat: 31.6, lng: -94.65 } },

  { id: 'edf', cv: 'PS3', short: 'Tapia 2023', title: 'Evaluating an Earliest Deadline First Algorithm for a Dial-a-Ride Problem', year: 2023,
    venue: 'CMD-IT/ACM Richard Tapia Conference 2023', kind: 'poster', lead: 1, rank: 1, area: 'alg',
    desc: 'An Earliest Deadline First algorithm and a brute-force optimal solver, implemented in Python to empirically validate a 2-approximation bound for a deadline-constrained, uniform-metric Dial-a-Ride variant.',
    tags: ['Algorithms', 'Scheduling'],
    links: [{ label: 'View the code', href: 'https://github.com/alejmedinajr/ImplementingEDF' }],
    place: { name: 'Dallas, TX, USA', lat: 32.78, lng: -96.8 } },

  { id: 'flyp', cv: 'PS2', short: 'CCSC 2023', title: 'Using Quality Diversity to Evolve Flying Machines in Minecraft', year: 2023,
    venue: 'South Central CCSC Regional Meeting', kind: 'poster', lead: 1, rank: 0, area: 'qd', award: '3rd place',
    desc: 'Poster version of the flying machines work [C2].',
    tags: ['Quality-diversity', 'Creative AI'],
    place: { name: 'Nacogdoches, TX, USA', lat: 31.6, lng: -94.65 } },

  { id: 'shapes', cv: 'PS1', short: 'CCSC 2023', title: 'Interactive Evolution of Novel Shapes in Minecraft', year: 2023,
    venue: 'South Central CCSC Regional Meeting', kind: 'poster', lead: 1, rank: 0, area: 'qd', award: 'Honorable mention',
    desc: 'Users guide the evolution of new voxel shapes in Minecraft with their own aesthetic taste.',
    tags: ['Interactive evolution', 'Creative AI'],
    place: { name: 'Nacogdoches, TX, USA', lat: 31.6, lng: -94.65 } },

  { id: 'honor', cv: 'T2', short: 'SU Convocation', title: 'Honor Code and Integrity Speech', year: 2023,
    venue: "Southwestern University's Matriculation Convocation (designated speaker)", kind: 'talk', lead: 1, rank: 0, area: 'hum',
    desc: 'Designated speaker on the honor code and academic integrity at Southwestern University.',
    tags: ['Speech'],
    place: { name: 'Georgetown, TX, USA', lat: 30.63, lng: -97.68 } }
];

/* helpers shared by the scene, map and cards */
window.IS_PUB = w => w.kind === 'paper' || w.kind === 'companion' || w.kind === 'preprint';

/* Publications list (conference papers, then preprints), from the CV */
window.PUBS = [
  { group: 'Conference, workshop and demo papers' },
  { cv: 'C3', year: 2026, authors: ['Alejandro Medina', ' and Mary Lauren Benton'], title: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites',
    venue: "Proceedings of the Genetic and Evolutionary Computation Conference Companion (GECCO '26 Companion)", rest: 'Association for Computing Machinery, New York, NY, USA, 637–640.',
    href: 'https://dl.acm.org/doi/10.1145/3795101.3805456', doi: 'https://doi.org/10.1145/3795101.3805456', work: 'motif' },
  { cv: 'C2', year: 2023, authors: ['Alejandro Medina', ', Melanie Richey, Mark Mueller, and Jacob Schrum'], title: 'Evolving Flying Machines in Minecraft Using Quality Diversity',
    venue: "Proceedings of the Genetic and Evolutionary Computation Conference (GECCO '23)", rest: 'Association for Computing Machinery, New York, NY, USA, 1418–1426.',
    href: 'https://dl.acm.org/doi/10.1145/3583131.3590352', doi: 'https://doi.org/10.1145/3583131.3590352', work: 'fly' },
  { cv: 'C1', year: 2022, authors: ['Barbara Anthony, ', 'Alejandro Medina', ', and Mark Mueller'], title: 'Prioritizing Self, Team, or Job: Trends in Sincerity in Cooperative Polls',
    venue: 'Cooperative Design, Visualization, and Engineering (CDVE 2022), Yuhua Luo (Ed.). Lecture Notes in Computer Science, Vol. 13492', rest: 'Springer, Cham, 33–44.',
    href: 'https://link.springer.com/chapter/10.1007/978-3-031-16538-2_4', doi: 'https://doi.org/10.1007/978-3-031-16538-2_4', work: 'polls' },
  { group: 'Preprints and under review' },
  { cv: 'P1', year: 2026, authors: ['Alejandro Medina', ' and Mary Lauren Benton'], title: 'Diversity Preservation Recovers Transcription Factor Motifs Across Challenging Confounder Landscapes',
    venue: 'Preprint available on arXiv (under review at EvoApplications 2027)', rest: '',
    href: 'http://arxiv.org/abs/2611.21859', doi: '', work: 'prepr' }
];

/* Presentations and posters, from the CV */
window.TALKS = [
  { head: 'Talks', items: [
    { cv: 'T3', year: 2026, text: 'Exploring CTCF Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites. CRA-WP Graduate Cohort Workshop (lightning talk)', work: 'cra' },
    { cv: 'T2', year: 2023, text: "Honor Code and Integrity Speech. Southwestern University's Matriculation Convocation (designated speaker)", work: 'honor' },
    { cv: 'T1', year: 2022, text: 'Prioritizing Self, Team, or Job: Trends in Sincerity in Cooperative Polls. 19th International Conference on Cooperative Design, Visualization, and Engineering (paper presentation)', work: 'polls' } ] },
  { head: 'Posters', items: [
    { cv: 'PS7', year: 2026, text: 'Using Quality Diversity for Motif Discovery. CMD-IT/ACM Richard Tapia Conference', award: '3rd Place', work: 'tapia' },
    { cv: 'PS6', year: 2026, text: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites. Genetic and Evolutionary Computation Conference', work: 'psgecco' },
    { cv: 'PS5', year: 2025, text: 'Revisiting Predictive Models of Alcohol Consumption in Nonhuman Primates. AI for Biology & Medicine Symposium', work: 'etoh' },
    { cv: 'PS4', year: 2024, text: "SNITCH: Southwestern's Newest Innovation to Cultivate Honor. South Central CCSC Regional Meeting", award: '3rd Place', work: 'snitch' },
    { cv: 'PS3', year: 2023, text: 'Evaluating an Earliest Deadline First Algorithm for a Dial-a-Ride Problem. CMD-IT/ACM Richard Tapia Conference', work: 'edf' },
    { cv: 'PS2', year: 2023, text: 'Using Quality Diversity to Evolve Flying Machines in Minecraft. South Central CCSC Regional Meeting', award: '3rd Place', work: 'flyp' },
    { cv: 'PS1', year: 2023, text: 'Interactive Evolution of Novel Shapes in Minecraft. South Central CCSC Regional Meeting', award: 'Honorable Mention', work: 'shapes' } ] }
];

window.NEWS = [
  { k: 'arXiv', t: 'My preprint on diversity preservation for transcription factor motifs is on arXiv and under review at EvoApplications 2027.' },
  { k: 'GECCO', t: 'My companion paper was presented at GECCO 2026.' },
  { k: 'Tapia', t: 'I won 3rd place in the ACM Graduate Poster Competition at the 2026 Tapia Conference.' }
];

window.SCHOLAR_FALLBACK = { updated: '2026-10-09', publications: 3, citations: 11, h_index: 1 };
