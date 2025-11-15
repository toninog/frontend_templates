import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: process.env.WEB_HOST || '0.0.0.0',
		port: parseInt(process.env.WEB_PORT || '5713'),
		proxy: {
			'/api': {
				target: `http://${process.env.API_HOST || 'localhost'}:${process.env.API_PORT || '8634'}`,
				changeOrigin: true
			}
		}
	},
	build: {
		sourcemap: false,
		rollupOptions: {
			output: {
				manualChunks: {
					'ui-vendor': ['lucide-svelte'],
					'http-vendor': ['axios']
				}
			}
		},
		chunkSizeWarningLimit: 200
	}
});
