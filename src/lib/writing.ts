// Writing index. Markdown lives in src/content/writing/<slug>.md with frontmatter:
//   title, date (YYYY-MM-DD), summary, draft (true hides it from the list and the build)
import type { Component } from 'svelte';

type Meta = { title: string; date: string; summary: string; draft?: boolean };
type Mod = { default: Component; metadata: Meta };

const mods = import.meta.glob<Mod>('/src/content/writing/*.md', { eager: true });

export type Post = Meta & { slug: string; component: Component };

export const posts: Post[] = Object.entries(mods)
  .map(([path, mod]) => ({
    slug: path.split('/').pop()!.replace(/\.md$/, ''),
    component: mod.default,
    ...mod.metadata
  }))
  .filter((p) => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const bySlug = (slug: string) => posts.find((p) => p.slug === slug);
