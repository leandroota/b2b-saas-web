import { z } from "zod";

export const chatMessageSchema = z.object({
    id: z.string(),
    content: z.string(),
    senderId: z.string(),
    senderName: z.string(),
    senderAvatar: z.string().optional(),
    createdAt: z.string(),
    type: z.enum(["TEXT", "FILE", "SYSTEM"]).default("TEXT"),
    metadata: z.record(z.string(), z.any()).optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
