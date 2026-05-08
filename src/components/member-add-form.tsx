"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type MemberAddFormProps = {
  projectId: string;
};

export function MemberAddForm({ projectId }: MemberAddFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch(`/api/projects/${projectId}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to add member.");
      return;
    }

    (event.currentTarget as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
      <input
        name="email"
        type="email"
        required
        placeholder="Add member by email"
        className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Adding..." : "Add member"}
      </button>
      {message ? <p className="sm:basis-full text-sm text-rose-200">{message}</p> : null}
    </form>
  );
}
