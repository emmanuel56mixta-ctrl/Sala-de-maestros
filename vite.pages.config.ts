import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const base = '/Sala-de-maestros/';
const advisorOrigin = 'https://ascenso-docente-laboratorio.mandrakker.chatgpt.site';
const advisor = `${advisorOrigin}/asesor`;

// Only the public Pages build rewrites application URLs. The Worker keeps its
// original routes and remains responsible for identity, access and saved progress.
function publicPaths(): Plugin {
  return {
    name: 'sala-pages-paths',
    enforce: 'pre',
    transform(code, id) {
      if (!id.startsWith(root) || id.includes('/node_modules/') || id.includes('/pages-static/') || !/\.[jt]sx?(?:\?|$)/.test(id)) return;
      return code
        .replace(/(["'`])\/signin-with-chatgpt(?=[?"'`])/g, `$1${advisorOrigin}/signin-with-chatgpt`)
        .replace(/(["'`])\/asesor(?=[/?"'`])/g, `$1${advisor}`)
        .replace(/(["'`])\/(?=assets\/|fonts\/|cursos(?:[/?"'`]))/g, `$1${base}`)
        .replace(/(["'`])\/\1/g, `$1${base}$1`);
    },
  };
}

export default defineConfig({
  root,
  base,
  plugins: [publicPaths(), react()],
  resolve: { alias: { '@': root } },
  publicDir: 'public',
  build: {
    outDir: '.pages-build',
    emptyOutDir: true,
    assetsDir: 'pages-assets',
    rollupOptions: { input: 'pages-static/index.html' },
  },
});
