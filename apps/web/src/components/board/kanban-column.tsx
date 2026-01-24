"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";
import { TaskCard } from "./task-card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column } from "@/lib/types";

interface KanbanColumnProps {
	column: Column;
	onDelete?: (id: string) => void;
}

export function KanbanColumn({ column, onDelete }: KanbanColumnProps) {
	return (
		<div className="flex w-72 min-w-72 flex-col gap-3">
			{/* Column Header */}
			<div className="flex items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					{column.color && (
						<div
							className="size-2 rounded-full"
							style={{ backgroundColor: column.color }}
						/>
					)}
					<span className="text-sm font-semibold text-[#6B6B70]">
						{column.name}
					</span>
					<div className="flex size-6 items-center justify-center rounded-xl bg-[#16161A]">
						<span className="text-xs font-semibold text-[#6B6B70]">
							{column.tasks.length}
						</span>
					</div>
				</div>

				{onDelete && (
					<DropdownMenu>
						<DropdownMenuTrigger className="flex size-6 items-center justify-center rounded-md text-[#6B6B70] transition-colors hover:bg-[#16161A] hover:text-[#FAFAF9]">
							<MoreHorizontal className="size-4" />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-40 rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuItem
								className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-[#E85A4F] hover:bg-[#E85A4F]/10 focus:bg-[#E85A4F]/10 focus:text-[#E85A4F]"
								onClick={() => onDelete(column.id)}
							>
								<Trash2 className="size-4" />
								<span className="text-sm">Delete column</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{/* Cards */}
			<div className="flex flex-1 flex-col gap-3 overflow-y-auto">
				{column.tasks.map((task) => (
					<TaskCard
						key={task.id}
						task={task}
						isCompleted={column.isCompleted}
					/>
				))}
			</div>
		</div>
	);
}
