<script lang="ts">
  // Live strip: bot awake/asleep from the API's /health (client-side), eval numbers from the
  // committed evals data if present. Renders nothing it cannot back with a real value.
  import { onMount } from 'svelte';
  import { PUBLIC_ASK_API } from '$env/static/public';
  import { evalLatest } from '$lib/evalstats';

  type Bot = 'unknown' | 'awake' | 'asleep' | 'offline';
  let bot: Bot = $state('unknown');
  const api = PUBLIC_ASK_API?.replace(/\/$/, '') ?? '';

  onMount(async () => {
    if (!api) return;
    try {
      const r = await fetch(`${api}/health`, { cache: 'no-store' });
      if (r.ok) { const d = await r.json(); bot = d.enabled ? 'awake' : 'offline'; }
      else bot = 'asleep';
    } catch { bot = 'asleep'; }
  });
</script>

{#if api || evalLatest}
  <div class="status" aria-label="Site status">
    {#if bot === 'awake'}<span><span class="status-dot ok"></span>bot awake · sleeps 23:30–07:00 ET</span>
    {:else if bot === 'asleep'}<span><span class="status-dot off"></span>bot asleep · back at 07:00 ET</span>
    {:else if bot === 'offline'}<span><span class="status-dot off"></span>bot offline for today</span>
    {/if}
    {#if evalLatest}
      <span>eval pass rate <span class="num">{Math.round(evalLatest.pass_rate * 100)}%</span></span>
      <span>cost per answer <span class="num">${evalLatest.cost_per_query_usd.toFixed(3)}</span></span>
      <span>last run <span class="num">{evalLatest.run_at.slice(0, 10)}</span></span>
    {/if}
    <span class="push"><a href="/writing/evaluating-this-bot">how this is measured →</a></span>
  </div>
{/if}
