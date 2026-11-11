# benkoester.com

Static personal site: SvelteKit + adapter-static, deployed by Cloudflare Pages on push to `main`.
Design tokens and the icon set are copied verbatim from the journal repo (canonical); see the
header comment in `src/tokens.css`.

## Pages

`/` home · `/writing` (Markdown in `src/content/writing/`, via mdsvex) · `/projects` and `/projects/<slug>` case studies · `/publications` · `/ask`
(widget calling `PUBLIC_ASK_API`) · `/about` · `/rss.xml`.

## Case studies

`/projects/<slug>` pages are generated from the private `portfolio` repo, which stays the source. A case study
is published only when its front matter there has `status: done` and `publish: true`.

```bash
node scripts/sync-case-studies.mjs ../portfolio   # needs mmdc (npm i -g @mermaid-js/mermaid-cli) for diagrams
npm run build
```

The script rewrites `src/content/projects/*.md` and `static/case-studies/*.svg`; commit both. Don't edit them by
hand. It drops the private "To resolve" list and any pitch section, points paper links at their DOIs, and keeps
GitHub links only for repos the portfolio inventory lists as public. Styles are the `.case` rules in
`src/app.css`.

## Publications

`/publications` is built from `src/data/publications.json`, generated from the private `publications` repo:

```bash
node scripts/sync-publications.mjs ../publications
```

Only titles, years, authors, venues and links are copied. Styles are the `.pub` rules in `src/app.css`.

## Config

Copy `.env.example` to `.env`. `PUBLIC_ASK_API` is the bot's base URL (empty = widget shows
"not wired up yet"). `PUBLIC_TURNSTILE_SITEKEY` is the Turnstile site key (public; the widget renders only when set).
`PUBLIC_INDEXABLE=true` removes the `noindex` meta at launch; also change
`static/robots.txt` to `Allow: /`.

## Develop

```bash
npm install
npm run dev
npm run build   # output in build/
```

## Cloudflare Pages settings

Build command `npm run build`, output directory `build`, Node 22. Set the three `PUBLIC_*`
variables in the project's environment. Attach `benkoester.com` + `www` as custom domains at
launch (PLAN.md §2b in ideas-claude-chat).
