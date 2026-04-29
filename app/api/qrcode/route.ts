import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { genererQrCodeBuffer } from '@/lib/qrcode/generate';

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

const MIN_SIZE = 200;
const MAX_SIZE = 2000;
const DEFAULT_SIZE = 1500;

/**
 * GET /api/qrcode?size=1500
 * Renvoie un PNG du QR code Areka (pointe vers /rendez-vous).
 * Tailles autorisées : 200-2000 px (anti-DoS).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sizeParam = searchParams.get('size');
  const size = sizeParam ? parseInt(sizeParam, 10) : DEFAULT_SIZE;

  // Validation : entier dans la plage autorisée
  if (!Number.isInteger(size) || size < MIN_SIZE || size > MAX_SIZE) {
    return NextResponse.json(
      {
        error: `Paramètre size invalide. Entier entre ${MIN_SIZE} et ${MAX_SIZE}.`,
      },
      { status: 400 }
    );
  }

  // ETag déterministe — le QR est immuable pour un (url, size) donné
  // Pointe vers la racine : la home page héberge directement le formulaire RDV.
  const url = `${PUBLIC_URL}/`;
  const etag = `"${crypto
    .createHash('sha256')
    .update(`${url}:${size}`)
    .digest('hex')
    .slice(0, 16)}"`;

  if (request.headers.get('if-none-match') === etag) {
    return new NextResponse(null, { status: 304, headers: { ETag: etag } });
  }

  try {
    const buffer = await genererQrCodeBuffer(url, size);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="areka-qrcode-${size}px.png"`,
        'Cache-Control': 'public, max-age=86400',
        ETag: etag,
      },
    });
  } catch (err) {
    console.error('[qrcode] generation failed', err);
    return NextResponse.json(
      { error: 'Échec de la génération du QR code' },
      { status: 500 }
    );
  }
}
