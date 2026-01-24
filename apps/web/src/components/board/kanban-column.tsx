"use client";

import { TaskCard } from "./task-card";
import type { Column } from "@/lib/types";

interface KanbanColumnProps {
	column: Column;
}

export function KanbanColumn({ column }: KanbanColumnProps) {
	return (
		<div className="flex flex-1 flex-col gap-3">
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
			</div>

			{/* Cards */}
			<div className="flex flex-1 flex-col gap-3">
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
