import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fixtureTaxonomy, publishedFixture } from './fixtures.ts';

export const literalCaption =
  'A literal </script><script>caption</script> & "quoted" view.';
export const literalTitle =
  'Café </script><script>literal project title</script>';

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
    const fixture = publishedFixture(id);
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
  put('src/content/projects/draft-empty.md', '---\n{}\n---\n');
  put(
    'src/content/projects/draft-sentinel.md',
    '---\ntitle: Private draft sentinel\n---\nUnfinished author preview.',
  );
}
