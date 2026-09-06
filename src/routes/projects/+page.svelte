<script lang="ts">
  import { site } from '$lib/site';
  import Icon from '$lib/components/Icon.svelte';

  // Repos link to github.com/bkoester/<name>; they 404 until published (STRATEGY.md portfolio plan).
  const projects = [
    {
      name: 'Personal agent',
      repo: 'ec2-apps',
      blurb: 'Headless Claude Code on a spot instance: nightly sweeps, a morning brief, read-only calendar and mail, a two-way Discord channel. Write access limited to one repo by design.',
      why: 'A real, running agentic system with the guardrails written down.'
    },
    {
      name: 'EC2 platform',
      repo: 'ec2-infra',
      blurb: 'Terraform-managed, self-healing spot host. Zero inbound ports, Cloudflare tunnels, scheduled scale-to-zero, EBS snapshots, about fifteen dollars a month.',
      why: 'The infrastructure everything else here runs on.'
    },
    {
      name: 'big-ten-jobs',
      repo: 'big-ten-jobs',
      blurb: 'A multi-source scraper across university ATS platforms with retry hardening and fit scoring, plus a small read-only explorer.',
      why: 'Data engineering and reliability work, on messy sources.'
    },
    {
      name: 'Solar',
      repo: 'solar',
      blurb: 'Home solar telemetry into Athena, a Streamlit dashboard, and a Discord bot that recommends when to run the dryer under a time-of-day tariff.',
      why: 'A small end-to-end data product with a real user.'
    },
    {
      name: 'This bot',
      repo: 'ask-ben',
      blurb: 'A retrieval bot over the writing on this site, with a golden-query harness, an LLM judge with a reliability check, and the results published on the evaluation page.',
      why: 'Evaluation as a first-class deliverable, not an afterthought.'
    }
  ];
</script>

<svelte:head>
  <title>Projects · {site.name}</title>
  <meta name="description" content="Public projects by Ben Koester: a personal coding agent, a self-healing spot-instance platform, scrapers, and an evaluated retrieval bot." />
</svelte:head>

<h1>Projects</h1>
<p class="muted" style="margin-bottom:1.5rem">Public repositories. Each README explains the engineering decisions rather than the personal use.</p>

{#each projects as p}
  <article class="panel">
    <h2>{p.name} <a href="{site.github}/{p.repo}" aria-label="{p.name} on GitHub" style="font-size:0.8rem;margin-left:0.5rem"><Icon name="external-link" size={14} /> {p.repo}</a></h2>
    <p>{p.blurb}</p>
    <p class="label">Why it's here</p>
    <p>{p.why}</p>
  </article>
{/each}
