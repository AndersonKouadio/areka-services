import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  FileText,
  Hash,
  Tag,
  Info,
} from 'lucide-react';
import { ChipStatut, ChipType } from './ChipStatut';
import { BlockLine } from './BlockLine';
import { LIBELLE_SOURCE } from '../../utils/statut.utils';
import { formaterCreneau } from '@/features/planning/utils/planning.utils';
import type { RendezVous } from '@prisma/client';

interface DetailProps {
  rdv: RendezVous;
}

export function DetailRendezVous({ rdv }: DetailProps) {
  return (
    <div className="bg-card border-border/50 space-y-6 rounded-xl border p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-foreground/60 text-xs font-medium uppercase">
            Référence
          </p>
          <p className="mt-1 font-mono text-lg font-semibold">{rdv.reference}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ChipType type={rdv.type} />
          <ChipStatut statut={rdv.statut} />
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        <BlockLine label="Date" icon={<Calendar size={16} />}>
          {new Date(rdv.dateRDV).toLocaleDateString('fr-FR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </BlockLine>
        <BlockLine label="Créneau" icon={<Clock size={16} />}>
          {formaterCreneau(rdv.creneau)}
        </BlockLine>
        <BlockLine label="Source" icon={<Tag size={16} />}>
          {LIBELLE_SOURCE[rdv.source]}
        </BlockLine>
        <BlockLine label="Reçue le" icon={<Hash size={16} />}>
          {new Date(rdv.createdAt).toLocaleString('fr-FR')}
        </BlockLine>
      </section>

      <section className="border-border/40 border-t pt-5">
        <h3 className="text-foreground/60 mb-3 text-xs font-medium uppercase">
          Client
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <BlockLine label="Nom" icon={<User size={16} />}>
            {rdv.clientPrenom} {rdv.clientNom}
          </BlockLine>
          <BlockLine label="Téléphone" icon={<Phone size={16} />}>
            <a
              href={`tel:${rdv.clientTelephone}`}
              className="hover:text-areka-orange"
            >
              {rdv.clientTelephone}
            </a>
          </BlockLine>
          <BlockLine label="Email" icon={<Mail size={16} />}>
            <a
              href={`mailto:${rdv.clientEmail}`}
              className="hover:text-areka-orange break-all"
            >
              {rdv.clientEmail}
            </a>
          </BlockLine>
          <BlockLine label="Adresse" icon={<MapPin size={16} />}>
            {rdv.clientAdresse}
          </BlockLine>
        </div>
      </section>

      {rdv.description && (
        <section className="border-border/40 border-t pt-5">
          <BlockLine label="Description" icon={<FileText size={16} />}>
            <p className="whitespace-pre-wrap">{rdv.description}</p>
          </BlockLine>
        </section>
      )}

      {(rdv.notesAdmin || rdv.motifRefus || rdv.datePropose) && (
        <section className="border-border/40 border-t pt-5">
          <h3 className="text-foreground/60 mb-3 text-xs font-medium uppercase">
            Notes admin
          </h3>
          <div className="space-y-3">
            {rdv.notesAdmin && (
              <BlockLine label="Note interne" icon={<Info size={16} />}>
                {rdv.notesAdmin}
              </BlockLine>
            )}
            {rdv.motifRefus && (
              <BlockLine label="Motif refus" icon={<Info size={16} />}>
                {rdv.motifRefus}
              </BlockLine>
            )}
            {rdv.datePropose && rdv.creneauPropose && (
              <BlockLine label="Nouvelle date proposée" icon={<Calendar size={16} />}>
                {new Date(rdv.datePropose).toLocaleDateString('fr-FR')} —{' '}
                {formaterCreneau(rdv.creneauPropose)}
              </BlockLine>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
