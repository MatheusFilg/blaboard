"use client";

import { useState } from "react";
import { Calendar, Check, ChevronDown, Plus, X } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CreateTaskModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit?: (data: TaskFormData) => void;
}

interface TaskFormData {
	name: string;
	description: string;
	status: string;
	priority: string;
	assignee: string;
	dueDate: string;
	tags: string[];
}

interface TagProps {
	text: string;
	color: string;
	onRemove?: () => void;
}

// Mock data
const statuses = [
	{ id: "backlog", label: "Backlog" },
	{ id: "in-progress", label: "In Progress" },
	{ id: "review", label: "Review" },
	{ id: "done", label: "Done" },
];

const priorities = [
	{ id: "high", label: "High", color: "#E85A4F" },
	{ id: "medium", label: "Medium", color: "#FFB547" },
	{ id: "low", label: "Low", color: "#32D583" },
	{ id: "none", label: "None", color: "#4A4A50" },
];

const assignees = [
	{ id: "js", name: "John Smith", initials: "JS", color: "#6366F1" },
	{ id: "am", name: "Alice Miller", initials: "AM", color: "#E85A4F" },
	{ id: "lk", name: "Lisa Kim", initials: "LK", color: "#32D583" },
	{ id: "unassigned", name: "Unassigned", initials: "?", color: "#4A4A50" },
];

const dueDates = [
	{ id: "today", label: "Today", value: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
	{ id: "tomorrow", label: "Tomorrow", value: new Date(Date.now() + 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
	{ id: "next-week", label: "Next Week", value: new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
	{ id: "next-month", label: "Next Month", value: new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
	{ id: "no-date", label: "No due date", value: "" },
];

function Tag({ text, color, onRemove }: TagProps) {
	return (
		<div
			className="flex h-7 items-center gap-1.5 rounded-md px-2.5"
			style={{ backgroundColor: `${color}33` }}
		>
			<span className="text-xs font-medium" style={{ color }}>
				{text}
			</span>
			{onRemove && (
				<button type="button" onClick={onRemove}>
					<X className="size-3" style={{ color }} />
				</button>
			)}
		</div>
	);
}

export function CreateTaskModal({
	isOpen,
	onClose,
	onSubmit,
}: CreateTaskModalProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState(statuses[0]);
	const [priority, setPriority] = useState(priorities[1]);
	const [assignee, setAssignee] = useState(assignees[0]);
	const [dueDate, setDueDate] = useState(dueDates[0]);
	const [tags, setTags] = useState([
		{ text: "Design", color: "#6366F1" },
		{ text: "Feature", color: "#32D583" },
	]);

	const handleSubmit = () => {
		onSubmit?.({
			name,
			description,
			status: status.id,
			priority: priority.id,
			assignee: assignee.id,
			dueDate: dueDate.value,
			tags: tags.map((t) => t.text),
		});
		onClose();
	};

	const removeTag = (index: number) => {
		setTags(tags.filter((_, i) => i !== index));
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-[600px] max-w-[600px] sm:max-w-[600px] gap-0 rounded-2xl border-none bg-[#1A1A1E] p-0 ring-0"
			>
				{/* Header */}
				<DialogHeader className="flex-row items-center justify-between border-b border-[#2A2A2E] p-6">
					<DialogTitle className="-tracking-wide text-[22px] font-semibold text-[#FAFAF9]">
						Create New Task
					</DialogTitle>
					<DialogClose className="flex size-8 items-center justify-center rounded-lg bg-[#16161A] transition-colors hover:bg-[#1E1E22]">
						<X className="size-[18px] text-[#6B6B70]" />
					</DialogClose>
				</DialogHeader>

				{/* Body */}
				<div className="flex flex-col gap-5 p-6">
					{/* Task Name */}
					<div className="flex flex-col gap-2">
						<label className="text-[13px] font-medium text-[#6B6B70]">
							Task Name
						</label>
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter task name..."
							className="h-11 rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 text-sm text-[#FAFAF9] placeholder:text-[#4A4A50] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
						/>
					</div>

					{/* Description */}
					<div className="flex flex-col gap-2">
						<label className="text-[13px] font-medium text-[#6B6B70]">
							Description
						</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Add a description..."
							className="h-[100px] resize-none rounded-lg border border-[#2A2A2E] bg-[#16161A] p-3.5 text-sm text-[#FAFAF9] placeholder:text-[#4A4A50] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
						/>
					</div>

					{/* Status & Priority */}
					<div className="flex gap-4">
						{/* Status Dropdown */}
						<div className="flex flex-1 flex-col gap-2">
							<label className="text-[13px] font-medium text-[#6B6B70]">
								Status
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
									<span className="text-sm text-[#FAFAF9]">{status.label}</span>
									<ChevronDown className="size-[18px] text-[#6B6B70]" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{statuses.map((s) => (
											<DropdownMenuItem
												key={s.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
												onClick={() => setStatus(s)}
											>
												<span className="text-sm">{s.label}</span>
												{status.id === s.id && (
													<Check className="size-4 text-[#6366F1]" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Priority Dropdown */}
						<div className="flex flex-1 flex-col gap-2">
							<label className="text-[13px] font-medium text-[#6B6B70]">
								Priority
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
									<div className="flex items-center gap-2">
										<div
											className="size-2 rounded-full"
											style={{ backgroundColor: priority.color }}
										/>
										<span className="text-sm text-[#FAFAF9]">
											{priority.label}
										</span>
									</div>
									<ChevronDown className="size-[18px] text-[#6B6B70]" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{priorities.map((p) => (
											<DropdownMenuItem
												key={p.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
												onClick={() => setPriority(p)}
											>
												<div className="flex items-center gap-2">
													<div
														className="size-2 rounded-full"
														style={{ backgroundColor: p.color }}
													/>
													<span className="text-sm">{p.label}</span>
												</div>
												{priority.id === p.id && (
													<Check className="size-4 text-[#6366F1]" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Assignee & Due Date */}
					<div className="flex gap-4">
						{/* Assignee Dropdown */}
						<div className="flex flex-1 flex-col gap-2">
							<label className="text-[13px] font-medium text-[#6B6B70]">
								Assignee
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
									<div className="flex items-center gap-2.5">
										<div
											className="flex size-6 items-center justify-center rounded-full"
											style={{ backgroundColor: assignee.color }}
										>
											<span className="text-[10px] font-semibold text-white">
												{assignee.initials}
											</span>
										</div>
										<span className="text-sm text-[#FAFAF9]">
											{assignee.name}
										</span>
									</div>
									<ChevronDown className="size-[18px] text-[#6B6B70]" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										<DropdownMenuLabel className="px-3 py-1.5 text-xs font-semibold text-[#6B6B70]">
											Team Members
										</DropdownMenuLabel>
										{assignees.map((a) => (
											<DropdownMenuItem
												key={a.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
												onClick={() => setAssignee(a)}
											>
												<div className="flex items-center gap-2.5">
													<div
														className="flex size-6 items-center justify-center rounded-full"
														style={{ backgroundColor: a.color }}
													>
														<span className="text-[10px] font-semibold text-white">
															{a.initials}
														</span>
													</div>
													<span className="text-sm">{a.name}</span>
												</div>
												{assignee.id === a.id && (
													<Check className="size-4 text-[#6366F1]" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						{/* Due Date Dropdown */}
						<div className="flex flex-1 flex-col gap-2">
							<label className="text-[13px] font-medium text-[#6B6B70]">
								Due Date
							</label>
							<DropdownMenu>
								<DropdownMenuTrigger className="flex h-11 w-full items-center justify-between rounded-lg border border-[#2A2A2E] bg-[#16161A] px-3.5 outline-none transition-colors hover:border-[#3A3A3E] focus:border-[#6366F1]">
									<div className="flex items-center gap-2.5">
										<Calendar className="size-4 text-[#6B6B70]" />
										<span className="text-sm text-[#FAFAF9]">
											{dueDate.value || dueDate.label}
										</span>
									</div>
									<ChevronDown className="size-[18px] text-[#6B6B70]" />
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-[--trigger-width] rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
									align="start"
									sideOffset={4}
								>
									<DropdownMenuGroup>
										{dueDates.map((d) => (
											<DropdownMenuItem
												key={d.id}
												className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-[#FAFAF9] hover:bg-[#16161A] focus:bg-[#16161A]"
												onClick={() => setDueDate(d)}
											>
												<div className="flex flex-col">
													<span className="text-sm">{d.label}</span>
													{d.value && (
														<span className="text-xs text-[#6B6B70]">
															{d.value}
														</span>
													)}
												</div>
												{dueDate.id === d.id && (
													<Check className="size-4 text-[#6366F1]" />
												)}
											</DropdownMenuItem>
										))}
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Tags */}
					<div className="flex flex-col gap-2">
						<label className="text-[13px] font-medium text-[#6B6B70]">
							Tags
						</label>
						<div className="flex flex-wrap items-center gap-2">
							{tags.map((tag, index) => (
								<Tag
									key={tag.text}
									text={tag.text}
									color={tag.color}
									onRemove={() => removeTag(index)}
								/>
							))}
							<button
								type="button"
								className="flex h-7 items-center gap-1 rounded-md border border-[#2A2A2E] px-2.5 transition-colors hover:border-[#3A3A3E]"
							>
								<Plus className="size-3.5 text-[#4A4A50]" />
								<span className="text-xs font-medium text-[#4A4A50]">
									Add tag
								</span>
							</button>
						</div>
					</div>
				</div>

				{/* Footer */}
				<DialogFooter className="flex-row justify-end border-t border-[#2A2A2E] p-6">
					<DialogClose className="flex h-11 items-center justify-center rounded-lg border border-[#2A2A2E] px-5 transition-colors hover:bg-[#16161A]">
						<span className="text-sm font-medium text-[#6B6B70]">Cancel</span>
					</DialogClose>
					<button
						type="button"
						onClick={handleSubmit}
						className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#6366F1] px-6 transition-colors hover:bg-[#5558E3]"
					>
						<Plus className="size-[18px] text-white" />
						<span className="text-sm font-semibold text-white">Create Task</span>
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
