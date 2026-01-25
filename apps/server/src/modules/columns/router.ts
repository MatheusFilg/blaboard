import { Elysia } from "elysia";
import {
	createColumnSchema,
	updateColumnSchema,
	reorderColumnsSchema,
	getColumnsQuerySchema,
	columnIdParamSchema,
} from "./schema";
import * as columnUseCases from "./use-case";

export const columnsRouter = new Elysia({ prefix: "/columns" })
	.get("/", async ({ query }) => {
		const parsed = getColumnsQuerySchema.parse(query);
		return columnUseCases.getColumns(parsed.organizationId);
	})
	.post("/", async ({ body }) => {
		const parsed = createColumnSchema.parse(body);
		return columnUseCases.createColumn(parsed);
	})
	.patch("/:id", async ({ params, body }) => {
		const { id } = columnIdParamSchema.parse(params);
		const parsed = updateColumnSchema.parse(body);
		return columnUseCases.updateColumn(id, parsed);
	})
	.delete("/:id", async ({ params }) => {
		const { id } = columnIdParamSchema.parse(params);
		return columnUseCases.deleteColumn(id);
	})
	.post("/reorder", async ({ body }) => {
		const parsed = reorderColumnsSchema.parse(body);
		return columnUseCases.reorderColumns(parsed);
	});
