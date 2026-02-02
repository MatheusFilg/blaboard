import Elysia from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { removeLabelUseCase } from "./use-case";
import { removeLabelParamsSchema, removeLabelResponseSchema } from "./schema";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";

export const removeLabelRouter = new Elysia().use(authMiddleware).patch(
	"/remove/:taskId/:labelId",
	async ({ params, status }) => {
		const result = await removeLabelUseCase(params.taskId, params.labelId);
		return status(200, result);
	},
	{
		requireOrganization: true,
		params: removeLabelParamsSchema,
		response: {
			200: removeLabelResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
