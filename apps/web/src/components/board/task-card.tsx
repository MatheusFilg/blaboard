"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TaskLabel {
	text: string;
	color: string;
}

export interface TaskAssignee {
	initials: string;
	color: string;
	textColor?: string;
}

export interface TaskCardProps {
	id?: string;
	title: string;
	description?: string;
	priority?: "high" | "medium" | "low" | "none";
	label?: TaskLabel;
	assignee?: TaskAssignee;
	completed?: boolean;
}

const priorityColors = {
	high: "#E85A4F",
	medium: "#FFB547",
	low: "#32D583",
	none: "#4A4A50",
};

export function TaskCard({
	id = "1",
	title,
	description,
	priority = "none",
	label,
	assignee,
	completed = false,
}: TaskCardProps) {
	return (
		<Link
			href={`/task/${id}`}
			className="flex cursor-pointer flex-col gap-3 rounded-xl border border-[#2A2A2E] bg-[#16161A] p-4 transition-colors hover:border-[#3A3A3E] hover:bg-[#1A1A1E]"
		>
			{/* Header */}
			<div className="flex items-center gap-2">
				{completed ? (
					<div className="flex size-[18px] items-center justify-center rounded-full bg-[#32D583]">
						<Check className="size-3 text-[#0B0B0E]" />
					</div>
				) : (
					<div
						className="size-1.5 rounded-sm"
						style={{ backgroundColor: priorityColors[priority] }}
					/>
				)}
				<span
					className={cn(
						"text-sm font-medium",
						completed ? "text-[#6B6B70]" : "text-[#FAFAF9]",
					)}
				>
					{title}
				</span>
			</div>

			{/* Description */}
			{description && (
				<p
					className={cn(
						"text-[13px]",
						completed ? "text-[#4A4A50]" : "text-[#6B6B70]",
					)}
				>
					{description}
				</p>
			)}

			{/* Footer */}
			{(label || assignee) && (
				<div className="flex items-center justify-between">
					{label && (
						<span
							className="rounded-md px-2 py-1 text-[11px] font-medium"
							style={{
								color: label.color,
								backgroundColor: `${label.color}20`,
							}}
						>
							{label.text}
						</span>
					)}
					{assignee && (
						<div
							className="flex size-7 items-center justify-center rounded-full"
							style={{ backgroundColor: assignee.color }}
						>
							<span
								className="text-[11px] font-semibold"
								style={{ color: assignee.textColor || "#FFFFFF" }}
							>
								{assignee.initials}
							</span>
						</div>
					)}
				</div>
			)}
		</Link>
	);
}
