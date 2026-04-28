import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null; // (protected) layout already redirects

  return (
    <AdminShell
      user={{
        name: session.user.name ?? null,
        email: session.user.email,
      }}
    >
      {children}
    </AdminShell>
  );
}
