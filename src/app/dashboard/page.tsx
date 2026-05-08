import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { LogoutButton } from "@/components/logout-button";
import { ProjectCreateForm } from "@/components/project-create-form";
import { MemberAddForm } from "@/components/member-add-form";
import { TaskCreateForm } from "@/components/task-create-form";
import { TaskStatusForm } from "@/components/task-status-form";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value: string | null) {
  if (!value) {
    return "No due date";
  }

  return dateFormatter.format(new Date(value));
}

function statusPill(status: string) {
  switch (status) {
    case "DONE":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-100";
    case "IN_PROGRESS":
      return "border-cyan-400/30 bg-cyan-400/10 text-cyan-100";
    case "BLOCKED":
      return "border-amber-400/30 bg-amber-400/10 text-amber-100";
    default:
      return "border-white/10 bg-white/5 text-slate-200";
  }
}

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  const data = await getDashboardData({ id: user.id, name: user.name, email: user.email, role: user.role });

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">Ethara dashboard</p>
          <h1 className="mt-2 text-4xl font-semibold text-white">Hello, {data.user.name}</h1>
          <p className="mt-2 text-slate-300">
            Role: <span className="font-semibold text-cyan-100">{data.user.role}</span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Projects" value={data.counts.projects.toString()} />
        <MetricCard label="Tasks" value={data.counts.tasks.toString()} />
        <MetricCard label="Overdue" value={data.counts.overdue.toString()} tone="danger" />
        <MetricCard label="Completed" value={data.counts.done.toString()} tone="success" />
      </section>

      {data.user.role === "ADMIN" ? (
        <section className="mt-10 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Create project</h2>
            <p className="text-slate-400">Admins can create new projects and immediately start assigning work.</p>
          </div>
          <ProjectCreateForm />
        </section>
      ) : null}

      <section className="mt-10 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">Projects</h2>
              <p className="text-slate-400">Project membership, task creation, and status updates live here.</p>
            </div>
          </div>

          <div className="space-y-6">
            {data.projects.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-300">
                No projects yet. Create the first project to unlock task tracking.
              </div>
            ) : null}

            {data.projects.map((project) => (
              <article key={project.id} className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
                      <span className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] ${statusPill(project.status)}`}>
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="max-w-3xl text-slate-300">{project.description}</p>
                    <p className="text-sm text-slate-400">
                      Owned by <span className="text-slate-200">{project.owner.name}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4 lg:min-w-[24rem]">
                    <MiniStat label="Tasks" value={project.taskStats.total.toString()} />
                    <MiniStat label="Open" value={(project.taskStats.todo + project.taskStats.inProgress + project.taskStats.blocked).toString()} />
                    <MiniStat label="Done" value={project.taskStats.done.toString()} tone="success" />
                    <MiniStat label="Late" value={project.taskStats.overdue.toString()} tone="danger" />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.members.map((member) => (
                    <span key={member.id} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                      {member.name}
                    </span>
                  ))}
                </div>

                {project.canManage ? <MemberAddForm projectId={project.id} /> : null}

                {project.canManage ? <TaskCreateForm projectId={project.id} members={project.members} /> : null}

                <div className="mt-6 space-y-3">
                  {project.tasks.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
                      No tasks yet.
                    </div>
                  ) : null}

                  {project.tasks.map((task) => (
                    <div key={task.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-lg font-semibold text-white">{task.title}</h4>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
                              {task.priority}
                            </span>
                            {task.overdue ? <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-rose-100">Overdue</span> : null}
                          </div>
                          <p className="max-w-4xl text-sm leading-6 text-slate-300">{task.description}</p>
                          <p className="text-xs text-slate-400">Due {formatDate(task.dueDate)}</p>
                          <p className="text-xs text-slate-400">
                            Assigned to <span className="text-slate-200">{task.assignee ? task.assignee.name : "Unassigned"}</span>
                          </p>
                        </div>
                        <TaskStatusForm taskId={task.id} status={task.status} canChangeStatus={task.canChangeStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Progress overview</h2>
            <div className="mt-6 space-y-3">
              {data.statusCounts.map((item) => (
                <div key={item.status} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <span>{item.status.replace("_", " ")}</span>
                  <span className="font-semibold text-cyan-100">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 backdrop-blur">
            <h2 className="text-2xl font-semibold text-white">Recent work</h2>
            <div className="mt-5 space-y-3">
              {data.recentTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm font-medium text-white">{task.title}</p>
                  <p className="text-xs text-slate-400">{task.projectName}</p>
                  <p className="mt-2 text-xs text-slate-300">{task.status.replace("_", " ")} · {formatDate(task.dueDate)}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function MetricCard({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "danger" }) {
  const toneStyles = tone === "success" ? "border-emerald-400/20 bg-emerald-400/10" : tone === "danger" ? "border-rose-400/20 bg-rose-400/10" : "border-white/10 bg-white/5";

  return (
    <div className={`rounded-[2rem] border p-6 backdrop-blur ${toneStyles}`}>
      <p className="text-sm text-slate-300">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "danger" }) {
  const toneStyles = tone === "success" ? "text-emerald-100" : tone === "danger" ? "text-rose-100" : "text-slate-100";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${toneStyles}`}>{value}</p>
    </div>
  );
}
