import { NextResponse } from 'next/server';
import { genererQrCodeBuffer } from '@/lib/qrcode/generate';

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

/**
 * GET /api/qrcode?size=1500
 * Renvoie un PNG du QR code Areka (pointe vers /rendez-vous).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const size = parseInt(searchParams.get('size') ?? '1500', 10);

  const buffer = await genererQrCodeBuffer(`${PUBLIC_URL}/rendez-vous`, size);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="areka-qrcode-${size}px.png"`,
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
