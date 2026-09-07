import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calendarDateUTC,
  developmentDays,
  formatDevelopmentSpan,
  formatProjectDate,
  projectCover,
  selectPublicProjects,
} from '../src/lib/project-metadata.ts';
import { publishedFixture } from './fixtures/projects/fixtures.ts';

test('calendar validation rejects impossible dates and accepts real leap years', () => {
  for (const value of [
    '2026-02-29',
    '2024-02-30',
    '1900-02-29',
    '2026-13-01',
    '2026-00-10',
    '2026-01-00',
    '2026-1-01',
    '2026-01-01T00:00:00Z',
  ])
    assert.throws(() => calendarDateUTC(value));
  assert.equal(
    new Date(calendarDateUTC('2000-02-29')).toISOString(),
    '2000-02-29T00:00:00.000Z',
  );
  assert.equal(developmentDays('2024-02-28', '2024-03-01'), 2);
  assert.throws(() => developmentDays('2026-03-02', '2026-03-01'), /precede/);
});

test('development spans use exact calendar days and grammatical units', () => {
  for (const [end, expected] of [
    [1, 'Same day'],
    [2, '1 day'],
    [3, '2 days'],
    [14, '13 days'],
    [15, '2 weeks'],
    [16, '2 weeks, 1 day'],
    [17, '2 weeks, 2 days'],
    [22, '3 weeks'],
  ] as const) {
    assert.equal(
      formatDevelopmentSpan(
        '2026-01-01',
        `2026-01-${String(end).padStart(2, '0')}`,
      ),
      expected,
    );
  }
});

test('dates and spans are stable across DST and extreme local timezones', () => {
  const before = process.env.TZ;
  try {
    for (const zone of ['America/Los_Angeles', 'Pacific/Kiritimati', 'UTC']) {
      process.env.TZ = zone;
      assert.equal(developmentDays('2026-03-07', '2026-03-09'), 2);
      assert.equal(developmentDays('2026-10-31', '2026-11-02'), 2);
      assert.equal(formatProjectDate('2026-01-01'), 'Jan 1, 2026');
    }
  } finally {
    if (before === undefined) delete process.env.TZ;
    else process.env.TZ = before;
  }
});

test('canonical public order excludes drafts, ignores updates, and breaks ties by slug without mutating input', () => {
  const older = publishedFixture('older');
  older.data.publishedOn = '2026-01-01';
  older.data.updatedOn = '2026-12-31';
  const draft = publishedFixture('draft');
  draft.data.draft = true;
  const entries = [
    publishedFixture('zebra'),
    draft,
    older,
    publishedFixture('alpha'),
  ];
  assert.deepEqual(
    selectPublicProjects(entries).map(({ id }) => id),
    ['alpha', 'zebra', 'older'],
  );
  assert.deepEqual(
    entries.map(({ id }) => id),
    ['zebra', 'draft', 'older', 'alpha'],
  );
  assert.equal(projectCover(older)?.id, 'overview');
});
