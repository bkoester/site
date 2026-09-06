// Latest eval run, if one has been copied into src/data/ (the ask-ben repo writes
// evals/history/<date>-<sha>.json; the newest is copied here at site build time).
type EvalRun = { run_at: string; pass_rate: number; refusal_accuracy: number; cost_per_query_usd: number; p50_latency_ms: number | null; by_category: Record<string, { pass: number; total: number }>; failure_taxonomy: Record<string, number> };
const mods = import.meta.glob<{ default: EvalRun }>('/src/data/eval-*.json', { eager: true });
const runs = Object.values(mods).map((m) => m.default).sort((a, b) => (a.run_at < b.run_at ? 1 : -1));
export const evalLatest: EvalRun | null = runs[0] ?? null;
export const evalHistory: EvalRun[] = runs;
