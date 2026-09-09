import type { ProjectTaxonomy } from '../types/projects.ts';

// Reviewed identifiers used by portfolio project metadata.
export const projectTaxonomy: ProjectTaxonomy = {
  tags: [
    { id: 'games', label: 'Games' },
    { id: 'graphics', label: 'Graphics' },
    { id: 'desktop', label: 'Desktop' },
  ],
  languages: [
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'shell', label: 'Shell' },
  ],
};
