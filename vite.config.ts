import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { visualizer } from 'rollup-plugin-visualizer';
import { kitRoutes } from 'vite-plugin-kit-routes';
import type { KIT_ROUTES } from '$lib/ROUTES';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		}),
		kitRoutes<KIT_ROUTES>({
			SERVERS: {
				'GET /users/api': {
					explicit_search_params: {
						query: { type: 'string' }
					}
				}
			}
		})
	]
});
