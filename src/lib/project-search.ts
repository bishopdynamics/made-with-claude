import type {
  ProjectEntry,
  ProjectFilterOptions,
  ProjectSearchRecord,
  ProjectSearchState,
  ProjectTaxonomy,
  TaxonomyOption,
} from '../types/projects.ts';
import { projectTaxonomy } from '../data/project-taxonomy.ts';
import { projectHref, selectPublicProjects } from './project-metadata.ts';

export function normalizeSearchText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/gu, ' ');
}

/** Safe for every production metadata/search caller, even when passed drafts. */
export function createProjectSearchRecords(
  entries: readonly ProjectEntry<unknown>[],
  taxonomy: ProjectTaxonomy = projectTaxonomy,
): ProjectSearchRecord[] {
  const labels = (ids: string[], options: readonly TaxonomyOption[]) =>
    ids.map((id) => {
      const option = options.find((option) => option.id === id);
      if (!option) throw new Error(`Unknown taxonomy identifier: ${id}`);
      return { ...option };
    });
  return selectPublicProjects(entries).map(({ id, data }) => {
    const tags = labels(data.tags, taxonomy.tags);
    const languages = labels(data.languages, taxonomy.languages);
    return {
      slug: id,
      href: projectHref(id),
      title: data.title,
      description: data.description,
      publishedOn: data.publishedOn,
      completedOn: data.completedOn,
      year: data.completedOn.slice(0, 4),
      tags,
      languages,
      searchText: normalizeSearchText(
        [
          data.title,
          data.description,
          ...tags.map(({ label }) => label),
          ...languages.map(({ label }) => label),
        ].join(' '),
      ),
    };
  });
}

/** Call once with all public records, never with the current filtered results. */
export function projectFilterOptions(
  records: readonly ProjectSearchRecord[],
): ProjectFilterOptions {
  const choices = (field: 'tags' | 'languages') =>
    [
      ...new Map(
        records
          .flatMap((record) => record[field])
          .map((option) => [option.id, option]),
      ).values(),
    ].sort(
      (a, b) =>
        a.label.localeCompare(b.label, 'en') || a.id.localeCompare(b.id, 'en'),
    );
  return {
    tags: choices('tags'),
    languages: choices('languages'),
    years: [...new Set(records.map(({ year }) => year))].sort().reverse(),
  };
}

export function filterProjects(
  records: readonly ProjectSearchRecord[],
  state: ProjectSearchState,
): ProjectSearchRecord[] {
  const query = normalizeSearchText(state.q);
  const tokens = query ? query.split(' ') : [];
  return records.filter(
    (record) =>
      tokens.every((token) => record.searchText.includes(token)) &&
      (!state.tag || record.tags.some(({ id }) => id === state.tag)) &&
      (!state.language ||
        record.languages.some(({ id }) => id === state.language)) &&
      (!state.year || record.year === state.year),
  );
}

export function parseProjectSearch(
  params: URLSearchParams,
  options: ProjectFilterOptions,
): ProjectSearchState {
  const choice = (name: string, ids: string[]) => {
    const value = params.get(name) ?? '';
    return ids.includes(value) ? value : '';
  };
  return {
    q: (params.get('q') ?? '').trim().replace(/\s+/gu, ' '),
    tag: choice(
      'tag',
      options.tags.map(({ id }) => id),
    ),
    language: choice(
      'language',
      options.languages.map(({ id }) => id),
    ),
    year: choice('year', options.years),
  };
}

export function serializeProjectSearch(
  state: ProjectSearchState,
  options: ProjectFilterOptions,
): URLSearchParams {
  const valid = parseProjectSearch(new URLSearchParams({ ...state }), options);
  return new URLSearchParams(
    Object.entries(valid).filter(([, value]) => value !== ''),
  );
}
