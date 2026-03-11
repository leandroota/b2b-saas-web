import { z } from "zod";

export const projectMethodologySchema = z.enum(["AGILE", "KANBAN", "LIST", "PLANNING"]);

export const createProjectSchema = z.object({
    name: z.string().min(3, "O nome do projeto deve ter no mínimo 3 caracteres").max(50),
    description: z.string().max(200).optional(),
    methodology: projectMethodologySchema,
    workspaceId: z.string(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type ProjectMethodology = z.infer<typeof projectMethodologySchema>;
