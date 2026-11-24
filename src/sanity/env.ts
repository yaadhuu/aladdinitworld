// Public by design: the project id and dataset identify the project, they do not unlock it.
// The read token (SANITY_API_READ_TOKEN) is server-only and is read in client.ts, never here.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2025-01-01';
export const hasSanity = /^[a-z0-9-]+$/.test(projectId);
