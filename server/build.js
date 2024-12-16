import { build } from 'esbuild';
import { clean } from 'esbuild-plugin-clean';

const executeBuild = async () => {
	try {
		await build({
			entryPoints: ['./src/index.js'],
			bundle: true,
			minify: true,
			sourcemap: true,
			platform: 'node',
			target: 'es2020',
			outfile: '../dist/index.js',
			plugins: [
				clean({
					patterns: ['../dist/index.js*'],
					verbose: true,
					options: {
						force: true,
					}
				}),
			],
		});
		console.log('esbuild finished! ⚡');
	} catch (error) {
		console.error(`Build error caught!`);
	}
};

(async () => {
	await executeBuild();
})();
