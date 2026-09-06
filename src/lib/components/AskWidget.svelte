<script lang="ts">
  // States per DESIGN.md §4: ready · thinking · answered · declined · asleep · limited · unavailable.
  import { PUBLIC_ASK_API } from '$env/static/public';

  type Citation = { slug: string; title: string; url: string };
  type Turn = { q: string; a: string; outcome: 'answered' | 'declined'; citations: Citation[] };
  type State = 'ready' | 'thinking' | 'asleep' | 'limited' | 'unavailable' | 'error';

  const api = PUBLIC_ASK_API?.replace(/\/$/, '') ?? '';
  let status: State = $state(api ? 'ready' : 'unavailable');
  let question = $state('');
  let turns: Turn[] = $state([]);
  let sessionId: string = $state('');

  async function ask(e: SubmitEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || status === 'thinking' || !api) return;
    status = 'thinking';
    try {
      const res = await fetch(`${api}/ask`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ question: q, session_id: sessionId || undefined, history: turns.slice(-2) })
      });
      if (res.status === 429) { status = 'limited'; return; }
      if (res.status === 503) { status = 'asleep'; return; }
      if (!res.ok) { status = 'error'; return; }
      const data = await res.json();
      sessionId = data.session_id ?? sessionId;
      turns = [...turns, { q, a: data.answer, outcome: data.outcome, citations: data.citations ?? [] }];
      question = '';
      status = 'ready';
    } catch {
      status = 'asleep';
    }
  }
  function clear() { turns = []; sessionId = ''; status = api ? 'ready' : 'unavailable'; }
</script>

<div class="ask">
  <p class="muted" style="font-size:0.85rem">
    Answers about Ben's writing and projects, with sources. Doesn't do opinions or personal questions.
  </p>

  <div class="transcript" aria-live="polite">
    {#each turns as t}
      <div class="turn">
        <p class="label">You</p>
        <p>{t.q}</p>
        <p class="label">Answer</p>
        {#if t.outcome === 'declined'}
          <p class="muted">{t.a}</p>
        {:else}
          <p>{t.a}</p>
          {#if t.citations.length}
            <p class="cites">
              {#each t.citations as c}<a class="chip" href={c.url}>{c.title}</a>{/each}
            </p>
          {/if}
        {/if}
      </div>
    {/each}
    {#if status === 'thinking'}<p class="cursor" aria-label="Thinking">▌</p>{/if}
  </div>

  {#if status === 'unavailable'}
    <p class="notice">The bot isn't wired up yet. The rest of the site works.</p>
  {:else if status === 'asleep'}
    <p class="notice">Ben's host sleeps 23:30–07:00 ET. Back at 7. <a href="/projects">Why it sleeps →</a></p>
  {:else if status === 'limited'}
    <p class="notice">That's enough for now; try again in a few minutes.</p>
  {:else if status === 'error'}
    <p class="notice">Something went wrong on the bot's side. <button class="link" onclick={() => (status = 'ready')}>Try again</button></p>
  {/if}

  <form onsubmit={ask}>
    <input
      type="text"
      bind:value={question}
      placeholder="What does Ben think about LLM-as-judge?"
      maxlength="300"
      disabled={status !== 'ready' && status !== 'error'}
      aria-label="Your question"
    />
    <button type="submit" disabled={status !== 'ready' || !question.trim()}>Ask</button>
    {#if turns.length}<button type="button" class="link" onclick={clear}>clear</button>{/if}
  </form>
  <p class="muted" style="font-size:0.75rem;margin-top:0.5rem">Two turns of memory. Questions are logged without identifying you. <a href="/writing/evaluating-this-bot">How it's evaluated →</a></p>
</div>

<style>
  .ask { border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; background: var(--panel); }
  .transcript { margin: 1rem 0; }
  .turn { padding: 0.75rem 0; border-top: 1px solid var(--border); }
  .turn p { margin-bottom: 0.4rem; }
  .cites { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  .chip { font-size: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.15rem 0.5rem; color: var(--cyan); }
  .cursor { color: var(--green); animation: blink 1s steps(1) infinite; }
  @keyframes blink { 50% { opacity: 0; } }
  .notice { color: var(--muted); font-size: 0.85rem; margin-bottom: 0.75rem; }
  form { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
  input { flex: 1; min-width: 220px; font-family: inherit; background: var(--bg); color: var(--text); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 0.55rem 0.75rem; font-size: 0.9rem; }
  input:focus { border-color: var(--green); outline: none; }
  button[type='submit'] { font-family: inherit; background: var(--green); color: var(--bg); border: none; border-radius: var(--radius-sm); padding: 0.55rem 1rem; font-weight: 600; cursor: pointer; }
  button[type='submit']:disabled { opacity: 0.5; cursor: not-allowed; }
  .link { background: none; border: none; color: var(--cyan); font-family: inherit; font-size: 0.8rem; cursor: pointer; padding: 0; }
  @media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
</style>
