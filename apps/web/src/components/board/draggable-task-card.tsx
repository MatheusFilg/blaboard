"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface DraggableTaskCardProps {
	task: Task;
	isCompleted?: boolean;
}

const priorityColors = {
	HIGH: "#E85A4F",
	MEDIUM: "#FFB547",
	LOW: "#32D583",
	NONE: "#4A4A50",
};

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function stringToColor(str: string): string {
	const colors = ["#6366F1", "#E85A4F", "#32D583", "#FFB547", "#8B5CF6"];
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return colors[Math.abs(hash) % colors.length];
}

export function DraggableTaskCard({
	task,
	isCompleted = false,
}: DraggableTaskCardProps) {
	const router = useRouter();
	const hasDragged = useRef(false);

	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: "task",
			task,
		},
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transition ?? undefined,
	};

	const firstLabel = task.labels?.[0];

	const handleMouseDown = () => {
		hasDragged.current = false;
	};

	const handleMouseMove = () => {
		hasDragged.current = true;
	};

	const handleClick = (e: React.MouseEvent) => {
		if (!hasDragged.current && !isDragging) {
			e.preventDefault();
			e.stopPropagation();
			router.push(`/task/${task.id}`);
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onClick={handleClick}
			className={cn(
				"flex flex-col gap-3 rounded-xl border p-4",
				isDragging
					? "border-dashed border-[#6366F1]/50 bg-[#6366F1]/5 opacity-40"
					: "cursor-grab border-[#2A2A2E] bg-[#16161A] transition-colors hover:border-[#3A3A3E] hover:bg-[#1A1A1E] active:cursor-grabbing",
			)}
		>
			{/* Header */}
			<div className="flex items-center gap-2">
				{isCompleted ? (
					<div className="flex size-[18px] items-center justify-center rounded-full bg-[#32D583]">
						<Check className="size-3 text-[#0B0B0E]" />
					</div>
				) : (
					<div
						className="size-1.5 rounded-sm"
						style={{ backgroundColor: priorityColors[task.priority] }}
					/>
				)}
				<span
					className={cn(
						"text-sm font-medium",
						isCompleted ? "text-[#6B6B70]" : "text-[#FAFAF9]",
					)}
				>
					{task.title}
				</span>
			</div>

			{/* Description */}
			{task.description && (
				<p
					className={cn(
						"text-[13px]",
						isCompleted ? "text-[#4A4A50]" : "text-[#6B6B70]",
					)}
				>
					{task.description}
				</p>
			)}

			{/* Footer */}
			{(firstLabel || task.assignee) && (
				<div className="flex items-center justify-between">
					{firstLabel && (
						<span
							className="rounded-md px-2 py-1 text-[11px] font-medium"
							style={{
								color: firstLabel.color,
								backgroundColor: `${firstLabel.color}20`,
							}}
						>
							{firstLabel.text}
						</span>
					)}
					{task.assignee && (
						<div
							className="flex size-7 items-center justify-center rounded-full"
							style={{ backgroundColor: stringToColor(task.assignee.name) }}
						>
							<span className="text-[11px] font-semibold text-white">
								{getInitials(task.assignee.name)}
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
