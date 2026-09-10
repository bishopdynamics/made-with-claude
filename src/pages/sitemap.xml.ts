import type { APIRoute } from 'astro';
import { getPublicProjects } from '../lib/projects.ts';
import { projectHref } from '../lib/project-metadata.ts';

const xmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
const escapeXml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => xmlEntities[character]!);

export const GET: APIRoute = async ({ site }) => {
  if (!site) throw new Error('Sitemap requires the canonical Astro site URL');
  const projects = await getPublicProjects();
  const entries: { path: string; lastmod?: string }[] = [
    { path: '/' },
    { path: '/projects/' },
    ...projects.map(({ id, data }) => ({
      path: projectHref(id),
      lastmod: data.updatedOn ?? data.publishedOn,
    })),
  ];
  const urls = entries.map(
    ({ path, lastmod }) =>
      `  <url><loc>${escapeXml(new URL(path, site).href)}</loc>${lastmod ? `<lastmod>${escapeXml(lastmod)}</lastmod>` : ''}</url>`,
  );
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
