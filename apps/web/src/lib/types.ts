export interface User {
	id: string;
	name: string;
	image: string | null;
}

export interface TaskLabel {
	text: string;
	color: string;
}

export interface Task {
	id: string;
	title: string;
	description: string | null;
	priority: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	dueDate: Date | string | null;
	order: number;
	labels: TaskLabel[];
	columnId: string;
	organizationId: string;
	assigneeId: string | null;
	assignee: User | null;
	createdById: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface Column {
	id: string;
	name: string;
	color: string | null;
	order: number;
	isCompleted: boolean;
	organizationId: string;
	tasks: Task[];
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface CreateTaskInput {
	title: string;
	description?: string;
	priority?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	dueDate?: string;
	labels?: TaskLabel[];
	columnId: string;
	organizationId: string;
	assigneeId?: string;
	createdById: string;
}

export interface UpdateTaskInput {
	title?: string;
	description?: string;
	priority?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	dueDate?: string;
	labels?: TaskLabel[];
	order?: number;
	columnId?: string;
	assigneeId?: string | null;
}

export interface MoveTaskInput {
	taskId: string;
	columnId: string;
	order: number;
}
