import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const sourcePath = path.join(root, 'lib/course-orientation.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const output = path.join(root, 'work/test/orientation');
fs.mkdirSync(output, { recursive: true });

async function loadModule(code, name) {
  const filename = path.join(output, `${name}.mjs`);
  fs.writeFileSync(filename, ts.transpileModule(code, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText);
  return import(pathToFileURL(filename).href);
}

const orientation = await loadModule(source, 'worker');
// Transpile the actual build config for every supported Node version, retaining
// its original import.meta.url so the transform still targets the repository.
const configPath = path.join(root, 'vite.pages.config.ts');
const configSource = fs.readFileSync(configPath, 'utf8')
  .replaceAll('import.meta.url', JSON.stringify(pathToFileURL(configPath).href));
const { default: pagesConfig } = await loadModule(configSource, 'pages-config');
const pathsPlugin = pagesConfig.plugins.flat(Infinity).find(plugin => plugin?.name === 'sala-pages-paths');
assert.equal(typeof pathsPlugin?.transform, 'function', 'The public build must expose its real URL transform.');
const publicSource = pathsPlugin.transform(source, sourcePath);
assert.equal(typeof publicSource, 'string');
const publicOrientation = await loadModule(publicSource, 'pages');
const slug = 'subdireccion-secundaria';
const advisorOrigin = 'https://ascenso-docente-laboratorio.mandrakker.chatgpt.site';
const hub = fs.readFileSync(path.join(root, 'app/course-hub.tsx'), 'utf8');
const allowedSections = new Set(['inicio', 'ruta', 'practica', 'simulacion']);

for (const { value: goal } of orientation.studyGoals) {
  for (const { value: time } of orientation.studyTimes) {
    for (const hasAccess of [false, true]) {
      const worker = orientation.recommendStart(goal, time, slug, hasAccess);
      const pages = publicOrientation.recommendStart(goal, time, slug, hasAccess);
      assert.ok(worker.title && worker.reason && worker.label && worker.note);
      assert.ok(worker.steps.length > 0 && worker.steps.every(step => typeof step === 'string' && step.length));
      assert.deepEqual({ ...pages, href: worker.href }, worker, 'Public URL rewriting must not alter the recommendation.');

      if (goal === 'organizar') {
        assert.equal(worker.href, '#hub-route-title');
        assert.equal(pages.href, worker.href);
        assert.ok(hub.includes('id="hub-route-title"'), 'The recommendation anchor must exist in the course hub.');
      } else if (!hasAccess) {
        const url = new URL(worker.href, 'https://worker.example');
        assert.equal(url.pathname, `/cursos/${slug}/leccion-gratuita`, 'Visitors must remain within the real free lesson.');
        assert.equal(url.searchParams.get('paso'), goal === 'aplicar' ? 'aplica' : 'comprende');
        assert.deepEqual([...url.searchParams.keys()], ['paso']);
        assert.equal(pages.href, `/Sala-de-maestros${worker.href}`, 'Static links need the repository prefix and must preserve the stage query.');
      } else {
        const url = new URL(worker.href, 'https://worker.example');
        assert.equal(url.pathname, '/asesor');
        assert.ok(allowedSections.has(url.searchParams.get('seccion')), 'The advisor must understand the requested section.');
        assert.ok([...url.searchParams.keys()].every(key => ['seccion', 'leccion'].includes(key)));
        if (url.searchParams.has('leccion')) {
          assert.equal(url.searchParams.get('seccion'), 'ruta');
          assert.equal(url.searchParams.get('leccion'), 'd1');
        }
        assert.equal(pages.href, `${advisorOrigin}${worker.href}`, 'Pages cannot serve the authenticated advisor locally.');
      }
    }
  }
  for (const hasAccess of [false, true]) {
    const brief = orientation.recommendStart(goal, 'breve', slug, hasAccess);
    const full = orientation.recommendStart(goal, 'completa', slug, hasAccess);
    assert.notDeepEqual(brief.steps, full.steps, 'Available time must change the proposed activity, not just its label.');
    assert.ok(brief.steps.length < full.steps.length, 'The brief plan should ask for fewer actions.');
  }
}
assert.equal(new Set(orientation.studyGoals.map(({ value }) => orientation.recommendStart(value, 'breve', slug, false).href)).size, 3,
  'Each purpose should lead to its corresponding entry point.');

// Follow local runtime imports from the new public component. Type-only imports
// are safe; importing the full lesson or question modules as values is not.
const visited = new Set();
function checkPublicImports(filename) {
  if (visited.has(filename)) return;
  visited.add(filename);
  const relative = path.relative(root, filename).split(path.sep).join('/');
  assert.ok(!/^lib\/(?:course\.ts|content\.ts|learning\.ts|subdirection-questions\.ts|legacy-questions\.ts|revised-questions\.ts|bank-builder\.ts|bank\/)/.test(relative),
    `Public orientation must not import protected curriculum: ${relative}`);
  const ast = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const item of ast.statements) {
    if (!ts.isImportDeclaration(item) && !ts.isExportDeclaration(item)) continue;
    if (!item.moduleSpecifier || !ts.isStringLiteral(item.moduleSpecifier)) continue;
    if (item.isTypeOnly || item.importClause?.isTypeOnly) continue;
    const bindings = item.importClause?.namedBindings;
    if (!item.importClause?.name && bindings && ts.isNamedImports(bindings) && bindings.elements.every(binding => binding.isTypeOnly)) continue;
    const specifier = item.moduleSpecifier.text;
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) continue;
    const base = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
    const target = [base, `${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
      .find(candidate => /\.[jt]sx?$/.test(candidate) && fs.existsSync(candidate));
    if (target) checkPublicImports(target);
  }
}
checkPublicImports(path.join(root, 'app/course-start.tsx'));

if (process.argv.includes('--pages-build')) {
  const build = path.join(root, '.pages-build');
  const available = fs.readFileSync(path.join(build, 'cursos', slug, 'index.html'), 'utf8');
  assert.ok(available.includes('id="course-start-title"'), 'The available course must render the orientation before JavaScript.');
  assert.ok(available.includes(`href="/Sala-de-maestros/cursos/${slug}/leccion-gratuita"`), 'The direct exploration shortcut must work in prerendered HTML.');
  for (const upcoming of ['promocion-vertical-primaria', 'habilidades-digitales', 'inteligencia-artificial-docencia']) {
    const html = fs.readFileSync(path.join(build, 'cursos', upcoming, 'index.html'), 'utf8');
    assert.ok(!html.includes('id="course-start-title"'), `An upcoming course must not offer an active learning orientation: ${upcoming}`);
    assert.ok(!fs.existsSync(path.join(build, 'cursos', upcoming, 'leccion-gratuita', 'index.html')));
  }
  assert.ok(fs.existsSync(path.join(build, 'cursos', slug, 'leccion-gratuita', 'index.html')));
  console.log('PASS: prerendered orientation, direct free-lesson shortcut, and unavailable-course gating in the Pages build.');
}

console.log('PASS: all goal/time/access combinations, distinct entry points, shorter brief plans, real Pages URL transformation, advisor query contract, and public import boundary.');
