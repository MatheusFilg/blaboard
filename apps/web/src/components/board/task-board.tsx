"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Sidebar } from "./sidebar";
import { BoardHeader } from "./board-header";
import { KanbanColumn } from "./kanban-column";
import { CreateTaskModal } from "./create-task-modal";
import { AddColumn } from "./add-column";
import { EmptyBoard } from "./empty-board";
import {
	useColumns,
	useCreateTask,
	useCreateColumn,
	useDeleteColumn,
	useCreateDefaultColumns,
} from "@/hooks/use-board";
import { DEFAULT_COLUMNS } from "@/lib/types";
import type { Column, CreateTaskInput } from "@/lib/types";

interface TaskBoardProps {
	organizationId: string;
	userId: string;
}

function filterColumns(columns: Column[], query: string): Column[] {
	if (!query.trim()) return columns;
	const lowerQuery = query.toLowerCase();

	return columns.map((column) => ({
		...column,
		tasks: column.tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(lowerQuery) ||
				task.description?.toLowerCase().includes(lowerQuery) ||
				task.labels?.some((label) =>
					label.text.toLowerCase().includes(lowerQuery),
				),
		),
	}));
}

export function TaskBoard({ organizationId, userId }: TaskBoardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const { data: columns = [], isLoading, error } = useColumns(organizationId);
	const createTaskMutation = useCreateTask(organizationId);
	const createColumnMutation = useCreateColumn(organizationId);
	const deleteColumnMutation = useDeleteColumn(organizationId);
	const createDefaultColumnsMutation = useCreateDefaultColumns(organizationId);

	const filteredColumns = useMemo(
		() => filterColumns(columns, searchQuery),
		[columns, searchQuery],
	);

	const totalTasks = useMemo(
		() => filteredColumns.reduce((acc, col) => acc + col.tasks.length, 0),
		[filteredColumns],
	);

	const handleCreateTask = async (
		input: Omit<CreateTaskInput, "organizationId" | "createdById">,
	) => {
		try {
			await createTaskMutation.mutateAsync({
				...input,
				organizationId,
				createdById: userId,
			});
			toast.success("Task created successfully");
		} catch {
			toast.error("Failed to create task");
		}
	};

	const handleCreateColumn = async (name: string) => {
		try {
			await createColumnMutation.mutateAsync({
				name,
				organizationId,
			});
			toast.success("Column created successfully");
		} catch {
			toast.error("Failed to create column");
		}
	};

	const handleDeleteColumn = async (id: string) => {
		const column = columns.find((c) => c.id === id);
		if (column && column.tasks.length > 0) {
			toast.error("Cannot delete column with tasks. Move or delete tasks first.");
			return;
		}

		try {
			await deleteColumnMutation.mutateAsync(id);
			toast.success("Column deleted successfully");
		} catch {
			toast.error("Failed to delete column");
		}
	};

	const handleCreateDefaultColumns = async () => {
		try {
			await createDefaultColumnsMutation.mutateAsync([...DEFAULT_COLUMNS]);
			toast.success("Default columns created successfully");
		} catch {
			toast.error("Failed to create default columns");
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0B0B0E]">
				<div className="text-[#6B6B70]">Loading board...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0B0B0E]">
				<div className="text-[#E85A4F]">{error.message}</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-[#0B0B0E]">
			<Sidebar />

			{/* Main Content */}
			<main className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
				<BoardHeader
					title="Project Overview"
					subtitle={`${totalTasks} tasks · ${columns.length} columns`}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onNewTask={() => setIsModalOpen(true)}
				/>

				{/* Board Area */}
				{columns.length === 0 ? (
					<EmptyBoard
						onCreateDefaultColumns={handleCreateDefaultColumns}
						isLoading={createDefaultColumnsMutation.isPending}
					/>
				) : (
					<div className="flex flex-1 gap-4 overflow-x-auto pb-4">
						{filteredColumns.map((column) => (
							<KanbanColumn
								key={column.id}
								column={column}
								onDelete={handleDeleteColumn}
							/>
						))}
						<AddColumn
							onAdd={handleCreateColumn}
							isLoading={createColumnMutation.isPending}
						/>
					</div>
				)}
			</main>

			{/* Create Task Modal */}
			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				columns={columns}
				onSubmit={handleCreateTask}
			/>
		</div>
	);
}
