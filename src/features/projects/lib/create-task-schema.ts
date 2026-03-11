import { z } from "zod";
import { taskPrioritySchema, taskStatusSchema } from "./task-schema";

export const createTaskSchema = z.object({
    title: z.string().min(1, "O título é obrigatório").max(100),
    description: z.string().max(500).optional(),
    status: taskStatusSchema.default("TODO"),
    priority: taskPrioritySchema.default("MEDIUM"),
    assigneeId: z.string().optional(),
    projectId: z.string(),
    workspaceId: z.string(),
    dueDate: z.date().optional(),
    labels: z.array(z.string()).default([]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
