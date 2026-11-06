import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const questions = JSON.parse(readFileSync(new URL('../src/lib/questions.json', import.meta.url)));
const source = readFileSync(new URL('../sources/uscis-2025.txt', import.meta.url), 'utf8');
const clean = value => value.replace(/\s+/g, ' ').trim();

test('all 128 numbered questions and every answer match the official source snapshot', () => {
  assert.deepEqual(questions.map(q => q.id), Array.from({length:128}, (_, i) => i + 1));
  for (const q of questions) {
    const start = new RegExp(`\\n${q.id}\\.\\s+`).exec(source);
    assert.ok(start);
    const end = q.id === 128 ? source.length : source.search(new RegExp(`\\n${q.id + 1}\\.\\s+`));
    const raw = source.slice(start.index + start[0].length, end)
      .replace(/^\d+ of 19\s*$/gm, '').replace(/^uscis.gov\/citizenship\s*$/gm, '')
      .replace(/^(AMERICAN HISTORY|SYMBOLS AND HOLIDAYS|[ABC]: .*)$/gm, '').trim();
    const [prompt, ...answers] = raw.split('•');
    assert.equal(q.question, clean(prompt.replace(/\*\s*$/, '')), `question ${q.id}`);
    assert.equal(q.specialConsideration, prompt.includes('*'), `star ${q.id}`);
    assert.deepEqual(q.answers, answers.map(a => clean(a.split('For a complete list')[0])), `answers ${q.id}`);
  }
});
test('official category boundaries, special consideration and variable answers are complete', () => {
  assert.deepEqual([...new Set(questions.map(q => q.category))], ['American Government', 'American History', 'Symbols And Holidays']);
  assert.deepEqual(['American Government','American History','Symbols And Holidays'].map(c => questions.filter(q => q.category === c).length), [72,46,10]);
  assert.equal(questions.filter(q => q.specialConsideration).length, 20);
  assert.deepEqual(questions.filter(q => q.variableAnswer).map(q => q.id), [23,29,30,38,39,57,61,62]);
  assert.equal(questions[116].note, 'For a complete list of tribes, please visit bia.gov.');
});

test('Richardson 75082 answers cover all variable questions with official sources', () => {
  const local = JSON.parse(readFileSync(new URL('../src/lib/local-answers.json', import.meta.url)));
  assert.match(local.verifiedOn, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(Object.keys(local.answers).map(Number), [23, 29, 30, 38, 39, 57, 61, 62]);
  assert.deepEqual(local.answers[29].answers, ['Julie Johnson']);
  assert.equal(new URL(local.answers[29].source).searchParams.get('ZIP'), '75082');
  assert.equal(local.answers[29].verifiedOn, '2026-11-06');
  assert.deepEqual(local.answers[23].answers, ['John Cornyn', 'Ted Cruz']);
  assert.deepEqual(local.answers[61].answers, ['Greg Abbott']);
  assert.deepEqual(local.answers[62].answers, ['Austin']);
  for (const [id, entry] of Object.entries(local.answers)) {
    assert.equal(questions[Number(id) - 1].variableAnswer, true);
    assert.ok(entry.answers.length > 0);
    assert.match(new URL(entry.source).hostname, /\.gov$/);
  }
});
