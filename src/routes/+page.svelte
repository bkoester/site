<script lang="ts">
  import { site } from '$lib/site';
  import { posts } from '$lib/writing';
  const latest = posts.slice(0, 3);
</script>

<svelte:head>
  <title>{site.name}</title>
  <meta name="description" content={site.description} />
  <meta property="og:title" content={site.name} />
  <meta property="og:description" content={site.description} />
</svelte:head>

<h1>Ben Koester</h1>
<p class="label" style="margin-bottom:1.25rem">Data scientist and applied AI engineer, Ann Arbor</p>

<!-- PLACEHOLDER: replace with the answer to QUESTIONS.md A1. Colleague-safe: no
     availability, titles or job-search language (PLAN.md §0). -->
<p>
  I build production AI systems and measure whether they actually work: retrieval-augmented
  agents, evaluation harnesses, and the cloud data platforms underneath them.
</p>
<p>
  Underneath that is twenty years of hard data at scale. A physics Ph.D. that ran a parallel
  clustering pipeline over multi-terabyte sky-survey data, machine learning on astrophysical
  databases, computational genomics, and a decade designing multi-institution data programs
  covering millions of student records.
</p>
<p>
  This site holds the writing and the projects. The <a href="/ask">Ask</a> page is a small
  retrieval bot over that writing, with its evaluation results published beside it.
</p>

<div class="panel-grid">
  <section class="panel">
    <h2>Writing</h2>
    {#if latest.length}
      {#each latest as p}
        <p><a href="/writing/{p.slug}">{p.title}</a><br /><span class="muted">{p.date}</span></p>
      {/each}
    {:else}
      <p class="muted">First pieces coming: evaluating a retrieval chatbot in production; how this bot is measured.</p>
    {/if}
    <p><a href="/writing">All writing →</a></p>
  </section>
  <section class="panel">
    <h2>Projects</h2>
    <p>A headless coding agent on a self-healing spot instance. A multi-source job-market scraper. The Terraform under both. This bot.</p>
    <p><a href="/projects">All projects →</a></p>
  </section>
  <section class="panel">
    <h2>Ask</h2>
    <p>Questions about the writing and projects, answered with sources. Declines opinions and personal questions.</p>
    <p><a href="/ask">Ask something →</a></p>
  </section>
</div>
