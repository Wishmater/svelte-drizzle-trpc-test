import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { visualizer } from 'rollup-plugin-visualizer';
import { kitRoutes } from 'vite-plugin-kit-routes';

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		kitRoutes(),
		visualizer({
			emitFile: true,
			filename: 'stats.html'
		})
	]
});
