import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { auth } from '../lib/auth';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding Areka Services database...\n');

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
  const ADMIN_NAME = process.env.ADMIN_NAME!;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'ADMIN_EMAIL et ADMIN_PASSWORD doivent être définis dans .env'
    );
  }

  // ─── ADMIN USER ─────────────────────────────────────────────────
  // Hash via Better-Auth pour que signIn fonctionne avec le même algo
  const ctx = await auth.$context;
  const hashedPassword = await ctx.password.hash(ADMIN_PASSWORD);

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      emailVerified: true,
      role: 'SUPER_ADMIN',
    },
    create: {
      id: 'admin-areka-001',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      emailVerified: true,
      role: 'SUPER_ADMIN',
    },
  });

  // Reset credential account pour s'assurer que le password est synchronisé
  await prisma.account.deleteMany({
    where: { userId: admin.id, providerId: 'credential' },
  });
  await prisma.account.create({
    data: {
      id: `admin-cred-${Date.now()}`,
      accountId: admin.id,
      providerId: 'credential',
      userId: admin.id,
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user créé / mis à jour');
  console.log(`   Email : ${ADMIN_EMAIL}`);
  console.log(`   Role  : SUPER_ADMIN`);

  // ─── PLANNING HEBDO PAR DÉFAUT ──────────────────────────────────
  // Cf. cahier des charges :
  //  Lun-Ven matin 8h30→11h30 + après-midi variable
  //  Sam/Dim fermé
  const CRENEAUX_MATIN = [
    '8h30-9h30',
    '9h30-10h30',
    '10h30-11h30',
    '11h30-12h30',
  ];
  const CRENEAUX_APREM_STANDARD = [
    '13h30-14h30',
    '14h30-15h30',
    '15h30-16h30',
    '16h30-17h30',
  ];
  const CRENEAUX_APREM_JEUDI = [...CRENEAUX_APREM_STANDARD, '17h30-18h30'];

  const planningDefaut: Array<{
    jourSemaine: number;
    actif: boolean;
    creneaux: string[];
  }> = [
    { jourSemaine: 0, actif: false, creneaux: [] }, // dimanche
    { jourSemaine: 1, actif: true, creneaux: [...CRENEAUX_MATIN, ...CRENEAUX_APREM_STANDARD] }, // lundi
    { jourSemaine: 2, actif: true, creneaux: [...CRENEAUX_MATIN] }, // mardi (matin only per cahier)
    { jourSemaine: 3, actif: true, creneaux: [...CRENEAUX_MATIN, ...CRENEAUX_APREM_STANDARD] }, // mercredi
    { jourSemaine: 4, actif: true, creneaux: [...CRENEAUX_MATIN, ...CRENEAUX_APREM_JEUDI] }, // jeudi (étendu)
    { jourSemaine: 5, actif: true, creneaux: [...CRENEAUX_MATIN, ...CRENEAUX_APREM_STANDARD] }, // vendredi
    { jourSemaine: 6, actif: false, creneaux: [] }, // samedi
  ];

  for (const p of planningDefaut) {
    await prisma.planning.upsert({
      where: { jourSemaine: p.jourSemaine },
      update: {}, // ne pas écraser si admin a déjà personnalisé
      create: p,
    });
  }
  console.log('✅ Planning hebdomadaire par défaut configuré');

  console.log('\n🎉 Seeding terminé.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
