import QRCode from 'qrcode';
import sharp from 'sharp';
import path from 'path';

const FOREGROUND = '#1A1612'; // noir chaud Areka
const BACKGROUND = '#FAF7F2'; // crème ivory

/**
 * Génère un QR code en data URL (base64) — pour affichage navigateur sans logo.
 * Niveau de correction H (30%) → reste scannable même avec un logo overlay au centre.
 */
export async function genererQrCodeDataUrl(
  url: string,
  size = 1024
): Promise<string> {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    width: size,
    margin: 2,
    color: {
      dark: FOREGROUND,
      light: BACKGROUND,
    },
  });
}

/**
 * Génère un QR code PNG avec le logo Areka centré (haute résolution).
 * Cahier des charges : impression stickers 6×6 cm @ 300 DPI = ~720px.
 * On génère 1500px pour permettre des stickers plus grands ou impressions HD.
 *
 * Le logo occupe ~20% de la taille (sous le seuil 25% du niveau H = QR reste scannable).
 * Un padding blanc autour du logo améliore le contraste pour le scan.
 */
export async function genererQrCodeBuffer(
  url: string,
  size = 1500
): Promise<Buffer> {
  // 1. QR code de base (sans logo)
  const qrBuffer = await QRCode.toBuffer(url, {
    errorCorrectionLevel: 'H',
    width: size,
    margin: 2,
    color: {
      dark: FOREGROUND,
      light: BACKGROUND,
    },
  });

  // 2. Logo redimensionné
  const logoTargetSize = Math.floor(size * 0.18); // 18% de la taille QR
  const padding = Math.floor(logoTargetSize * 0.12);
  const tileSize = logoTargetSize + padding * 2;

  const logoPath = path.join(process.cwd(), 'public', 'icone.png');
  const logoResized = await sharp(logoPath)
    .resize(logoTargetSize, logoTargetSize, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toBuffer();

  // 3. Tile blanc arrondi avec le logo au centre (pour contraste sur le QR)
  const radius = Math.floor(tileSize * 0.18);
  const roundedSquareSvg = Buffer.from(
    `<svg width="${tileSize}" height="${tileSize}">
      <rect x="0" y="0" width="${tileSize}" height="${tileSize}" rx="${radius}" ry="${radius}" fill="white" />
    </svg>`
  );

  const tile = await sharp({
    create: {
      width: tileSize,
      height: tileSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: roundedSquareSvg },
      { input: logoResized, gravity: 'center' },
    ])
    .png()
    .toBuffer();

  // 4. Composite final : tile centré sur le QR
  return sharp(qrBuffer)
    .composite([{ input: tile, gravity: 'center' }])
    .png()
    .toBuffer();
}
