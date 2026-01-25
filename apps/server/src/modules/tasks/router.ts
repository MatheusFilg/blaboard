import { Elysia } from "elysia";
import {
	createTaskSchema,
	moveTaskSchema,
	reorderTasksSchema,
	taskIdParamSchema,
	updateTaskSchema,
} from "./schema";
import * as taskUseCases from "./use-case";

export const tasksRouter = new Elysia({ prefix: "/tasks" })
	.get("/:id", async ({ params }) => {
		const { id } = taskIdParamSchema.parse(params);
		return taskUseCases.getTask(id);
	})
	.post("/", async ({ body }) => {
		const parsed = createTaskSchema.parse(body);
		return taskUseCases.createTask(parsed);
	})
	.patch("/:id", async ({ params, body }) => {
		const { id } = taskIdParamSchema.parse(params);
		const parsed = updateTaskSchema.parse(body);
		return taskUseCases.updateTask(id, parsed);
	})
	.delete("/:id", async ({ params }) => {
		const { id } = taskIdParamSchema.parse(params);
		return taskUseCases.deleteTask(id);
	})
	.post("/move", async ({ body }) => {
		const parsed = moveTaskSchema.parse(body);
		return taskUseCases.moveTask(parsed);
	})
	.post("/reorder", async ({ body }) => {
		const parsed = reorderTasksSchema.parse(body);
		return taskUseCases.reorderTasks(parsed);
	});
