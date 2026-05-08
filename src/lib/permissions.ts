import type { Project, Task, User } from "@prisma/client";

export function canManageProject(user: Pick<User, "id" | "role">, project: Pick<Project, "ownerId">) {
  return user.role === "ADMIN" || project.ownerId === user.id;
}

export function canEditTask(user: Pick<User, "id" | "role">, task: Pick<Task, "assigneeId">, isProjectManager: boolean) {
  return isProjectManager || user.role === "ADMIN" || task.assigneeId === user.id;
}
