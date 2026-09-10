import type {
  ProjectEntry,
  ProjectTaxonomy,
} from '../../../src/types/projects.ts';

/** Synthetic vocabulary lives only in tests, never the production taxonomy. */
export const fixtureTaxonomy: ProjectTaxonomy = {
  tags: [
    { id: 'public', label: 'Public' },
    { id: 'private', label: 'Private' },
    { id: 'graphics', label: 'Graphics' },
    { id: 'tools', label: 'Developer tools' },
  ],
  languages: [
    { id: 'cpp', label: 'C++' },
    { id: 'ts', label: 'TypeScript' },
  ],
};

export function publishedFixture(
  id = 'fixture-project',
  availability: 'public' | 'private' = 'public',
): ProjectEntry<string> {
  return {
    id,
    data: {
      draft: false,
      title: 'Café renderer',
      description: 'A literal C++ <tool> & graphics demo.',
      publishedOn: '2026-09-07',
      startedOn: '2026-02-20',
      completedOn: '2026-03-07',
      languages: ['cpp'],
      tags: ['graphics', availability],
      ...(availability === 'public'
        ? { repositoryUrl: 'https://example.invalid/source' }
        : {}),
      images: [
        {
          id: 'overview',
          src: `../../assets/projects/${id}/overview.svg`,
          alt: 'Colored rectangles in a synthetic renderer window',
        },
      ],
      coverId: 'overview',
      coverPosition: { x: 50, y: 50 },
    },
    body: 'This is synthetic fixture content, never a real portfolio project.',
  };
}

export const fixtureSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90"><rect width="160" height="90" fill="#d4a15a"/></svg>';
