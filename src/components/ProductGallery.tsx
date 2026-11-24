'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  video?: string;
  productName: string;
}

export function ProductGallery({ images, video, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalItems = images.length + (video ? 1 : 0);
  const clampedIndex = Math.min(activeIndex, totalItems - 1);
  const isVideo = video && clampedIndex === images.length;

  const prev = () => setActiveIndex((i) => (i - 1 + totalItems) % totalItems);
  const next = () => setActiveIndex((i) => (i + 1) % totalItems);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-accent/20"
        style={{ boxShadow: '0 0 40px rgba(201,168,76,0.08)' }}
      >
        {isVideo && video ? (
          <iframe
            src={video}
            title={`${productName} — video`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <Image
            src={images[clampedIndex] ?? images[0]}
            alt={`${productName} — view ${clampedIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={clampedIndex === 0}
          />
        )}

        {totalItems > 1 && !isVideo && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-lg transition-all backdrop-blur-sm"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center text-lg transition-all backdrop-blur-sm"
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}

        {totalItems > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm">
            {clampedIndex + 1} / {totalItems}
          </div>
        )}
      </div>

      {totalItems > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                clampedIndex === idx && !isVideo
                  ? 'border-accent shadow-lg shadow-accent/20 scale-105'
                  : 'border-transparent hover:border-accent/40'
              }`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}

          {video && (
            <button
              onClick={() => setActiveIndex(images.length)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl border-2 transition-all bg-zinc-900 flex flex-col items-center justify-center gap-0.5 ${
                isVideo
                  ? 'border-accent shadow-lg shadow-accent/20 scale-105'
                  : 'border-transparent hover:border-accent/40'
              }`}
            >
              <span className="text-white text-xl leading-none">▶</span>
              <span className="text-white text-xs">Video</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
