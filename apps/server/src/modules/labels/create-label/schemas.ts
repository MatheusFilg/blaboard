import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const createLabelBodySchema = z.object({
	text: z.string().min(1).max(100),
	color: z.string().min(1).max(100),
});

export type CreateLabelInput = z.infer<typeof createLabelBodySchema>;

export const createLabelResponseSchema = z.object({
	id: z.string(),
	text: z.string().min(1).max(100),
	color: z.string().min(1).max(100),
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
