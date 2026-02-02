import z from "zod";
import { apiErrorSchema } from "@/shared/schemas/api-error";
import { zDate } from "@/shared/schemas/zod-date";

export const getLabelsResponseSchema = z.array(
	z.object({
		id: z.string(),
		text: z.string(),
		color: z.string(),
		taskIds: z.string().array(),
		organizationId: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
	}),
);

export const getLabelsNotFoundResponseSchema =
	apiErrorSchema("Labels not found");
