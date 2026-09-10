import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createProjectSearchRecords,
  filterProjects,
  normalizeSearchText,
  parseProjectSearch,
  projectFilterOptions,
  serializeProjectSearch,
} from '../src/lib/project-search.ts';
import {
  fixtureTaxonomy,
  publishedFixture,
} from './fixtures/projects/fixtures.ts';

const all = { q: '', tag: '', language: '', year: '' };
function catalog() {
  const alpha = publishedFixture('alpha');
  const beta = publishedFixture('beta', 'private');
  beta.data.title = 'Tool [a-z].*';
  beta.data.description = 'A small developer utility';
  beta.data.tags = ['tools', 'private'];
  beta.data.languages = ['ts'];
  beta.data.completedOn = '2025-12-31';
  beta.data.startedOn = '2025-11-01';
  const draft = publishedFixture('private-draft', 'private');
  draft.data.draft = true;
  draft.data.title = 'Draft-only title';
  const publicDraft = publishedFixture('public-draft');
  publicDraft.data.draft = true;
  return createProjectSearchRecords(
    [beta, draft, publicDraft, alpha],
    fixtureTaxonomy,
  );
}

test('public metadata excludes draft records and article/image payloads', () => {
  const records = catalog();
  assert.deepEqual(
    records.map(({ slug }) => slug),
    ['alpha', 'beta'],
  );
  assert.ok(!JSON.stringify(records).includes('Draft-only'));
  assert.ok(!JSON.stringify(records).includes('synthetic fixture content'));
  assert.ok(!JSON.stringify(records).includes('overview.svg'));
});

test('normalization handles Unicode, whitespace and literal punctuation', () => {
  assert.equal(normalizeSearchText('  CAFÉ\t C++ \n'), 'cafe c++');
  const records = catalog();
  const matches = (q: string) =>
    filterProjects(records, { ...all, q }).map(({ slug }) => slug);
  assert.deepEqual(matches('  cafe   GRAPHICS c++ '), ['alpha']);
  assert.deepEqual(matches('[a-z].*'), ['beta']);
  assert.deepEqual(matches('('), []);
  assert.deepEqual(matches('cafe typescript'), []);
  assert.deepEqual(matches(''), ['alpha', 'beta']);
  assert.deepEqual(matches('synthetic fixture content'), []);
});

test('all filters combine with AND and choices stay independent of results', () => {
  const records = catalog();
  const options = projectFilterOptions(records);
  assert.deepEqual(options.years, ['2026', '2025']);
  assert.deepEqual(
    options.tags.map(({ label }) => label),
    ['Developer tools', 'Graphics', 'Private', 'Public'],
  );
  assert.equal(
    filterProjects(records, {
      q: 'café',
      tag: 'graphics',
      language: 'cpp',
      year: '2026',
    }).length,
    1,
  );
  assert.equal(
    filterProjects(records, {
      q: 'café',
      tag: 'tools',
      language: 'cpp',
      year: '2026',
    }).length,
    0,
  );
  assert.deepEqual(projectFilterOptions(records), options);
  assert.equal(
    filterProjects(records, { ...all, year: '2025' })[0]?.slug,
    'beta',
  );
});

test('reserved availability tags filter published articles independently of draft status', () => {
  const records = catalog();
  for (const [tag, expected] of [
    ['public', 'alpha'],
    ['private', 'beta'],
  ]) {
    assert.deepEqual(
      filterProjects(records, { ...all, tag: tag! }).map(({ slug }) => slug),
      [expected],
    );
    assert.deepEqual(
      filterProjects(records, { ...all, q: tag! }).map(({ slug }) => slug),
      [expected],
    );
    const options = projectFilterOptions(records);
    const state = { ...all, tag: tag! };
    assert.deepEqual(
      parseProjectSearch(serializeProjectSearch(state, options), options),
      state,
    );
  }
});

test('URL state safely roundtrips Unicode and literal special characters and discards invalid choices', () => {
  const options = projectFilterOptions(catalog());
  const state = {
    q: 'Café C++ & <tag> #? / [x]',
    tag: 'graphics',
    language: 'cpp',
    year: '2026',
  };
  assert.deepEqual(
    parseProjectSearch(serializeProjectSearch(state, options), options),
    state,
  );
  assert.deepEqual(
    parseProjectSearch(
      new URLSearchParams(
        'q=++café+++&tag=unknown&language=rust&year=1999&extra=x',
      ),
      options,
    ),
    { ...all, q: 'café' },
  );
  assert.equal(serializeProjectSearch(all, options).toString(), '');
  assert.equal(
    serializeProjectSearch({ ...all, tag: 'unknown' }, options).toString(),
    '',
  );
  assert.deepEqual(projectFilterOptions([]), {
    tags: [],
    languages: [],
    years: [],
  });
});
