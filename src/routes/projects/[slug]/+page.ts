import { error } from '@sveltejs/kit';
import { caseStudies, studyBySlug } from '$lib/casestudies';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => caseStudies.map((c) => ({ slug: c.slug }));

export const load: PageLoad = ({ params }) => {
  const study = studyBySlug(params.slug);
  if (!study) error(404, 'Not found');
  const { slug, title, summary, kind, updated } = study;
  return { slug, title, summary, kind, updated };
};
