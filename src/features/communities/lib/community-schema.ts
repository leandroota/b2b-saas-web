import { z } from "zod";

export const communitySchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    emoji: z.string(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    memberCount: z.number(),
    postCount: z.number(),
    createdBy: z.string(),
    createdAt: z.string(),
    isPrivate: z.boolean().default(false),
});

export const createCommunitySchema = z.object({
    name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(50),
    description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres").max(200),
    emoji: z.string().min(1, "Escolha um emoji"),
    category: z.string().min(1, "Escolha uma categoria"),
    tags: z.array(z.string()).default([]),
    isPrivate: z.boolean().default(false),
});

export const communityPostSchema = z.object({
    id: z.string(),
    communityId: z.string(),
    communityName: z.string(),
    communityEmoji: z.string(),
    userId: z.string(),
    userName: z.string(),
    userRole: z.string(),
    content: z.string(),
    createdAt: z.string(),
    likesCount: z.number().default(0),
    commentsCount: z.number().default(0),
    mediaUrls: z.array(z.string()).optional(),
    mediaType: z.enum(['image', 'video']).optional(),
});

export const COMMUNITY_CATEGORIES = [
    "Tecnologia",
    "Design",
    "Carreira",
    "Hobbies",
    "Saúde & Bem-estar",
    "Cultura",
    "Esportes",
    "Outros",
] as const;

export type Community = z.infer<typeof communitySchema>;
export type CreateCommunity = z.infer<typeof createCommunitySchema>;
export type CommunityPost = z.infer<typeof communityPostSchema>;
