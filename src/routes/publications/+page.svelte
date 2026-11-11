<script lang="ts">
  import { site } from '$lib/site';
  import { publications, profiles, authorParts, type Publication } from '$lib/publications';

  type View = 'papers' | 'first' | 'all';
  let view = $state<View>('papers');
  let topic = $state('All');

  const size = (t: string) => publications.filter((p) => p.topic === t).length;
  const topics = ['All', ...[...new Set(publications.map((p) => p.topic))].sort((a, b) => size(b) - size(a))];
  const inView = (p: Publication, v: View) => (v === 'papers' ? p.paper : v === 'first' ? p.firstAuthor : true);
  const inTopic = (p: Publication, t: string) => t === 'All' || p.topic === t;

  const views: { id: View; label: string }[] = [
    { id: 'papers', label: 'Papers' },
    { id: 'first', label: 'First author' },
    { id: 'all', label: 'Everything' }
  ];
  const count = (v: View, t: string) => publications.filter((p) => inView(p, v) && inTopic(p, t)).length;

  const shown = $derived(publications.filter((p) => inView(p, view) && inTopic(p, topic)));
  const years = $derived(
    [...new Set(shown.map((p) => p.year))].map((y) => ({ year: y, items: shown.filter((p) => p.year === y) }))
  );

  const total = publications.length;
  const refereed = publications.filter((p) => p.kind === 'Journal article').length;
  const first = publications.filter((p) => p.firstAuthor).length;
  const span = `${Math.min(...publications.map((p) => p.year))} to ${Math.max(...publications.map((p) => p.year))}`;
  const description = `${total} publications by Ben Koester, ${span}: ${refereed} refereed journal articles, ${first} as first author, across astrophysics, learning analytics and genomics.`;
</script>

<svelte:head>
  <title>Publications · {site.name}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content="Publications · {site.name}" />
  <meta property="og:description" content={description} />
</svelte:head>

<h1 class="page-title">Publications</h1>
<p class="page-lede">
  <span class="num">{total}</span> items from {span}: <span class="num">{refereed}</span> refereed journal articles,
  <span class="num">{first}</span> as first author. Mostly astrophysics, then a decade of learning analytics.
</p>
<p class="pub-profiles">
  <a href={profiles.orcid} rel="me">ORCID</a>
  <a href={profiles.scholar} rel="me">Google Scholar</a>
</p>

<div class="pub-controls">
  <div class="pub-filter" role="group" aria-label="Show">
    <span class="label">Show</span>
    {#each views as v}
      <button type="button" class="chip" aria-pressed={view === v.id} onclick={() => (view = v.id)}>
        {v.label} <span class="num">{count(v.id, topic)}</span>
      </button>
    {/each}
  </div>
  <div class="pub-filter" role="group" aria-label="Field">
    <span class="label">Field</span>
    {#each topics as t}
      <button type="button" class="chip" aria-pressed={topic === t} onclick={() => (topic = t)}>
        {t} <span class="num">{count(view, t)}</span>
      </button>
    {/each}
  </div>
</div>

<div class="pubs" aria-live="polite">
  {#each years as group (group.year)}
    <section class="pub-year" aria-labelledby="y{group.year}">
      <h2 id="y{group.year}">{group.year}</h2>
      <ol>
        {#each group.items as p (p.title + p.venue)}
          <li class="pub">
            {#if p.url}
              <a class="pub-title" href={p.url}>{@html p.titleHtml}</a>
            {:else}
              <span class="pub-title">{@html p.titleHtml}</span>
            {/if}
            <p class="pub-authors">
              {#each authorParts(p) as a, i}{#if i > 0}{a.note || authorParts(p)[i - 1].note ? ' ' : ', '}{/if}{#if a.me}<strong>{a.text}</strong>{:else if a.note}<span class="muted">{a.text}</span>{:else}{a.text}{/if}{/each}{#if p.collaboration}<span class="muted">, {p.collaboration}</span>{/if}
            </p>
            <p class="pub-meta">
              <span class="pub-venue">{p.venue}</span>
              {#if p.kind !== 'Journal article'}<span class="tag">{p.kind}</span>{/if}
              {#if p.firstAuthor}<span class="tag tag-first">First author</span>{/if}
              {#if p.arxiv}<a href={p.arxiv}>arXiv</a>{/if}
            </p>
          </li>
        {/each}
      </ol>
    </section>
  {:else}
    <p class="muted">Nothing matches that combination.</p>
  {/each}
</div>
