<script lang="ts">
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>About · {site.name}</title>
  <meta name="description" content="About Ben Koester: data scientist and applied AI engineer in Ann Arbor, Michigan." />
</svelte:head>

<h1 class="page-title">About</h1>

<div class="prose" style="margin-top: 24px">
  <!-- PLACEHOLDER: short bio from QUESTIONS.md A2; human paragraph from I1 (or nothing). -->
  <p>Ben Koester is a data scientist in Ann Arbor, Michigan. He has spent the last decade at the University of Michigan building data programs and, more recently, production AI systems and the evaluation practice around them. Before that: a physics Ph.D. on large sky-survey data, machine learning on astrophysical databases, and computational genomics.</p>
</div>

<div class="cards two" style="margin-top: 40px">
  <div class="card">
    <span class="label">Contact</span>
    <a class="title" href="mailto:{site.email}">{site.email}</a>
    <a class="summary" href={site.github}>github.com/bkoester</a>
    <a class="summary" href={site.linkedin}>LinkedIn</a>
  </div>
  <div class="card">
    <span class="label">This site</span>
    <p class="summary">Static, built with SvelteKit and served from Cloudflare Pages. The Ask bot runs on a spot instance that sleeps overnight; its evaluation page is regenerated from committed results so it never depends on the host being awake. No cookies, no trackers beyond Cloudflare's cookie-free analytics.</p>
  </div>
</div>
