import type { ProjectEntry, PublishedProjectEntry } from '../types/projects.ts';

/** Validated midnight UTC; independent of the browser timezone. */
export function calendarDateUTC(value: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error(`Invalid calendar date: ${value}`);
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  if (
    !Number.isFinite(timestamp) ||
    new Date(timestamp).toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`Invalid calendar date: ${value}`);
  }
  return timestamp;
}

export function compareProjectPublication(
  a: ProjectEntry<unknown>,
  b: ProjectEntry<unknown>,
): number {
  const dateOrder = (b.data.publishedOn ?? '').localeCompare(
    a.data.publishedOn ?? '',
  );
  return dateOrder || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

/** The single public selection policy. Production consumers always start here. */
export function selectPublicProjects<T extends ProjectEntry<unknown>>(
  entries: readonly T[],
): PublishedProjectEntry<T>[] {
  return entries
    .filter(
      (entry): entry is PublishedProjectEntry<T> => entry.data.draft === false,
    )
    .sort(compareProjectPublication);
}

export function developmentDays(
  startedOn: string,
  completedOn: string,
): number {
  const days =
    (calendarDateUTC(completedOn) - calendarDateUTC(startedOn)) / 86_400_000;
  if (days < 0) throw new Error('Completion cannot precede start');
  return days;
}

export function formatDevelopmentSpan(
  startedOn: string,
  completedOn: string,
): string {
  const days = developmentDays(startedOn, completedOn);
  const count = (n: number, unit: string) =>
    `${n} ${unit}${n === 1 ? '' : 's'}`;
  if (days === 0) return 'Same day';
  if (days < 14) return count(days, 'day');
  return [
    count(Math.floor(days / 7), 'week'),
    days % 7 ? count(days % 7, 'day') : '',
  ]
    .filter(Boolean)
    .join(', ');
}

export function formatProjectDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(calendarDateUTC(date));
}

export function projectHref(slug: string): string {
  return `/projects/${encodeURIComponent(slug)}/`;
}

export function projectCover<TImage>(project: ProjectEntry<TImage>) {
  return project.data.images.find(({ id }) => id === project.data.coverId);
}
