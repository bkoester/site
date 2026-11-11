#!/usr/bin/env node
// Builds src/data/publications.json from the private publications repo's inventory.
//
//   node scripts/sync-publications.mjs ../publications
//
// Only public bibliographic facts are copied: title, year, authors, venue, link, kind. No PDFs, no
// figures, no access notes. Edit the inventory there, re-run this, commit the result here.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(SITE, 'src/data/publications.json');

// Inventory category -> [short label, counts as a "paper" for the default view]
const KIND = {
  '1. Refereed journal articles': ['Journal article', true],
  '2. Conference papers, proceedings, and workshop papers': ['Conference paper', true],
  '3. arXiv-only preprints and reports': ['Preprint', true],
  '4. Dissertation': ['Dissertation', true],
  '5. AAS meeting abstracts': ['Meeting abstract', false],
  '6. Observing proposals': ['Observing proposal', false],
  '7. GCN circulars': ['GCN circular', false],
  '8. Datasets and data catalogs': ['Dataset', false],
  '9. Reports and documentation': ['Report', false]
};

const TOPIC = {
  'Michigan Learning Analytics': 'Learning analytics',
  'Michigan Bioinformatics': 'Genomics and biology',
  'Michigan Undergrad': 'Genomics and biology'
};

const ENTITIES = { '&gt;': '>', '&lt;': '<', '&amp;': '&', '&quot;': '"', '&#39;': "'", '&apos;': "'" };

// Titles arrive with entities and a little markup. Keep sub/sup/i, drop every other tag, escape the rest.
function titleHtml(raw) {
  const kept = [];
  let s = raw.replace(/<\s*(\/?)\s*(sub|sup|i|em)\s*>/gi, (_, slash, tag) => {
    kept.push(`<${slash}${tag.toLowerCase() === 'em' ? 'i' : tag.toLowerCase()}>`);
    return `\u0000${kept.length - 1}\u0000`;
  });
  s = s.replace(/<[^>]*>/g, '');
  s = s.replace(/&(?:gt|lt|amp|quot|apos|#39);/g, (m) => ENTITIES[m]);
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)]).replace(/\s+/g, ' ').trim();
}

const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

// Indexes disagree on name order. "Koester, B. P." becomes "B. P. Koester" so a comma only ever separates people.
function displayName(a) {
  const m = a.match(/^([^,]+),\s*(.+)$/);
  return (m ? `${m[2]} ${m[1]}` : a).replace(/\s+/g, ' ').trim();
}

function link(p) {
  if (p.doi) return `https://doi.org/${p.doi}`;
  if (p.arxiv) return `https://arxiv.org/abs/${p.arxiv}`;
  return p.landing_url || '';
}

function main() {
  const repo = resolve(process.argv[2] || '');
  const src = join(repo, 'publications_inventory.json');
  if (!process.argv[2] || !existsSync(src)) {
    console.error('usage: node scripts/sync-publications.mjs <path to the publications repo>');
    process.exit(1);
  }
  const items = JSON.parse(readFileSync(src, 'utf8')).map((p) => {
    const [kind, paper] = KIND[p.category] || ['Other', false];
    const html = titleHtml(p.title);
    const pos = p.authors.findIndex((a) => /koester/i.test(a)) + 1;
    return {
      title: plain(html),
      titleHtml: html,
      year: Number(p.year),
      authors: p.authors.map(displayName),
      me: pos, // 1-based position of Koester in the author list; 0 if not found
      collaboration: p.collaboration || '',
      venue: p.venue || '',
      url: link(p),
      arxiv: p.arxiv && p.doi ? `https://arxiv.org/abs/${p.arxiv}` : '',
      kind,
      paper,
      topic: TOPIC[p.era] || 'Astrophysics',
      firstAuthor: Boolean(p.first_author)
    };
  });
  const rank = Object.fromEntries(Object.values(KIND).map(([label], i) => [label, i]));
  items.sort((a, b) => b.year - a.year || rank[a.kind] - rank[b.kind] || a.title.localeCompare(b.title));
  const missing = items.filter((i) => !i.url || !i.me);
  if (missing.length) console.warn(`check: ${missing.length} item(s) without a link or without Koester as an author`);
  writeFileSync(OUT, JSON.stringify(items, null, 1) + '\n');
  console.log(`wrote ${items.length} publications (${items.filter((i) => i.paper).length} papers) to src/data/publications.json`);
}

main();
