"use client";

import { Plus, Search } from "lucide-react";

interface BoardHeaderProps {
	title: string;
	subtitle: string;
	searchQuery: string;
	onSearchChange: (query: string) => void;
	onNewTask?: () => void;
}

export function BoardHeader({
	title,
	subtitle,
	searchQuery,
	onSearchChange,
	onNewTask,
}: BoardHeaderProps) {
	return (
		<div className="flex items-center justify-between">
			{/* Left side */}
			<div className="flex flex-col gap-1">
				<h1 className="-tracking-wide text-[28px] font-semibold text-[#FAFAF9]">
					{title}
				</h1>
				<p className="text-sm text-[#6B6B70]">{subtitle}</p>
			</div>

			{/* Right side */}
			<div className="flex items-center gap-3">
				{/* Search */}
				<div className="flex h-10 w-60 items-center gap-2.5 rounded-lg bg-[#16161A] px-3.5 focus-within:ring-1 focus-within:ring-[#6366F1]">
					<Search className="size-[18px] text-[#6B6B70]" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder="Search tasks..."
						className="flex-1 bg-transparent text-sm text-[#FAFAF9] placeholder:text-[#4A4A50] focus:outline-none"
					/>
				</div>

				{/* New Task Button */}
				<button
					type="button"
					onClick={onNewTask}
					className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-4 transition-colors hover:bg-[#5558E3]"
				>
					<Plus className="size-[18px] text-white" />
					<span className="text-sm font-semibold text-white">New Task</span>
				</button>
			</div>
		</div>
	);
}
