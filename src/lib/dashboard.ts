import type { TaskStatus, User } from "@prisma/client";
import { prisma } from "@/lib/db";

type SessionUser = Pick<User, "id" | "name" | "email" | "role">;

function isOverdue(dueDate: Date | null, status: TaskStatus) {
  return Boolean(dueDate && status !== "DONE" && dueDate.getTime() < Date.now());
}

function toIso(value: Date | null) {
  return value ? value.toISOString() : null;
}

export async function getDashboardData(user: SessionUser) {
  // Show all projects if ADMIN; otherwise show projects user owns or is a member of
  const projectFilter = user.role === "ADMIN" 
    ? {} 
    : {
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      };

  const projects = await prisma.project.findMany({
    where: projectFilter,
    orderBy: { updatedAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, email: true, role: true } },
      members: {
        orderBy: { joinedAt: "asc" },
        include: { user: { select: { id: true, name: true, email: true, role: true } } },
      },
      tasks: {
        orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          createdBy: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });

  const transformedProjects = projects.map((project) => {
    const manager = user.role === "ADMIN" || project.ownerId === user.id;
    const tasks = project.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: toIso(task.dueDate),
      completedAt: toIso(task.completedAt),
      overdue: isOverdue(task.dueDate, task.status),
      assignee: task.assignee,
      canChangeStatus: manager || task.assigneeId === user.id,
    }));

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      owner: project.owner,
      canManage: manager,
      members: project.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        role: member.user.role,
      })),
      taskStats: {
        total: tasks.length,
        todo: tasks.filter((task) => task.status === "TODO").length,
        inProgress: tasks.filter((task) => task.status === "IN_PROGRESS").length,
        blocked: tasks.filter((task) => task.status === "BLOCKED").length,
        done: tasks.filter((task) => task.status === "DONE").length,
        overdue: tasks.filter((task) => task.overdue).length,
      },
      tasks,
    };
  });

  const allTasks = transformedProjects.flatMap((project) =>
    project.tasks.map((task) => ({
      ...task,
      projectId: project.id,
      projectName: project.name,
    })),
  );

  const counts = {
    projects: transformedProjects.length,
    tasks: allTasks.length,
    overdue: allTasks.filter((task) => task.overdue).length,
    done: allTasks.filter((task) => task.status === "DONE").length,
  };

  const recentTasks = [...allTasks]
    .sort((left, right) => {
      const leftTime = left.dueDate ? new Date(left.dueDate).getTime() : 0;
      const rightTime = right.dueDate ? new Date(right.dueDate).getTime() : 0;
      return rightTime - leftTime;
    })
    .slice(0, 6);

  const statusCounts = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"].map((status) => ({
    status,
    count: allTasks.filter((task) => task.status === status).length,
  }));

  return {
    user,
    projects: transformedProjects,
    recentTasks,
    counts,
    statusCounts,
  };
}
