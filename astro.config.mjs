import { defineConfig } from 'astro/config';
import { astroImageTools } from "astro-imagetools";
import netlify from '@astrojs/netlify';

export default defineConfig({
    integrations: [astroImageTools],
    output:'static',
    adapter:netlify(),
});