import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'work/test/course-sections');
fs.mkdirSync(output, { recursive: true });
const compilerOptions = { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX };

// Use the production URL transform, then render the real components and their
// actual local dependencies. No component or catalog fixtures replace runtime code.
const configPath = path.join(root, 'vite.pages.config.ts');
const configSource = fs.readFileSync(configPath, 'utf8').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(configPath).href));
const configOutput = path.join(output, 'pages-config.mjs');
fs.writeFileSync(configOutput, ts.transpileModule(configSource, { compilerOptions }).outputText);
const { default: pagesConfig } = await import(pathToFileURL(configOutput).href);
const pathsPlugin = pagesConfig.plugins.flat(Infinity).find(plugin => plugin?.name === 'sala-pages-paths');
assert.equal(typeof pathsPlugin?.transform, 'function');
const compiled = new Map();
function compile(relative, mode = 'worker') {
  const key = `${mode}:${relative}`;
  if (compiled.has(key)) return compiled.get(key);
  const filename = path.join(root, relative);
  const destination = path.join(output, mode, relative.replace(/\.tsx?$/, '.mjs'));
  compiled.set(key, destination);
  let source = fs.readFileSync(filename, 'utf8');
  if (mode === 'pages') source = pathsPlugin.transform(source, filename) ?? source;
  assert.equal(typeof source, 'string');
  let code = ts.transpileModule(source, { compilerOptions }).outputText;
  // Node renders the real JSX; stylesheet side effects belong to the browser.
  code = code.replace(/^\s*import\s+["'][^"']+\.css["'];?\s*$/gm, '');
  code = code.replace(/(\bfrom\s*["'])([^"']+)(["'])/g, (all, before, specifier, after) => {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return all;
    const candidate = specifier.startsWith('@/') ? path.join(root, specifier.slice(2)) : path.resolve(path.dirname(filename), specifier);
    const dependency = [`${candidate}.ts`, `${candidate}.tsx`, candidate].find(name => fs.existsSync(name) && fs.statSync(name).isFile());
    assert.ok(dependency, `Cannot resolve the real dependency ${specifier} from ${relative}`);
    return `${before}${pathToFileURL(compile(path.relative(root, dependency), mode)).href}${after}`;
  });
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, code);
  return destination;
}
const load = (relative, mode) => import(pathToFileURL(compile(relative, mode)).href);
const { courseOfferings } = await load('lib/course-offerings.ts');
const { promotionSection, digitalSection, courseSections, coursesForSection } = await load('lib/course-sections.ts');
const { default: CourseCards } = await load('app/course-cards.tsx');
const { default: CatalogPage } = await load('app/catalog-page.tsx');
const { default: PublicCatalog } = await load('app/catalog-page.tsx', 'pages');
const publicSections = await load('lib/course-sections.ts', 'pages');
const original = structuredClone(courseOfferings);
const expected = new Map([
  ['promocion-docente', ['subdireccion-secundaria-2026', 'promocion-primaria']],
  ['herramientas-digitales', ['habilidades-digitales', 'ia-docente']],
]);
const sortedIds = courses => courses.map(course => course.id).sort();
assert.equal(courseSections.length, 2);
assert.equal(new Set(courseSections.map(section => section.slug)).size, 2);
assert.ok(courseSections.every(section => !courseOfferings.some(course => course.slug === section.slug)), 'Category routes cannot shadow individual course routes.');
assert.ok(courseSections.includes(promotionSection) && courseSections.includes(digitalSection));
const allMembers = courseSections.flatMap(section => coursesForSection(section));
assert.equal(new Set(allMembers.map(course => course.id)).size, allMembers.length, 'Each offering must belong to exactly one entry category.');
assert.deepEqual(sortedIds(allMembers), sortedIds(courseOfferings), 'The two entries must retain the complete catalog.');
for (const section of courseSections) {
  const members = coursesForSection(section);
  assert.deepEqual(sortedIds(members), [...expected.get(section.slug)].sort());
  assert.deepEqual(sortedIds(coursesForSection(section, [...courseOfferings].reverse())), sortedIds(members), 'Reordering the catalog cannot change category membership.');
  for (const member of members) assert.equal(member, courseOfferings.find(course => course.id === member.id), 'Grouping must preserve the course, price and availability rather than clone or enable it.');
}
assert.deepEqual(courseOfferings, original, 'Grouping must not mutate catalog prices, availability or content.');
assert.deepEqual(coursesForSection(digitalSection).map(course => course.available), [false, false]);
assert.equal(coursesForSection(promotionSection).filter(course => course.available).length, 1);

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
}
function cards(html) {
  return [...html.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0])
    .filter(card => /\bcatalog-course\b/.test(attrs(card.match(/^<article[^>]*>/)[0]).class ?? ''));
}
function cardSlug(card, prefix) {
  const cover = [...card.matchAll(/<a\b[^>]*>/g)].map(match => attrs(match[0])).find(a => a.class === 'catalog-cover');
  assert.ok(cover, 'Every rendered course needs an ordinary cover link.');
  const base = `${prefix}/cursos/`;
  assert.ok(cover.href.startsWith(base) && cover.href.endsWith('/'), `Course links must use the deployment base and directory URL: ${cover.href}`);
  return cover.href.slice(base.length).replace(/\/$/, '');
}
function verifyCatalog(html, section, prefix = '') {
  const actualCards = cards(html);
  const offerings = section ? coursesForSection(section) : courseOfferings;
  assert.equal(actualCards.length, section ? 2 : 4, 'A category shows two cards; the full catalog retains all four.');
  assert.deepEqual(actualCards.map(card => cardSlug(card, prefix)).sort(), offerings.map(course => course.slug).sort());
  const plainHtml = html.replace(/<!--[\s\S]*?-->/g, '');
  if (section) {
    const hero = plainHtml.match(/<section\b[^>]*class="[^\"]*\bcourse-section-hero\b[^\"]*"[^>]*>[\s\S]*?<\/section>/)?.[0];
    assert.ok(hero, 'Category context must remain present without aggregate counters.');
    assert.doesNotMatch(hero, /<dl\b/, 'The category hero must omit the proposals/availability counter list.');
  } else {
    const displayedCounts = plainHtml.match(/(\d+) propuestas? · (\d+) (?:lección gratuita disponible|lecciones gratuitas disponibles)/)?.slice(1).map(Number);
    assert.deepEqual(displayedCounts, [offerings.length, offerings.filter(course => course.available).length], 'The full catalog must count open free lessons without implying that paid enrollment is available.');
  }
  for (const card of actualCards) {
    const offering = offerings.find(course => course.slug === cardSlug(card, prefix));
    const status = card.match(/<p\b[^>]*class="eyebrow\b[^"]*"[^>]*>([^<]*)<\/p>/)?.[1];
    assert.ok(status, `The ${offering.slug} card must disclose its own availability.`);
    assert.equal(/^LECCIÓN GRATUITA DISPONIBLE\b/.test(status), offering.available, `Free-lesson availability must remain accurate for ${offering.slug}.`);
    assert.equal(status === 'PRÓXIMAMENTE', !offering.available, `Upcoming status must remain accurate for ${offering.slug}.`);
  }
  const navigation = html.match(/<nav\b[^>]*class="catalog-sections"[^>]*>[\s\S]*?<\/nav>/)?.[0];
  assert.ok(navigation, 'Category choices must be present in rendered HTML without JavaScript.');
  const links = [...navigation.matchAll(/<a\b[^>]*>/g)].map(match => attrs(match[0]));
  assert.equal(links.length, 3);
  const current = links.filter(link => link['aria-current'] === 'page');
  assert.equal(current.length, 1, 'Exactly one category must be announced as the current page.');
  assert.equal(current[0].href, `${prefix}/cursos/${section ? `${section.slug}/` : ''}`);
  if (section) {
    const back = [...html.matchAll(/<a\b[^>]*>/g)].map(match => attrs(match[0])).find(a => a.class === 'catalog-back');
    assert.equal(back?.href, `${prefix}/cursos/`, 'Category pages must provide a working return to the full catalog.');
  }
  const image = html.match(/<figure\b[^>]*class="[^"]*catalog-learning-photo[^\"]*"[^>]*>[\s\S]*?<\/figure>/)?.[0];
  assert.ok(image, 'The category retains its explanatory photograph.');
  const photo = attrs(image.match(/<img\b[^>]*>/)[0]);
  assert.ok(photo.src.startsWith(`${prefix}/assets/learning/`) && photo.alt.length > 0);
  const expectedPhoto = section ? `${prefix}${section.image.src.replace(/^\/Sala-de-maestros(?=\/)/, '')}` : `${prefix}/assets/learning/estudio-personal.webp`;
  assert.equal(photo.src, expectedPhoto, 'Filtering a catalog must keep its own contextual photograph.');
  if (section?.slug === digitalSection.slug) {
    assert.equal(actualCards.filter(card => card.includes('PRÓXIMAMENTE')).length, 2, 'Both digital offerings must disclose that they are upcoming.');
    assert.ok(!/href="[^"]*leccion-gratuita/.test(html), 'Upcoming offerings cannot expose a free-lesson entry.');
  }
}
for (const section of [undefined, promotionSection, digitalSection]) verifyCatalog(renderToStaticMarkup(createElement(CatalogPage, { section })), section);
for (const section of [undefined, publicSections.promotionSection, publicSections.digitalSection]) verifyCatalog(renderToStaticMarkup(createElement(PublicCatalog, { section })), section, '/Sala-de-maestros');

const anchorAttributes = html => [...html.matchAll(/<a\b[^>]*>/g)].map(match => attrs(match[0]));
const advisorHref = prefix => prefix ? 'https://ascenso-docente-laboratorio.mandrakker.chatgpt.site/asesor' : '/asesor';
const signInHref = prefix => `${prefix ? 'https://ascenso-docente-laboratorio.mandrakker.chatgpt.site' : ''}/signin-with-chatgpt?return_to=%2Fasesor`;
const availableCourse = courseOfferings.find(course => course.available);
assert.ok(availableCourse?.previewLessonId, 'The public lesson must belong to an enabled course.');
function verifyHome(html, prefix = '') {
  const links = anchorAttributes(html);
  const account = links.find(link => link.class?.split(/\s+/).includes('public-account-link'));
  assert.equal(account?.href, signInHref(prefix), 'Returning learners need an explicit sign-in entry that returns to the advisor in both deployments.');
  const footer = html.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/)?.[0];
  assert.ok(footer && anchorAttributes(footer).some(link => link.href === signInHref(prefix)), 'The public footer must retain the same sign-in destination and return path.');
  const previews = links.filter(link => link.href?.includes('/leccion-gratuita'));
  assert.ok(previews.length > 0, 'The homepage must offer a real free lesson before hydration.');
  for (const preview of previews) {
    const url = new URL(preview.href, 'https://worker.example');
    assert.equal(url.origin, 'https://worker.example');
    assert.equal(url.pathname, `${prefix}/cursos/${availableCourse.slug}/leccion-gratuita/`, 'Free entry links must retain the real enabled lesson, deployment prefix and directory slash.');
    assert.ok([...url.searchParams.keys()].every(key => key === 'paso'));
    assert.ok(!url.searchParams.has('paso') || ['comprende', 'aplica'].includes(url.searchParams.get('paso')));
  }
  assert.doesNotMatch(html, /Docentes inscritos|Cifra simulada/, 'Public trust must not depend on a simulated enrollment counter.');
}
function verifyHub(html, course, hasAccess, prefix = '') {
  const sequence = html.match(/<ol\b[^>]*class="hub-sequence"[^>]*>[\s\S]*?<\/ol>/)?.[0];
  const previewPath = `${prefix}/cursos/${course.slug}/leccion-gratuita/`;
  if (!course.available) {
    assert.equal(sequence, undefined, 'Upcoming courses cannot expose the active learning sequence.');
    assert.ok(anchorAttributes(html).every(link => !link.href?.includes('/leccion-gratuita')), 'An upcoming course cannot offer a free-lesson CTA, even when hasAccess is supplied.');
    return;
  }
  assert.ok(sequence, 'The enabled course must describe its four learning activities.');
  assert.equal([...sequence.matchAll(/<li\b/g)].length, 4);
  const sequenceLinks = anchorAttributes(sequence);
  if (hasAccess) {
    assert.deepEqual(sequenceLinks.map(link => link.href), ['inicio', 'ruta', 'practica', 'simulacion'].map(view => `${advisorHref(prefix)}?seccion=${view}`), 'Each unlocked activity must lead to its own advisor destination.');
  } else {
    assert.equal(sequenceLinks.length, 0, 'Visitor course contents must not disguise four identical free-lesson links as separate actions.');
  }
  const pricePanel = html.match(/<section\b[^>]*class="course-price-panel"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(pricePanel);
  const action = anchorAttributes(pricePanel).find(link => link.class?.split(/\s+/).includes('primary'));
  assert.equal(action?.href, hasAccess ? advisorHref(prefix) : previewPath);
  const notice = pricePanel.match(/<p\b[^>]*class="hub-enrollment-note"[^>]*>[\s\S]*?<\/p>/)?.[0];
  if (hasAccess) assert.equal(notice, undefined, 'Existing learners must retain direct access without a visitor enrollment notice.');
  else {
    assert.ok(notice && /pago[\s\S]*no est[áa]n habilitados/i.test(notice), 'Visitors must learn that online enrollment/payment is unavailable before the free CTA.');
    assert.ok(pricePanel.indexOf(notice) < pricePanel.indexOf('<a'), 'The access limitation must precede the free-lesson action in reading order.');
  }
}

// Exercise public components only; no protected lesson/question modules are
// needed to validate navigation and access semantics.
for (const mode of ['worker', 'pages']) {
  const prefix = mode === 'pages' ? '/Sala-de-maestros' : '';
  const { default: Home } = await load('app/page.tsx', mode);
  const { default: CourseHub } = await load('app/course-hub.tsx', mode);
  verifyHome(renderToStaticMarkup(createElement(Home)), prefix);
  for (const course of courseOfferings) {
    for (const hasAccess of [false, true]) {
      verifyHub(renderToStaticMarkup(createElement(CourseHub, { course, modules: [], hasAccess })), course, hasAccess, prefix);
    }
  }
}

// Rendering each digital course alone catches index-based icon selection after
// filtering, even when the full-catalog order still happens to look correct.
for (const [id, icon] of [['habilidades-digitales', 'monitor'], ['ia-docente', 'sparkles']]) {
  const course = courseOfferings.find(item => item.id === id);
  const html = renderToStaticMarkup(createElement(CourseCards, { courses: [course] }));
  assert.equal(cards(html).length, 1);
  assert.match(html, new RegExp(`class="[^"]*lucide-${icon}(?:[ "])`), `The ${id} course must keep its own icon when filtered or reordered.`);
}

if (process.argv.includes('--pages-build')) {
  const build = path.join(root, '.pages-build');
  verifyHome(fs.readFileSync(path.join(build, 'index.html'), 'utf8'), '/Sala-de-maestros');
  for (const course of courseOfferings) {
    verifyHub(fs.readFileSync(path.join(build, 'cursos', course.slug, 'index.html'), 'utf8'), course, false, '/Sala-de-maestros');
  }
  for (const section of [undefined, promotionSection, digitalSection]) {
    const filename = path.join(build, 'cursos', ...(section ? [section.slug] : []), 'index.html');
    assert.ok(fs.statSync(filename).isFile(), `Direct navigation and reload require a real HTML file: ${filename}`);
    const html = fs.readFileSync(filename, 'utf8');
    verifyCatalog(html, section, '/Sala-de-maestros');
    for (const match of html.matchAll(/<img\b[^>]*>/g)) {
      const { src } = attrs(match[0]);
      if (!src?.startsWith('/Sala-de-maestros/assets/')) continue;
      assert.ok(fs.existsSync(path.join(build, src.slice('/Sala-de-maestros/'.length))), `Published photograph is missing: ${src}`);
    }
  }
  for (const course of coursesForSection(digitalSection)) assert.ok(!fs.existsSync(path.join(build, 'cursos', course.slug, 'leccion-gratuita', 'index.html')), 'An upcoming digital course must not generate a lesson route.');
  console.log('PASS: published home/hub navigation and access notices, category HTML, 2/2/4 cards, directory links, prefixed photographs and upcoming-course boundaries.');
}
console.log('PASS: category membership, counts/availability, real Worker/Pages home and hub navigation, access notices, no simulated enrollment and stable digital icons.');
