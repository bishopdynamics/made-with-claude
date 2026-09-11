import assert from 'node:assert/strict';
import test from 'node:test';
import {
  resolveCanonical,
  siteOrigin,
  visitCounterEndpoint,
  visitCounterImageUrl,
} from '../src/lib/site-url.ts';

test('canonicals resolve fallback and relative paths without search or hash', () => {
  assert.equal(
    resolveCanonical(undefined, siteOrigin, '/projects/').href,
    'https://whatclaudemade.com/projects/',
  );
  assert.equal(
    resolveCanonical('/a/?q=1#x', siteOrigin, '/').href,
    'https://whatclaudemade.com/a/',
  );
  assert.equal(
    resolveCanonical(
      'article/?q=1#x',
      new URL('https://example.invalid/blog/'),
      '/',
    ).href,
    'https://example.invalid/blog/article/',
  );
});

test('absolute canonicals retain their origin without mutating URL inputs', () => {
  for (const origin of [siteOrigin.origin, 'https://example.invalid']) {
    const input = new URL('/a/?q=1#x', origin);
    for (const canonical of [input, input.href]) {
      assert.equal(
        resolveCanonical(canonical, siteOrigin, '/').href,
        `${origin}/a/`,
      );
    }
    assert.equal(input.href, `${origin}/a/?q=1#x`);
  }
});

test('counter image paths round-trip through one query encoding', () => {
  for (const path of ['/projects/', '/café/a b/', '/literal%25/']) {
    const canonical = resolveCanonical(path, siteOrigin, '/');
    const image = new URL(visitCounterImageUrl(canonical));
    assert.equal(image.origin + image.pathname, visitCounterEndpoint);
    assert.equal(image.searchParams.get('p'), canonical.pathname);
    assert.deepEqual([...image.searchParams.keys()], ['p']);
  }
  assert.equal(
    visitCounterImageUrl(new URL('/café/a b/', siteOrigin)),
    `${visitCounterEndpoint}?p=%2Fcaf%25C3%25A9%2Fa%2520b%2F`,
  );
});
