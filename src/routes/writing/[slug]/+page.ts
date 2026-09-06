import { error } from '@sveltejs/kit';
import { bySlug, posts } from '$lib/writing';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => posts.map((p) => ({ slug: p.slug }));

export const load: PageLoad = ({ params }) => {
  const post = bySlug(params.slug);
  if (!post) error(404, 'Not found');
  return { slug: post.slug, title: post.title, date: post.date, summary: post.summary };
};
