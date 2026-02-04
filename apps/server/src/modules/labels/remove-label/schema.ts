import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const removeLabelParamsSchema = z.object({
	taskId: z.string().min(1),
	labelId: z.string().min(1),
});

const remainingLabelSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: zHexColor,
});

export const removeLabelResponseSchema = z.object({
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
	createdAt: zDate,
	updatedAt: zDate,
	labelIds: z.array(z.string()),
	labels: z.array(remainingLabelSchema),
});
