import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	server: {
		proxy: {
			'/ookla': 'http://localhost:5000',
			'/iperf': 'http://localhost:5000',
		},
	},
	build: {
		outDir: '../dist/client' 
	},
	plugins: [
		react(),
		svgrPlugin({
			svgrOptions: {
				icon: true,
			},
		}),
	],
});
