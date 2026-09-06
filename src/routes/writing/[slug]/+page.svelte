<script lang="ts">
  import { bySlug } from '$lib/writing';
  import { site } from '$lib/site';
  let { data } = $props();
  const Body = $derived(bySlug(data.slug)!.component);
</script>

<svelte:head>
  <title>{data.title} · {site.name}</title>
  <meta name="description" content={data.summary} />
  <meta property="og:title" content={data.title} />
  <meta property="og:description" content={data.summary} />
  <meta property="og:type" content="article" />
</svelte:head>

<article class="prose">
  <h1>{data.title}</h1>
  <p class="meta">{data.date}</p>
  <Body />
</article>
