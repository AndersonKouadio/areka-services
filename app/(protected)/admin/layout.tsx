import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { Sidebar } from '@/components/admin/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null; // (protected) layout already redirects

  return (
    <div className="flex min-h-screen">
      <Sidebar
        user={{
          name: session.user.name ?? null,
          email: session.user.email,
        }}
      />
      <div className="flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
