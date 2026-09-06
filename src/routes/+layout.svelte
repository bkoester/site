<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { site } from '$lib/site';
  import { PUBLIC_INDEXABLE } from '$env/static/public';
  import StatusStrip from '$lib/components/StatusStrip.svelte';

  let { children } = $props();

  const nav = [
    { href: '/', label: 'home' },
    { href: '/writing', label: 'writing' },
    { href: '/projects', label: 'projects' },
    { href: '/ask', label: 'ask' },
    { href: '/about', label: 'about' }
  ];
  const isActive = (href: string) =>
    href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  const indexable = PUBLIC_INDEXABLE === 'true';
</script>

<svelte:head>
  {#if !indexable}<meta name="robots" content="noindex, nofollow" />{/if}
  <meta property="og:site_name" content={site.name} />
  <meta property="og:type" content="website" />
</svelte:head>

<a class="skip" href="#main">Skip to content</a>
<div class="shell">
  <StatusStrip />
  <header class="site-header">
    <a class="brand" href="/" aria-label="Ben Koester, home">bk</a>
    <nav class="site-nav" aria-label="Site">
      {#each nav as item}
        <a href={item.href} class:active={isActive(item.href)} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</a>
      {/each}
    </nav>
  </header>

  <main id="main">
    {@render children()}
  </main>

  <footer class="site-footer">
    <a href="mailto:{site.email}">{site.email}</a>
    <a href={site.github} rel="me">github.com/bkoester</a>
    <a href={site.linkedin} rel="me">LinkedIn</a>
    <a href="/rss.xml">RSS</a>
    <span>© {new Date().getFullYear()} {site.name}</span>
  </footer>
</div>
