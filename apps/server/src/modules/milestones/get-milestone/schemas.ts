import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

const milestonesStatusSchema = z.enum([
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
	"CANCELLED",
]);

export const getMilestoneParamsSchema = z.object({
	id: z.string().min(2),
});

export const getMilestoneResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	status: milestonesStatusSchema,
	startDate: zDate.nullable(),
	progress: z.number().min(0).max(100),
	endDate: zDate.nullable(),
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
