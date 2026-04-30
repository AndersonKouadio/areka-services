import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-session';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/auth/sign-in');
  }
  return <>{children}</>;
}
