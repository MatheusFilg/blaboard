"use client";

import { useMemo, useState } from "react";
import { Sidebar } from "./sidebar";
import { BoardHeader } from "./board-header";
import { KanbanColumn } from "./kanban-column";
import { CreateTaskModal } from "./create-task-modal";
import type { TaskCardProps } from "./task-card";

// Sample data based on the Pencil design
const backlogTasks: TaskCardProps[] = [
	{
		title: "Design new dashboard",
		description: "Create wireframes and mockups for the analytics dashboard",
		priority: "medium",
		label: { text: "Design", color: "#6366F1" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
	{
		title: "Update documentation",
		description: "Review and update API documentation for v2.0",
		priority: "low",
		label: { text: "Docs", color: "#32D583" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Research user feedback",
		description: "Analyze user interviews and create summary report",
		priority: "none",
		label: { text: "Research", color: "#E85A4F" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
];

const inProgressTasks: TaskCardProps[] = [
	{
		title: "Implement authentication",
		description: "Add OAuth 2.0 login flow with Google and GitHub",
		priority: "high",
	},
	{
		title: "Implement authentication",
		description: "Add OAuth 2.0 login flow with Google and GitHub",
		priority: "high",
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
	{
		title: "Build notification system",
		description: "Real-time notifications with WebSocket integration",
		priority: "medium",
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Create API endpoints",
		description: "REST API for task CRUD operations",
		priority: "low",
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
	{
		title: "Fix drag and drop bug",
		description: "Cards not reordering correctly on mobile",
		priority: "high",
		label: { text: "Bug", color: "#E85A4F" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
];

const reviewTasks: TaskCardProps[] = [
	{
		title: "Review PR #142",
		description: "Code review for new search feature implementation",
		priority: "medium",
		label: { text: "Review", color: "#FFB547" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Test mobile responsiveness",
		description: "QA testing on iOS and Android devices",
		priority: "low",
		label: { text: "QA", color: "#32D583" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
	{
		title: "Security audit",
		description: "Review authentication flow for vulnerabilities",
		priority: "high",
		label: { text: "Security", color: "#E85A4F" },
		assignee: { initials: "AM", color: "#E85A4F" },
	},
];

const doneTasks: TaskCardProps[] = [
	{
		title: "Setup CI/CD pipeline",
		description: "Configure GitHub Actions for automated deployment",
		completed: true,
		label: { text: "DevOps", color: "#32D583" },
		assignee: { initials: "JS", color: "#6366F1" },
	},
	{
		title: "Database schema design",
		description: "Design and implement PostgreSQL schema",
		completed: true,
		label: { text: "Backend", color: "#6366F1" },
		assignee: { initials: "LK", color: "#32D583", textColor: "#0B0B0E" },
	},
];

function filterTasks(tasks: TaskCardProps[], query: string): TaskCardProps[] {
	if (!query.trim()) return tasks;
	const lowerQuery = query.toLowerCase();
	return tasks.filter(
		(task) =>
			task.title.toLowerCase().includes(lowerQuery) ||
			task.description?.toLowerCase().includes(lowerQuery) ||
			task.label?.text.toLowerCase().includes(lowerQuery),
	);
}

export function TaskBoard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const filteredBacklog = useMemo(
		() => filterTasks(backlogTasks, searchQuery),
		[searchQuery],
	);
	const filteredInProgress = useMemo(
		() => filterTasks(inProgressTasks, searchQuery),
		[searchQuery],
	);
	const filteredReview = useMemo(
		() => filterTasks(reviewTasks, searchQuery),
		[searchQuery],
	);
	const filteredDone = useMemo(
		() => filterTasks(doneTasks, searchQuery),
		[searchQuery],
	);

	const totalTasks =
		filteredBacklog.length +
		filteredInProgress.length +
		filteredReview.length +
		filteredDone.length;

	return (
		<div className="flex h-screen overflow-hidden bg-[#0B0B0E]">
			<Sidebar />

			{/* Main Content */}
			<main className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
				<BoardHeader
					title="Project Overview"
					subtitle={`${totalTasks} tasks · 4 team members`}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onNewTask={() => setIsModalOpen(true)}
				/>

				{/* Board Area */}
				<div className="flex flex-1 gap-4 overflow-x-auto">
					<KanbanColumn
						title="Backlog"
						count={filteredBacklog.length}
						tasks={filteredBacklog}
					/>
					<KanbanColumn
						title="In Progress"
						count={filteredInProgress.length}
						tasks={filteredInProgress}
					/>
					<KanbanColumn
						title="Review"
						count={filteredReview.length}
						tasks={filteredReview}
					/>
					<KanbanColumn
						title="Done"
						count={filteredDone.length}
						tasks={filteredDone}
					/>
				</div>
			</main>

			{/* Create Task Modal */}
			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
}
