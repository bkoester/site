import { posts } from '$lib/writing';
import { site } from '$lib/site';

export const prerender = true;

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);

export function GET() {
  const base = `https://${site.domain}`;
  const items = posts
    .map(
      (p) => `<item><title>${esc(p.title)}</title><link>${base}/writing/${p.slug}</link><guid>${base}/writing/${p.slug}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.summary)}</description></item>`
    )
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} — Writing</title><link>${base}/writing</link><description>${esc(site.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
