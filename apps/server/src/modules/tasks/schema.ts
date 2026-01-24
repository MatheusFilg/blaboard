import { z } from "zod";

export const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

export const taskLabelSchema = z.object({
	text: z.string().min(1),
	color: z.string().min(1),
});

export const createTaskSchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	priority: taskPrioritySchema.optional().default("NONE"),
	dueDate: z.string().datetime().optional(),
	labels: z.array(taskLabelSchema).optional().default([]),
	columnId: z.string().min(1),
	organizationId: z.string().min(1),
	assigneeId: z.string().optional(),
	createdById: z.string().min(1),
});

export const updateTaskSchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	priority: taskPrioritySchema.optional(),
	dueDate: z.string().datetime().optional(),
	labels: z.array(taskLabelSchema).optional(),
	order: z.number().int().optional(),
	columnId: z.string().optional(),
	assigneeId: z.string().nullable().optional(),
});

export const moveTaskSchema = z.object({
	taskId: z.string().min(1),
	columnId: z.string().min(1),
	order: z.number().int(),
});

export const reorderTasksSchema = z.object({
	tasks: z.array(
		z.object({
			id: z.string().min(1),
			order: z.number().int(),
			columnId: z.string().min(1),
		}),
	),
});

export const taskIdParamSchema = z.object({
	id: z.string().min(1),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type MoveTaskInput = z.infer<typeof moveTaskSchema>;
export type ReorderTasksInput = z.infer<typeof reorderTasksSchema>;
export type TaskLabel = z.infer<typeof taskLabelSchema>;
