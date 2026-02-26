import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

const taskMilestonesSchema = z.object({
	id: z.string(),
	title: z.string(),
});

const milestoneStatusSchema = z.enum([
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
	"CANCELLED",
]);

export const getMilestonesResponseSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable(),
		status: milestoneStatusSchema,
		startDate: zDate.nullable(),
		endDate: zDate.nullable(),
		tasks: z.array(taskMilestonesSchema),
		taskIds: z.array(z.string()),
		organizationId: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
	}),
);
