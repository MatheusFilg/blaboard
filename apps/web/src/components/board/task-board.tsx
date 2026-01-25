"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	pointerWithin,
	MeasuringStrategy,
	type DragStartEvent,
	type DragEndEvent,
	type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import { Sidebar } from "./sidebar";
import { BoardHeader } from "./board-header";
import { KanbanColumn } from "./kanban-column";
import { CreateTaskModal } from "./create-task-modal";
import { AddColumn } from "./add-column";
import { EmptyBoard } from "./empty-board";
import { DraggableTaskCard } from "./draggable-task-card";
import {
	useColumns,
	useCreateTask,
	useCreateColumn,
	useDeleteColumn,
	useCreateDefaultColumns,
	useMoveTask,
	useReorderTasks,
} from "@/hooks/use-board";
import { DEFAULT_COLUMNS } from "@/lib/types";
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
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [localColumns, setLocalColumns] = useState<Column[]>([]);

	// Track original position for server sync
	const dragStartState = useRef<{
		columnId: string;
		taskIndex: number;
	} | null>(null);

	// Track if we're waiting for a mutation to complete
	const isPendingMutation = useRef(false);

	const { data: columns = [], isLoading, error } = useColumns(organizationId);
	const createTaskMutation = useCreateTask(organizationId);
	const createColumnMutation = useCreateColumn(organizationId);
	const deleteColumnMutation = useDeleteColumn(organizationId);
	const createDefaultColumnsMutation = useCreateDefaultColumns(organizationId);
	const moveTaskMutation = useMoveTask(organizationId);
	const reorderTasksMutation = useReorderTasks(organizationId);

	// Sync local state with server data when not dragging and not pending mutation
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

			setLocalColumns((currentColumns) => {
				// Find current position of the active task
				const sourceColIndex = currentColumns.findIndex((col) =>
					col.tasks.some((t) => t.id === activeId),
				);
				if (sourceColIndex === -1) return currentColumns;

				const sourceCol = currentColumns[sourceColIndex];
				const activeTaskIndex = sourceCol.tasks.findIndex(
					(t) => t.id === activeId,
				);
				if (activeTaskIndex === -1) return currentColumns;

				const task = sourceCol.tasks[activeTaskIndex];

				// Check if over a column or a task
				const overColumnIndex = currentColumns.findIndex(
					(col) => col.id === overId,
				);
				const overTaskColumnIndex = currentColumns.findIndex((col) =>
					col.tasks.some((t) => t.id === overId),
				);

				// Determine target column
				let targetColIndex: number;
				let insertIndex: number;

				if (overColumnIndex !== -1) {
					// Dropped on a column - add to end
					targetColIndex = overColumnIndex;
					insertIndex = currentColumns[targetColIndex].tasks.length;
					// If same column, subtract 1 because we'll remove the task first
					if (sourceColIndex === targetColIndex) {
						insertIndex = currentColumns[targetColIndex].tasks.length - 1;
					}
				} else if (overTaskColumnIndex !== -1) {
					// Dropped on a task
					targetColIndex = overTaskColumnIndex;
					const overTaskIndex = currentColumns[targetColIndex].tasks.findIndex(
						(t) => t.id === overId,
					);
					insertIndex = overTaskIndex;
				} else {
					return currentColumns;
				}

				// Same column reordering
				if (sourceColIndex === targetColIndex) {
					if (activeTaskIndex === insertIndex) return currentColumns;

					const newColumns = [...currentColumns];
					const newTasks = arrayMove(
						newColumns[sourceColIndex].tasks,
						activeTaskIndex,
						insertIndex,
					);
					newColumns[sourceColIndex] = {
						...newColumns[sourceColIndex],
						tasks: newTasks,
					};
					return newColumns;
				}

				// Cross-column move
				const newColumns = [...currentColumns];

				// Remove from source
				newColumns[sourceColIndex] = {
					...newColumns[sourceColIndex],
					tasks: newColumns[sourceColIndex].tasks.filter(
						(t) => t.id !== activeId,
					),
				};

				// Add to target
				const targetTasks = [...newColumns[targetColIndex].tasks];
				targetTasks.splice(insertIndex, 0, task);
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

			// Mark as pending BEFORE clearing activeTask to prevent sync with stale server state
			isPendingMutation.current = true;

			setActiveTask(null);
			dragStartState.current = null;

			if (!over || !startState) {
				isPendingMutation.current = false;
				setLocalColumns(columns);
				return;
			}

			const activeId = active.id as string;

			// Find current position in local state
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

			// Check if position changed
			const columnChanged = currentColumn.id !== startState.columnId;
			const indexChanged = currentIndex !== startState.taskIndex;

			if (!columnChanged && !indexChanged) {
				isPendingMutation.current = false;
				return; // No change
			}

			if (columnChanged) {
				// Move to different column
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
				// Reorder in same column
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

			// Allow sync again after mutation completes
			isPendingMutation.current = false;
		},
		[columns, localColumns, moveTaskMutation, reorderTasksMutation],
	);

	const handleDragCancel = useCallback(() => {
		setActiveTask(null);
		dragStartState.current = null;
		isPendingMutation.current = false;
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
