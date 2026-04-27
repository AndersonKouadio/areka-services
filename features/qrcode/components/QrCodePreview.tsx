import Image from 'next/image';

interface Props {
  dataUrl: string;
  url: string;
}

/**
 * Affiche le QR code avec le logo Areka centré (CSS overlay).
 * Le niveau H de correction d'erreur permet de couvrir ~25% du QR sans casser le scan.
 */
export function QrCodePreview({ dataUrl, url }: Props) {
  return (
    <div className="bg-card border-border/50 mx-auto w-fit rounded-2xl border p-6 shadow-sm">
      <div className="relative inline-block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          alt={`QR code vers ${url}`}
          className="block h-auto w-72 rounded-lg"
        />
        <div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-xl border-4 border-white bg-white p-1 shadow-md">
          <Image
            src="/icone.png"
            alt="Areka"
            width={64}
            height={64}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
      <p className="text-foreground/60 mt-4 break-all text-center text-xs">
        {url}
      </p>
    </div>
  );
}
