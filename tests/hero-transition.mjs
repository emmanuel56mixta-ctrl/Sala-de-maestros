import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = fs.readFileSync(path.join(root, 'lib/hero-transition.ts'), 'utf8');
const output = path.join(root, 'work/test/hero-transition.mjs');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText);
const { shouldAnimateCourseLink, expandedPortraitFrame } = await import(pathToFileURL(output).href);
const plainClick = { button: 0, defaultPrevented: false, altKey: false, ctrlKey: false, metaKey: false, shiftKey: false };
const sameWindow = { target: '', download: false };
assert.equal(shouldAnimateCourseLink(plainClick, sameWindow, false), true);
for (const target of ['_self', '_SELF']) assert.equal(shouldAnimateCourseLink(plainClick, { target, download: false }, false), true);

// Primary activation includes keyboard-generated clicks; all modifiers preserve
// browser operations such as opening a new tab/window or saving the resource.
for (let mask = 1; mask < 16; mask++) {
  const event = { ...plainClick };
  ['altKey', 'ctrlKey', 'metaKey', 'shiftKey'].forEach((key, index) => { event[key] = Boolean(mask & (1 << index)); });
  assert.equal(shouldAnimateCourseLink(event, sameWindow, false), false, `Modified activation ${mask} must remain native.`);
}
for (const button of [1, 2, 3, 4]) assert.equal(shouldAnimateCourseLink({ ...plainClick, button }, sameWindow, false), false, 'Non-primary mouse buttons must not be intercepted.');
assert.equal(shouldAnimateCourseLink({ ...plainClick, defaultPrevented: true }, sameWindow, false), false, 'An earlier handler owns a prevented event.');
for (const target of ['_blank', '_parent', '_top', 'named-window']) assert.equal(shouldAnimateCourseLink(plainClick, { target, download: false }, false), false, `Target ${target} must retain native navigation.`);
for (const target of ['', '_self', '_blank']) assert.equal(shouldAnimateCourseLink(plainClick, { target, download: true }, false), false, 'Download attributes must bypass animation regardless of target.');
assert.equal(shouldAnimateCourseLink(plainClick, sameWindow, true), false, 'Reduced motion and compact static mode must navigate without waiting for animation.');

// These are geometric invariants, not copies of the sizing formula: portraits
// stay proportional, fit the viewport, and remain centered and bottom-aligned.
for (const [width, height] of [[320, 640], [390, 844], [768, 1024], [1024, 768], [1440, 900], [2560, 1440], [360, 600]]) {
  for (const ratio of [937 / 1678, 939 / 1674, 1, 16 / 9]) {
    const frame = expandedPortraitFrame(width, height, ratio);
    const tolerance = 1e-7;
    assert.ok(Object.values(frame).every(Number.isFinite));
    assert.ok(frame.width > 0 && frame.height > 0);
    assert.ok(frame.left >= 0 && frame.top >= 0);
    assert.ok(frame.left + frame.width <= width + tolerance && frame.top + frame.height <= height + tolerance, 'The enlarged portrait must fit without viewport clipping.');
    assert.ok(Math.abs(frame.width / frame.height - ratio) < tolerance, 'Scaling must retain the original portrait proportions.');
    assert.ok(Math.abs(frame.left + frame.width / 2 - width / 2) < tolerance, 'The destination portrait is horizontally centered.');
    assert.ok(Math.abs(frame.top + frame.height - height) < tolerance, 'The destination portrait remains bottom-aligned.');
  }
}
console.log('PASS: native modified/non-primary/target/download clicks, immediate static-mode navigation, and proportional portrait fitting across viewport sizes.');
