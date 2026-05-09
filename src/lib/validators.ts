import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(1),
});

export const projectCreateSchema = z.object({
  name: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(500),
});

export const projectUpdateSchema = z.object({
  name: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(500).optional(),
  status: z.enum(["ACTIVE", "ON_HOLD", "ARCHIVED"]).optional(),
});

export const memberAddSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
});

export const taskCreateSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().trim().min(3).max(120),
  description: z
    .string()
    .max(500)
    .optional()
    .transform((value) => value?.trim() ?? ""),
  dueDate: z.string().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  assigneeId: z
    .string()
    .min(1)
    .nullable()
    .or(z.literal(""))
    .transform((val) => (val === "" ? null : val))
    .optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  description: z.string().trim().min(10).max(500).optional(),
  dueDate: z.string().nullable().optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "DONE"]).optional(),
  assigneeId: z.string().min(1).nullable().optional(),
});

export const taskStatusOnlySchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "BLOCKED", "DONE"]),
});
