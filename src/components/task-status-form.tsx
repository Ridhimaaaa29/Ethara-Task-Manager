"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type TaskStatusFormProps = {
  taskId: string;
  status: string;
  canChangeStatus: boolean;
};

export function TaskStatusForm({ taskId, status, canChangeStatus }: TaskStatusFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [pending, setPending] = useState(false);

  async function handleChange(nextStatus: string) {
    setValue(nextStatus);
    setPending(true);

    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    setPending(false);
    router.refresh();
  }

  return (
    <label className="flex items-center gap-2 text-xs text-slate-300">
      <span>Status</span>
      <select
        value={value}
        disabled={!canChangeStatus || pending}
        onChange={(event) => handleChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-slate-100 outline-none transition disabled:cursor-not-allowed"
      >
        <option value="TODO">To do</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="BLOCKED">Blocked</option>
        <option value="DONE">Done</option>
      </select>
    </label>
  );
}
