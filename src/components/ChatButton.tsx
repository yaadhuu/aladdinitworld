'use client';

import { openChat } from '@/lib/whatsapp';

/** Opens the chat panel; usable inside server components */
export function ChatButton({ className = 'btn btn--secondary', children = 'Ask a question' }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" onClick={openChat} className={className}>
      {children}
    </button>
  );
}
