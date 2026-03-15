import { z } from "zod";

export const activityTypeSchema = z.enum([
    "TASK_CREATED",
    "TASK_COMPLETED",
    "TASK_UPDATED",
    "PROJECT_MEMBER_ADDED",
    "PROJECT_MILESTONE",
    "WORKSPACE_UPDATE",
    "COMMUNITY_POST",
]);

export const activitySchema = z.object({
    id: z.string(),
    userId: z.string(),
    userName: z.string(),
    userAvatar: z.string().optional(),
    type: activityTypeSchema,
    projectName: z.string().optional(),
    projectId: z.string().optional(),
    content: z.string(),
    createdAt: z.string(),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type ActivityType = z.infer<typeof activityTypeSchema>;
export type Activity = z.infer<typeof activitySchema>;
