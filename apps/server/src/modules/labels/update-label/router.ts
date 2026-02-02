import Elysia  from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { updateLabelBodySchema, updateLabelParamsSchema, updateLabelResponseSchema } from "./schema";
import { updateLabelUseCase } from "./use-case";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";

export const updateLabelRouter = new Elysia().use(authMiddleware).patch(
	"/:id",
	async ({ params, body, status }) => {
		const result = await updateLabelUseCase(params.id, body);
		return status(200, result);
	},
	{
    body: updateLabelBodySchema,
		params: updateLabelParamsSchema,
		response: {
			200: updateLabelResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
