import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

const isPages = !!process.env.PAGES_BASE;

export default defineConfig({
  site: isPages ? 'https://berkanbayar.github.io' : 'https://www.dijitapro.com.tr',
  base: isPages ? process.env.PAGES_BASE : '/',
  output: isPages ? 'static' : 'hybrid',
  adapter: isPages ? undefined : vercel({ webAnalytics: { enabled: false } }),
  server: { port: 4321 },
  build: { inlineStylesheets: 'auto' }
});
