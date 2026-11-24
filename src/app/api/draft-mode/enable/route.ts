import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { apiVersion, dataset, hasSanity, projectId } from '@/sanity/env';

// Opened by the "Preview on website" button in the Studio. The link carries a short-lived secret (valid for one hour) that the
// Studio made from the editor's login; Sanity confirms it here before preview mode is switched on.
export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!hasSanity || !token) return new Response('Preview is not set up on this website.', { status: 501 });

  const client = createClient({ projectId, dataset, apiVersion, useCdn: false, token });
  let result;
  try {
    result = await validatePreviewUrl(client, request.url);
  } catch {
    return new Response('Preview could not be checked. Check the read token, then try again.', { status: 502 });
  }
  const { isValid, redirectTo = '/' } = result;
  if (!isValid) return new Response('This preview link is not valid or has expired. Open it again from the Studio.', { status: 401 });

  // only pages on this website, never another address
  const to = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';
  (await draftMode()).enable();
  redirect(to);
}
