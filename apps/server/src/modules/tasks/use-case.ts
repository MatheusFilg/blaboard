import prisma from "@blaboard/db";
import type {
	CreateTaskInput,
	MoveTaskInput,
	ReorderTasksInput,
	UpdateTaskInput,
} from "./schema";

const taskInclude = {
	column: true,
	assignee: {
		select: { id: true, name: true, image: true },
	},
	createdBy: {
		select: { id: true, name: true, image: true },
	},
} as const;

export async function getTask(id: string) {
	return prisma.task.findUnique({
		where: { id },
		include: taskInclude,
	});
}

export async function createTask(input: CreateTaskInput) {
	const lastTask = await prisma.task.findFirst({
		where: { columnId: input.columnId },
		orderBy: { order: "desc" },
	});

	return prisma.task.create({
		data: {
			title: input.title,
			description: input.description,
			priority: input.priority,
			dueDate: input.dueDate ? new Date(input.dueDate) : null,
			labels: input.labels,
			order: lastTask ? lastTask.order + 1 : 0,
			columnId: input.columnId,
			organizationId: input.organizationId,
			assigneeId: input.assigneeId,
			createdById: input.createdById,
		},
		include: {
			column: true,
			assignee: {
				select: { id: true, name: true, image: true },
			},
		},
	});
}

export async function updateTask(id: string, input: UpdateTaskInput) {
	return prisma.task.update({
		where: { id },
		data: {
			title: input.title,
			description: input.description,
			priority: input.priority,
			dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
			labels: input.labels,
			order: input.order,
			columnId: input.columnId,
			assigneeId: input.assigneeId,
		},
		include: {
			column: true,
			assignee: {
				select: { id: true, name: true, image: true },
			},
		},
	});
}

export async function deleteTask(id: string) {
	await prisma.task.delete({ where: { id } });
	return { success: true };
}

export async function moveTask(input: MoveTaskInput) {
	return prisma.task.update({
		where: { id: input.taskId },
		data: {
			columnId: input.columnId,
			order: input.order,
		},
		include: {
			column: true,
			assignee: {
				select: { id: true, name: true, image: true },
			},
		},
	});
}

export async function reorderTasks(input: ReorderTasksInput) {
	const updates = input.tasks.map((task) =>
		prisma.task.update({
			where: { id: task.id },
			data: { order: task.order, columnId: task.columnId },
		}),
	);
	await prisma.$transaction(updates);
	return { success: true };
}
