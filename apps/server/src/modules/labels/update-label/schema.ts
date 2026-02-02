import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const updateLabelParamsSchema = z.object({
	id: z.string().min(1),
});

export const updateLabelBodySchema = z.object({
	text: z.string().min(1).optional(),
	color: z.string().optional(),
});
export type UpdateLabelBodySchema = z.infer<typeof updateLabelBodySchema>;

export const updateLabelResponseSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: z.string(),
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
