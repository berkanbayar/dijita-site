import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://www.dijitapro.com.tr',
  output: 'hybrid',
  adapter: vercel({
    webAnalytics: { enabled: false }
  }),
  server: { port: 4321 },
  build: { inlineStylesheets: 'auto' }
});
