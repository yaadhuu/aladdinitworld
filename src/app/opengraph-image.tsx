import { ImageResponse } from 'next/og';
import { SITE_CONFIG } from '@/config';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A0A0A',
          position: 'relative',
        }}
      >
        {/* Gold glow accent */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            top: -100,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 400,
            background: 'radial-gradient(circle, rgba(201,168,76,0.25), transparent)',
            borderRadius: '50%',
          }}
        />

        {/* Logo badge */}
        <div
          style={{
            display: 'flex',
            width: 90,
            height: 90,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 700,
            color: '#0A0A0A',
            marginBottom: 36,
          }}
        >
          A
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          Aladdin IT World
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#C9A84C',
            fontWeight: 500,
            marginBottom: 8,
          }}
        >
          Certified Pre-Owned MacBooks
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 22,
            color: '#9CA3AF',
          }}
        >
          100+ Point Inspected · Warranty Included · {SITE_CONFIG.region}
        </div>
      </div>
    ),
    { ...size }
  );
}
