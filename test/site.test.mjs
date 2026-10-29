
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const SITE = fs.existsSync(path.join(here,'..','site','index.html')) ? path.join(here,'..','site') : path.join(here,'..');
const read = f => fs.readFileSync(path.join(SITE,f),'utf8');
const html = read('index.html');
const ctx = {}; vm.createContext(ctx); vm.runInContext(read('challenges.js').replace(/^const /gm,'var '), ctx);
test('page basics', () => {
  assert.match(html, /<title>Oko Empire[^<]*<\/title>/);
  assert.match(html, /name="viewport"[^>]*width=device-width/);
  for (const f of ['styles.css','game.js','challenges.js','codelab.js','manifest.webmanifest']) { assert.ok(html.includes(f), f); assert.ok(fs.existsSync(path.join(SITE,f)), f); }
  assert.ok(html.includes('id="lab"') && html.includes('id="edCode"') && html.includes('id="edRun"') && html.includes('id="edHint"') && html.includes('id="edReset"'));
  assert.doesNotMatch(html + read('codelab.js'), /lorem|TODO|placeholder text/i);
});
test('service worker caches every asset with a new version', () => {
  const sw = read('sw.js');
  for (const f of ['index.html','styles.css','game.js','challenges.js','codelab.js','manifest.webmanifest','icon-192.png','icon-512.png']) assert.ok(sw.includes("'./"+f+"'"), f);
  assert.match(sw, /oko-empire-v2/);
});
test('curriculum: 33 coding challenges in roadmap order, 3 hints each', () => {
  const T = JSON.parse(JSON.stringify(ctx.LAB_TOPICS.map(t=>t.id))); assert.deepEqual(T, ['queue','hash','heap','window','search','graph']);
  const counts = {}; for (const c of ctx.LAB_CH) counts[c.topic]=(counts[c.topic]||0)+1;
  assert.deepEqual(counts, {queue:6,hash:6,heap:5,window:5,search:5,graph:6});
  for (const c of ctx.LAB_CH) {
    assert.equal(c.hints.length, 3, c.id); assert.ok(c.tests.length >= 6, c.id);
    assert.ok(c.big && c.big.gen && c.big.limit, c.id);
    for (const t of c.tests) assert.ok('exp' in t, c.id);
    assert.ok(!('ref' in c), 'no reference solution shipped: '+c.id);
  }
});
test('hints never contain code', () => {
  const bad = /\breturn\b|=>|;|[{}]|\bfunction\b|\bconst\b|\blet\b|\bvar\b|\.push\(|\bwhile\s*\(|\bfor\s*\(/;
  for (const c of ctx.LAB_CH) c.hints.forEach((h,i)=>assert.ok(!bad.test(h), c.id+' hint '+(i+1)+': '+h));
});
test('logic puzzles and building gates', () => {
  const src = read('codelab.js');
  const puz = (src.match(/\{id:'[a-z]z\d'/g)||[]).length; assert.ok(puz >= 24, 'puzzles: '+puz);
  for (const id of ['s1','s2','s4','s5','h2','h4','h5','s3','h1','h3','h6','q1','q4','q2','q5','p1','p3','b1','b3','g3','p2','p5','g5','g6']) assert.ok(src.includes("'"+id+"'"), id);
});
