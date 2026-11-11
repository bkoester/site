// Case studies. Markdown in src/content/projects/<slug>.md is GENERATED from the private portfolio
// repo by scripts/sync-case-studies.mjs; edit the source there and re-run the script.
// Frontmatter: title, summary, kind ("Running now" | "Earlier work" | ...), updated (YYYY-MM-DD), order.
import type { Component } from 'svelte';

type Meta = { title: string; summary: string; kind: string; updated: string; order: number };
type Mod = { default: Component; metadata: Meta };

const mods = import.meta.glob<Mod>('/src/content/projects/*.md', { eager: true });

export type CaseStudy = Meta & { slug: string; component: Component };

export const caseStudies: CaseStudy[] = Object.entries(mods)
  .map(([path, mod]) => ({
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    component: mod.default,
    ...mod.metadata
  }))
  .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

export const studyBySlug = (slug: string) => caseStudies.find((c) => c.slug === slug);
