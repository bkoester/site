# benkoester.com

Static personal site: SvelteKit + adapter-static, deployed by Cloudflare Pages on push to `main`.
Design tokens and the icon set are copied verbatim from the journal repo (canonical); see the
header comment in `src/tokens.css`.

## Pages

`/` home · `/writing` (Markdown in `src/content/writing/`, via mdsvex) · `/projects` · `/ask`
(widget calling `PUBLIC_ASK_API`) · `/about` · `/rss.xml`.

## Config

Copy `.env.example` to `.env`. `PUBLIC_ASK_API` is the bot's base URL (empty = widget shows
"not wired up yet"). `PUBLIC_INDEXABLE=true` removes the `noindex` meta at launch; also change
`static/robots.txt` to `Allow: /`.

## Develop

```bash
npm install
npm run dev
npm run build   # output in build/
```

## Cloudflare Pages settings

Build command `npm run build`, output directory `build`, Node 22. Set the two `PUBLIC_*`
variables in the project's environment. Attach `benkoester.com` + `www` as custom domains at
launch (PLAN.md §2b in ideas-claude-chat).
