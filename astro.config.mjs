import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://thiagogs202.github.io',
  base: '/portifolio',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
