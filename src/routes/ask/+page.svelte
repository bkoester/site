<script lang="ts">
  import { site } from '$lib/site';
  import AskWidget from '$lib/components/AskWidget.svelte';
</script>

<svelte:head>
  <title>Ask · {site.name}</title>
  <meta name="description" content="Ask questions about Ben Koester's writing and projects. Answers cite their sources; the evaluation results are public." />
</svelte:head>

<h1>Ask</h1>
<p style="margin-bottom:1.25rem">A small retrieval bot over the writing on this site. It answers in the third person, cites the piece each claim comes from, and says so when it has nothing from Ben on a topic.</p>

<AskWidget />
