/* ------------------------------------------------------------------
   Single source of truth for the habitat, the map, and the cards.
   Add an object to WORK and a new creature appears in the habitat,
   and (if it has a `place`) a new pin appears on the map.

   kind:   paper | companion | poster | talk
   status: done | wip
   area:   qd | ml | alg | hum
   lead:   1 = I led it, 0 = co-author
   rank:   venue rank 0 (none) .. 4  (C, B, A, A*)
   place:  { name, lat, lng, virtual? }  (omit for "no pin")
------------------------------------------------------------------- */
window.WORK = [
  { id: 'motif', short: 'GECCO 2026', title: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites', year: 2026,
    venue: 'GECCO 2026 Companion (also presented as a poster)', kind: 'companion', status: 'done', lead: 1, rank: 3, area: 'qd',
    desc: 'Frames DNA motif discovery as a quality-diversity problem, so one run returns many strong motif hypotheses. Compared against standard tools under matched criteria.',
    tags: ['Quality-diversity', 'Genomics'], href: 'https://dl.acm.org/doi/10.1145/3795101.3805456', linkLabel: 'Read the paper',
    place: { name: 'San José, Costa Rica', lat: 9.93, lng: -84.08 } },

  { id: 'fly', short: 'GECCO 2023', title: 'Evolving Flying Machines in Minecraft Using Quality Diversity', year: 2023,
    venue: 'GECCO 2023', kind: 'paper', status: 'done', lead: 1, rank: 3, area: 'qd',
    desc: 'MAP-Elites algorithms that evolve flying machines in Minecraft, guided by custom behavioral descriptors.',
    tags: ['Quality-diversity', 'Creative AI'], href: 'https://dl.acm.org/doi/10.1145/3583131.3590352', linkLabel: 'Read the paper',
    place: { name: 'Lisbon, Portugal', lat: 38.72, lng: -9.14 } },

  { id: 'flyp', short: 'CCSC 2023', title: 'Using Quality Diversity to Evolve Flying Machines in Minecraft', year: 2023,
    venue: 'CCSC South Central 2023', kind: 'poster', status: 'done', lead: 1, rank: 0, area: 'qd', award: '3rd place',
    desc: 'Poster version of the flying machines work, presented at the CCSC undergraduate poster competition.',
    tags: ['Quality-diversity', 'Creative AI'],
    place: { name: 'Nacogdoches, TX, USA', lat: 31.6, lng: -94.65 } },

  { id: 'shapes', short: 'CCSC 2023', title: 'Interactive Evolution of Novel Shapes in Minecraft', year: 2023,
    venue: 'CCSC South Central 2023', kind: 'poster', status: 'done', lead: 1, rank: 0, area: 'qd', award: 'Honorable mention',
    desc: 'Users guide the evolution of new voxel shapes in Minecraft with their own aesthetic taste.',
    tags: ['Interactive evolution', 'Creative AI'],
    place: { name: 'Nacogdoches, TX, USA', lat: 31.6, lng: -94.65 } },

  { id: 'cra', short: 'CRA-WP 2026', title: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites', year: 2026,
    venue: 'CRA Grad Cohort Workshop 2026', kind: 'talk', status: 'done', lead: 1, rank: 0, area: 'qd',
    desc: 'A lightning talk on this work, accepted at the 2026 CRA Grad Cohort Workshop.',
    tags: ['Talk'],
    place: { name: 'Seattle, WA, USA', lat: 47.61, lng: -122.33 } },

  { id: 'tapia', short: 'Tapia 2026', title: 'Using Quality Diversity for Motif Discovery', year: 2026,
    venue: 'Tapia Conference 2026', kind: 'poster', status: 'done', lead: 1, rank: 1, area: 'qd', award: '3rd place',
    desc: 'Poster for the ACM Graduate Poster Competition at the 2026 Tapia Conference. It won 3rd place and came with a full conference scholarship.',
    tags: ['Poster competition'],
    place: { name: 'Atlanta, GA, USA', lat: 33.75, lng: -84.39 } },

  { id: 'etoh', short: 'AI4BM 2025', title: 'Revisiting Predictive Models of Alcohol Consumption in Nonhuman Primates', year: 2025,
    venue: 'AI for Biology and Medicine Symposium 2025', kind: 'poster', status: 'done', lead: 1, rank: 0, area: 'ml',
    desc: 'Machine learning on behavioral and phenotypic data to classify future drinking severity, checking how stable the predictions are.',
    tags: ['Machine learning', 'Bioinformatics'],
    place: { name: 'Denton, TX, USA', lat: 33.21, lng: -97.13 } },

  { id: 'edf', short: 'Tapia 2023', title: 'Evaluating an Earliest Deadline First Algorithm for a Dial-a-Ride Problem', year: 2023,
    venue: 'Tapia 2023', kind: 'poster', status: 'done', lead: 1, rank: 1, area: 'alg',
    desc: 'Benchmarks existing scheduling algorithms against an earliest-deadline-first approach for time-windowed routing.',
    tags: ['Algorithms', 'Scheduling'], href: 'https://github.com/alejmedinajr/ImplementingEDF', linkLabel: 'View the code',
    place: { name: 'Dallas, TX, USA', lat: 32.78, lng: -96.8 } },

  { id: 'polls', short: 'CDVE 2022', title: 'Prioritizing Self, Team, or Job: Trends in Sincerity in Cooperative Polls', year: 2022,
    venue: 'CDVE 2022', kind: 'paper', status: 'done', lead: 0, rank: 1, area: 'hum',
    desc: 'Studies how US respondents weigh themselves, their team, and the job when answering cooperative scheduling polls.',
    tags: ['Voting theory', 'Analysis'], href: 'https://link.springer.com/chapter/10.1007/978-3-031-16538-2_4', linkLabel: 'Read the paper',
    place: { name: 'Presented virtually (work done in Georgetown, TX, USA)', label: 'Georgetown (virtual)', lat: 30.63, lng: -97.68, virtual: true } },

  { id: 'snitch', short: 'CCSC 2024', title: "SNITCH: Southwestern's Newest Innovation to Cultivate Honor", year: 2024,
    venue: 'CCSC South Central 2024', kind: 'poster', status: 'done', lead: 1, rank: 0, area: 'hum', award: '3rd place',
    desc: 'An anonymous, AI-assisted honor code reporting system built to raise reporting rates while keeping students psychologically safe.',
    tags: ['Systems', 'HCI'],
    place: { name: 'Nacogdoches, TX, USA', lat: 31.6, lng: -94.65 } },

  { id: 'w1', short: 'Evo* 2027', title: 'Variable-Length Quality-Diversity Search for Structurally Competitive Motif Discovery', year: 2027,
    venue: 'Evo* 2027 (in preparation)', kind: 'paper', status: 'wip', lead: 1, rank: 2, area: 'qd',
    desc: 'A manuscript in progress, planned for submission to Evo* 2027.',
    tags: ['In progress', 'Motif discovery'],
    place: { name: 'Mainz, Germany', lat: 49.99, lng: 8.27 } },

  { id: 'w2', short: 'GECCO 2027', title: 'Comparative Diversity Mechanisms for Transcription Factor Motif Discovery', year: 2027,
    venue: 'GECCO 2027 (in preparation)', kind: 'paper', status: 'wip', lead: 1, rank: 3, area: 'qd',
    desc: 'A manuscript in progress, planned for submission to GECCO 2027.',
    tags: ['In progress', 'Motif discovery'],
    place: { name: 'Kraków, Poland', lat: 50.06, lng: 19.94 } },

  { id: 'w3', short: 'ICLR 2027', title: 'Using a Hybrid Method to Further Separate Motif Family Members', year: 2027,
    venue: 'ICLR 2027 (in preparation)', kind: 'paper', status: 'wip', lead: 1, rank: 4, area: 'ml',
    desc: 'A manuscript in progress, planned for submission to ICLR 2027.',
    tags: ['In progress', 'Motif discovery'] /* no place yet: add one when the venue is known */ }
];

/* Full citations for the Publications list */
window.PUBS = [
  { year: 2026, authors: ['Alejandro Medina', ' and Mary Lauren Benton'], title: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites',
    venue: "Proceedings of the Genetic and Evolutionary Computation Conference Companion (GECCO '26 Companion)", rest: 'Association for Computing Machinery, New York, NY, USA, 637–640.',
    href: 'https://dl.acm.org/doi/10.1145/3795101.3805456', doi: 'https://doi.org/10.1145/3795101.3805456', work: 'motif' },
  { year: 2023, authors: ['Alejandro Medina', ', Melanie Richey, Mark Mueller, and Jacob Schrum'], title: 'Evolving Flying Machines in Minecraft Using Quality Diversity',
    venue: "Proceedings of the Genetic and Evolutionary Computation Conference (GECCO '23)", rest: 'Association for Computing Machinery, New York, NY, USA, 1418–1426.',
    href: 'https://dl.acm.org/doi/10.1145/3583131.3590352', doi: 'https://doi.org/10.1145/3583131.3590352', work: 'fly' },
  { year: 2022, authors: ['Barbara M. Anthony, ', 'Alejandro Medina', ', and Mark Mueller'], title: 'Prioritizing Self, Team, or Job: Trends in Sincerity in Cooperative Polls',
    venue: 'Cooperative Design, Visualization, and Engineering (CDVE 2022), Yuhua Luo (Ed.). Lecture Notes in Computer Science, Vol. 13492', rest: 'Springer, Cham, 33–44.',
    href: 'https://link.springer.com/chapter/10.1007/978-3-031-16538-2_4', doi: 'https://doi.org/10.1007/978-3-031-16538-2_4', work: 'polls' }
];

/* Selected presentations (award is shown after the text) */
window.TALKS = [
  { year: 2026, items: [
    { text: 'Using Quality Diversity for Motif Discovery. ACM Graduate Poster, CMD-IT/Tapia Conference', award: '3rd Place: Poster Competition', work: 'tapia' },
    { text: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites. Lightning talk, CRA-WP Grad Cohort Workshop', work: 'cra' },
    { text: 'Motif Diversity in Human Liver ChIP-seq Data Using MAP-Elites. Poster, GECCO 2026 Companion', work: 'motif' } ] },
  { year: 2025, items: [
    { text: 'Revisiting Predictive Models of Alcohol Consumption in Nonhuman Primates. AI for Biology and Medicine Symposium, Denton, TX', work: 'etoh' } ] },
  { year: 2024, items: [
    { text: "SNITCH: Southwestern's Newest Innovation to Cultivate Honor. CCSC South Central", award: '3rd Place: Poster Competition', work: 'snitch' } ] },
  { year: 2023, items: [
    { text: 'Using Quality Diversity to Evolve Flying Machines in Minecraft. CCSC South Central', award: '3rd Place: Poster Competition', work: 'flyp' },
    { text: 'Interactive Evolution of Novel Shapes in Minecraft. CCSC South Central', award: 'Honorable Mention: Poster Competition', work: 'shapes' },
    { text: 'Evaluating an Earliest Deadline First Algorithm for a Dial-a-Ride Problem. CMD-IT/Tapia Conference, Dallas, TX', work: 'edf' },
    { text: 'Evolving Flying Machines in Minecraft Using Quality Diversity. Southwestern University Undergraduate Research and Creative Works Symposium' } ] },
  { year: 2022, items: [
    { text: 'Prioritizing Self, Team, or Job: Trends in Sincerity in Cooperative Polls. CDVE 2022 (virtual)', work: 'polls' },
    { text: 'Using Quality Diversity to Generate Flying Machines in Minecraft. Southwestern University High Impact Experiences Celebration' },
    { text: 'Interactive Evolution of Novel Shapes in Minecraft. Southwestern University High Impact Experiences Celebration' } ] }
];

window.NEWS = [
  { k: 'GECCO', t: 'My companion paper was accepted to GECCO 2026.' },
  { k: 'CRA', t: 'My lightning talk was accepted at the 2026 CRA Grad Cohort Workshop.' },
  { k: 'Tapia', t: 'I won 3rd place in the ACM Graduate Poster Competition at the 2026 Tapia Conference.' }
];

window.SCHOLAR_FALLBACK = { updated: '2026-10-09', publications: 3, citations: 11, h_index: 1 };
