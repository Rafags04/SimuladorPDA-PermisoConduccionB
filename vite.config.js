import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';

function injectServiceWorkerManifest() {
  return {
    name: 'inject-sw-manifest',
    apply: 'build',
    writeBundle(options, bundle) {
      const outDir = options.dir || 'dist';
      const swPath = path.join(outDir, 'sw.js');
      if (!fs.existsSync(swPath)) return;

      const coreAssets = Object.keys(bundle)
        .filter((file) => file.startsWith('assets/') && (file.endsWith('.js') || file.endsWith('.css')))
        .filter((file) => !file.includes('html2canvas') && !file.includes('purify'))
        .map((file) => `  ,'./${file}'`)
        .join('\n');

      const version = `permiso-b-v0.6.0-${Date.now().toString(36)}`;
      let swContent = fs.readFileSync(swPath, 'utf8');
      swContent = swContent
        .replace('__SW_CACHE_VERSION__', version)
        .replace('  /* __SW_EXTRA_ASSETS__ */', coreAssets);
      fs.writeFileSync(swPath, swContent, 'utf8');
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [injectServiceWorkerManifest()]
});
