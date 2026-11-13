import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'work/test/free-lesson');
const compilerOptions = { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX };
const compiled = new Map();

// Render the production component graph. Only stylesheet side effects are
// omitted; no fake React hooks or copied progress implementation are used.
function compile(relative) {
  if (compiled.has(relative)) return compiled.get(relative);
  const filename = path.join(root, relative);
  const destination = path.join(output, relative.replace(/\.tsx?$/, '.mjs'));
  compiled.set(relative, destination);
  let code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions }).outputText;
  code = code.replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*$/gm, '');
  code = code.replace(/(\bfrom\s*['"])([^'"]+)(['"])/g, (all, before, specifier, after) => {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return all;
    const base = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
    const dependency = [`${base}.ts`, `${base}.tsx`, base].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(dependency, `Resolve ${specifier} from ${relative}`);
    return before + pathToFileURL(compile(path.relative(root, dependency))).href + after;
  });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, code);
  return destination;
}
const load = relative => import(pathToFileURL(compile(relative)).href);
const { emptyAttempt, selectAnswer, submitAnswer, resultForAttempt } = await load('lib/free-lesson-progress.ts');
const { firstCase } = await load('lib/case-analysis.ts');
const { freeLessonContent, transferCase } = await load('lib/free-lesson.ts');
const { courseOfferings } = await load('lib/course-offerings.ts');
const { default: CourseExplorer } = await load('app/cursos/[slug]/course-explorer.tsx');

const fresh = Object.freeze(emptyAttempt());
assert.notEqual(emptyAttempt(), emptyAttempt(), 'Each case needs independent visit state.');
assert.equal(resultForAttempt(fresh, firstCase.check.correct), 'Pendiente de responder');
assert.equal(submitAnswer(fresh), fresh, 'An unanswered case cannot become checked or count as an attempt.');
for (const invalid of [-1, firstCase.check.options.length, 100, .5, NaN, Infinity, -Infinity, '1', null, undefined, true]) {
  assert.equal(selectAnswer(fresh, invalid, firstCase.check.options.length), fresh, `Reject an out-of-range or malformed choice: ${String(invalid)}`);
}

// A first independent success remains a first success when the reader revisits
// its explanation without actually changing the answer.
const chosenCorrect = Object.freeze(selectAnswer(fresh, firstCase.check.correct, firstCase.check.options.length));
assert.equal(chosenCorrect.attempts, 0, 'Selecting alone does not submit an answer.');
assert.equal(chosenCorrect.checked, false);
const firstSuccess = Object.freeze(submitAnswer(chosenCorrect));
assert.equal(firstSuccess.firstAnswer, firstCase.check.correct);
assert.equal(firstSuccess.attempts, 1);
assert.equal(firstSuccess.checked, true);
assert.equal(resultForAttempt(firstSuccess, firstCase.check.correct), 'Correcto en el primer intento');
assert.equal(submitAnswer(firstSuccess), firstSuccess, 'Reopening feedback must not count another attempt.');
assert.equal(selectAnswer(firstSuccess, firstCase.check.correct, firstCase.check.options.length), firstSuccess, 'Selecting the unchanged response must preserve its checked result.');

// Recovering from an error must retain the actual first answer, including A/0,
// and must never be promoted to an independent first-attempt success.
const firstError = Object.freeze(submitAnswer(selectAnswer(fresh, 0, firstCase.check.options.length)));
assert.equal(firstError.firstAnswer, 0);
assert.equal(resultForAttempt(firstError, firstCase.check.correct), 'Por reforzar');
const correction = Object.freeze(selectAnswer(firstError, firstCase.check.correct, firstCase.check.options.length));
assert.equal(correction.checked, false, 'Changing an answer invalidates the displayed result until it is checked.');
assert.equal(correction.attempts, 1);
assert.equal(resultForAttempt(correction, firstCase.check.correct), 'Respuesta cambiada; falta comprobarla');
const supportedSuccess = Object.freeze(submitAnswer(correction));
assert.equal(supportedSuccess.firstAnswer, 0, 'The original A answer must not be lost through a falsy-value fallback.');
assert.equal(supportedSuccess.attempts, 2);
assert.equal(resultForAttempt(supportedSuccess, firstCase.check.correct), 'Correcto después de revisar la explicación');
assert.equal(submitAnswer(supportedSuccess), supportedSuccess);
const laterError = submitAnswer(selectAnswer(supportedSuccess, 2, firstCase.check.options.length));
assert.equal(laterError.firstAnswer, 0);
assert.equal(laterError.attempts, 3);
assert.equal(resultForAttempt(laterError, firstCase.check.correct), 'Por reforzar');
assert.deepEqual(fresh, { selected: null, firstAnswer: null, checked: false, attempts: 0 }, 'Progress operations must not mutate a previous state.');

const cases = [firstCase, transferCase];
assert.equal(new Set(cases.map(item => item.id)).size, 2, 'The transfer exercise must have its own identity.');
assert.notEqual(transferCase.title, firstCase.title);
assert.ok(!transferCase.paragraphs.some(paragraph => firstCase.paragraphs.some(original => original.text === paragraph.text)), 'The transfer task must introduce a genuinely different situation.');
assert.ok(!cases.some(item => item.paragraphs.some(paragraph => paragraph.text === freeLessonContent.example.situation)), 'The worked example must not simply reveal the same exercise.');
for (const item of cases) {
  const { options, feedback, correct } = item.check;
  assert.ok(Number.isInteger(correct) && correct >= 0 && correct < options.length, 'Each exercise needs an in-range answer key.');
  assert.ok(options.length >= 3);
  assert.equal(new Set(options).size, options.length);
  assert.equal(feedback.length, options.length, 'Every choice must receive feedback.');
  assert.equal(new Set(feedback).size, feedback.length, 'Feedback must address each choice separately.');
  assert.ok(options.every(option => typeof option === 'string' && option.trim()));
  assert.ok(feedback.every(message => typeof message === 'string' && message.trim()));
  assert.equal(new Set(item.paragraphs.map(paragraph => paragraph.id)).size, item.paragraphs.length);
  assert.ok(item.paragraphs.every(paragraph => paragraph.id && paragraph.text.trim()));
  assert.equal(new URL(item.source.url).protocol, 'https:');
}
const independentTransfer = submitAnswer(selectAnswer(emptyAttempt(), transferCase.check.correct, transferCase.check.options.length));
assert.equal(independentTransfer.firstAnswer, transferCase.check.correct);
assert.equal(independentTransfer.attempts, 1, 'Using help in the first case must not consume the transfer case\'s independent attempt.');
assert.equal(resultForAttempt(independentTransfer, transferCase.check.correct), 'Correcto en el primer intento');
assert.equal(firstError.firstAnswer, 0, 'Answering the transfer task must not overwrite the guided result.');

const publicData = JSON.parse(fs.readFileSync(path.join(root, 'pages-static/public-data.json'), 'utf8'));
const course = courseOfferings.find(item => item.available && item.previewLessonId === publicData.freeLesson.id);
assert.ok(course, 'The tested free lesson must belong to the actual available course.');
const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#x27;');
function verifyInitialLesson(html) {
  const plain = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, '');
  assert.ok(plain.includes(escapeHtml(freeLessonContent.objective)));
  for (const block of freeLessonContent.readingBlocks) {
    assert.ok(plain.includes(escapeHtml(block.title)) && plain.includes(escapeHtml(block.text)), 'The first stage must contain the complete structured reading.');
  }
  assert.ok(plain.includes(escapeHtml(freeLessonContent.example.situation)));
  assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
  assert.match(html, /<h2\b[^>]*id="lesson-stage-title"[^>]*>/, 'Stage focus must land on a heading beneath the lesson title.');
  assert.match(html, /<button\b[^>]*disabled=""[^>]*>Explicación<\/button>/, 'Explanation is gated until a response has been checked.');
  assert.doesNotMatch(html, /class="case-analysis"|class="lesson-results"|class="free-lesson-next"/, 'Initial reading must not expose the solution, an unearned result or the commercial close.');
  for (const item of cases) {
    for (const message of item.check.feedback) assert.ok(!plain.includes(escapeHtml(message)), 'Answer feedback cannot appear before submission.');
  }
  for (const paragraph of transferCase.paragraphs) assert.ok(!plain.includes(escapeHtml(paragraph.text)), 'The independent case is introduced after the guided exercise.');
  for (const option of transferCase.check.options) assert.ok(!plain.includes(escapeHtml(option)), 'Do not expose transfer options in the worked example.');
  assert.ok(!plain.includes(escapeHtml(transferCase.takeaway)), 'The transfer solution must not leak into the initial reading.');
  assert.equal([...html.matchAll(/class="lesson-local-note"/g)].length, 1, 'Use one notice explaining visit-only persistence.');
  assert.match(plain, /Se borran al recargar o salir y no se guardan en tu cuenta\./);
  assert.doesNotMatch(plain, /Tus respuestas no se guardan/, 'Avoid a second notice that contradicts visit retention.');
  const primaryButtons = [...html.matchAll(/<button\b[^>]*class="primary"[^>]*>([\s\S]*?)<\/button>/g)];
  assert.equal(primaryButtons.length, 1, 'The initial reading needs one main action.');
  assert.match(primaryButtons[0][1], /^Ir a la práctica/);
}
for (const hasAccess of [false, true]) {
  verifyInitialLesson(renderToStaticMarkup(createElement(CourseExplorer, {
    course, lesson: publicData.freeLesson, source: publicData.source, outline: publicData.outline, hasAccess,
  })));
}
if (process.argv.includes('--pages-build')) {
  const html = fs.readFileSync(path.join(root, '.pages-build', 'cursos', course.slug, 'leccion-gratuita', 'index.html'), 'utf8');
  verifyInitialLesson(html);
  for (const [, href] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    if (href.startsWith('/')) assert.ok(href.startsWith('/Sala-de-maestros/'), `Published lesson links need the deployment prefix: ${href}`);
  }
  console.log('PASS: published lesson preserves initial reading, gated solutions and prefixed links.');
}
console.log('PASS: independent case history, invalid-answer gating, idempotent submission, honest assisted results, distinct transfer case with complete feedback and no solution leaks in initial SSR.');
