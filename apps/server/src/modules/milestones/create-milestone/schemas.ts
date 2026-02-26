import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

const milestonesStatusSchema = z.enum([
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
	"CANCELLED",
]);

export const createMilestonesBodySchema = z.object({
	name: z.string().min(2).max(100),
	description: z.string().min(2).max(200).nullable(),
	status: milestonesStatusSchema,
	startDate: zDate.nullable(),
	endDate: zDate.nullable(),
});

export type CreateMilestonesInput = z.infer<typeof createMilestonesBodySchema>;

export const createMilestonesResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	status: milestonesStatusSchema,
	startDate: zDate.nullable(),
	endDate: zDate.nullable(),
	organizationId: z.string(),
	taskIds: z.array(z.string()),
	createdAt: zDate,
	updatedAt: zDate,
});
