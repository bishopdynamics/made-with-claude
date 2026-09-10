import { z } from 'astro/zod';
import type { ProjectTaxonomy } from '../types/projects.ts';
import { calendarDateUTC } from './project-metadata.ts';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Check the raw basename, before a loader can normalize it or honor a slug override. */
export function canonicalProjectSlug(file: string): string {
  const basename = file.replaceAll('\\', '/').split('/').at(-1)!;
  const slug = basename.slice(0, -3);
  if (!basename.endsWith('.md') || !slugPattern.test(slug)) {
    throw new Error(`${file}: filename must be a lowercase kebab-case slug.md`);
  }
  return slug;
}

export function validateProjectFiles(
  files: readonly string[],
): Map<string, string> {
  const paths = new Map<string, string>();
  for (const file of files) {
    const slug = canonicalProjectSlug(file);
    const previous = paths.get(slug);
    if (previous)
      throw new Error(`${file}: duplicate slug "${slug}" (also ${previous})`);
    paths.set(slug, file);
  }
  for (const file of files) {
    if (file.includes('/') || file.includes('\\')) {
      throw new Error(
        `${file}: project Markdown must be directly in the projects directory`,
      );
    }
  }
  return paths;
}

const calendarDate = z.string().refine((value) => {
  try {
    calendarDateUTC(value);
    return true;
  } catch {
    return false;
  }
}, 'Expected a real calendar date in YYYY-MM-DD format (quote YAML dates)');
const text = z.string().trim().min(1, 'Must not be empty');
const httpsUrl = z.url().refine((value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}, 'Expected an HTTPS URL without credentials');
const imageId = text.regex(
  slugPattern,
  'Expected a lowercase kebab-case image ID',
);
export const localImagePath = text.refine(
  (value) => /^(?:\.\/|\.\.\/)/.test(value) && !/[?#\\]/.test(value),
  'Expected a relative local image path, without a URL, query, or fragment',
);
const altText = text.refine(
  (value) =>
    !/^(?:image|photo|picture|screenshot|placeholder|todo)(?:\s*\d+)?(?:\.[a-z]+)?$/i.test(
      value,
    ),
  'Describe the image content; a generic image label is not meaningful alt text',
);

function taxonomyIds(options: ProjectTaxonomy['tags']) {
  const known = new Set(options.map(({ id }) => id));
  return z
    .array(text.refine((id) => known.has(id), 'Unknown taxonomy identifier'))
    .default([])
    .refine(
      (ids) => new Set(ids).size === ids.length,
      'Duplicate taxonomy identifiers',
    );
}

/** Inject Astro's image() in the collection; the loader also validates raw localImagePath. */
export function createProjectSchema<TImage extends z.ZodType>(
  image: TImage,
  taxonomy: ProjectTaxonomy,
) {
  return z
    .strictObject({
      draft: z.boolean().default(true),
      title: text.optional(),
      description: text
        .refine(
          (value) => !/[\r\n<>]/.test(value),
          'Use a short plain-text summary',
        )
        .optional(),
      publishedOn: calendarDate.optional(),
      updatedOn: calendarDate.optional(),
      startedOn: calendarDate.optional(),
      completedOn: calendarDate.optional(),
      languages: taxonomyIds(taxonomy.languages),
      tags: taxonomyIds(taxonomy.tags),
      repositoryUrl: httpsUrl.optional(),
      releaseUrl: httpsUrl.optional(),
      videoUrl: httpsUrl.optional(),
      images: z
        .array(
          z.strictObject({
            id: imageId,
            src: image,
            alt: altText,
            caption: text.optional(),
          }),
        )
        .default([]),
      coverId: imageId.optional(),
      coverPosition: z
        .strictObject({
          x: z.number().min(0).max(100),
          y: z.number().min(0).max(100),
        })
        .default({ x: 50, y: 50 }),
    })
    .superRefine((data, ctx) => {
      const issue = (path: (string | number)[], message: string) =>
        ctx.addIssue({ code: 'custom', path, message });
      const publicSource = data.tags.includes('public');
      const privateSource = data.tags.includes('private');
      if (publicSource && privateSource)
        issue(
          ['tags'],
          'Public and private source tags are mutually exclusive',
        );
      if (privateSource && data.repositoryUrl)
        issue(
          ['repositoryUrl'],
          'Private-source projects must omit repositoryUrl',
        );
      if (!data.draft) {
        if (!publicSource && !privateSource)
          issue(
            ['tags'],
            'Publication requires one source availability tag: public or private',
          );
        if (publicSource && !data.repositoryUrl)
          issue(
            ['repositoryUrl'],
            'Required for publication with public source',
          );
      }
      if (
        data.startedOn &&
        data.completedOn &&
        data.completedOn < data.startedOn
      ) {
        issue(['completedOn'], 'Completion cannot precede start');
      }
      const ids = new Set<string>();
      data.images.forEach((image, index) => {
        if (ids.has(image.id))
          issue(['images', index, 'id'], 'Duplicate image ID');
        ids.add(image.id);
      });
      if (data.coverId && !ids.has(data.coverId))
        issue(['coverId'], 'Cover must reference an image ID in images');
      if (!data.draft) {
        for (const field of [
          'title',
          'description',
          'publishedOn',
          'startedOn',
          'completedOn',
          'coverId',
        ] as const) {
          if (!data[field]) issue([field], 'Required for publication');
        }
        for (const field of ['languages', 'tags', 'images'] as const) {
          if (!data[field].length)
            issue([field], 'At least one is required for publication');
        }
      }
    });
}

export function validateProjectBody(
  draft: boolean,
  body: string,
  file: string,
): void {
  if (!draft && !body.replace(/<!--[\s\S]*?-->/g, '').trim()) {
    throw new Error(
      `${file}: body: a published project needs a nonempty Markdown article`,
    );
  }
}
