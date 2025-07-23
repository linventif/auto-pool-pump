import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
	plugins: [solid()],
	server: {
		port: 4001,
		host: true,
		allowedHosts: ['localhost', '127.0.0.1', 'iot.linv.dev'],
		cors: true,
		proxy: {
			// Optionnel: proxy pour contourner les problèmes CORS en développement
			'/api': {
				target: 'https://iot.linv.dev',
				changeOrigin: true,
				secure: true,
			},
		},
	},
	build: {
		target: 'esnext',
	},
});
