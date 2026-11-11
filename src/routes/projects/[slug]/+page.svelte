<script lang="ts">
  import { studyBySlug } from '$lib/casestudies';
  import { site } from '$lib/site';
  let { data } = $props();
  const Body = $derived(studyBySlug(data.slug)!.component);
</script>

<svelte:head>
  <title>{data.title} · {site.name}</title>
  <meta name="description" content={data.summary} />
  <meta property="og:title" content={data.title} />
  <meta property="og:description" content={data.summary} />
  <meta property="og:type" content="article" />
</svelte:head>

<article class="case">
  <p class="case-crumb label"><a href="/projects">Projects</a> <span aria-hidden="true">/</span> {data.kind}</p>
  <h1 class="page-title">{data.title}</h1>
  <p class="page-lede">{data.summary}</p>
  <div class="prose">
    <Body />
  </div>
  {#if data.updated}<p class="case-updated">Updated {data.updated}</p>{/if}
</article>
