"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ProjectCreateForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to create project.");
      return;
    }

    (event.currentTarget as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-5 md:grid-cols-[1fr_1fr_auto]">
      <input
        name="name"
        required
        placeholder="Project name"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
      />
      <input
        name="description"
        required
        placeholder="Short description"
        className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating..." : "Create project"}
      </button>
      {message ? <p className="md:col-span-3 text-sm text-rose-200">{message}</p> : null}
    </form>
  );
}
