import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const updateMilestonesParamsSchema = z.object({
	id: z.string().min(1),
});

const milestoneStatusSchema = z.enum([
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
	"CANCELLED",
]);

export const updateMilestonesBodySchema = z.object({
	name: z.string().min(2).max(100).optional(),
	description: z.string().min(2).max(200).optional(),
	status: milestoneStatusSchema.optional(),
	startDate: zDate.optional(),
	endDate: zDate.optional(),
	taskIds: z.array(z.string()).optional(),
});

export type UpdateMilestonesBody = z.infer<typeof updateMilestonesBodySchema>;

export const updateMilestonesResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	status: z.string(),
	startDate: zDate.nullable(),
	endDate: zDate.nullable(),
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
