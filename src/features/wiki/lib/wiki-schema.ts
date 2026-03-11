import { z } from "zod";

export const wikiPageSchema = z.object({
    id: z.string(),
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    category: z.string().default("Geral"),
    authorId: z.string(),
    authorName: z.string(),
    lastUpdatedAt: z.string(),
    tags: z.array(z.string()).default([]),
});

export type WikiPage = z.infer<typeof wikiPageSchema>;

export const wikiCategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string().optional(),
});

export type WikiCategory = z.infer<typeof wikiCategorySchema>;
