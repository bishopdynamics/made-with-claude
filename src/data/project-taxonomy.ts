import type { ProjectTaxonomy } from '../types/projects.ts';

// Reviewed identifiers used by portfolio project metadata.
export const projectTaxonomy: ProjectTaxonomy = {
  tags: [
    { id: 'public', label: 'Public' },
    { id: 'private', label: 'Private' },
    { id: 'games', label: 'Games' },
    { id: 'graphics', label: 'Graphics' },
    { id: 'desktop', label: 'Desktop' },
    { id: 'emulation', label: 'Emulation' },
    { id: 'developer-tools', label: 'Developer tools' },
    { id: 'home-assistant', label: 'Home Assistant' },
    { id: 'kiosks', label: 'Kiosks' },
    { id: 'compatibility', label: 'Compatibility' },
    { id: 'self-hosted', label: 'Self-hosted' },
    { id: 'cameras', label: 'Cameras' },
    { id: 'dashboards', label: 'Dashboards' },
  ],
  languages: [
    { id: 'c', label: 'C' },
    { id: 'cpp', label: 'C++' },
    { id: 'python', label: 'Python' },
    { id: 'shell', label: 'Shell' },
    { id: 'rust', label: 'Rust' },
    { id: 'wgsl', label: 'WGSL' },
    { id: 'beamvm-dsl', label: 'BeamVM DSL' },
    { id: 'go', label: 'Go' },
    { id: 'typescript', label: 'TypeScript' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
  ],
};
