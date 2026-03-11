import { z } from "zod";

export const copilotMessageSchema = z.object({
    id: z.string(),
    role: z.enum(["user", "assistant"]),
    content: z.string(),
    createdAt: z.string(),
    context: z.object({
        pageTitle: z.string().optional(),
        activeTasks: z.array(z.string()).optional(),
    }).optional(),
});

export type CopilotMessage = z.infer<typeof copilotMessageSchema>;
