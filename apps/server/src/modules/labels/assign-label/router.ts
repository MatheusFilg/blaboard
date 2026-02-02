import Elysia from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { assignLabelUseCase } from "./use-case";
import { assignLabelParamsSchema, assignLabelResponseSchema } from "./schema";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";

export const assignLabelRouter = new Elysia().use(authMiddleware).patch(
	"/assign/:taskId/:labelId",
	async ({ params, status }) => {
		const result = await assignLabelUseCase(params.taskId, params.labelId);
		return status(200, result);
	},
	{
		requireOrganization: true,
		params: assignLabelParamsSchema,
		response: {
			200: assignLabelResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
