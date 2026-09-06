<script lang="ts">
  import { site } from '$lib/site';
  import { projects } from '$lib/projects';
  import Icon from '$lib/components/Icon.svelte';
</script>

<svelte:head>
  <title>Projects · {site.name}</title>
  <meta name="description" content="Public projects by Ben Koester: a personal coding agent, a self-healing spot-instance platform, scrapers, and an evaluated retrieval bot." />
</svelte:head>

<h1 class="page-title">Projects</h1>
<p class="page-lede">Public repositories. Each README explains the engineering decisions rather than the personal use.</p>

<div class="cards two" style="margin-top: 0">
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
