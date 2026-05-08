import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";

export default async function Home() {
  const user = await getSessionUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-between px-6 py-8 lg:px-10">
      <header className="flex items-center justify-between rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Ethara</p>
          <p className="text-xs text-slate-400">Team task manager</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/login" className="rounded-full border border-white/10 px-4 py-2 text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
            Sign in
          </Link>
          <Link href="/signup" className="rounded-full bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300">
            Get started
          </Link>
        </div>
      </header>

      <section className="grid gap-10 py-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            Admin/member access, project control, and live task status in one place.
          </div>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-7xl">
              A focused workspace for projects, people, and progress.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300">
              Ethara gives teams a clean, deployable task manager with authenticated users, REST APIs, PostgreSQL data, and a dashboard built for fast selection demos.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Create account
            </Link>
            <Link href="/login" className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-cyan-400/10">
              Login to dashboard
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur">
          <div className="space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-200/70">Included</p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li>• Signup/login with secure httpOnly cookies</li>
              <li>• Admin/member permissions on projects and tasks</li>
              <li>• Projects, members, task assignment, and overdue tracking</li>
              <li>• REST APIs backed by Prisma and PostgreSQL</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
