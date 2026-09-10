import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { ProjectEntry } from '../../../src/types/projects.ts';
import { fixtureTaxonomy, publishedFixture } from './fixtures.ts';

export const catalogLiteralTitle =
  'Café </script><script>catalogSentinel()</script> & C++';
export const catalogPublicationOrder = [
  'catalog-echo',
  'catalog-alpha',
  'catalog-bravo',
  'catalog-charlie',
  'catalog-delta',
  'catalog-foxtrot',
];

/** Deliberately unsorted with a publication tie, different completion years and mixed taxonomies. */
export function catalogFixtures(): ProjectEntry<string>[] {
  const definitions = [
    [
      'catalog-foxtrot',
      '2026-09-08',
      '2024-04-01',
      '2024-04-01',
      'ts',
      'tools',
    ],
    [
      'catalog-bravo',
      '2026-09-11',
      '2025-05-01',
      '2025-05-09',
      'cpp',
      'graphics',
    ],
    ['catalog-alpha', '2026-09-11', '2026-02-20', '2026-03-07', 'cpp', 'tools'],
    [
      'catalog-delta',
      '2026-09-09',
      '2024-01-01',
      '2024-02-01',
      'ts',
      'graphics',
    ],
    ['catalog-echo', '2026-09-12', '2026-08-01', '2026-09-01', 'ts', 'tools'],
    [
      'catalog-charlie',
      '2026-09-10',
      '2025-01-01',
      '2025-03-01',
      'cpp',
      'graphics',
    ],
  ];
  return definitions.map(
    ([id, publishedOn, startedOn, completedOn, language, tag], index) => {
      const availability = index % 2 === 0 ? 'private' : 'public';
      const fixture = publishedFixture(id!, availability);
      Object.assign(fixture.data, {
        title:
          id === 'catalog-alpha'
            ? catalogLiteralTitle
            : `Synthetic ${id!.slice('catalog-'.length)} project`,
        description:
          index === 1
            ? 'A synthetic renderer with long-but-literal details: ' +
              'unbroken'.repeat(35)
            : 'A synthetic C++ / TypeScript café tool for graphics and keyboard testing.',
        publishedOn,
        startedOn,
        completedOn,
        languages: index === 4 ? ['ts', 'cpp'] : [language!],
        tags: [...(index === 4 ? ['tools', 'graphics'] : [tag!]), availability],
        coverPosition: { x: 35, y: 65 },
        images: [
          {
            id: 'overview',
            src: `../../assets/projects/${id}/landscape.png`,
            alt: `Blue gradient for the synthetic ${id} project`,
          },
        ],
      });
      return fixture;
    },
  );
}

/** Writes only synthetic content into a caller-prepared isolated checkout. */
export function writeCatalogFixtures(
  root: string,
  { count = 6, drafts = true }: { count?: number; drafts?: boolean } = {},
) {
  const put = (path: string, contents: string) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  };
  put(
    'src/data/project-taxonomy.ts',
    `export const projectTaxonomy = ${JSON.stringify(fixtureTaxonomy)};`,
  );
  const entries = catalogFixtures().slice(0, count);
  for (const fixture of entries) {
    const destination = join(
      root,
      'src/assets/projects',
      fixture.id,
      'landscape.png',
    );
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(
      fileURLToPath(new URL('landscape.png', import.meta.url)),
      destination,
    );
    put(
      `src/content/projects/${fixture.id}.md`,
      `---\n${JSON.stringify(fixture.data)}\n---\n## Synthetic project story\n\n${fixture.body}\n`,
    );
  }
  const draftSlugs = drafts
    ? ['catalog-draft-empty', 'catalog-draft-sentinel']
    : [];
  if (drafts) {
    put(
      'src/content/projects/catalog-draft-empty.md',
      '---\ntags: [public]\n---\n',
    );
    put(
      'src/content/projects/catalog-draft-sentinel.md',
      '---\ntitle: Draft catalog sentinel\ndescription: Unpublished sample card\ntags: [private]\n---\nUnfinished story.',
    );
  }
  return { entries, draftSlugs };
}
