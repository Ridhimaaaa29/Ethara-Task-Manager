import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10 lg:px-10">
      <div className="grid w-full gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <Link href="/" className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">
            Ethara
          </Link>
          <h1 className="text-5xl font-semibold text-white">Welcome back.</h1>
          <p className="max-w-xl text-lg leading-8 text-slate-300">
            Sign in to manage projects, assign tasks, and review progress from a single dashboard.
          </p>
        </section>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
