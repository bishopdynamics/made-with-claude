import assert from 'node:assert/strict';
import test from 'node:test';
import {
  youtubeEmbedUrl,
  youtubeVideoId,
  youtubeWatchUrl,
} from '../src/lib/project-video.ts';

const id = 'DVSHgFvknj0';

test('YouTube watch and short links accept exact normalized hosts and ignore sharing options', () => {
  for (const url of [
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtube.com/watch?v=${id}`,
    `https://m.youtube.com/watch?v=${id}&t=42s`,
    `https://youtu.be/${id}`,
    `https://youtu.be/${id}?si=abc`,
    `https://WWW.YOUTUBE.COM/watch?v=${id}`,
    `https://YOUTU.BE/${id}`,
    `https://www.youtube.com/watch?list=ignored&v=${id}&feature=share#t=42`,
    `https://www.youtube.com:443/watch?v=${id}`,
  ])
    assert.equal(youtubeVideoId(url), id, url);
  assert.equal(youtubeVideoId('https://youtu.be/Ab_1-Def234'), 'Ab_1-Def234');
});

test('unsupported, ambiguous, and malformed YouTube URLs do not become embeds', () => {
  for (const url of [
    undefined,
    '',
    'not a URL',
    `http://www.youtube.com/watch?v=${id}`,
    `https://www.youtube.com:8443/watch?v=${id}`,
    `https://notyoutube.com/watch?v=${id}`,
    `https://www.youtube.com.evil.example/watch?v=${id}`,
    `https://example.invalid/?u=https://www.youtube.com/watch?v=${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://youtu.be/${id}/extra`,
    `https://youtu.be/${id}/`,
    `https://www.youtu.be/${id}`,
    `https://youtube.com./watch?v=${id}`,
    `https://www.youtube.com/watch/?v=${id}`,
    `https://www.youtube.com/watch?v=${id}&v=${id}`,
    `https://www.youtube.com/watch?v=&v=${id}`,
    'https://www.youtube.com/watch',
    'https://www.youtube.com/watch?v=',
    'https://youtu.be/',
    ...['AbCdEfGhIj', 'AbCdEfGhIjKl', 'AbCdEfGhIj.', 'AbCdEfGhIj%'].flatMap(
      (invalid) => [
        `https://www.youtube.com/watch?v=${invalid}`,
        `https://youtu.be/${invalid}`,
      ],
    ),
  ])
    assert.equal(youtubeVideoId(url), undefined, String(url));
  // Construct synthetic userinfo without email-shaped source literals.
  for (const [username, password] of [
    ['user', ''],
    ['user', 'password'],
    ['', 'password'],
  ] as const) {
    const url = new URL(`https://www.youtube.com/watch?v=${id}`);
    url.username = username;
    url.password = password;
    assert.equal(youtubeVideoId(url.href), undefined);
  }
});

test('embed URLs use only the fixed privacy-enhanced minimal-player options', () => {
  const url = new URL(youtubeEmbedUrl(id));
  assert.equal(url.origin, 'https://www.youtube-nocookie.com');
  assert.equal(url.pathname, `/embed/${id}`);
  assert.deepEqual([...url.searchParams].sort(), [
    ['autoplay', '0'],
    ['color', 'white'],
    ['controls', '1'],
    ['disablekb', '0'],
    ['fs', '1'],
    ['iv_load_policy', '3'],
    ['playsinline', '1'],
    ['rel', '0'],
  ]);
  for (const name of [
    'modestbranding',
    'showinfo',
    'autohide',
    'theme',
    'origin',
    'enablejsapi',
  ])
    assert.equal(url.searchParams.has(name), false);
  assert.equal(url.hash, '');
});

test('fallback links use the canonical YouTube watch page', () => {
  assert.equal(youtubeWatchUrl(id), `https://www.youtube.com/watch?v=${id}`);
});
