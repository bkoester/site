import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [mdsvex({ extensions: ['.md'] })],
  kit: {
    // Fully prerendered static site for Cloudflare Pages. No fallback:
    // every route is a real HTML file, which is what a public site wants.
    adapter: adapter({ pages: 'build', assets: 'build', strict: true }),
    prerender: { handleHttpError: 'warn' }
  }
};

export default config;
