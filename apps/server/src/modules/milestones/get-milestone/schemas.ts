import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

const taskMilestoneSchema = z.object({
	id: z.string(),
	title: z.string(),
});

const milestoneStatusSchema = z.enum([
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
	status: milestoneStatusSchema,
	startDate: zDate.nullable(),
	endDate: zDate.nullable(),
	tasks: z.array(taskMilestoneSchema),
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
