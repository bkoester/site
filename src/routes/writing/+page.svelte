<script lang="ts">
  import { posts } from '$lib/writing';
  import { site } from '$lib/site';
</script>

<svelte:head>
  <title>Writing · {site.name}</title>
  <meta name="description" content="Long-form pieces by Ben Koester on LLM evaluation, retrieval systems, and data at scale." />
</svelte:head>

<h1>Writing</h1>
<p class="muted" style="margin-bottom:1.5rem">Long-form pieces. New ones are announced nowhere in particular; there is an <a href="/rss.xml">RSS feed</a>.</p>

{#if posts.length === 0}
  <p class="muted">Nothing published yet.</p>
{/if}
{#each posts as p}
  <article class="panel">
    <h2><a href="/writing/{p.slug}">{p.title}</a></h2>
    <p class="label">{p.date}</p>
    <p>{p.summary}</p>
  </article>
{/each}
