import { Download, Sticker, ScanLine } from 'lucide-react';
import { genererQrCodeDataUrl } from '@/lib/qrcode/generate';
import { QrCodePreview } from '@/features/qrcode/components/QrCodePreview';

const PUBLIC_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001';

export const metadata = {
  title: 'QR Code',
};

export default async function QrCodePage() {
  const targetUrl = `${PUBLIC_URL}/rendez-vous`;
  const dataUrl = await genererQrCodeDataUrl(targetUrl, 600);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">QR Code</h1>
        <p className="text-foreground/60 mt-1">
          À imprimer en sticker pour coller sur les chaudières des clients.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-[1fr_auto]">
        <div className="space-y-4 text-sm">
          <InfoCard icon={<ScanLine size={18} />} title="Comment ça marche">
            Le client scanne le QR code avec son téléphone et arrive sur le
            formulaire de prise de rendez-vous. Aucune app à installer.
          </InfoCard>

          <InfoCard icon={<Sticker size={18} />} title="Impression">
            Format recommandé : <strong>stickers 6 × 6 cm</strong> à 300 DPI
            minimum. Le PNG haute résolution ci-dessous (1500 px) couvre tous
            les besoins d&apos;impression.
          </InfoCard>

          <div className="border-border/40 bg-muted/30 rounded-xl border p-4">
            <p className="text-foreground/60 mb-3 text-xs">Téléchargements</p>
            <div className="flex flex-wrap gap-2">
              <a
                href="/api/qrcode?size=1500"
                download="areka-qrcode-1500px.png"
                className="button button--primary"
              >
                <Download size={16} />
                PNG 1500 px (impression)
              </a>
              <a
                href="/api/qrcode?size=600"
                download="areka-qrcode-600px.png"
                className="button button--outline"
              >
                <Download size={16} />
                PNG 600 px (web)
              </a>
            </div>
          </div>
        </div>

        <QrCodePreview dataUrl={dataUrl} url={targetUrl} />
      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border-border/50 rounded-xl border p-4">
      <p className="text-areka-navy mb-1.5 inline-flex items-center gap-2 text-sm font-semibold">
        {icon}
        {title}
      </p>
      <p className="text-foreground/70 leading-relaxed">{children}</p>
    </div>
  );
}
