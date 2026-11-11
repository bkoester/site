<script lang="ts">
  import { site } from '$lib/site';
  import { projects } from '$lib/projects';
  import { caseStudies } from '$lib/casestudies';
  import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
  <title>Projects · {site.name}</title>
  <meta name="description" content="Public projects by Ben Koester: a personal coding agent, a self-healing spot-instance platform, scrapers, and an evaluated retrieval bot." />
</svelte:head>

<h1 class="page-title">Projects</h1>
<p class="page-lede">Case studies of what was built and what came of it, and the public repositories behind them. Each README explains the engineering decisions rather than the personal use.</p>

{#if caseStudies.length}
  <div class="section-head" style="margin-top: 0"><h2>Case studies</h2></div>
  <div class="cards two">
    {#each caseStudies as c}
      <a class="card" href="/projects/{c.slug}">
        <span class="label">{c.kind}</span>
        <span class="title">{c.title}</span>
        <span class="summary">{c.summary}</span>
        <span class="meta">Read the case study →</span>
      </a>
    {/each}
  </div>
  <div class="section-head"><h2>Repositories</h2></div>
{/if}

<div class="cards two" style="margin-top: {caseStudies.length ? 20 : 0}px">
  {#each projects as p}
    <article class="card" id={p.slug}>
      <span class="label">Project</span>
      <span class="title">{p.name}</span>
      <p class="summary">{p.blurb}</p>
      <p class="summary"><span class="label">Why it's here</span><br />{p.why}</p>
      <a class="meta" href="{site.github}/{p.repo}"><Icon name="external-link" size={12} /> github.com/bkoester/{p.repo}</a>
    </article>
  {/each}
</div>
