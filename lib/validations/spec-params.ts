import { z } from "zod";

export const specRouteParamsSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  specId: z.string().min(1, "Spec ID is required").optional(),
});

export const specDetailSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  createdAt: z.string(),
  content: z.string(),
});

export type SpecDetailParsed = z.infer<typeof specDetailSchema>;

export const specListItemSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
});

export type SpecListItemParsed = z.infer<typeof specListItemSchema>;
