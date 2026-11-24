import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #C9A84C, #E8C96A)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#0A0A0A',
          borderRadius: 6,
        }}
      >
        A
      </div>
    ),
    { ...size }
  );
}
