"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "./sidebar";
import { BoardHeader } from "./board-header";
import { KanbanColumn } from "./kanban-column";
import { CreateTaskModal } from "./create-task-modal";
import { useBoard } from "@/hooks/use-board";
import type { Column, Task, CreateTaskInput } from "@/lib/types";

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

	const { columns, isLoading, error, createTask } = useBoard({
		organizationId,
	});

	const filteredColumns = useMemo(
		() => filterColumns(columns, searchQuery),
		[columns, searchQuery],
	);

	const totalTasks = useMemo(
		() => filteredColumns.reduce((acc, col) => acc + col.tasks.length, 0),
		[filteredColumns],
	);

	const handleCreateTask = async (input: Omit<CreateTaskInput, "organizationId" | "createdById">) => {
		await createTask({
			...input,
			organizationId,
			createdById: userId,
		});
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
				<div className="text-[#E85A4F]">{error}</div>
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
				<div className="flex flex-1 gap-4 overflow-x-auto">
					{filteredColumns.length === 0 ? (
						<div className="flex flex-1 items-center justify-center text-[#6B6B70]">
							No columns yet. Create your first column to get started.
						</div>
					) : (
						filteredColumns.map((column) => (
							<KanbanColumn key={column.id} column={column} />
						))
					)}
				</div>
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
