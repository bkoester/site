<!-- Copied verbatim from journal/frontend/src/lib/components/Icon.svelte (canonical). Edit there first, then re-copy. -->
<script lang="ts">
  // Self-contained monochrome line-icon set (Lucide-style paths, inlined so
  // there's no runtime CDN dependency — important for offline EC2 serving).
  // Inherits color from `currentColor` and sizes via the `size` prop.
  // Part of the terminal-data design kit; copied verbatim into big-ten-jobs.
  let { name, size = 18 }: { name: string; size?: number } = $props();

  const paths: Record<string, string> = {
    book: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20',
    'book-open': 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z',
    dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
    calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
    activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
    link: 'M9 17H7A5 5 0 0 1 7 7h2M15 7h2a5 5 0 1 1 0 10h-2M8 12h8',
    bulb: 'M9 18h6M10 22h4M15 14c.2-1 .7-1.7 1.5-2.5C17.5 10.6 18 9.4 18 8A6 6 0 0 0 6 8c0 1.4.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5',
    message: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
    sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6',
    briefcase: 'M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z',
    'external-link': 'M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
    'map-pin': 'M12 21.5s-7-5.5-7-11.5a7 7 0 1 1 14 0c0 6-7 11.5-7 11.5z',
    building: 'M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2',
    x: 'M18 6 6 18M6 6l12 12',
    pencil: 'M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z',
  };
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-hidden="true"
>
  <path d={paths[name] ?? ''} />
</svg>
