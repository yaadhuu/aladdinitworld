interface ComingSoonPosterProps {
  label?: string;
}

// Inline SVG "Photo Coming Soon" poster — on-brand gold/black, renders
// instantly with zero external requests. Used whenever a product doesn't
// yet have a real photo of the actual unit.
export function ComingSoonPoster({ label = 'Photo Coming Soon' }: ComingSoonPosterProps) {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="diagonalLines" width="14" height="14" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="14" stroke="#C9A84C" strokeOpacity="0.08" strokeWidth="8" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#diagonalLines)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A)' }}
        >
          <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
        <p className="font-display font-bold text-sm text-black dark:text-white">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[180px] leading-relaxed">
          Real unit photos arriving shortly — message us on WhatsApp for current photos
        </p>
      </div>
    </div>
  );
}
