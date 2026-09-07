import { getCollection } from 'astro:content';
import {
  compareProjectPublication,
  selectPublicProjects,
} from './project-metadata.ts';

/** Use for every public route, sitemap, and metadata output, including during dev. */
export async function getPublicProjects() {
  return selectPublicProjects(await getCollection('projects'));
}

/** Author-preview route/card queries must opt in, and retain data.draft for labeling. */
export async function getProjectsForDevelopment() {
  if (!import.meta.env.DEV)
    throw new Error('Draft project queries are available only in development');
  return (await getCollection('projects')).sort(compareProjectPublication);
}
