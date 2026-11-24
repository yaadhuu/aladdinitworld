import { draftMode } from 'next/headers';

// Shown only to an editor who opened a preview link: a clear reminder that this is not what visitors see.
export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-[60] flex flex-wrap items-center justify-between gap-x-6 gap-y-1 bg-[var(--ink)] px-4 py-3 text-[14px] text-white">
      <span>Preview: you are seeing changes that are not published yet.</span>
      <a href="/api/draft-mode/disable" className="underline underline-offset-4">Exit preview</a>
    </div>
  );
}
