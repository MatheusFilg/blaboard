"use client";

import {
	ArrowLeft,
	Calendar,
	Edit2,
	MoreHorizontal,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { toast } from "sonner";
import { EditTaskModal, Sidebar } from "@/components/board";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	useColumns,
	useDeleteTask,
	useTask,
	useUpdateTask,
} from "@/hooks/board";
import type { UpdateTaskInput } from "@/lib/types";

const priorityColors = {
	HIGH: "#E85A4F",
	MEDIUM: "#FFB547",
	LOW: "#32D583",
	NONE: "#4A4A50",
};

const priorityLabels = {
	HIGH: "High",
	MEDIUM: "Medium",
	LOW: "Low",
	NONE: "None",
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

function formatDate(date: Date | string | null): string {
	if (!date) return "Not set";
	const d = new Date(date);
	return d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

interface PageProps {
	params: Promise<{ taskId: string }>;
}

export default function TaskDetailsPage({ params }: PageProps) {
	const { taskId } = use(params);
	const router = useRouter();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { data: task, isLoading, error, refetch } = useTask(taskId);
	const { data: columns = [] } = useColumns(task?.organizationId ?? "");
	const deleteTaskMutation = useDeleteTask(task?.organizationId ?? "");
	const updateTaskMutation = useUpdateTask(task?.organizationId ?? "");

	const handleDelete = async () => {
		if (!task) return;

		try {
			await deleteTaskMutation.mutateAsync(task.id);
			toast.success("Task deleted successfully");
			router.push("/");
		} catch {
			toast.error("Failed to delete task");
		}
	};

	const handleUpdate = async (input: UpdateTaskInput) => {
		if (!task) return;

		try {
			await updateTaskMutation.mutateAsync({ id: task.id, input });
			await refetch();
			toast.success("Task updated successfully");
		} catch {
			toast.error("Failed to update task");
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen bg-[#0B0B0E]">
				<Sidebar />
				<main className="flex flex-1 items-center justify-center">
					<div className="text-[#6B6B70]">Loading task...</div>
				</main>
			</div>
		);
	}

	if (error || !task) {
		return (
			<div className="flex h-screen bg-[#0B0B0E]">
				<Sidebar />
				<main className="flex flex-1 flex-col items-center justify-center gap-4">
					<div className="text-[#E85A4F]">Task not found</div>
					<Link href="/" className="text-[#6366F1] text-sm hover:underline">
						Back to board
					</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-[#0B0B0E]">
			<Sidebar />

			<main className="flex flex-1 flex-col">
				<header className="flex items-center justify-between border-[#2A2A2E] border-b px-6 py-5">
					<div className="flex items-center gap-4">
						<Link
							href="/"
							className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2E] bg-[#16161A] transition-colors hover:border-[#3A3A3E]"
						>
							<ArrowLeft className="size-4 text-[#FAFAF9]" />
						</Link>
						<div className="flex items-center gap-2 text-sm">
							<span className="text-[#6B6B70]">Project Overview</span>
							<span className="text-[#4A4A50]">/</span>
							<span className="font-medium text-[#FAFAF9]">Task Details</span>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="sm"
							className="h-9 gap-2 border-[#2A2A2E] bg-transparent text-[#FAFAF9] hover:border-[#3A3A3E] hover:bg-[#16161A]"
							onClick={() => setIsEditModalOpen(true)}
						>
							<Edit2 className="size-4" />
							Edit
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex size-9 items-center justify-center rounded-lg border border-[#2A2A2E] bg-[#16161A] transition-colors hover:border-[#3A3A3E] hover:bg-[#1A1A1E]">
								<MoreHorizontal className="size-4 text-[#FAFAF9]" />
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-40 rounded-lg border border-[#2A2A2E] bg-[#1A1A1E] p-1"
								align="end"
							>
								<DropdownMenuItem
									className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-[#E85A4F] hover:bg-[#E85A4F]/10 focus:bg-[#E85A4F]/10 focus:text-[#E85A4F]"
									onClick={handleDelete}
								>
									<Trash2 className="size-4" />
									<span className="text-sm">Delete task</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</header>

				<div className="flex flex-1 overflow-hidden">
					<div className="flex flex-1 flex-col gap-6 overflow-y-auto border-[#2A2A2E] border-r p-8">
						<div className="flex flex-col gap-4">
							<div className="flex items-center gap-3">
								<div
									className="size-2.5 rounded-sm"
									style={{ backgroundColor: priorityColors[task.priority] }}
								/>
								<h1 className="font-semibold text-[#FAFAF9] text-[28px] tracking-tight">
									{task.title}
								</h1>
							</div>
							<div className="flex items-center gap-4">
								<div
									className="flex h-7 items-center gap-1.5 rounded-md px-3"
									style={{ backgroundColor: `${task.column.color}20` }}
								>
									<div
										className="size-1.5 rounded-full"
										style={{ backgroundColor: task.column.color ?? "#6B6B70" }}
									/>
									<span
										className="font-medium text-xs"
										style={{ color: task.column.color ?? "#6B6B70" }}
									>
										{task.column.name}
									</span>
								</div>
								<span className="text-[#4A4A50] text-[13px]">
									Created {formatDate(task.createdAt)}
								</span>
							</div>
						</div>

						{task.description && (
							<div className="flex flex-col gap-3">
								<span className="font-semibold text-[#6B6B70] text-[13px]">
									Description
								</span>
								<p className="text-[#FAFAF9] text-[15px] leading-relaxed">
									{task.description}
								</p>
							</div>
						)}

						{task.labels && task.labels.length > 0 && (
							<div className="flex flex-col gap-3">
								<span className="font-semibold text-[#6B6B70] text-[13px]">
									Labels
								</span>
								<div className="flex flex-wrap gap-2">
									{task.labels.map((label) => (
										<div
											key={label.text}
											className="flex h-7 items-center rounded-md px-3"
											style={{ backgroundColor: `${label.color}33` }}
										>
											<span
												className="font-medium text-xs"
												style={{ color: label.color }}
											>
												{label.text}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex w-[360px] shrink-0 flex-col gap-6 bg-[#1A1A1E] p-6">
						<span className="font-semibold text-[#FAFAF9] text-base">
							Details
						</span>

						<div className="flex flex-col gap-5">
							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Assignee</span>
								{task.assignee ? (
									<div className="flex items-center gap-2.5">
										<Avatar className="size-7">
											<AvatarFallback
												className="font-semibold text-[10px] text-white"
												style={{
													backgroundColor: stringToColor(task.assignee.name),
												}}
											>
												{getInitials(task.assignee.name)}
											</AvatarFallback>
										</Avatar>
										<span className="font-medium text-[#FAFAF9] text-sm">
											{task.assignee.name}
										</span>
									</div>
								) : (
									<span className="text-[#4A4A50] text-sm">Unassigned</span>
								)}
							</div>

							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Due Date</span>
								<div className="flex items-center gap-2">
									<Calendar className="size-4 text-[#6B6B70]" />
									<span className="font-medium text-[#FAFAF9] text-sm">
										{formatDate(task.dueDate)}
									</span>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Priority</span>
								<div className="flex items-center gap-2">
									<div
										className="size-2 rounded-full"
										style={{ backgroundColor: priorityColors[task.priority] }}
									/>
									<span className="font-medium text-[#FAFAF9] text-sm">
										{priorityLabels[task.priority]}
									</span>
								</div>
							</div>

							<div className="flex items-center justify-between">
								<span className="text-[#4A4A50] text-[13px]">Status</span>
								<div className="flex items-center gap-2">
									<div
										className="size-2 rounded-full"
										style={{ backgroundColor: task.column.color ?? "#6B6B70" }}
									/>
									<span className="font-medium text-[#FAFAF9] text-sm">
										{task.column.name}
									</span>
								</div>
							</div>
						</div>

						<Separator className="bg-[#2A2A2E]" />

						<div className="flex flex-col gap-3">
							<span className="font-semibold text-[#FAFAF9] text-base">
								Created by
							</span>
							<div className="flex items-center gap-2.5">
								<Avatar className="size-8">
									<AvatarFallback
										className="font-semibold text-[11px] text-white"
										style={{
											backgroundColor: stringToColor(task.createdBy.name),
										}}
									>
										{getInitials(task.createdBy.name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="font-medium text-[#FAFAF9] text-sm">
										{task.createdBy.name}
									</span>
									<span className="text-[#4A4A50] text-xs">
										{formatDate(task.createdAt)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<EditTaskModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				task={task}
				columns={columns}
				onSubmit={handleUpdate}
			/>
		</div>
	);
}
