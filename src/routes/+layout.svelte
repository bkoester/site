<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { site } from '$lib/site';
  import { PUBLIC_INDEXABLE } from '$env/static/public';

  let { children } = $props();

  const nav = [
    { href: '/', label: 'Home' },
    { href: '/writing', label: 'Writing' },
    { href: '/projects', label: 'Projects' },
    { href: '/ask', label: 'Ask' },
    { href: '/about', label: 'About' }
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

<div class="shell">
  <header class="site-header">
    <div>
      <a class="brand" href="/">{site.name}</a>
      <span class="brand-sub">{site.tagline}</span>
    </div>
    <nav class="site-nav" aria-label="Site">
      {#each nav as item}
        <a href={item.href} class:active={isActive(item.href)} aria-current={isActive(item.href) ? 'page' : undefined}>{item.label}</a>
      {/each}
    </nav>
  </header>

  <main>
    {@render children()}
  </main>

  <footer class="site-footer">
    <a href="mailto:{site.email}">{site.email}</a>
    <a href={site.github} rel="me">github.com/bkoester</a>
    <a href={site.linkedin} rel="me">LinkedIn</a>
    <span>© {new Date().getFullYear()} {site.name}</span>
  </footer>
</div>
