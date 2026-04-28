import { Phone, ShieldCheck, Info, FileText } from 'lucide-react';

/**
 * Panneau latéral affiché en mode 'admin' du formulaire de RDV.
 * Remplace `InfoAreka` (qui s'adresse au client public).
 */
export function InfoAdminManuel() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="bg-areka-orange/15 text-areka-orange flex size-12 shrink-0 items-center justify-center rounded-full">
          <ShieldCheck size={22} />
        </div>
        <div>
          <p className="font-semibold leading-tight">Création manuelle</p>
          <p className="text-foreground/60 text-xs">
            Espace administrateur — Areka
          </p>
        </div>
      </div>

      <div>
        <p className="text-foreground/60 text-xs uppercase tracking-wider">
          Nouveau rendez-vous
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-tight">
          Saisie côté admin
        </h2>
        <p className="text-foreground/70 mt-3 text-sm leading-relaxed">
          Pour les RDV pris au téléphone ou par d&apos;autres canaux. Le rendez-vous
          sera créé en statut <strong>confirmé</strong> directement.
        </p>
      </div>

      <ul className="bg-muted/40 border-border/40 space-y-3 rounded-xl border p-4 text-sm">
        <li className="flex items-start gap-2">
          <ShieldCheck size={16} className="text-areka-green mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Statut automatique</p>
            <p className="text-foreground/60 text-xs">
              CONFIRMÉ — pas d&apos;attente de validation
            </p>
          </div>
        </li>
        <li className="flex items-start gap-2">
          <Phone size={16} className="text-areka-navy mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Source : MANUEL</p>
            <p className="text-foreground/60 text-xs">
              Le RDV apparaît dans la liste avec un tag &quot;Saisie manuelle&quot;.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-2">
          <FileText size={16} className="text-areka-amber mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Email + SMS au client</p>
            <p className="text-foreground/60 text-xs">
              Confirmation envoyée automatiquement avec la référence.
            </p>
          </div>
        </li>
      </ul>

      <div className="text-foreground/60 inline-flex items-start gap-2 text-xs">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>
          Pour modifier un RDV existant, ouvre sa fiche et utilise les actions
          (valider / refuser / proposer une autre date).
        </p>
      </div>
    </div>
  );
}
