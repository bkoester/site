# site — working notes for Claude

benkoester.com: SvelteKit static site (adapter-static) on Cloudflare Pages, built from this repo; the Ask page talks to ask.benkoester.com. Preview at benkoester.pages.dev behind Cloudflare Access; the custom domain is attached at launch, not before.

## Rules
- No job-search signal anywhere (coworkers will read it): no availability, titles, resume downloads or "open to" language. Copy stays at public-resume level.
- Same "terminal-data" design tokens as the journal/solar/big-ten apps (direction C2, see `../ideas-claude-chat/DESIGN.md`); plan and open items in `../ideas-claude-chat/PLAN.md`.

## Develop and deploy
- `npm run dev`; `npm run build` (output `build/`); `npx svelte-check` before committing.
- Deploys happen from GitHub through Cloudflare Pages on push to main — nothing runs on the EC2 host for this repo.
