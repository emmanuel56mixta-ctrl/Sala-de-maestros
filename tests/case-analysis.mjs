import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'work/test/case-analysis');
const compilerOptions = { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX };
fs.mkdirSync(output, { recursive: true });

async function loadCode(source, name) {
  const filename = path.join(output, name + '.mjs');
  fs.writeFileSync(filename, ts.transpileModule(source, { compilerOptions }).outputText);
  return import(pathToFileURL(filename).href);
}

const sourcePath = path.join(root, 'lib/case-analysis.ts');
const source = fs.readFileSync(sourcePath, 'utf8');
const { firstCase, analysisForAnswer } = await loadCode(source, 'case-data');
const originalCase = structuredClone(firstCase);
const originalLesson = JSON.parse(fs.readFileSync(path.join(root, 'pages-static/public-data.json'), 'utf8')).freeLesson;
assert.equal(originalLesson.id, 'd1');
assert.equal(firstCase.check.correct, 1, 'B remains the correct answer for the public case.');
assert.equal(firstCase.check.correct, originalLesson.check.correct, 'The expanded public exercise must preserve the first lesson answer key.');
assert.equal(firstCase.check.options.length, 3);
assert.equal(firstCase.check.feedback.length, firstCase.check.options.length, 'Every option requires its own feedback.');
assert.equal(new Set(firstCase.check.options).size, 3);
assert.equal(new Set(firstCase.paragraphs.map(paragraph => paragraph.id)).size, firstCase.paragraphs.length);
assert.ok(firstCase.paragraphs.every(paragraph => paragraph.id && paragraph.text.trim()));

for (const invalid of [null, undefined, NaN, Infinity, -Infinity, -1, 3, 100, 0.5, '1', '', true, false, {}, [], [1]]) {
  assert.equal(analysisForAnswer(invalid), null, 'An unanswered or malformed value cannot reveal a plan: ' + String(invalid));
}

const plans = [0, 1, 2].map(analysisForAnswer);
assert.equal(new Set(plans.map(plan => plan.id)).size, 3, 'A new choice needs a distinct plan identity so the player can reset.');
for (const [choice, plan] of plans.entries()) {
  assert.ok(plan);
  assert.deepEqual(plan.paragraphs, firstCase.paragraphs, 'Review must use the exact case that was answered.');
  assert.deepEqual(plan.source, firstCase.source, 'All routes through the analysis retain the original source.');
  assert.equal(plan.steps.length, 5, 'Every answer gets the complete five-part analysis.');
  assert.equal(new Set(plan.steps.map(step => step.id)).size, plan.steps.length, 'Steps that quote the same paragraph still need separate identities.');
  assert.ok(new Set(plan.steps.map(step => step.paragraphId)).size < plan.steps.length, 'The player must support revisiting the same paragraph.');
  assert.ok(plan.title.trim() && plan.takeaway.trim());
  for (const step of plan.steps) {
    assert.ok(step.id && step.title.trim() && step.explanation.trim());
    const paragraph = plan.paragraphs.find(item => item.id === step.paragraphId);
    assert.ok(paragraph, 'Each signal must identify an existing paragraph: ' + step.paragraphId);
    assert.ok(step.quote.trim(), 'An empty quote cannot locate an evidence range.');
    const first = paragraph.text.indexOf(step.quote);
    assert.ok(first >= 0, 'A highlighted quote must match the original text exactly: ' + step.quote);
    assert.equal(paragraph.text.indexOf(step.quote, first + 1), -1, 'A quote must identify an unambiguous range within its paragraph.');
    assert.equal(paragraph.text.slice(first, first + step.quote.length), step.quote);
  }
  assert.deepEqual(analysisForAnswer(choice), plan, 'Repeating an answer should produce the same editorial analysis.');
}
assert.equal(new Set(plans.map(plan => JSON.stringify(plan.steps.map(step => step.paragraphId + ':' + step.quote)))).size, 3,
  'Answer adaptation must change the evidence sequence, not only the outcome heading.');
for (const plan of plans) {
  assert.ok(plan.steps.some(step => plans.filter(other => other !== plan).every(other =>
    !other.steps.some(candidate => candidate.explanation === step.explanation))),
  'Each choice needs at least one substantive explanation specific to that choice.');
}
assert.deepEqual(firstCase, originalCase, 'Building plans must not alter the case, answer key or feedback.');
assert.equal(new URL(firstCase.source.url).protocol, 'https:');

// Inspect every reachable local runtime dependency. Type-only curriculum imports
// are harmless; their runtime equivalents must never enter the public lesson.
const visited = new Set();
function inspectPublicImports(filename) {
  if (visited.has(filename)) return;
  visited.add(filename);
  const relative = path.relative(root, filename).split(path.sep).join('/');
  assert.ok(!/^lib\/(?:course\.ts|content\.ts|learning\.ts|subdirection-questions\.ts|legacy-questions\.ts|revised-questions\.ts|bank-builder\.ts|bank\/)/.test(relative),
    'Public case analysis must not bundle protected curriculum: ' + relative);
  const ast = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  function inspect(node) {
    let specifier;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
      if (node.isTypeOnly || node.importClause?.isTypeOnly) return;
      const bindings = node.importClause?.namedBindings ?? node.exportClause;
      if (!node.importClause?.name && bindings && (ts.isNamedImports(bindings) || ts.isNamedExports(bindings))
        && bindings.elements.length && bindings.elements.every(binding => binding.isTypeOnly)) return;
      specifier = node.moduleSpecifier;
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword
      || (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
      specifier = node.arguments[0];
    }
    if (specifier && ts.isStringLiteral(specifier)) {
      const value = specifier.text;
      if (value.startsWith('.') || value.startsWith('@/')) {
        const base = value.startsWith('@/') ? path.join(root, value.slice(2)) : path.resolve(path.dirname(filename), value);
        const dependency = [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]
          .find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
        assert.ok(dependency, 'Resolve public local dependency ' + value + ' from ' + relative);
        if (/\.[jt]sx?$/.test(dependency)) inspectPublicImports(dependency);
      }
    }
    ts.forEachChild(node, inspect);
  }
  inspect(ast);
}
inspectPublicImports(sourcePath);
inspectPublicImports(path.join(root, 'app/case-analysis.tsx'));
inspectPublicImports(path.join(root, 'app/cursos/[slug]/course-explorer.tsx'));

// Compile the real component graph for server rendering. CSS has no DOM output;
// all runtime components, data and third-party modules remain the actual ones.
const compiled = new Map();
function compile(relative) {
  if (compiled.has(relative)) return compiled.get(relative);
  const filename = path.join(root, relative);
  const destination = path.join(output, 'components', relative.replace(/\.tsx?$/, '.mjs'));
  compiled.set(relative, destination);
  let code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions }).outputText;
  code = code.replace(/\bimport\s*['"][^'"]+\.css['"];?/g, '');
  code = code.replace(/(\bfrom\s*['"])([^'"]+)(['"])/g, (all, before, specifier, after) => {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return all;
    const candidate = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
    const dependency = [candidate + '.ts', candidate + '.tsx', candidate].find(item => fs.existsSync(item) && fs.statSync(item).isFile());
    assert.ok(dependency, 'Resolve real component dependency ' + specifier);
    return before + pathToFileURL(compile(path.relative(root, dependency))).href + after;
  });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, code);
  return destination;
}
const { default: CaseAnalysis } = await import(pathToFileURL(compile('app/case-analysis.tsx')).href);
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
for (const plan of plans) {
  const html = renderToStaticMarkup(createElement(CaseAnalysis, { plan }));
  const withoutTags = html.replace(/<[^>]+>/g, '');
  for (const paragraph of plan.paragraphs) {
    assert.ok(withoutTags.includes(escapeHtml(paragraph.text)), 'Server output must retain the complete case text independently of animation.');
  }
  assert.ok(html.includes(escapeHtml(plan.source.url)), 'The source stays available in server-rendered output.');
  for (const step of plan.steps) {
    assert.ok(withoutTags.includes(escapeHtml(step.explanation)), 'Every explanation must be available without waiting for animated playback.');
  }
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, 'Shared paragraph references must not produce duplicate DOM IDs.');
}

const configPath = path.join(root, 'vite.pages.config.ts');
const configSource = fs.readFileSync(configPath, 'utf8').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(configPath).href));
const { default: pagesConfig } = await loadCode(configSource, 'pages-config');
const pathsPlugin = pagesConfig.plugins.flat(Infinity).find(plugin => plugin?.name === 'sala-pages-paths');
assert.equal(typeof pathsPlugin?.transform, 'function');
const publicSource = pathsPlugin.transform(source, sourcePath);
const publicAnalysis = await loadCode(publicSource, 'case-data-pages');
for (const selected of [0, 1, 2]) assert.deepEqual(publicAnalysis.analysisForAnswer(selected), analysisForAnswer(selected),
  'Pages URL rewriting must preserve every source quote, answer key and explanation.');

console.log('PASS: B answer key, malformed-answer gating, exact and unique evidence ranges, five distinct steps, meaningful A/B/C adaptation, public import boundary, complete SSR content and unchanged Pages data.');
