// Publications. src/data/publications.json is GENERATED from the private publications repo by
// scripts/sync-publications.mjs; edit the inventory there and re-run the script.
import data from '../data/publications.json';

export type Publication = {
  title: string;
  titleHtml: string; // title with only <sub>, <sup> and <i> allowed; everything else escaped by the sync script
  year: number;
  authors: string[];
  me: number; // 1-based position of Koester in the author list
  collaboration: string;
  venue: string;
  url: string;
  arxiv: string;
  kind: string;
  paper: boolean; // journal article, conference paper, preprint or dissertation
  topic: string;
  firstAuthor: boolean;
};

export const publications = data as Publication[];

export const profiles = {
  orcid: 'https://orcid.org/0000-0003-0178-5738',
  scholar: 'https://scholar.google.com/citations?user=iGrTUjUAAAAJ'
};

export type AuthorPart = { text: string; me?: boolean; note?: boolean };

const ordinal = (n: number) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Up to six authors are listed in full. Longer lists show the first three, then Koester with his
// position, so a 60-author collaboration paper stays one line and still says where he sits.
export function authorParts(p: Publication): AuthorPart[] {
  const n = p.authors.length;
  const part = (i: number): AuthorPart => ({ text: p.authors[i], me: i + 1 === p.me });
  if (n <= 6) return p.authors.map((_, i) => part(i));
  const parts = [0, 1, 2].map(part);
  if (p.me > 3) {
    parts.push({ text: '…', note: true }, part(p.me - 1), { text: `(${ordinal(p.me)} of ${n})`, note: true });
  } else {
    parts.push({ text: `and ${n - 3} more`, note: true });
  }
  return parts;
}
