<script lang="ts">
  import { posts } from '$lib/writing';
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>Writing · {site.name}</title>
  <meta name="description" content="Long-form pieces by Ben Koester on LLM evaluation, retrieval systems, and data at scale." />
</svelte:head>

<h1 class="page-title">Writing</h1>
<p class="page-lede">Long-form pieces. There is an <a href="/rss.xml">RSS feed</a>.</p>

{#if posts.length === 0}
  <p class="muted">Nothing published yet.</p>
{:else}
  <div class="cards two" style="margin-top: 0">
    {#each posts as p}
      <a class="card" href="/writing/{p.slug}">
        <span class="label">{p.date}</span>
        <span class="title">{p.title}</span>
        <p class="summary">{p.summary}</p>
      </a>
    {/each}
  </div>
{/if}
