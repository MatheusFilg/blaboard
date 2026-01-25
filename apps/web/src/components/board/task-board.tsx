"use client";

import {
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	MeasuringStrategy,
	PointerSensor,
	pointerWithin,
	TouchSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	useColumns,
	useCreateColumn,
	useCreateDefaultColumns,
	useCreateTask,
	useDeleteColumn,
	useMoveTask,
	useReorderTasks,
} from "@/hooks/board";
import type { Column, CreateTaskInput, Task } from "@/lib/types";
import { DEFAULT_COLUMNS } from "@/lib/types";
import { AddColumn } from "./add-column";
import { BoardHeader } from "./board-header";
import { CreateTaskModal } from "./create-task-modal";
import { DraggableTaskCard } from "./draggable-task-card";
import { EmptyBoard } from "./empty-board";
import { KanbanColumn } from "./kanban-column";
import { Sidebar } from "./sidebar";

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
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [localColumns, setLocalColumns] = useState<Column[]>([]);

	const dragStartState = useRef<{
		columnId: string;
		taskIndex: number;
	} | null>(null);

	const isPendingMutation = useRef(false);

	const lastMoveRef = useRef<{ taskId: string; columnId: string } | null>(null);

	const { data: columns = [], isLoading, error } = useColumns(organizationId);
	const createTaskMutation = useCreateTask(organizationId);
	const createColumnMutation = useCreateColumn(organizationId);
	const deleteColumnMutation = useDeleteColumn(organizationId);
	const createDefaultColumnsMutation = useCreateDefaultColumns(organizationId);
	const moveTaskMutation = useMoveTask(organizationId);
	const reorderTasksMutation = useReorderTasks(organizationId);

	useEffect(() => {
		if (!activeTask && !isPendingMutation.current) {
			setLocalColumns(columns);
		}
	}, [columns, activeTask]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 3,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 150,
				tolerance: 5,
			},
		}),
	);

	const measuring = {
		droppable: {
			strategy: MeasuringStrategy.Always,
		},
	};

	const filteredColumns = useMemo(
		() => filterColumns(localColumns, searchQuery),
		[localColumns, searchQuery],
	);

	const totalTasks = useMemo(
		() => filteredColumns.reduce((acc, col) => acc + col.tasks.length, 0),
		[filteredColumns],
	);

	const findColumnByTaskId = useCallback(
		(taskId: string): Column | undefined => {
			return localColumns.find((col) =>
				col.tasks.some((task) => task.id === taskId),
			);
		},
		[localColumns],
	);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			const { active } = event;
			const taskId = active.id as string;

			lastMoveRef.current = null;

			const column = findColumnByTaskId(taskId);
			if (column) {
				const taskIndex = column.tasks.findIndex((t) => t.id === taskId);
				const task = column.tasks[taskIndex];
				if (task) {
					setActiveTask(task);
					dragStartState.current = {
						columnId: column.id,
						taskIndex,
					};
				}
			}
		},
		[findColumnByTaskId],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over || !activeTask) return;

			const activeId = active.id as string;
			const overId = over.id as string;

			if (activeId === overId) return;

			const overData = over.data.current;
			const isOverColumn = overData?.type === "column";
			const isOverTask = overData?.type === "task";

			if (!isOverColumn && !isOverTask) return;

			setLocalColumns((currentColumns) => {
				const sourceColIndex = currentColumns.findIndex((col) =>
					col.tasks.some((t) => t.id === activeId),
				);
				if (sourceColIndex === -1) return currentColumns;

				let targetColIndex: number;
				if (isOverColumn) {
					targetColIndex = currentColumns.findIndex((col) => col.id === overId);
				} else {
					targetColIndex = currentColumns.findIndex((col) =>
						col.tasks.some((t) => t.id === overId),
					);
				}
				if (targetColIndex === -1) return currentColumns;

				if (sourceColIndex === targetColIndex) {
					return currentColumns;
				}

				const targetColumnId = currentColumns[targetColIndex].id;

				if (
					lastMoveRef.current?.taskId === activeId &&
					lastMoveRef.current?.columnId === targetColumnId
				) {
					return currentColumns;
				}

				const sourceCol = currentColumns[sourceColIndex];
				const activeTaskIndex = sourceCol.tasks.findIndex(
					(t) => t.id === activeId,
				);
				if (activeTaskIndex === -1) return currentColumns;

				const task = sourceCol.tasks[activeTaskIndex];

				const insertIndex = isOverColumn
					? currentColumns[targetColIndex].tasks.length
					: currentColumns[targetColIndex].tasks.findIndex(
							(t) => t.id === overId,
						);

				lastMoveRef.current = { taskId: activeId, columnId: targetColumnId };

				const newColumns = [...currentColumns];

				newColumns[sourceColIndex] = {
					...newColumns[sourceColIndex],
					tasks: newColumns[sourceColIndex].tasks.filter(
						(t) => t.id !== activeId,
					),
				};

				const targetTasks = [...newColumns[targetColIndex].tasks];
				targetTasks.splice(insertIndex === -1 ? 0 : insertIndex, 0, task);
				newColumns[targetColIndex] = {
					...newColumns[targetColIndex],
					tasks: targetTasks,
				};

				return newColumns;
			});
		},
		[activeTask],
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			const startState = dragStartState.current;

			isPendingMutation.current = true;

			setActiveTask(null);
			dragStartState.current = null;

			if (!over || !startState) {
				isPendingMutation.current = false;
				setLocalColumns(columns);
				return;
			}

			const activeId = active.id as string;

			const currentColumn = localColumns.find((col) =>
				col.tasks.some((t) => t.id === activeId),
			);

			if (!currentColumn) {
				isPendingMutation.current = false;
				setLocalColumns(columns);
				return;
			}

			const currentIndex = currentColumn.tasks.findIndex(
				(t) => t.id === activeId,
			);

			const columnChanged = currentColumn.id !== startState.columnId;
			const indexChanged = currentIndex !== startState.taskIndex;

			if (!columnChanged && !indexChanged) {
				isPendingMutation.current = false;
				return;
			}

			if (columnChanged) {
				try {
					await moveTaskMutation.mutateAsync({
						taskId: activeId,
						columnId: currentColumn.id,
						order: currentIndex,
					});
				} catch {
					toast.error("Failed to move task");
					setLocalColumns(columns);
				}
			} else if (indexChanged) {
				const reorderedTasks = currentColumn.tasks.map((task, index) => ({
					id: task.id,
					order: index,
					columnId: currentColumn.id,
				}));

				try {
					await reorderTasksMutation.mutateAsync(reorderedTasks);
				} catch {
					toast.error("Failed to reorder tasks");
					setLocalColumns(columns);
				}
			}

			isPendingMutation.current = false;
			lastMoveRef.current = null;
		},
		[columns, localColumns, moveTaskMutation, reorderTasksMutation],
	);

	const handleDragCancel = useCallback(() => {
		setActiveTask(null);
		dragStartState.current = null;
		isPendingMutation.current = false;
		lastMoveRef.current = null;
		setLocalColumns(columns);
	}, [columns]);

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
		const column = localColumns.find((c) => c.id === id);
		if (column && column.tasks.length > 0) {
			toast.error(
				"Cannot delete column with tasks. Move or delete tasks first.",
			);
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

			<main className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
				<BoardHeader
					title="Project Overview"
					subtitle={`${totalTasks} tasks · ${columns.length} columns`}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onNewTask={() => setIsModalOpen(true)}
				/>

				{localColumns.length === 0 ? (
					<EmptyBoard
						onCreateDefaultColumns={handleCreateDefaultColumns}
						isLoading={createDefaultColumnsMutation.isPending}
					/>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={pointerWithin}
						measuring={measuring}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDragEnd={handleDragEnd}
						onDragCancel={handleDragCancel}
					>
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

						<DragOverlay dropAnimation={null}>
							{activeTask && (
								<div className="rotate-1 scale-[1.02] cursor-grabbing opacity-95 shadow-2xl shadow-black/30">
									<DraggableTaskCard
										task={activeTask}
										isCompleted={
											findColumnByTaskId(activeTask.id)?.isCompleted ?? false
										}
									/>
								</div>
							)}
						</DragOverlay>
					</DndContext>
				)}
			</main>

			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				columns={columns}
				onSubmit={handleCreateTask}
			/>
		</div>
	);
}
