import { z } from "zod";

export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);
export const taskStatusSchema = z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "REVIEW", "DONE"]);

export const taskSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "O título é obrigatório"),
    description: z.string().optional(),
    status: taskStatusSchema.default("BACKLOG"),
    priority: taskPrioritySchema.default("MEDIUM"),
    assigneeId: z.string().optional(),
    projectId: z.string(),
    workspaceId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    dueDate: z.string().optional(),
    labels: z.array(z.string()).default([]),
});

export type Task = z.infer<typeof taskSchema>;
export type TaskPriority = z.infer<typeof taskPrioritySchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
