import 'server-only';
import { createClient } from '@sanity/client';
import { draftMode } from 'next/headers';
import { apiVersion, dataset, hasSanity, projectId } from './env';

// Read-only, server-side. Published documents only, so drafts are never shown to visitors.
// The token is optional for the live site: published content of a public dataset needs none.
// It is needed for preview (unpublished changes), and then only for editors who opened a preview link.
const token = process.env.SANITY_API_READ_TOKEN || undefined;

export const client = hasSanity
  ? createClient({ projectId, dataset, apiVersion, useCdn: !token, perspective: 'published', token })
  : null;

// Used only while preview mode is on: drafts first, never cached
const previewClient = hasSanity && token
  ? createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: 'drafts', token })
  : null;

async function previewing() {
  if (!previewClient) return false;
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // not inside a request (build, sitemap): never preview
  }
}

/** One cached read (about 60 seconds). Returns null when Sanity is not set up or cannot be reached. */
export async function sanityFetch<T>(query: string, params: Record<string, string | number> = {}): Promise<T | null> {
  if (!client) return null;
  try {
    if (previewClient && (await previewing())) {
      // the drafts view already hands back one version of each document
      return await previewClient.fetch<T>(query.replace('!(_id in path("drafts.**")) && ', ''), params, { cache: 'no-store' });
    }
    return await client.fetch<T>(query, params, { next: { revalidate: 60 } });
  } catch (error) {
    console.error('sanity: fetch failed', error instanceof Error ? error.message : 'unknown error');
    return null;
  }
}
