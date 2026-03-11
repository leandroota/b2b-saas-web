import { z } from "zod";

export const ProjectHealthSchema = z.object({
    projectId: z.string(),
    projectName: z.string(),
    status: z.enum(["Healthy", "At Risk", "Critical"]),
    progress: z.number().min(0).max(100),
    tasksTotal: z.number(),
    tasksCompleted: z.number(),
    blockingIssues: z.number(),
});

export const WorkspaceKPISchema = z.object({
    activeProjects: z.number(),
    completedTasksThisWeek: z.number(),
    avgVelocity: z.number(),
    totalBlockedItems: z.number(),
});

export type ProjectHealth = z.infer<typeof ProjectHealthSchema>;
export type WorkspaceKPI = z.infer<typeof WorkspaceKPISchema>;
