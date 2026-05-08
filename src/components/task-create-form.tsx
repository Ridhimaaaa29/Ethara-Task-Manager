"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type MemberOption = {
  id: string;
  name: string;
  email: string;
};

type TaskCreateFormProps = {
  projectId: string;
  members: MemberOption[];
};

export function TaskCreateForm({ projectId, members }: TaskCreateFormProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, projectId }),
    });

    const result = (await response.json().catch(() => null)) as { error?: string } | null;
    setPending(false);

    if (!response.ok) {
      setMessage(result?.error ?? "Unable to create task.");
      return;
    }

    (event.currentTarget as HTMLFormElement).reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
      <div className="grid gap-3 lg:grid-cols-2">
        <input name="title" required placeholder="Task title" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
        <select name="priority" defaultValue="MEDIUM" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>
      <textarea name="description" required rows={3} placeholder="Task details" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400" />
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
        <input name="dueDate" type="date" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400" />
        <select name="assigneeId" defaultValue="" className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400">
          <option value="">Unassigned</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} ({member.email})
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating..." : "Create task"}
        </button>
      </div>
      {message ? <p className="text-sm text-rose-200">{message}</p> : null}
    </form>
  );
}
