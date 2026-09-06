// Public projects. Repos 404 until published (STRATEGY.md portfolio plan).
export const projects = [
  { slug: 'agent', name: 'A personal agent with written-down guardrails', repo: 'ec2-apps',
    blurb: 'Headless Claude Code on a spot instance: nightly sweeps, a morning brief, read-only calendar and mail, a two-way Discord channel. Write access limited to one repo by design.',
    why: 'A real, running agentic system with the guardrails written down.' },
  { slug: 'platform', name: 'A fifteen-dollar self-healing platform', repo: 'ec2-infra',
    blurb: 'Terraform-managed spot host. Zero inbound ports, Cloudflare tunnels, scheduled scale-to-zero, EBS snapshots.',
    why: 'The infrastructure everything else here runs on.' },
  { slug: 'jobs', name: 'big-ten-jobs, a multi-source scraper', repo: 'big-ten-jobs',
    blurb: 'Scrapes university ATS platforms with retry hardening and fit scoring, plus a small read-only explorer.',
    why: 'Data engineering and reliability work, on messy sources.' },
  { slug: 'solar', name: 'Solar telemetry and a tariff-aware bot', repo: 'solar',
    blurb: 'Home solar data into Athena, a dashboard, and a Discord bot that says when to run the dryer under a time-of-day tariff.',
    why: 'A small end-to-end data product with a real user.' },
  { slug: 'ask', name: 'This bot, and how it is evaluated', repo: 'ask-ben',
    blurb: 'A retrieval bot over the writing on this site, with a golden-query harness, an LLM judge with a reliability check, and the results published beside it.',
    why: 'Evaluation as a first-class deliverable, not an afterthought.' }
];
