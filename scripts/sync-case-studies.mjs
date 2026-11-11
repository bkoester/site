#!/usr/bin/env node
// Copies finished case studies from the private portfolio repo into this site.
//
//   node scripts/sync-case-studies.mjs ../portfolio
//
// A case study is published only when its front matter has `status: done` AND `publish: true`.
// The portfolio Markdown stays the source: edit there, re-run this, commit the result here.
//
// What it changes on the way:
//   - the H1 and the first paragraph become the page title and summary
//   - internal sections are dropped (OMIT below)
//   - ```mermaid blocks are rendered to SVG in static/case-studies/ (needs `mmdc` on PATH)
//   - links to other case studies point at /projects/<slug> if that one is published, else become plain text
//   - links to paper summaries point at the paper's DOI or URL
//   - links to github.com/bkoester repos are kept only for repos the portfolio inventory lists as public
//   - 10^14 becomes a superscript, and bare doi:/hdl: references become links
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(SITE, 'src/content/projects');
const IMG = join(SITE, 'static/case-studies');

// Sections that never reach the site. "To resolve" is a private to-do list. "Why it reads well to
// a client" is pitch language, which CLAUDE.md rules out here (no job-search signal).
const OMIT = ['To resolve', 'Why it reads well to a client'];

const KIND = { past: 'Earlier work', live: 'Running now', 'um-hr': 'Public parallel' };

// Terminal-data tokens (src/tokens.css), so diagrams match the site.
const MERMAID_CONFIG = {
  theme: 'base',
  flowchart: { wrappingWidth: 440, nodeSpacing: 40, rankSpacing: 46 },
  themeVariables: {
    fontFamily: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace",
    fontSize: '14px',
    background: 'transparent',
    primaryColor: '#161B14',
    primaryBorderColor: '#3FA85C',
    primaryTextColor: '#f0f7f0',
    secondaryColor: '#11150F',
    tertiaryColor: '#11150F',
    lineColor: '#9fb29f',
    textColor: '#dcefdc',
    clusterBkg: '#10140f',
    clusterBorder: '#253025',
    edgeLabelBackground: '#0B0E0C',
    titleColor: '#9fb29f'
  }
};

function frontMatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return [{}, text];
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].replace(/^["']|["']$/g, '').trim();
  }
  return [fm, text.slice(m[0].length)];
}

function publicRepos(portfolio) {
  const out = new Set();
  const file = join(portfolio, 'inventory/repos.md');
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length > 3 && /^public\b/.test(cells[2])) out.add(cells[1].toLowerCase());
  }
  return out;
}

function sourceFiles(portfolio) {
  const root = join(portfolio, 'projects');
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => readdirSync(join(root, d.name)).filter((f) => f.endsWith('.md')).map((f) => join(root, d.name, f)));
}

function dropSections(body) {
  const out = [];
  let skipping = false;
  for (const line of body.split('\n')) {
    const h = line.match(/^## +(.*)$/);
    if (h) skipping = OMIT.includes(h[1].trim());
    if (!skipping) out.push(line);
  }
  return out.join('\n');
}

function renderDiagrams(body, slug) {
  let n = 0;
  return body.replace(/(?:<!--\s*alt:\s*([\s\S]*?)-->\s*\n)?```mermaid\n([\s\S]*?)```/g, (_, alt, code) => {
    n += 1;
    const name = `${slug}-${n}.svg`;
    const tmp = mkdtempSync(join(tmpdir(), 'mmd-'));
    writeFileSync(join(tmp, 'in.mmd'), code);
    writeFileSync(join(tmp, 'config.json'), JSON.stringify(MERMAID_CONFIG));
    writeFileSync(join(tmp, 'pptr.json'), JSON.stringify({ args: ['--no-sandbox'] }));
    try {
      execFileSync('mmdc', ['-i', join(tmp, 'in.mmd'), '-o', join(IMG, name), '-c', join(tmp, 'config.json'),
        '-p', join(tmp, 'pptr.json'), '-b', 'transparent', '-q'], { stdio: 'inherit' });
    } catch (e) {
      throw new Error(`mmdc failed for ${slug} (install with: npm i -g @mermaid-js/mermaid-cli): ${e.message}`);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
    const text = (alt || 'Diagram').replace(/\s+/g, ' ').trim().replace(/"/g, '&quot;');
    if (!alt) console.warn(`  ${slug}: diagram ${n} has no <!-- alt: ... --> line above it`);
    return `<figure class="diagram"><img src="/case-studies/${name}" alt="${text}" /></figure>`;
  });
}

function rewriteLinks(body, file, portfolio, published, repos) {
  return body.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (whole, text, href) => {
    const gh = href.match(/^https:\/\/github\.com\/bkoester\/([\w.-]+)\/?$/i);
    if (gh) return repos.has(gh[1].toLowerCase()) ? whole : text;
    if (/^(https?:|mailto:|#|\/)/.test(href)) return whole;
    const target = resolve(dirname(file), href.split('#')[0]);
    const rel = relative(portfolio, target);
    if (rel.startsWith('projects/')) {
      const slug = basename(target, '.md');
      return published.has(slug) ? `[${text}](/projects/${slug})` : text;
    }
    if (rel.startsWith('papers/') && existsSync(target)) {
      const [fm] = frontMatter(readFileSync(target, 'utf8'));
      const url = fm.doi ? `https://doi.org/${fm.doi}` : fm.url;
      return url ? `[${text}](${url})` : text;
    }
    return text;
  });
}

// Small touches plain Markdown can't express: powers, sigma-8, and clickable DOIs and handles.
function typography(body) {
  return body
    .replace(/(\d)\^(\d+)/g, '$1<sup>$2</sup>')
    .replace(/σ8\b/g, 'σ<sub>8</sub>')
    .replace(/(^|[\s(])doi:(10\.\d{4,9}\/[^\s)]+?)(?=[.,;]?(\s|\)|$))/gm, '$1[doi:$2](https://doi.org/$2)')
    .replace(/(^|[\s(])hdl:(\d[\d.]*\/[^\s)]+?)(?=[.,;]?(\s|\)|$))/gm, '$1[hdl:$2](https://hdl.handle.net/$2)');
}

function updated(portfolio, file) {
  try {
    return execFileSync('git', ['-C', portfolio, 'log', '-1', '--format=%ad', '--date=short', '--', file]).toString().trim();
  } catch {
    return '';
  }
}

function main() {
  const portfolio = resolve(process.argv[2] || '');
  if (!process.argv[2] || !existsSync(join(portfolio, 'projects'))) {
    console.error('usage: node scripts/sync-case-studies.mjs <path to the portfolio repo>');
    process.exit(1);
  }
  mkdirSync(OUT, { recursive: true });
  mkdirSync(IMG, { recursive: true });

  const sources = sourceFiles(portfolio).map((file) => {
    const [fm, body] = frontMatter(readFileSync(file, 'utf8'));
    return { file, fm, body, slug: basename(file, '.md') };
  });
  const chosen = sources.filter((s) => s.fm.status === 'done' && s.fm.publish === 'true');
  const published = new Set(chosen.map((s) => s.slug));
  const repos = publicRepos(portfolio);

  for (const f of readdirSync(OUT)) if (f.endsWith('.md')) rmSync(join(OUT, f));
  for (const f of readdirSync(IMG)) if (f.endsWith('.svg')) rmSync(join(IMG, f));

  for (const s of chosen) {
    let body = s.body.replace(/^\s*# .*\n/, '').trim();
    const [first, ...rest] = body.split(/\n\s*\n/);
    const summary = first.replace(/\s+/g, ' ').trim();
    body = dropSections(rest.join('\n\n'));
    body = renderDiagrams(body, s.slug);
    body = rewriteLinks(body, s.file, portfolio, published, repos);
    body = body.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    body = typography(body);
    const head = [
      '---',
      `title: ${JSON.stringify(s.fm.title)}`,
      `summary: ${JSON.stringify(summary)}`,
      `kind: ${JSON.stringify(KIND[s.fm.bucket] || '')}`,
      `updated: ${JSON.stringify(updated(portfolio, relative(portfolio, s.file)))}`,
      `order: ${Number(s.fm.site_order || 50)}`,
      '---',
      '',
      '<!-- Generated by scripts/sync-case-studies.mjs from the portfolio repo. Edit there, not here. -->',
      ''
    ].join('\n');
    writeFileSync(join(OUT, `${s.slug}.md`), `${head}\n${body.trim()}\n`);
    console.log(`published ${s.slug}`);
  }
  if (!chosen.length) console.log('nothing has status: done and publish: true');
}

main();
