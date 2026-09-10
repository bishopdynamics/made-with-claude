import type { ImageMetadata } from 'astro';

export interface TaxonomyOption {
  id: string;
  label: string;
}

export interface ProjectTaxonomy {
  tags: readonly TaxonomyOption[];
  languages: readonly TaxonomyOption[];
}

export interface ProjectImage<TImage = ImageMetadata> {
  id: string;
  src: TImage;
  alt: string;
  caption?: string;
}

/** Incomplete metadata is allowed only while draft is true. */
export interface ProjectData<TImage = ImageMetadata> {
  draft: boolean;
  title?: string;
  description?: string;
  publishedOn?: string;
  updatedOn?: string;
  startedOn?: string;
  completedOn?: string;
  languages: string[];
  tags: string[];
  repositoryUrl?: string;
  releaseUrl?: string;
  videoUrl?: string;
  images: ProjectImage<TImage>[];
  coverId?: string;
  coverPosition: { x: number; y: number };
}

export type PublishedProjectData<TImage = ImageMetadata> =
  ProjectData<TImage> & {
    draft: false;
    title: string;
    description: string;
    publishedOn: string;
    startedOn: string;
    completedOn: string;
    coverId: string;
  };

/** Structurally compatible with Astro CollectionEntry<'projects'>. */
export interface ProjectEntry<TImage = ImageMetadata> {
  id: string;
  data: ProjectData<TImage>;
  body?: string;
}

export type PublishedProjectEntry<T extends ProjectEntry<unknown>> = T & {
  data: PublishedProjectData<T['data']['images'][number]['src']>;
};

/** JSON-safe public metadata for the catalog; never includes article or assets. */
export interface ProjectSearchRecord {
  slug: string;
  href: string;
  title: string;
  description: string;
  publishedOn: string;
  completedOn: string;
  year: string;
  tags: TaxonomyOption[];
  languages: TaxonomyOption[];
  searchText: string;
}

export interface ProjectFilterOptions {
  tags: TaxonomyOption[];
  languages: TaxonomyOption[];
  years: string[];
}

export interface ProjectSearchState {
  q: string;
  tag: string;
  language: string;
  year: string;
}
