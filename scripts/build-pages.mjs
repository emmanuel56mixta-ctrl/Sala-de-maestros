import { build } from 'vite';
import { mkdir, readFile, writeFile, cp, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
process.chdir(root);
const output = path.join(root, '.pages-build');
const serverOutput = path.join(root, '.pages-ssr');
const configFile = path.join(root, 'vite.pages.config.ts');
const base = '/Sala-de-maestros/';

await import('../pages-static/generate-public-data.mjs');
await rm(output, { recursive: true, force: true });
await build({ configFile });
await build({
  configFile,
  publicDir: false,
  build: {
    ssr: 'pages-static/prerender.tsx',
    outDir: serverOutput,
    emptyOutDir: true,
    rollupOptions: { input: 'pages-static/prerender.tsx', output: { entryFileNames: 'prerender.mjs' } },
  },
});
const { render, routes } = await import(pathToFileURL(path.join(serverOutput, 'prerender.mjs')).href);
const template = await readFile(path.join(output, 'pages-static/index.html'), 'utf8');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
for (const route of [...routes, { path: '/404', title: 'Página no encontrada · Sala de Maestros' }]) {
  const html = template
    .replace('<title>Sala de Maestros · NEMC</title>', `<title>${escape(route.title)}</title>`)
    .replace('<!--app-html-->', render(route.path));
  const relative = route.path === '/404' ? '404.html' : path.join(route.path.slice(1), 'index.html');
  await mkdir(path.dirname(path.join(output, relative)), { recursive: true });
  await writeFile(path.join(output, relative), html);
}
await rm(path.join(output, 'pages-static'), { recursive: true, force: true });
await writeFile(path.join(output, '.nojekyll'), '');
await writeFile(path.join(output, 'robots.txt'), `User-agent: *\nAllow: ${base}\n`);

if (process.argv.includes('--publish')) {
  // Copy only compiled public files to the branch root used by GitHub Pages.
  // Application source, private configuration and the database are never copied.
  const entries = await readdir(output);
  // This directory contains only hashed bundles produced by this command.
  await rm(path.join(root, 'pages-assets'), { recursive: true, force: true });
  for (const name of entries) {
    await cp(path.join(output, name), path.join(root, name), { recursive: true });
  }
  console.log(`Published ${routes.length} routes to the repository root. Commit the output to deploy.`);
} else {
  console.log(`Built ${routes.length} public routes in ${output}.`);
}
await rm(serverOutput, { recursive: true, force: true });
