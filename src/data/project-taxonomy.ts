import type { ProjectTaxonomy } from '../types/projects.ts';

// Reviewed identifiers used by portfolio project metadata.
export const projectTaxonomy: ProjectTaxonomy = {
  tags: [
    { id: 'games', label: 'Games' },
    { id: 'graphics', label: 'Graphics' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'emulation', label: 'Emulation' },
    { id: 'developer-tools', label: 'Developer tools' },
  ],
  languages: [
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'shell', label: 'Shell' },
    { id: 'rust', label: 'Rust' },
    { id: 'wgsl', label: 'WGSL' },
    { id: 'beamvm-dsl', label: 'BeamVM DSL' },
  ],
};
