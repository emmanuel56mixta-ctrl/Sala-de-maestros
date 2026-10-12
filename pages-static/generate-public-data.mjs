import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.dirname(directory);

// Extract only public curriculum metadata and the free lesson. The complete
// question bank and the remaining lesson bodies never enter the static bundle.
function literalExport(filename, name) {
  const source = ts.createSourceFile(filename, fs.readFileSync(path.join(root, filename), 'utf8'), ts.ScriptTarget.Latest, true);
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.name.getText(source) !== name || !declaration.initializer) continue;
      const expression = declaration.initializer.getText(source);
      const compiled = ts.transpileModule(`export const value = ${expression};`, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      const context = { exports: {} };
      vm.runInNewContext(compiled, context, { timeout: 1000 });
      return context.exports.value;
    }
  }
  throw new Error(`Missing public data export: ${filename}:${name}`);
}

const lessons = literalExport('lib/course.ts', 'lessons');
const topics = literalExport('lib/content.ts', 'topics');
const sources = literalExport('lib/content.ts', 'sources');
const freeLesson = lessons.find(lesson => lesson.id === 'd1');
if (!freeLesson || !sources[freeLesson.source]) throw new Error('The free lesson and its source are required.');
const outline = lessons.map(({ id, title, minutes }) => ({ id, title, minutes }));
const modules = topics.map(topic => ({
  id: topic.id,
  title: topic.title,
  lessons: lessons.filter(lesson => lesson.topic === topic.id).map(({ id, title, minutes }) => ({ id, title, minutes })),
}));
fs.writeFileSync(path.join(directory, 'public-data.json'), JSON.stringify({ modules, freeLesson, source: sources[freeLesson.source], outline }, null, 2) + '\n');
console.log(`Public course data: ${modules.length} modules, ${outline.length} lesson titles, 1 free lesson.`);
