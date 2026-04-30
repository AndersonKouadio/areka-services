import { getSession } from '@/lib/auth-session';
import { AdminShell } from '@/components/admin/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
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
