"use client";

import { useDroppable } from "@dnd-kit/core";
import {
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DotsThree, Trash } from "@phosphor-icons/react";
import { useMemo } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DraggableTaskCard } from "./draggable-task-card";

interface KanbanColumnProps {
	column: Column;
	onDelete?: (id: string) => void;
}

export function KanbanColumn({ column, onDelete }: KanbanColumnProps) {
	const { setNodeRef, isOver } = useDroppable({
		id: column.id,
		data: {
			type: "column",
			column,
		},
	});

	const taskIds = useMemo(
		() => column.tasks.map((task) => task.id),
		[column.tasks],
	);

	return (
		<div className="flex w-64 min-w-64 flex-col rounded-lg border border-border/50 bg-card/30 p-3 shadow-sm">
			<div className="flex items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					{column.color && (
						<div
							className="size-2 rounded-full"
							style={{ backgroundColor: column.color }}
						/>
					)}
					<span className="font-medium text-foreground text-sm">
						{column.name}
					</span>
					<span className="text-muted-foreground text-xs">
						{column.tasks.length}
					</span>
				</div>

				{onDelete && (
					<DropdownMenu>
						<DropdownMenuTrigger className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
							<DotsThree size={16} weight="bold" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-36 rounded-lg border border-border bg-popover p-1"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuItem
								className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive"
								onClick={() => onDelete(column.id)}
							>
								<Trash size={14} />
								<span className="text-sm">Delete column</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			<div
				ref={setNodeRef}
				className={cn(
					"flex min-h-[100px] flex-1 flex-col gap-2 overflow-y-auto rounded-lg p-0.5",
					isOver && "bg-accent/50",
				)}
			>
				<SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
					{column.tasks.map((task) => (
						<DraggableTaskCard
							key={task.id}
							task={task}
							isCompleted={column.isCompleted}
						/>
					))}
				</SortableContext>
			</div>
		</div>
	);
}
