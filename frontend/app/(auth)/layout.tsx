import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AuthLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get("jwt");

  // If user is already logged in, redirect to dashboard
  if (jwt) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}