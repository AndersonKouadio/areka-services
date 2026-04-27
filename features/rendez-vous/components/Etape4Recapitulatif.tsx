'use client';

import { useFormContext } from 'react-hook-form';
import { Calendar, Clock, MapPin, User, Mail, Phone, FileText } from 'lucide-react';
import { LIBELLE_TYPE } from '../utils/statut.utils';
import { formaterCreneau, formaterJour } from '@/features/planning/utils/planning.utils';
import type { CreateRendezVousDTO } from '../schemas/rendez-vous.schema';

export function Etape4Recapitulatif() {
  const { watch } = useFormContext<CreateRendezVousDTO>();
  const data = watch();

  const jour = data.dateRDV ? formaterJour(new Date(data.dateRDV)) : '—';

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-lg font-semibold">Récapitulatif</h3>
        <p className="text-foreground/60 mt-1 text-sm">
          Vérifiez vos informations avant d&apos;envoyer la demande.
        </p>
      </div>

      <div className="border-border/50 bg-muted/30 space-y-4 rounded-xl border p-5">
        <RecapLine
          icon={<Calendar size={16} />}
          label="Date"
          value={jour}
        />
        <RecapLine
          icon={<Clock size={16} />}
          label="Créneau"
          value={data.creneau ? formaterCreneau(data.creneau) : '—'}
        />
        <RecapLine
          icon={<FileText size={16} />}
          label="Type"
          value={data.type ? LIBELLE_TYPE[data.type] : '—'}
        />
        {data.description && (
          <RecapLine
            icon={<FileText size={16} />}
            label="Description"
            value={data.description}
          />
        )}
        <div className="border-border/40 my-4 border-t" />
        <RecapLine
          icon={<User size={16} />}
          label="Nom"
          value={`${data.clientPrenom ?? ''} ${data.clientNom ?? ''}`.trim() || '—'}
        />
        <RecapLine
          icon={<Mail size={16} />}
          label="Email"
          value={data.clientEmail ?? '—'}
        />
        <RecapLine
          icon={<Phone size={16} />}
          label="Téléphone"
          value={data.clientTelephone ?? '—'}
        />
        <RecapLine
          icon={<MapPin size={16} />}
          label="Adresse"
          value={data.clientAdresse ?? '—'}
        />
      </div>

      <p className="text-foreground/60 text-xs leading-relaxed">
        En envoyant ce formulaire, vous acceptez d&apos;être contacté par Areka
        Services à propos de votre demande. Aucun paiement n&apos;est demandé.
      </p>
    </div>
  );
}

function RecapLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-areka-navy mt-0.5">{icon}</span>
      <div className="flex-1">
        <p className="text-foreground/60 text-xs">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}
