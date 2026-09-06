<script lang="ts">
  import { site } from '$lib/site';
  import { posts } from '$lib/writing';
  import { projects } from '$lib/projects';
  import AskWidget from '$lib/components/AskWidget.svelte';
  const latest = posts.slice(0, 2);
  const featured = projects.slice(0, 2);
</script>

<svelte:head>
  <title>{site.name}</title>
  <meta name="description" content={site.description} />
  <meta property="og:title" content={site.name} />
  <meta property="og:description" content={site.description} />
</svelte:head>

<section class="hero">
  <div class="hero-copy">
    <h1>Build the system.<br />Then prove it works.</h1>
    <!-- PLACEHOLDER: replace with the answer to QUESTIONS.md A1. Colleague-safe: no
         availability, titles or job-search language (PLAN.md §0). -->
    <p>Ben Koester is a data scientist and applied AI engineer in Ann Arbor. Retrieval-augmented agents, evaluation harnesses, cloud data platforms, and twenty years of large, messy data before that: a physics Ph.D. on multi-terabyte sky surveys, computational genomics, and multi-institution data programs covering millions of records.</p>
    <div class="actions">
      <a class="btn btn-primary" href="/writing">writing</a>
      <a class="btn btn-secondary" href="/projects">projects</a>
    </div>
  </div>
  <AskWidget compact={true} />
</section>

<div class="cards">
  {#each latest as p}
    <a class="card" href="/writing/{p.slug}">
      <span class="label">Writing</span>
      <span class="title">{p.title}</span>
      <span class="meta">{p.date}</span>
    </a>
  {/each}
  {#if latest.length < 2}
    <div class="card" aria-hidden="true">
      <span class="label">Writing</span>
      <span class="title">First pieces coming: evaluating a retrieval chatbot in production; how this bot is measured.</span>
    </div>
  {/if}
  {#each featured as pr}
    <a class="card" href="/projects#{pr.slug}">
      <span class="label">Project</span>
      <span class="title">{pr.name}</span>
      <span class="meta">github.com/bkoester/{pr.repo}</span>
    </a>
  {/each}
</div>
