import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixtureTaxonomy, publishedFixture } from './fixtures.ts';

export const literalCaption =
  'A literal </script><script>caption</script> & "quoted" view.';
export const literalTitle =
  'Café </script><script>literal project title</script>';
export const draftMedia = {
  'draft-gallery.svg':
    '<svg xmlns="http://www.w3.org/2000/svg" width="37" height="23"><rect width="37" height="23" fill="#b53161"/><!-- Draft gallery asset sentinel --></svg>',
  'draft-inline.svg':
    '<svg xmlns="http://www.w3.org/2000/svg" width="29" height="41"><rect width="29" height="41" fill="#512ba7"/><!-- Draft inline asset sentinel --></svg>',
};

/** Test-only content, reusable in a separate browser-review checkout. */
export function writePageFixtures(root: string) {
  const put = (path: string, contents: string) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), contents);
  };
  put(
    'src/data/project-taxonomy.ts',
    `export const projectTaxonomy = ${JSON.stringify(fixtureTaxonomy)};`,
  );
  for (const id of ['gallery-multiple', 'gallery-single']) {
    const fixture = publishedFixture(
      id,
      id === 'gallery-single' ? 'private' : 'public',
    );
    fixture.data.title =
      id === 'gallery-multiple' ? literalTitle : 'Single-image fixture';
    fixture.data.description =
      'A synthetic project for isolated gallery route verification.';
    fixture.data.updatedOn = '2026-09-08';
    fixture.data.releaseUrl = 'https://example.invalid/release?q=one&next=two';
    fixture.data.videoUrl = 'https://example.invalid/video';
    fixture.data.images = [
      {
        id: 'overview',
        src: `../../assets/projects/${id}/landscape.png`,
        alt: 'Blue landscape with a vertical gradient in the fixture',
        caption: literalCaption,
      },
    ];
    if (id === 'gallery-multiple')
      fixture.data.images.push({
        id: 'portrait',
        src: `../../assets/projects/${id}/portrait.png`,
        alt: 'Tall blue gradient showing the complete portrait fixture',
        caption: 'A long portrait caption. '.repeat(50),
      });
    for (const image of fixture.data.images) {
      const name = image.src.split('/').at(-1)!;
      const destination = join(root, 'src/assets/projects', id, name);
      mkdirSync(dirname(destination), { recursive: true });
      cpSync(fileURLToPath(new URL(name, import.meta.url)), destination);
    }
    put(
      `src/content/projects/${id}.md`,
      `---\n${JSON.stringify(fixture.data)}\n---\n## The fixture story\n\n${fixture.body}\n\n\`\`\`ts title="fixture.ts"\nconst literal = "<tag> & value";\n\`\`\`\n`,
    );
  }
  put('src/content/projects/draft-empty.md', '---\ntags: [public]\n---\n');
  for (const [name, svg] of Object.entries(draftMedia))
    put(`src/assets/projects/draft-sentinel/${name}`, svg);
  put(
    'src/content/projects/draft-sentinel.md',
    '---\ntitle: Private draft sentinel\ntags: [private]\nimages:\n  - id: overview\n    src: ../../assets/projects/draft-sentinel/draft-gallery.svg\n    alt: Purple rectangle in the draft gallery fixture\n---\nUnfinished author preview.\n\n![Purple draft inline fixture](../../assets/projects/draft-sentinel/draft-inline.svg)',
  );
}
