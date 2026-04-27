import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import prisma from '@/lib/prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    // Areka = 1 seul admin (Julien). Le seed crée le user, on bloque toute autre inscription.
    disableSignUp: true,
  },
  plugins: [nextCookies()],
});
