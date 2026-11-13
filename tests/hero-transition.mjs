import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'work/test/hero-transition');
const compilerOptions = { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX };
fs.mkdirSync(output, { recursive: true });
const configPath = path.join(root, 'vite.pages.config.ts');
const configSource = fs.readFileSync(configPath, 'utf8').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(configPath).href));
const configOutput = path.join(output, 'pages-config.mjs');
fs.writeFileSync(configOutput, ts.transpileModule(configSource, { compilerOptions }).outputText);
const { default: pagesConfig } = await import(pathToFileURL(configOutput).href);
const pathsPlugin = pagesConfig.plugins.flat(Infinity).find(plugin => plugin?.name === 'sala-pages-paths');
assert.equal(typeof pathsPlugin?.transform, 'function');
const compiled = new Map();
function compile(relative, mode) {
  const key = `${mode}:${relative}`;
  if (compiled.has(key)) return compiled.get(key);
  const filename = path.join(root, relative);
  const destination = path.join(output, mode, relative.replace(/\.tsx?$/, '.mjs'));
  compiled.set(key, destination);
  let source = fs.readFileSync(filename, 'utf8');
  if (mode === 'pages') source = pathsPlugin.transform(source, filename) ?? source;
  assert.equal(typeof source, 'string');
  let code = ts.transpileModule(source, { compilerOptions }).outputText;
  // Keep the real component graph; only browser stylesheet side effects are omitted.
  code = code.replace(/^\s*import\s+["'][^"']+\.css["'];?\s*$/gm, '');
  code = code.replace(/(\bfrom\s*["'])([^"']+)(["'])/g, (all, before, specifier, after) => {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return all;
    const candidate = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
    const dependency = [`${candidate}.ts`, `${candidate}.tsx`, candidate].find(name => fs.existsSync(name) && fs.statSync(name).isFile());
    assert.ok(dependency, `Cannot resolve ${specifier} from ${relative}`);
    return `${before}${pathToFileURL(compile(path.relative(root, dependency), mode)).href}${after}`;
  });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, code);
  return destination;
}
const load = (relative, mode) => import(pathToFileURL(compile(relative, mode)).href);
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match => attrs(match[0]));
const hasClass = (node, name) => node.class?.split(/\s+/).includes(name);
const expected = [
  { slug: 'promocion-docente', file: 'docente-hombre-v2.png', width: 937, height: 1678, side: 'left', name: 'teacher-promotion' },
  { slug: 'herramientas-digitales', file: 'docente-mujer-v2.png', width: 939, height: 1674, side: 'right', name: 'teacher-digital' },
];

// Check only the shared-element identity contract, not timings or decorative CSS.
// Actual viewport placement and interpolation remain browser checks.
const transitionCss = fs.readFileSync(path.join(root, 'app/course-transitions.css'), 'utf8');
const homeNames = new Map([...transitionCss.matchAll(/\.hero-person-(\d+)\s+img\s*\{([^}]+)\}/g)].map(match => [Number(match[1]), match[2].match(/view-transition-name\s*:\s*([\w-]+)/)?.[1]]));
assert.deepEqual(expected.map((_, index) => homeNames.get(index)), expected.map(item => item.name), 'Each home portrait must match its own destination snapshot, never the other teacher.');
assert.equal(new Set(homeNames.values()).size, homeNames.size, 'Home snapshots must have unique names.');

function verifyImage(image, item, prefix) {
  assert.equal(image.src, `${prefix}/assets/identity/${item.file}`, 'A category must preserve the exact transparent home portrait.');
  assert.equal(Number(image.width), item.width);
  assert.equal(Number(image.height), item.height, 'Intrinsic dimensions must preserve the original aspect ratio before images load.');
  assert.ok(fs.existsSync(path.join(root, 'public/assets/identity', item.file)));
}

function verifyHome(html, prefix) {
  const links = tags(html, 'a').filter(a => hasClass(a, 'hero-course-link'));
  assert.deepEqual(links.map(link => link.href), expected.map(item => `${prefix}/cursos/${item.slug}/`), 'Both choices must be ordinary, deployment-correct directory links in SSR.');
  for (const link of links) assert.ok(!link.role && !link.target && !link.download, 'Category choices retain default same-window anchor semantics.');
  // A <picture> may offer lighter WebP sources; the <img> fallback keeps the original PNG contract.
  const containers = [...html.matchAll(/<div\b[^>]*class="[^"]*\bhero-person-\d+\b[^"]*"[^>]*>\s*(?:<picture>\s*(?:<source\b[^>]*>\s*)*)?(<img\b[^>]*>)/g)];
  assert.equal(containers.length, 2);
  for (const [index, container] of containers.entries()) {
    assert.ok(hasClass(attrs(container[0].slice(0, container[0].indexOf('>') + 1)), `hero-person-${index}`));
    verifyImage(attrs(container[1]), expected[index], prefix);
  }
  const fallback = tags(html, 'a').find(link => hasClass(link, 'hero-all-courses'));
  assert.equal(fallback?.href, `${prefix}/cursos/`, 'The all-courses fallback must exist without hydration or a transition.');
}

function verifyCategory(html, item, prefix) {
  const hero = tags(html, 'section').find(section => hasClass(section, 'course-section-hero'));
  assert.ok(hero, 'Direct SSR must render the selected teacher and context panel.');
  assert.equal(hero['data-portrait-side'], item.side, 'Promotion stays on the left and digital tools on the right.');
  assert.ok(!Object.hasOwn(hero, 'hidden') && !Object.hasOwn(hero, 'inert') && hero['aria-hidden'] !== 'true');
  const portraits = tags(html, 'img').filter(img => hasClass(img, 'course-section-portrait-image'));
  assert.equal(portraits.length, 1, 'Only the chosen teacher appears in the destination hero.');
  const portrait = portraits[0];
  verifyImage(portrait, item, prefix);
  assert.equal(portrait.loading, 'eager', 'The arriving snapshot cannot depend on a lazy image entering the viewport.');
  assert.equal(portrait['data-course-portrait'], item.name);
  const namedElements = [...html.matchAll(/<[^!][^>]*\bstyle="([^"]*view-transition-name\s*:[^"]+)"[^>]*>/g)]
    .map(match => match[1].match(/view-transition-name\s*:\s*([\w-]+)/)?.[1]);
  assert.deepEqual(namedElements, [item.name], 'Exactly one destination element owns the shared portrait snapshot.');
  const headings = tags(html, 'h1');
  assert.equal(headings.length, 1, 'The category has one primary heading before hydration.');
  assert.equal(hero['aria-labelledby'], headings[0].id);
  assert.ok(tags(html, 'div').some(node => hasClass(node, 'course-section-context')));
  const entry = tags(html, 'a').find(link => hasClass(link, 'course-section-enter'));
  assert.equal(entry?.href, '#section-courses');
  assert.ok(tags(html, 'div').some(node => node.id === 'section-courses'), 'The hero CTA must reach actual catalog content without JavaScript.');
  assert.equal(tags(html, 'article').filter(node => hasClass(node, 'catalog-course')).length, 2);
}

// SSR cannot expose React handlers. Inspect real JSX/AST to prevent restoring
// a deferred overlay/navigation path behind otherwise valid anchors.
const heroPath = path.join(root, 'app/depth-hero.tsx');
const ast = ts.createSourceFile(heroPath, fs.readFileSync(heroPath, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let nativeChoices = 0;
function inspect(node) {
  if ((ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) && node.tagName.getText(ast) === 'a') {
    const attributes = node.attributes.properties.filter(ts.isJsxAttribute);
    const choice = attributes.find(attribute => attribute.name.getText(ast) === 'className' && attribute.initializer && ts.isStringLiteral(attribute.initializer) && attribute.initializer.text.split(/\s+/).includes('hero-course-link'));
    if (choice) {
      nativeChoices += 1;
      assert.ok(!attributes.some(attribute => /^on(?:Click|PointerDown|MouseDown)$/.test(attribute.name.getText(ast))), 'Category navigation must not depend on a React activation handler.');
    }
  }
  if (ts.isCallExpression(node)) {
    const callee = node.expression.getText(ast);
    assert.ok(!/(?:^|\.)(?:setTimeout|setInterval|preventDefault|cloneNode)$/.test(callee), `Hero navigation may not be delayed or replaced: ${callee}`);
    assert.ok(!/(?:^|\.)location\.(?:assign|replace)$/.test(callee), 'The browser must follow the native anchor.');
    assert.notEqual(callee, 'document.createElement', 'The hero must not construct a blocking transition overlay.');
  }
  ts.forEachChild(node, inspect);
}
inspect(ast);
assert.equal(nativeChoices, 2);

for (const mode of ['worker', 'pages']) {
  const prefix = mode === 'pages' ? '/Sala-de-maestros' : '';
  const { default: DepthHero } = await load('app/depth-hero.tsx', mode);
  const { default: CatalogPage } = await load('app/catalog-page.tsx', mode);
  const { courseSections } = await load('lib/course-sections.ts', mode);
  verifyHome(renderToStaticMarkup(createElement(DepthHero)), prefix);
  for (const item of expected) {
    const section = courseSections.find(section => section.slug === item.slug);
    assert.ok(section);
    verifyCategory(renderToStaticMarkup(createElement(CatalogPage, { section })), item, prefix);
  }
  const fullCatalog = renderToStaticMarkup(createElement(CatalogPage));
  assert.equal(tags(fullCatalog, 'img').filter(img => hasClass(img, 'course-section-portrait-image')).length, 0, 'The full catalog must not inherit either selected category identity.');
  assert.equal(tags(fullCatalog, 'article').filter(node => hasClass(node, 'catalog-course')).length, 4);
}

if (process.argv.includes('--pages-build')) {
  const build = path.join(root, '.pages-build');
  const home = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
  verifyHome(home, '/Sala-de-maestros');
  for (const item of expected) {
    const html = fs.readFileSync(path.join(build, 'cursos', item.slug, 'index.html'), 'utf8');
    verifyCategory(html, item, '/Sala-de-maestros');
    assert.ok(fs.existsSync(path.join(build, 'assets/identity', item.file)), 'The selected image must be included in the static publication.');
  }
  console.log('PASS: prerendered home/category continuity, direct directory routes, complete category content and published portrait assets.');
}
console.log('PASS: native home choices, exact selected portraits/aspect ratios/sides, unique shared names, SSR content and real Worker/Pages URL transformation.');
