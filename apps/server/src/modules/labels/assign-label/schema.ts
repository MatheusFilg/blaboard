import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

const assignedLabelSchema = z.object({
	text: z.string(),
	color: zHexColor,
});

export const assignLabelParamsSchema = z.object({
	taskId: z.string().min(1),
	labelId: z.string().min(1),
});

export const assignLabelResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	priority: z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]),
	dueDate: zDate.nullable(),
	order: z.number(),
	organizationId: z.string(),
	columnId: z.string(),
	assigneeId: z.string().nullable(),
	createdById: z.string(),
	labelIds: z.array(z.string()),
	createdAt: zDate,
	updatedAt: zDate,
	labels: z.array(assignedLabelSchema),
});
