"use client";

import { TaskCard, type TaskCardProps } from "./task-card";

interface KanbanColumnProps {
	title: string;
	count: number;
	tasks: TaskCardProps[];
}

export function KanbanColumn({ title, count, tasks }: KanbanColumnProps) {
	return (
		<div className="flex flex-1 flex-col gap-3">
			{/* Column Header */}
			<div className="flex items-center justify-between pb-2">
				<div className="flex items-center gap-2">
					<span className="text-sm font-semibold text-[#6B6B70]">{title}</span>
					<div className="flex size-6 items-center justify-center rounded-xl bg-[#16161A]">
						<span className="text-xs font-semibold text-[#6B6B70]">
							{count}
						</span>
					</div>
				</div>
			</div>

			{/* Cards */}
			<div className="flex flex-1 flex-col gap-3">
				{tasks.map((task, index) => (
					<TaskCard key={`${task.title}-${index}`} {...task} />
				))}
			</div>
		</div>
	);
}
